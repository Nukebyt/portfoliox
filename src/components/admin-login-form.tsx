"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm({
  nextPath,
  setupRequired,
}: {
  nextPath: string;
  setupRequired: boolean;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (setupRequired && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, next: nextPath }),
      });

      const result = (await response.json()) as {
        ok: boolean;
        message?: string;
        next?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Unable to sign in.");
      }

      router.push(result.next || nextPath);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Login failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="soft-card rounded-3xl p-6 sm:p-8">
      <div className="space-y-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-muted">Admin password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={setupRequired ? 12 : undefined}
            autoComplete={setupRequired ? "new-password" : "current-password"}
            placeholder={
              setupRequired
                ? "Create an admin password"
                : "Enter the admin password"
            }
            className="rounded-2xl border border-border bg-surface px-4 py-3 outline-none transition focus:border-(--color-accent)"
          />
        </label>
        {setupRequired ? (
          <label className="grid gap-2">
            <span className="text-sm font-medium text-muted">
              Confirm password
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={12}
              autoComplete="new-password"
              placeholder="Confirm the admin password"
              className="rounded-2xl border border-border bg-surface px-4 py-3 outline-none transition focus:border-(--color-accent)"
            />
          </label>
        ) : null}
        {error ? (
          <p className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-(--color-accent) px-6 py-3 font-semibold text-white transition hover:bg-(--color-accent-strong) disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? setupRequired
              ? "Creating password..."
              : "Signing in..."
            : setupRequired
              ? "Create password"
              : "Access admin"}
        </button>
      </div>
    </form>
  );
}
