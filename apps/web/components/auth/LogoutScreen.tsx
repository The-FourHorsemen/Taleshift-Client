"use client";

import Link from "next/link";
import { useEffect } from "react";

export function LogoutScreen() {
  useEffect(() => {
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {
      // Nothing to clean up client-side if this fails - the user still
      // lands on this "logged out" screen either way.
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-app-bg px-6 text-center">
      <p className="font-display text-2xl font-bold text-brand-600">Taleshift</p>
      <h1 className="font-display text-xl font-bold text-text-primary">You&apos;ve been logged out</h1>
      <p className="max-w-sm text-sm text-text-secondary">
        Thanks for using Taleshift. Sign back in anytime to keep tracking your progress.
      </p>
      <Link href="/login" className="mt-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold text-white">
        Log Back In
      </Link>
    </div>
  );
}
