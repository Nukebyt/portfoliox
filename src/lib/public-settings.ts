export const publicSettings = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseStorageBucket:
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "portfolio-images",
  formspreeAction:
    process.env.NEXT_PUBLIC_FORMSPREE_ACTION ||
    "https://formspree.io/f/your-form-id",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "you@example.com",
};
