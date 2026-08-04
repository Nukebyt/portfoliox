import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { SectionHeading } from "@/components/section-heading";
import { getPortfolioContent } from "@/lib/portfolio-data";
import { publicSettings } from "@/lib/public-settings";

const navItems = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Services", "#services"],
  ["Projects", "#projects"],
  ["Contact", "#contact"],
];

const socialLinks = [
  { glyph: "GH", href: "https://github.com", label: "GitHub" },
  { glyph: "IG", href: "https://instagram.com", label: "Instagram" },
  { glyph: "IN", href: "https://linkedin.com", label: "LinkedIn" },
  { glyph: "◎", href: "https://stackoverflow.com", label: "Website" },
];

const serviceCards = [
  {
    glyph: "01",
    title: "Web Application Development",
    text: "Human-centered interfaces, design system thinking, and responsive builds that stay sharp in both themes.",
  },
  {
    glyph: "02",
    title: "Mobile Application Development",
    text: "App experiences with clear flows, modern motion, and reusable UI patterns for mobile-first delivery.",
  },
  {
    glyph: "03",
    title: "Backend Development",
    text: "Data modeling, content APIs, authentication-ready workflows, and cloud-managed content surfaces.",
  },
];

const sectionShell =
  "mx-auto w-full max-w-7xl border-t border-border/40 px-4 py-14 sm:px-6 lg:px-8";

function TinyIcon({ label }: { label: string }) {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center text-[11px] font-bold">
      {label}
    </span>
  );
}

