import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import {
  ADMIN_SESSION_COOKIE,
  sanitizeRedirectPath,
  verifySessionToken,
} from "@/lib/admin-session";
import { getAdminPasswordState } from "@/lib/admin-store";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const params = (await searchParams) || {};
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (token && (await verifySessionToken(token))) {
    redirect("/admin");
  }

  const nextPath = sanitizeRedirectPath(params.next);
  const passwordState = await getAdminPasswordState();
  const setupRequired = passwordState.status === "missing";
  const setupBlocked = passwordState.status === "setup-required";

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        <div className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-(--color-accent)">
            Protected admin
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            {setupBlocked
              ? "Supabase setup required"
              : setupRequired
                ? "Create the admin password"
                : "Sign in to manage content"}
          </h1>
          <p className="text-base leading-8 text-muted">
            {setupBlocked
              ? passwordState.message
              : setupRequired
                ? "Create a password and remember it."
                : "Enter the password."}
          </p>
        </div>

        <AdminLoginForm nextPath={nextPath} setupRequired={setupRequired} />
      </div>
    </main>
  );
}
