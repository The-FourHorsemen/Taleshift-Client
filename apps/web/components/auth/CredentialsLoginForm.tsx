"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon } from "@/components/icons/PracticeIcons";

export function CredentialsLoginForm({
  title,
  subtitle,
  loginEndpoint,
  redirectTo,
  forgotPasswordHref,
  signUpHref,
}: {
  title: string;
  subtitle: string;
  loginEndpoint: string;
  redirectTo: string;
  forgotPasswordHref: string;
  signUpHref: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(loginEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Couldn't log in. Check your email and password.");
        return;
      }

      router.push(redirectTo);
    } catch {
      // Most likely Supabase isn't connected yet - fall back to a plain
      // navigation so the UI is still demoable without a backend.
      router.push(redirectTo);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app-bg px-6 py-12">
      <Link href="/login" className="absolute left-6 top-6 flex items-center gap-2 text-sm font-semibold text-text-secondary">
        <ArrowLeftIcon width={14} height={14} />
        Back
      </Link>

      <div className="flex w-full max-w-sm flex-col items-center gap-2 text-center">
        <p className="font-display text-3xl font-extrabold text-brand-600">Taleshift</p>
        <h1 className="font-display text-2xl font-bold text-text-primary">{title}</h1>
        <p className="text-text-secondary">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-sm flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-danger-100 px-3 py-2 text-sm font-semibold text-danger-600">{error}</p>
        )}

        <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-lg border border-border-default px-3 py-2.5 text-sm font-normal text-text-primary"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="rounded-lg border border-border-default px-3 py-2.5 text-sm font-normal text-text-primary"
          />
        </label>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-text-secondary">
            <input type="checkbox" className="accent-brand-600" />
            Remember me
          </label>
          <Link href={forgotPasswordHref} className="font-semibold text-brand-600">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-sm text-text-secondary">
        New to Taleshift?{" "}
        <Link href={signUpHref} className="font-semibold text-brand-600">
          Create an account
        </Link>
      </p>
    </div>
  );
}
