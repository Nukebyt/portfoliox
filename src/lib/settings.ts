function normalizeSupabaseUrl(value: string) {
  const rawValue = value.trim();

  if (!rawValue) {
    return "";
  }

  try {
    const url = new URL(rawValue);

    return url.origin;
  } catch {
    return rawValue;
  }
}

export const settings = {
  supabaseUrl: normalizeSupabaseUrl(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  ),
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  supabaseStorageBucket:
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    process.env.SUPABASE_STORAGE_BUCKET ||
    "portfolio-images",
  adminSessionSecret: process.env.ADMIN_SESSION_SECRET || "",
  adminSessionMaxAgeSeconds: Number.parseInt(
    process.env.ADMIN_COOKIE_MAX_AGE_SECONDS ||
      process.env.ADMIN_SESSION_MAX_AGE_SECONDS ||
      "604800",
    10,
  ),
  formspreeAction:
    process.env.NEXT_PUBLIC_FORMSPREE_ACTION ||
    process.env.FORM_SPFREE_ACTION ||
    "https://formspree.io/f/your-form-id",
  email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    process.env.CONTACT_EMAIL ||
    "your@email.com",
};

// Debug: print presence of critical env vars in non-production for troubleshooting.
if (process.env.NODE_ENV !== "production") {
  // Don't print secrets; only indicate presence/absence.
  // Useful when the dev server was not restarted or env didn't load.
  // eslint-disable-next-line no-console
  console.log(
    "[dev] settings: SUPABASE_SERVICE_ROLE_KEY present:",
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  );
}
