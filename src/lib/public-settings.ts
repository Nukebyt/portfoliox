export const publicSettings = {
  formspreeAction:
    process.env.NEXT_PUBLIC_FORMSPREE_ACTION ||
    "https://formspree.io/f/your-form-id",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "you@example.com",
};