export default async function Home() {
  const { blogCards, education, events, projects, skills } =
    await getPortfolioContent();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-[color:var(--surface)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="#home"
            className="text-xl font-black tracking-tight sm:text-2xl"
          >
            choti.nunni
          </Link>
          <nav className="hidden items-center gap-1 rounded-full border border-border bg-[color:var(--surface)] p-1 md:flex">
            {navItems.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-medium transition hover:bg-[color:var(--color-accent)] hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="mx-auto w-full max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10"
        >
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="space-y-8">
              <div className="inline-flex w-fit items-center rounded-full border border-border bg-[color:var(--card)] px-4 py-2 text-sm font-medium text-[color:var(--muted)] shadow-sm">
                Front-end / Full-stack developer
              </div>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">
                  Hi, I am nunni
                  <span className="mt-3 block text-[color:var(--color-accent)]">
                    Front End Developer
                  </span>
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
                  I build polished portfolio and product experiences with a calm
                  visual system, strong theme support, and CMS-driven content
                  that stays easy to update.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent)] px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[color:var(--color-accent-strong)]"
                >
                  Show More <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-[color:var(--card)] px-6 py-3 font-semibold transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
                >
                  Contact me <span aria-hidden="true">✉</span>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="soft-card overflow-hidden rounded-[2rem] p-4 sm:p-5">
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-border bg-[linear-gradient(180deg,rgba(148,163,184,0.16),rgba(59,130,246,0.08))]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_42%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)]" />
                  <div className="absolute inset-5 flex items-center justify-center rounded-[1.25rem] border border-dashed border-[color:var(--border)] bg-[color:var(--surface)]/80 text-center">
                    <div className="max-w-xs space-y-3 px-4">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-[color:var(--card)] text-lg font-bold text-[color:var(--color-accent)]">
                        1:1
                      </div>
                      <h2 className="text-xl font-semibold tracking-tight">
                        ANY random mechanical svg
                      </h2>
                      <p className="text-sm leading-6 text-[color:var(--muted)]">
                        SVG Holder
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className={sectionShell}>
          <SectionHeading
            eyebrow="About"
            title="About me"
            description="A clean portfolio shell with a bold hero, content sections that can be managed from Supabase, and a theme system that keeps the entire page consistent."
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="soft-card rounded-[1.75rem] p-8">
              <h3 className="text-2xl font-semibold text-[color:var(--color-accent)]">
                A bit about me
              </h3>
              <p className="mt-4 leading-8 text-[color:var(--muted)]">
                I focus on products that feel structured, fast, and human. The
                layout here keeps the visual rhythm close to your references
                while leaving the content flow ready for Supabase updates.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {skills.slice(0, 6).map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full border border-border bg-[color:var(--card)] px-4 py-2 text-sm"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-[color:var(--color-accent)]">
                  Technologies and tools
                </h3>
                <p className="mt-3 leading-8 text-[color:var(--muted)]">
                  Add here
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="soft-card flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-5 text-center"
                  >
                    <div className="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
                      {skill.category}
                    </div>
                    <div className="font-medium">{skill.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14">
            <SectionHeading
              eyebrow="Education"
              title="Education timeline"
              description="Light-weight motion is reserved for this area so the page feels alive without becoming noisy."
            />
            <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="soft-card rounded-[1.75rem] p-8">
                <div className="space-y-5">
                  {education.map((item, index) => (
                    <div key={item.title} className="relative pl-8">
                      <span className="absolute left-0 top-2 h-4 w-4 rounded-full bg-[color:var(--color-accent)]" />
                      {index !== education.length - 1 ? (
                        <span className="absolute left-[7px] top-6 h-full w-px bg-border" />
                      ) : null}
                      <div className="text-lg font-semibold">{item.title}</div>
                      <div className="mt-1 text-sm text-[color:var(--muted)]">
                        {item.subtitle}
                      </div>
                      <div className="mt-1 text-sm text-[color:var(--muted)]">
                        {item.period}
                      </div>
                      <ul className="mt-3 space-y-1 text-sm leading-7 text-[color:var(--muted)]">
                        {item.details.map((detail) => (
                          <li key={detail}>• {detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        </section>

        <section id="services" className={sectionShell}>
          <SectionHeading
            eyebrow="Services"
            title="What I provide"
            description="This section follows the look of your reference while keeping the cards easy to maintain."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {serviceCards.map((card) => (
              <div key={card.title} className="soft-card rounded-[1.5rem] p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(99,102,241,0.18))] text-[color:var(--color-accent)]">
                  <span className="text-sm font-bold">{card.glyph}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold">{card.title}</h3>
                <p className="mt-3 leading-7 text-[color:var(--muted)]">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className={sectionShell}>
          <SectionHeading
            eyebrow="Projects"
            title="What I built"
            description="Project cards are data-driven and ready to be swapped from Supabase in the admin dashboard."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={project.href}
                className="soft-card group rounded-[1.5rem] p-6 transition hover:-translate-y-1 hover:border-[color:var(--color-accent)]"
              >
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-[color:var(--muted)]">
                  {project.stack.join(" / ")}
                </div>
                <h3 className="mt-5 text-2xl font-semibold">{project.title}</h3>
                <p className="mt-3 leading-7 text-[color:var(--muted)]">
                  {project.description}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 font-semibold text-[color:var(--color-accent)]">
                  Read more{" "}
                  <span
                    className="transition group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={sectionShell}>
          <SectionHeading
            eyebrow="Words and experiences"
            title="Blogspot-linked cards"
            description="Each card can be managed from the dashboard with a cover image, title, and Blogspot URL; the masonry layout keeps variable image sizes organized."
          />
          <div className="masonry mt-10">
            {blogCards.map((card, index) => (
              <a
                key={card.id}
                href={card.href}
                target="_blank"
                rel="noreferrer"
                className="masonry-item group mb-4 block overflow-hidden rounded-[1.5rem] border border-border bg-[color:var(--card)] shadow-sm transition hover:-translate-y-1 hover:border-[color:var(--color-accent)]"
              >
                <div className={`relative w-full ${card.sizeClass}`}>
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading={index === 0 ? "eager" : "lazy"}
                    priority={index === 0}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.88))]" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <div className="flex items-center gap-2 text-sm text-white/75">
                      <TinyIcon label="◧" /> Blogspot
                    </div>
                    <h3 className="mt-2 text-xl font-semibold">{card.title}</h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className={sectionShell}>
          <SectionHeading
            eyebrow="Events"
            title="Events I attended"
            description="Image-heavy cards with a moody feel inspired by the reference while staying responsive."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event, index) => (
              <article
                key={event.id}
                className="group overflow-hidden rounded-[1.5rem] border border-border bg-[color:var(--card)] shadow-sm transition hover:-translate-y-1"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading={index === 0 ? "eager" : "lazy"}
                    priority={index === 0}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.9))]" />
                </div>
                <div className="p-5">
                  <div className="text-sm text-[color:var(--muted)]">
                    {event.date}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold">{event.title}</h3>
                  <p className="mt-3 leading-7 text-[color:var(--muted)]">
                    {event.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className={sectionShell}>
          <SectionHeading
            eyebrow="Contact"
            title="Connect with me"
            description="The form is wired for Formspree, so it can send messages to a chosen email without adding a custom backend."
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <ContactForm />

            <aside className="soft-card rounded-[1.75rem] p-6 sm:p-8">
              <div className="space-y-10 text-center">
                <div>
                  <div className="text-2xl font-semibold">Email</div>
                  <a
                    href={`mailto:${publicSettings.email}`}
                    className="mt-3 block font-semibold text-[color:var(--color-accent)]"
                  >
                    {publicSettings.email}
                  </a>
                </div>
                <div>
                  <div className="text-2xl font-semibold">Address</div>
                  <p className="mt-3 leading-7 text-[color:var(--muted)]">
                    Jhilmil Colony, Delhi, India
                  </p>
                </div>
                <div>
                  <div className="text-2xl font-semibold">Social</div>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    {socialLinks.map(({ glyph, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-[color:var(--card)] transition hover:-translate-y-0.5 hover:border-[color:var(--color-accent)]"
                      >
                        <span className="text-xs font-bold">{glyph}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
