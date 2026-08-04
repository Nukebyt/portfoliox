import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";
import { settings } from "@/lib/settings";

const allowedPrefixes = new Set(["blogCards", "events"]);
const maxUploadBytes = 5 * 1024 * 1024;
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function createAdminClient() {
  if (!settings.supabaseUrl || !settings.supabaseServiceRoleKey) {
    return null;
  }

  return createClient(settings.supabaseUrl, settings.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

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

function safeExtension(file: File) {
  if (file.type === "image/jpeg") {
    return "jpg";
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  if (file.type === "image/gif") {
    return "gif";
  }

  return "bin";
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, message: "Invalid origin." },
      { status: 403 },
    );
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  const client = createAdminClient();

  if (!client) {
    return NextResponse.json(
      {
        ok: false,
        message: "Supabase service role key is required for uploads.",
      },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const prefix = String(formData.get("prefix") || "");
  const bucket = settings.supabaseStorageBucket;

  if (!(file instanceof File) || !allowedPrefixes.has(prefix)) {
    return NextResponse.json(
      { ok: false, message: "A file and valid upload prefix are required." },
      { status: 400 },
    );
  }

  if (file.size > maxUploadBytes || !allowedMimeTypes.has(file.type)) {
    return NextResponse.json(
      {
        ok: false,
        message: "Upload must be a JPG, PNG, WebP, or GIF image under 5 MB.",
      },
      { status: 400 },
    );
  }

  const path = `${prefix}/${crypto.randomUUID()}.${safeExtension(file)}`;

  const uploadResult = await client.storage
    .from(bucket)
    .upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

  if (uploadResult.error) {
    return NextResponse.json(
      { ok: false, message: uploadResult.error.message },
      { status: 500 },
    );
  }

  const { data } = client.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ ok: true, url: data.publicUrl });
}
