"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function MobileNav({
  navItems,
}: {
  navItems: [string, string][];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground transition hover:border-[color:var(--color-accent)]"
      >
        <span
          aria-hidden="true"
          className={`absolute h-px w-4 bg-current transition-transform ${
            open ? "translate-y-0 rotate-45" : "-translate-y-[3px]"
          }`}
        />
        <span
          aria-hidden="true"
          className={`absolute h-px w-4 bg-current transition-transform ${
            open ? "translate-y-0 -rotate-45" : "translate-y-[3px]"
          }`}
        />
      </button>

      {open ? (
        <div className="fixed inset-x-0 top-[65px] bottom-0 z-30 overflow-y-auto border-t border-border bg-[color:var(--background)]">
          <nav className="flex flex-col px-4 py-4 sm:px-6">
            {navItems.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 font-mono text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--muted)] transition hover:text-[color:var(--color-accent)]"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/resume.pdf"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm font-medium transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
            >
              Resume
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
