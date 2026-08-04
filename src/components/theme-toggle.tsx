"use client";

import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    document.documentElement.classList.toggle("dark", storedTheme !== "light");
  }, []);

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem("theme", nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-sm transition hover:scale-105 hover:border-[color:var(--color-accent)]"
      aria-label="Toggle theme"
    >
      <span aria-hidden="true">◐</span>
    </button>
  );
}
