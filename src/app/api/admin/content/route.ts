import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";
import { settings } from "@/lib/settings";
import {
  isMissingSchemaError,
  setupRequiredMessage,
} from "@/lib/supabase-errors";

type ContentCollection = "skills" | "projects" | "blogCards" | "events" | "certificates";

const collections = ["skills", "projects", "blogCards", "events", "certificates"] as const;
const maxItemsPerCollection = 100;
const maxTextLength = 4000;
const maxStackItems = 12;

type SavePayload = {
  collection: ContentCollection;
  items: Array<Record<string, unknown>>;
};

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

function getTableName(collection: ContentCollection) {
  switch (collection) {
    case "skills":
      return "skills";
    case "projects":
      return "projects";
    case "blogCards":
      return "blog_cards";
    case "events":
      return "events";
    case "certificates":
      return "certificates";
  }
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

function isContentCollection(value: unknown): value is ContentCollection {
  return (
    typeof value === "string" &&
    collections.includes(value as ContentCollection)
  );
}

function cleanText(value: unknown, maxLength = maxTextLength) {
  return String(value || "")
    .trim()
    .slice(0, maxLength);
}

function cleanUrl(value: unknown, fallback: string) {
  const raw = cleanText(value, 2048);

  if (!raw) {
    return fallback;
  }

  if (raw.startsWith("/")) {
    return raw.startsWith("//") ? fallback : raw;
  }

  try {
    const parsed = new URL(raw);

    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : fallback;
  } catch {
    return fallback;
  }
}

function cleanImageUrl(value: unknown) {
  const raw = cleanText(value, 2048);

  if (!raw) {
    return "";
  }

  try {
    const parsed = new URL(raw);

    return parsed.protocol === "https:" ? parsed.toString() : "";
  } catch {
    return raw.startsWith("/") && !raw.startsWith("//") ? raw : "";
  }
}

function cleanSizeClass(value: unknown) {
  const raw = cleanText(value, 32);

  return /^h-(?:48|52|56|60|64|72|80|96)$/.test(raw) ? raw : "h-72";
}

function mapItems(
  collection: ContentCollection,
  items: Array<Record<string, unknown>>,
) {
  return items.map((item, index) => {
    const base = { sort_order: index + 1 } as Record<string, unknown>;

    if (collection === "skills") {
      return {
        ...base,
        name: cleanText(item.name, 120),
        category: cleanText(item.category, 80),
      };
    }

    if (collection === "projects") {
      const stack = Array.isArray(item.stack)
        ? item.stack
        : String(item.stack || "")
            .split(",");

      return {
        ...base,
        title: cleanText(item.title, 180),
        description: cleanText(item.description),
        href: cleanUrl(item.href, "#projects"),
        stack: stack
          .map((entry) => cleanText(entry, 40))
          .filter(Boolean)
          .slice(0, maxStackItems),
      };
    }

    if (collection === "blogCards") {
      return {
        ...base,
        title: cleanText(item.title, 180),
        href: cleanUrl(item.href, "#"),
        cover_image_url: cleanImageUrl(item.image || item.cover_image_url),
        size_class: cleanSizeClass(item.sizeClass || item.size_class),
      };
    }

      if (collection === "certificates") {
        return {
          ...base,
          title: cleanText(item.title, 180),
          issuer: cleanText(item.issuer, 120),
          date_text: cleanText(item.date || item.date_text, 80),
          description: cleanText(item.description),
          certificate_url: cleanImageUrl(
            item.certificate_url || item.certificateUrl || item.image || item.image_url,
          ),
        };
      }

    return {
      ...base,
      title: cleanText(item.title, 180),
      description: cleanText(item.description),
      image_url: cleanImageUrl(item.image || item.image_url),
      date: cleanText(item.date, 80),
    };
  });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

async function hasAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  return Boolean(token && (await verifySessionToken(token)));
}

export async function PUT(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, message: "Invalid origin." },
      { status: 403 },
    );
  }

  if (!(await hasAdminSession(request))) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  const client = createAdminClient();

  // Debug: show whether admin client could be created (no secrets printed)
  // eslint-disable-next-line no-console
  console.log("[admin] createAdminClient ->", Boolean(client));

  if (!client) {
    // eslint-disable-next-line no-console
    console.warn("[admin] Supabase service role key missing in server env");
    return NextResponse.json(
      {
        ok: false,
        message: "Supabase service role key is required for updates.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as SavePayload | null;

  // Debug: log a small summary of the incoming payload
  // eslint-disable-next-line no-console
  console.log(
    "[admin] incoming payload:",
    body ? { collection: body.collection, items: Array.isArray(body.items) ? body.items.length : 0 } : null,
  );

  if (
    !body ||
    !isContentCollection(body.collection) ||
    !Array.isArray(body.items) ||
    body.items.length > maxItemsPerCollection
  ) {
    return NextResponse.json(
      { ok: false, message: "Invalid payload." },
      { status: 400 },
    );
  }

  const tableName = getTableName(body.collection);
  const rows = mapItems(body.collection, body.items);

  const deleteResult = await client
    .from(tableName)
    .delete()
    .not("id", "is", null);

  if (deleteResult.error) {
    // eslint-disable-next-line no-console
    console.error("[admin] deleteResult.error ->", deleteResult.error.message);
    return NextResponse.json(
      {
        ok: false,
        message: isMissingSchemaError(deleteResult.error)
          ? setupRequiredMessage(`The public.${tableName} table`)
          : deleteResult.error.message,
      },
      { status: isMissingSchemaError(deleteResult.error) ? 503 : 500 },
    );
  }

  const insertResult = await client.from(tableName).insert(rows);

  if (insertResult.error) {
    // eslint-disable-next-line no-console
    console.error("[admin] insertResult.error ->", insertResult.error.message);
    return NextResponse.json(
      {
        ok: false,
        message: isMissingSchemaError(insertResult.error)
          ? setupRequiredMessage(`The public.${tableName} table`)
          : insertResult.error.message,
      },
      { status: isMissingSchemaError(insertResult.error) ? 503 : 500 },
    );
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return NextResponse.json({ ok: true });
}
