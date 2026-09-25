"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeftIcon } from "@/components/icons/PracticeIcons";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app-bg px-6 py-12">
      <Link href="/login" className="absolute left-6 top-6 flex items-center gap-2 text-sm font-semibold text-text-secondary">
        <ArrowLeftIcon width={14} height={14} />
        Back
      </Link>

      <div className="flex w-full max-w-sm flex-col items-center gap-2 text-center">
        <p className="font-display text-3xl font-extrabold text-brand-600">Taleshift</p>
        <h1 className="font-display text-2xl font-bold text-text-primary">Reset your password</h1>
        <p className="text-text-secondary">We&apos;ll email you a link to get back in.</p>
      </div>

      {sent ? (
        <div className="mt-8 w-full max-w-sm rounded-xl border border-success-200 bg-[#f0fdf9] p-6 text-center">
          <p className="text-sm font-semibold text-text-primary">Check your inbox!</p>
          <p className="mt-1 text-sm text-text-secondary">
            If an account matches that email, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="mt-8 flex w-full max-w-sm flex-col gap-4"
        >
          <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
            Email
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="rounded-lg border border-border-default px-3 py-2.5 text-sm font-normal text-text-primary"
            />
          </label>
          <button type="submit" className="mt-2 w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white">
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
}
