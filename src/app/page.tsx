import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { SectionHeading } from "@/components/section-heading";
import { MobileNav } from "@/components/mobile-nav";
import { Carousel } from "@/components/carousel";
import { getPortfolioContent } from "@/lib/portfolio-data";
import { publicSettings } from "@/lib/public-settings";

const navItems = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Services", "#services"],
  ["Projects", "#projects"],
  ["Certificates", "#certificates"],
  ["Contact", "#contact"],
];

const socialLinks = [
  { glyph: "GH", href: "https://github.com/Nukebyt", label: "GitHub" },
  { glyph: "IG", href: "https://instagram.com/nukefilms_", label: "Instagram" },
  { glyph: "IN", href: "https://linkedin.com/in/priyanuj-boruah-997ba5231", label: "LinkedIn" },
];

const serviceCards = [
  {
    glyph: "01",
    title: "Low-Latency & Financial Systems",
    text: "C++ infrastructure for exchange-like systems: matching engines, order books, and distributed event pipelines (Kafka, Postgres, Redis) built for correctness under failure, not just demos.",
  },
  {
    glyph: "02",
    title: "Applied AI & Data Analytics",
    text: "Local-first ML tooling and SQL-driven analytics: offline LLM pipelines, forecasting and classification models, and Tableau/Power BI dashboards.",
  },
  {
    glyph: "03",
    title: "VLSI & Digital Design",
    text: "RTL design in Verilog/SystemVerilog, computer architecture, and EDA toolchains (Cadence, Vivado, Quartus) for scalable digital systems.",
  },
  {
    glyph: "04",
    title: "Engineering Leadership",
    text: "Leading cross-functional technical teams of 20+ engineers through planning, integration, and delivery under competition deadlines.",
  },
];

const sectionShell =
  "mx-auto w-full max-w-7xl scroll-mt-20 border-t border-border px-4 py-12 sm:px-6 sm:py-16 lg:px-8";

function TinyIcon({ label }: { label: string }) {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center text-[11px] font-bold">
      {label}
    </span>
  );
}

function SocialIcon({ glyph }: { glyph: string }) {
  if (glyph === "GH") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.47-2.38 1.236-3.22-.124-.303-.536-1.525.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.984-.399 3.005-.404 1.02.005 2.048.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.651.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.62-5.48 5.92.43.37.815 1.1.815 2.22 0 1.604-.015 2.896-.015 3.287 0 .32.216.694.825.577C20.565 21.795 24 17.296 24 12 24 5.37 18.63 0 12 0z" />
      </svg>
    );
  }

  if (glyph === "IG") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <path d="M17.5 6.5h.01" />
      </svg>
    );
  }

  // default: LinkedIn
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.023-3.038-1.852-3.038-1.853 0-2.136 1.445-2.136 2.939v5.668H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.368-1.852 3.602 0 4.268 2.37 4.268 5.455v6.288zM5.337 7.433a2.07 2.07 0 110-4.139 2.07 2.07 0 010 4.139zM6.99 20.452H3.684V9h3.306v11.452z" />
    </svg>
  );
}

