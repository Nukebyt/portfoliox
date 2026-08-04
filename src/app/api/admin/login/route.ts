import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  hashPassword,
  sanitizeRedirectPath,
  verifyPassword,
} from "@/lib/admin-session";
import {
  getAdminPasswordState,
  saveAdminPasswordHash,
} from "@/lib/admin-store";
import { settings } from "@/lib/settings";

const attempts = new Map<string, { count: number; resetAt: number }>();
const minPasswordLength = 12;

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

function rateLimitKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }

  current.count += 1;

  return current.count > 8;
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, message: "Invalid origin." },
      { status: 403 },
    );
  }

  const key = rateLimitKey(request);

  if (isRateLimited(key)) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    password?: string;
    next?: string;
  } | null;

  const password = body?.password?.trim() || "";

  if (!password || password.length > 256) {
    return NextResponse.json(
      { ok: false, message: "Password is required." },
      { status: 400 },
    );
  }

  if (!settings.adminSessionSecret || settings.adminSessionSecret.length < 32) {
    return NextResponse.json(
      {
        ok: false,
        message: "ADMIN_SESSION_SECRET must be configured before admin setup.",
      },
      { status: 503 },
    );
  }

  const passwordState = await getAdminPasswordState();

  if (passwordState.status === "unconfigured") {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Supabase service role key is required before admin setup can run.",
      },
      { status: 503 },
    );
  }

  if (passwordState.status === "setup-required") {
    return NextResponse.json(
      {
        ok: false,
        message: passwordState.message,
      },
      { status: 503 },
    );
  }

  if (passwordState.status === "missing") {
    if (password.length < minPasswordLength) {
      return NextResponse.json(
        {
          ok: false,
          message: `Create a password with at least ${minPasswordLength} characters.`,
        },
        { status: 400 },
      );
    }

    const passwordHash = await hashPassword(password);
    const saveResult = await saveAdminPasswordHash(passwordHash);

    if (!saveResult.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: saveResult.message || "Unable to create admin password.",
        },
        { status: 500 },
      );
    }
  }

  if (passwordState.status === "configured") {
    const valid = await verifyPassword(password, passwordState.passwordHash);

    if (!valid) {
      return NextResponse.json(
        { ok: false, message: "Invalid password." },
        { status: 401 },
      );
    }
  }

  const token = await createSessionToken("admin");
  const response = NextResponse.json({
    ok: true,
    next: sanitizeRedirectPath(body?.next),
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: settings.adminSessionMaxAgeSeconds,
  });

  return response;
}
