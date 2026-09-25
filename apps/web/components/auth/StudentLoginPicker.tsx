"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@/components/icons/PracticeIcons";
import { PinEntry } from "@/components/auth/PinEntry";

interface LinkedLearner {
  id: string;
  name: string;
  avatarEmoji: string;
}

const AVATAR_BG_PALETTE = ["bg-indigo-100", "bg-success-200", "bg-brand-100", "bg-amber-100"];

/**
 * Owner: unassigned.
 * Shown only if /api/learners can't be reached (e.g. Supabase isn't
 * connected yet) so the screen still demos something instead of an
 * empty grid. Remove once the API is reliably available.
 */
const FALLBACK_LEARNERS: LinkedLearner[] = [
  { id: "alex", name: "Alex", avatarEmoji: "🐨" },
  { id: "jamie", name: "Jamie", avatarEmoji: "🦊" },
];

export function StudentLoginPicker() {
  const router = useRouter();
  const [customName, setCustomName] = useState("");
  const [selectedLearner, setSelectedLearner] = useState<LinkedLearner | null>(null);
  const [learners, setLearners] = useState<LinkedLearner[]>(FALLBACK_LEARNERS);
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    // Clear any previous student's session before showing the picker,
    // so "Switch Reader" can never leave a prior child's session live.
    fetch("/api/auth/student-logout", { method: "POST" }).catch(() => {});

    fetch("/api/learners")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: LinkedLearner[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setLearners(data);
          setIsMock(false);
        }
      })
      .catch(() => {
        // Supabase likely isn't connected yet - keep the fallback list.
      });
  }, []);

  async function verifyPin(pin: string): Promise<boolean> {
    if (!selectedLearner) return false;

    if (isMock) {
      // No backend connected - accept "1234" so the flow is still demoable.
      await new Promise((r) => setTimeout(r, 300));
      return pin === "1234";
    }

    const res = await fetch("/api/auth/student-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ learnerProfileId: selectedLearner.id, pin }),
    });
    return res.ok;
  }

  if (selectedLearner) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-app-bg px-6 py-12">
        <PinEntry
          learnerName={selectedLearner.name}
          avatarEmoji={selectedLearner.avatarEmoji}
          avatarBg={AVATAR_BG_PALETTE[learners.indexOf(selectedLearner) % AVATAR_BG_PALETTE.length]!}
          onSubmitPin={verifyPin}
          onSuccess={() => router.push("/")}
          onCancel={() => setSelectedLearner(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app-bg px-6 py-12">
      <Link href="/login" className="absolute left-6 top-6 flex items-center gap-2 text-sm font-semibold text-text-secondary">
        <ArrowLeftIcon width={14} height={14} />
        Back
      </Link>

      <div className="flex w-full max-w-lg flex-col items-center gap-2 text-center">
        <p className="font-display text-3xl font-extrabold text-brand-600">Taleshift</p>
        <h1 className="font-display text-2xl font-bold text-text-primary">Who&apos;s reading today?</h1>
        <p className="text-text-secondary">Tap your name, then enter your PIN.</p>
      </div>

      <div className="mt-8 grid w-full max-w-lg grid-cols-2 gap-4 sm:grid-cols-3">
        {learners.map((learner, i) => (
          <button
            key={learner.id}
            type="button"
            onClick={() => setSelectedLearner(learner)}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border-light bg-surface p-5 text-center shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:border-brand-500"
          >
            <span
              className={`flex size-16 items-center justify-center rounded-full text-3xl ${AVATAR_BG_PALETTE[i % AVATAR_BG_PALETTE.length]}`}
            >
              {learner.avatarEmoji}
            </span>
            <p className="font-display text-base font-bold text-text-primary">{learner.name}</p>
          </button>
        ))}
      </div>

      <div className="mt-8 w-full max-w-sm">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">
          Don&apos;t see your name?
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customName.trim()) router.push("/");
          }}
          className="flex gap-2"
        >
          <input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Type your name"
            className="flex-1 rounded-full border border-border-default px-4 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={!customName.trim()}
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40"
          >
            Go
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-text-secondary">
          Ask your teacher or parent to link your account if it&apos;s missing.
        </p>
      </div>
    </div>
  );
}