export default async function Home() {
  const { blogCards, education, events, projects, skills, technologies, certificates } =
    await getPortfolioContent();

  return (
    <div className="min-h-screen min-w-0">
      <header className="sticky top-0 z-40 border-b border-border bg-[color:var(--surface)]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="#home"
            className="font-mono text-sm font-semibold tracking-tight"
          >
            <span className="text-[color:var(--color-accent)]">▪</span>{" "}
            priyanuj.boruah
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--muted)] transition hover:text-[color:var(--color-accent)]"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/resume.pdf"
              className="hidden items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] md:inline-flex"
            >
              Resume
            </Link>
            {/* TODO: Place the actual resume PDF at public/resume.pdf */}
            <MobileNav navItems={navItems as [string, string][]} />
          </div>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="section-grid mx-auto w-full max-w-7xl scroll-mt-20 px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14"
        >
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="min-w-0 space-y-8">
              <div className="inline-flex max-w-full items-start gap-2 rounded-md border border-border bg-[color:var(--background)] px-3 py-1.5 font-mono text-[11px] font-medium uppercase leading-relaxed tracking-[0.15em] text-[color:var(--muted)] sm:w-fit sm:text-xs sm:tracking-[0.2em]">
                <span className="mt-0.5 shrink-0 text-[color:var(--color-accent)]">●</span>
                <span>Low-Latency Systems / Financial Engineering / Applied AI</span>
              </div>
              <div className="space-y-2">
                <h1 className="max-w-3xl font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
                  Priyanuj Boruah
                </h1>
                <p className="font-serif text-xl italic text-[color:var(--color-accent)] sm:text-2xl md:text-3xl">
                  Systems Engineer, from Silicon to Markets
                </p>
              </div>
              <p className="max-w-xl text-base leading-8 text-[color:var(--muted)]">
                I build C++ trading infrastructure, applied AI tooling, and
                SQL/BI analytics, on a foundation of RTL, RISC-V, and FPGA
                design built for real deadlines, not demos.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-accent)] px-6 py-3 font-semibold text-[color:var(--on-accent)] transition hover:bg-[color:var(--color-accent-strong)]"
                >
                  Show more <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-semibold transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
                >
                  Contact me <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
              <div className="corner-frame relative aspect-[4/3] overflow-hidden border border-border bg-[color:var(--card-strong)]">
                <span className="corner-mark-tr" aria-hidden="true" />
                <span className="corner-mark-bl" aria-hidden="true" />
                {/* Show profile image here. Place the file at public/profilepic.jpeg */}
                <Image
                  src="/profilepic.jpeg"
                  alt="Priyanuj profile"
                  fill
                  sizes="(max-width: 1024px) 60vw, 30vw"
                  className="object-contain p-3"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className={sectionShell}>
          <SectionHeading eyebrow="About" title="About me" description="" index="01" />
          <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="soft-card rounded-md p-8">
              <h3 className="font-serif text-2xl font-medium">
                A bit about me
              </h3>
              <p className="mt-4 leading-8 text-[color:var(--muted)]">
                I'm an Electronics Engineering student (VLSI Design) at VIT Chennai, working at the intersection of RTL design, embedded systems, and computer architecture. That foundation is now pulling me toward low-latency systems and financial engineering: I build C++ trading infrastructure, local-first AI tooling, and SQL/BI analytics alongside FPGA work like a pipelined CFAR radar-detection system. I also led Reva Solar Racing, a 20+ member student team building a solar electric vehicle. GATE 2026 AIR 1626 (Instrumentation Engineering).
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {skills.slice(0, 6).map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-md border border-border px-3 py-1.5 font-mono text-xs"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-medium">
                  Technologies and tools
                </h3>
                <div className="mt-4 space-y-4">
                  {technologies?.map((group: any) => (
                    <div
                      key={group.id}
                      className="border-t border-border pt-4"
                    >
                      <div className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
                        {group.heading}
                      </div>
                      <p className="mt-2 leading-7 text-[color:var(--muted)]">
                        {group.items.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="soft-card flex flex-col items-center justify-center gap-2 rounded-md px-4 py-5 text-center"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
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
              description=""
            />
            <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="soft-card rounded-md p-8">
                <div className="space-y-5">
                  {education.map((item, index) => (
                    <div key={item.title} className="relative pl-8">
                      <span className="absolute left-0 top-2 h-2.5 w-2.5 border-2 border-[color:var(--color-accent)]" />
                      {index !== education.length - 1 ? (
                        <span className="absolute left-[4px] top-6 h-full w-px bg-border" />
                      ) : null}
                      <div className="text-lg font-semibold">{item.title}</div>
                      <div className="mt-1 text-sm text-[color:var(--muted)]">
                        {item.subtitle}
                      </div>
                      <div className="mt-1 font-mono text-xs text-[color:var(--muted)]">
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
            description=""
            index="02"
          />
          <div className="mt-4">
            {serviceCards.map((card) => (
              <div
                key={card.title}
                className="group grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-border py-6 transition sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-8 sm:py-8 lg:grid-cols-[140px_minmax(0,1fr)_1.4fr]"
              >
                <span className="font-mono text-2xl text-[color:var(--muted)] transition group-hover:text-[color:var(--color-accent)] sm:text-4xl">
                  {card.glyph}
                </span>
                <h3 className="font-serif text-xl font-medium sm:text-2xl lg:text-[1.75rem]">
                  {card.title}
                </h3>
                <p className="col-span-2 leading-7 text-[color:var(--muted)] sm:col-span-1 lg:max-w-xl">
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
            description=""
            index="03"
          />
          <div className="mt-10">
            <Carousel
              items={projects.map((project) => (
                <Link
                  key={project.id}
                  href={project.href}
                  className="soft-card group flex h-full flex-col rounded-md p-6 transition hover:border-[color:var(--color-accent)]"
                >
                  <div className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                    {project.stack.join(" / ")}
                  </div>
                  <h3 className="mt-5 font-serif text-2xl font-medium">{project.title}</h3>
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
            />
          </div>
        </section>

        <section className={sectionShell}>
          <SectionHeading
            eyebrow="Words and experiences"
            title="Blogs"
            description=""
            index="04"
          />
          <div className="mt-10">
            <Carousel
              items={blogCards.map((card, index) => (
                <a
                  key={card.id}
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-md border border-border bg-[color:var(--card)] transition hover:border-[color:var(--color-accent)]"
                >
                  <div className="relative h-72 w-full">
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
            />
          </div>
        </section>

        <section className={sectionShell}>
          <SectionHeading
            eyebrow="Events"
            title="Events I attended"
            description=""
            index="05"
          />
          <div className="mt-10">
            <Carousel
              items={events.map((event, index) => (
                <article
                  key={event.id}
                  className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-[color:var(--card)] transition hover:border-[color:var(--color-accent)]"
                >
                  <div className="relative h-72 w-full shrink-0 overflow-hidden">
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
                    <div className="font-mono text-xs text-[color:var(--muted)]">
                      {event.date}
                    </div>
                    <h3 className="mt-2 font-serif text-2xl font-medium">{event.title}</h3>
                    <p className="mt-3 leading-7 text-[color:var(--muted)]">
                      {event.description}
                    </p>
                  </div>
                </article>
              ))}
            />
          </div>
        </section>

        <section id="certificates" className={sectionShell}>
          <SectionHeading
            eyebrow="Certificates"
            title="Certificates & Courses"
            description=""
            index="06"
          />
          <div className="mt-10">
            {certificates.length === 0 ? (
              <div className="soft-card rounded-md p-6">No certificates yet.</div>
            ) : (
              <Carousel
                items={certificates.map((cert, index) => (
                  <article
                    key={cert.id}
                    className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-[color:var(--card)] transition hover:border-[color:var(--color-accent)]"
                  >
                    <div className="relative h-72 w-full shrink-0 overflow-hidden">
                      <Image
                        src={cert.certificateUrl || ''}
                        alt={cert.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading={index === 0 ? "eager" : "lazy"}
                        priority={index === 0}
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.9))]" />
                    </div>
                    <div className="p-5">
                      <div className="font-mono text-xs text-[color:var(--muted)]">{cert.date}</div>
                      <h3 className="mt-2 font-serif text-2xl font-medium">{cert.title}</h3>
                      <div className="mt-1 text-sm text-[color:var(--muted)]">{cert.issuer}</div>
                      <p className="mt-3 leading-7 text-[color:var(--muted)]">{cert.description}</p>
                      {cert.certificateUrl ? (
                        <div className="mt-4">
                          <a
                            href={cert.certificateUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-[color:var(--color-accent)]"
                          >
                            View Certificate
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              />
            )}
          </div>
        </section>

        <section id="contact" className={sectionShell}>
          <SectionHeading
            eyebrow="Contact"
            title="Connect with me"
            description=""
            index="07"
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <ContactForm />

            <aside className="soft-card rounded-md p-6 sm:p-8">
              <div className="space-y-8">
                <div className="border-b border-border pb-8">
                  <div className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                    Email
                  </div>
                  <a
                    href={`mailto:${publicSettings.email}`}
                    className="mt-3 block font-semibold text-[color:var(--color-accent)]"
                  >
                    {publicSettings.email}
                  </a>
                </div>
                <div className="border-b border-border pb-8">
                  <div className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                    Address
                  </div>
                  <p className="mt-3 leading-7 text-[color:var(--muted)]">
                    Vellore Institute of Technology, Chennai, Tamil Nadu, India
                  </p>
                </div>
                <div>
                  <div className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                    Social
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    {socialLinks.map(({ glyph, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
                      >
                        <SocialIcon glyph={glyph} />
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
