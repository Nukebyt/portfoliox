import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";

function getContentSecurityPolicy() {
  const scriptSrc =
    process.env.NODE_ENV === "production"
      ? "script-src 'self' 'unsafe-inline'"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "form-action 'self' https://formspree.io",
    "upgrade-insecure-requests",
  ].join("; ");
}

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return false;
  }

  return verifySessionToken(token);
}

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("Content-Security-Policy", getContentSecurityPolicy());
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return withSecurityHeaders(NextResponse.next());
  }

  const protectedApi = pathname.startsWith("/api/admin/");
  const protectedPage = pathname.startsWith("/admin");

  if (protectedApi || protectedPage) {
    const validSession = await hasValidSession(request);

    if (!validSession) {
      if (protectedApi) {
        return withSecurityHeaders(
          NextResponse.json(
            { ok: false, message: "Unauthorized." },
            { status: 401 },
          ),
        );
      }

      return withSecurityHeaders(
        NextResponse.redirect(
          new URL(
            `/admin/login?next=${encodeURIComponent(pathname)}`,
            request.url,
          ),
        ),
      );
    }
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
