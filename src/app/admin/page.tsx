import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPortfolioContent } from "@/lib/portfolio-data";
import { AdminDashboard } from "@/components/admin-dashboard";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token || !(await verifySessionToken(token))) {
    redirect("/admin/login?next=/admin");
  }

  const { blogCards, events, projects, skills, certificates, source } =
    await getPortfolioContent();

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl bg-[color:var(--background)] px-4 py-16 text-[color:var(--foreground)] sm:px-6 lg:px-8">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-(--color-accent)">
          Admin dashboard
        </p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Content controls for Supabase
        </h1>
      </div>

      <AdminDashboard
        blogCards={blogCards}
        events={events}
        certificates={certificates}
        
        projects={projects}
        skills={skills}
        source={source}
      />
    </main>
  );
}
