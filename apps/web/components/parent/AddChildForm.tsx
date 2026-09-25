"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChildQuestionnaireFields, EMPTY_CHILD, type ChildDraft } from "@/components/auth/ChildQuestionnaireFields";

export function AddChildForm() {
  const router = useRouter();
  const [child, setChild] = useState<ChildDraft>({ ...EMPTY_CHILD });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(patch: Partial<ChildDraft>) {
    setChild((prev) => ({ ...prev, ...patch }));
  }

  function toggleSupportNeed(need: string) {
    setChild((prev) => ({
      ...prev,
      supportNeeds: prev.supportNeeds.includes(need)
        ? prev.supportNeeds.filter((n) => n !== need)
        : [...prev.supportNeeds, need],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/parent/add-child", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(child),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Couldn't add your child. Please try again.");
        return;
      }

      router.push("/parent/children");
    } catch {
      // Most likely Supabase isn't connected yet - fall back to a plain
      // navigation so the UI is still demoable without a backend.
      router.push("/parent/children");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-lg flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
          Child&apos;s Full Name
          <input
            required
            value={child.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="e.g. Jamie Johnson"
            className="rounded-lg border border-border-default px-3 py-2 text-sm font-normal text-text-primary"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
            Age
            <input
              required
              type="number"
              min={3}
              max={18}
              value={child.age}
              onChange={(e) => update({ age: e.target.value })}
              placeholder="e.g. 7"
              className="rounded-lg border border-border-default px-3 py-2 text-sm font-normal text-text-primary"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
            Grade
            <input
              required
              value={child.grade}
              onChange={(e) => update({ grade: e.target.value })}
              placeholder="e.g. Grade 2"
              className="rounded-lg border border-border-default px-3 py-2 text-sm font-normal text-text-primary"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
          Class Invite Code (optional)
          <input
            value={child.inviteCode}
            onChange={(e) => update({ inviteCode: e.target.value })}
            placeholder="Provided by their teacher"
            className="rounded-lg border border-border-default px-3 py-2 text-sm font-normal text-text-primary"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
          Set a 4-Digit Login PIN
          <input
            required
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            value={child.pin}
            onChange={(e) => update({ pin: e.target.value.replace(/\D/g, "").slice(0, 4) })}
            placeholder="e.g. 1234"
            className="rounded-lg border border-border-default px-3 py-2 text-sm font-normal text-text-primary"
          />
          <span className="font-normal text-xs text-text-secondary">
            Your child will use this instead of a password to log in.
          </span>
        </label>
      </div>

      <div>
        <p className="mb-3 text-sm text-text-secondary">
          The details below help us personalize {child.name || "your child"}&apos;s experience. Everything is
          optional and private.
        </p>
        <ChildQuestionnaireFields child={child} onChange={update} onToggleSupportNeed={toggleSupportNeed} />
      </div>

      {error && (
        <p className="rounded-lg bg-danger-100 px-3 py-2 text-sm font-semibold text-danger-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Adding Child..." : "Add Child"}
      </button>
    </form>
  );
}
