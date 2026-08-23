"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { settings } from "@/lib/settings";

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch(settings.formspreeAction, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Unable to send message right now.");
      }

      form.reset();
      setStatus("success");
      setMessage("Message sent successfully. I’ll get back to you soon.");

      window.setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3500);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Unable to send message.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="soft-card rounded-md p-6 sm:p-8"
    >
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            Name
          </span>
          <input
            name="name"
            required
            autoComplete="name"
            placeholder="Enter your name"
            className="rounded-md border border-border bg-[color:var(--surface)] px-4 py-3 outline-none ring-0 transition focus:border-[color:var(--color-accent)]"
          />
        </label>
        <label className="grid gap-2">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="Enter your email"
            data-lpignore="true"
            data-form-type="other"
            suppressHydrationWarning
            className="rounded-md border border-border bg-[color:var(--surface)] px-4 py-3 outline-none ring-0 transition focus:border-[color:var(--color-accent)]"
          />
        </label>
        <label className="grid gap-2">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            Message
          </span>
          <textarea
            name="message"
            rows={6}
            required
            placeholder="Enter your message"
            className="rounded-md border border-border bg-[color:var(--surface)] px-4 py-3 outline-none ring-0 transition focus:border-[color:var(--color-accent)]"
          />
        </label>
      </div>
      <input type="hidden" name="_subject" value="New portfolio message" />
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <a
          href={`mailto:${settings.email}`}
          className="text-sm font-medium underline decoration-[color:var(--color-accent)] underline-offset-4"
        >
          Send me email directly
        </a>
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-[color:var(--color-accent)] px-6 py-3 font-semibold text-[color:var(--on-accent)] transition hover:bg-[color:var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Submit"}
        </button>
      </div>
      {message ? (
        <div
          className={`mt-4 rounded-md border px-4 py-3 text-sm ${
            status === "error"
              ? "border-red-400/40 bg-red-500/10 text-red-700 dark:text-red-300"
              : "border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          }`}
        >
          {message}
        </div>
      ) : null}
    </form>
  );
}
