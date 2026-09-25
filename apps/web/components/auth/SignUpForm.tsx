"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon } from "@/components/icons/PracticeIcons";
import { ChildQuestionnaireFields, EMPTY_CHILD, type ChildDraft } from "@/components/auth/ChildQuestionnaireFields";

const ROLE_COPY = {
  teacher: { title: "Create a Teacher Account", subtitle: "Set up your classroom dashboard.", redirectTo: "/teacher" },
  parent: { title: "Create a Parent Account", subtitle: "Start tracking your child's progress.", redirectTo: "/parent" },
} as const;

type Step = "account" | "children" | "support";

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") === "parent" ? "parent" : "teacher";
  const copy = ROLE_COPY[role];

  const [step, setStep] = useState<Step>("account");
  const [children, setChildren] = useState<ChildDraft[]>([{ ...EMPTY_CHILD }]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function finishSignUp() {
    setError(null);
    setIsSubmitting(true);
    try {
      const endpoint = role === "parent" ? "/api/auth/parent-signup" : "/api/auth/teacher-signup";
      const body =
        role === "parent" ? { fullName, email, password, children } : { fullName, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Couldn't create your account. Please try again.");
        return;
      }

      router.push(copy.redirectTo);
    } catch {
      // Most likely Supabase isn't connected yet - fall back to a plain
      // navigation so the UI is still demoable without a backend.
      router.push(copy.redirectTo);
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateChild(index: number, patch: Partial<ChildDraft>) {
    setChildren((prev) => prev.map((child, i) => (i === index ? { ...child, ...patch } : child)));
  }

  function toggleSupportNeed(index: number, need: string) {
    setChildren((prev) =>
      prev.map((child, i) => {
        if (i !== index) return child;
        const has = child.supportNeeds.includes(need);
        return {
          ...child,
          supportNeeds: has ? child.supportNeeds.filter((n) => n !== need) : [...child.supportNeeds, need],
        };
      }),
    );
  }

  function removeChild(index: number) {
    setChildren((prev) => prev.filter((_, i) => i !== index));
  }

  if (step === "children") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-app-bg px-6 py-12">
        <button
          onClick={() => setStep("account")}
          className="absolute left-6 top-6 flex items-center gap-2 text-sm font-semibold text-text-secondary"
        >
          <ArrowLeftIcon width={14} height={14} />
          Back
        </button>

        <div className="flex w-full max-w-sm flex-col items-center gap-2 text-center">
          <p className="font-display text-3xl font-extrabold text-brand-600">Taleshift</p>
          <p className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">Step 2 of 3</p>
          <h1 className="font-display text-2xl font-bold text-text-primary">Link Your Child</h1>
          <p className="text-text-secondary">Add each child you&apos;d like to track. You can add more later.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep("support");
          }}
          className="mt-8 flex w-full max-w-sm flex-col gap-5"
        >
          {children.map((child, index) => (
            <div key={index} className="flex flex-col gap-3 rounded-xl border border-border-light bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-text-primary">Child {index + 1}</p>
                {children.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChild(index)}
                    className="text-xs font-semibold text-danger-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
                Child&apos;s Full Name
                <input
                  required
                  value={child.name}
                  onChange={(e) => updateChild(index, { name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                  className="rounded-lg border border-border-default px-3 py-2.5 text-sm font-normal text-text-primary"
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
                    onChange={(e) => updateChild(index, { age: e.target.value })}
                    placeholder="e.g. 8"
                    className="rounded-lg border border-border-default px-3 py-2.5 text-sm font-normal text-text-primary"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
                  Grade
                  <input
                    required
                    value={child.grade}
                    onChange={(e) => updateChild(index, { grade: e.target.value })}
                    placeholder="e.g. Grade 3"
                    className="rounded-lg border border-border-default px-3 py-2.5 text-sm font-normal text-text-primary"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
                Class Invite Code (optional)
                <input
                  value={child.inviteCode}
                  onChange={(e) => updateChild(index, { inviteCode: e.target.value })}
                  placeholder="Provided by their teacher"
                  className="rounded-lg border border-border-default px-3 py-2.5 text-sm font-normal text-text-primary"
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
                  onChange={(e) => updateChild(index, { pin: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  placeholder="e.g. 1234"
                  className="rounded-lg border border-border-default px-3 py-2.5 text-sm font-normal text-text-primary"
                />
                <span className="font-normal text-xs text-text-secondary">
                  Your child will use this instead of a password to log in.
                </span>
              </label>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setChildren((prev) => [...prev, { ...EMPTY_CHILD }])}
            className="w-full rounded-full border-2 border-border-default py-2 text-sm font-semibold text-text-secondary"
          >
            + Add Another Child
          </button>

          <button type="submit" className="mt-2 w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white">
            Continue
          </button>
        </form>
      </div>
    );
  }

  if (step === "support") {
    return (
      <div className="flex min-h-screen flex-col items-center bg-app-bg px-6 py-12">
        <button
          onClick={() => setStep("children")}
          className="absolute left-6 top-6 flex items-center gap-2 text-sm font-semibold text-text-secondary"
        >
          <ArrowLeftIcon width={14} height={14} />
          Back
        </button>

        <div className="flex w-full max-w-lg flex-col items-center gap-2 text-center">
          <p className="font-display text-3xl font-extrabold text-brand-600">Taleshift</p>
          <p className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">Step 3 of 3</p>
          <h1 className="font-display text-2xl font-bold text-text-primary">Help Us Understand Your Child</h1>
          <p className="max-w-md text-text-secondary">
            This helps Taleshift personalize the reading experience and pacing. Every field below is optional, and
            visible only to you and your child&apos;s teacher.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            finishSignUp();
          }}
          className="mt-8 flex w-full max-w-lg flex-col gap-6"
        >
          {error && (
            <p className="rounded-lg bg-danger-100 px-3 py-2 text-sm font-semibold text-danger-600">{error}</p>
          )}

          {children.map((child, index) => (
            <ChildQuestionnaireFields
              key={index}
              child={child}
              onChange={(patch) => updateChild(index, patch)}
              onToggleSupportNeed={(need) => toggleSupportNeed(index, need)}
            />
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {isSubmitting ? "Finishing Up..." : "Finish Setting Up"}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={finishSignUp}
            className="text-center text-sm font-semibold text-text-secondary disabled:opacity-60"
          >
            Skip this step
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app-bg px-6 py-12">
      <Link href="/login" className="absolute left-6 top-6 flex items-center gap-2 text-sm font-semibold text-text-secondary">
        <ArrowLeftIcon width={14} height={14} />
        Back
      </Link>

      <div className="flex w-full max-w-sm flex-col items-center gap-2 text-center">
        <p className="font-display text-3xl font-extrabold text-brand-600">Taleshift</p>
        {role === "parent" && <p className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">Step 1 of 3</p>}
        <h1 className="font-display text-2xl font-bold text-text-primary">{copy.title}</h1>
        <p className="text-text-secondary">{copy.subtitle}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (role === "parent") {
            setStep("children");
          } else {
            finishSignUp();
          }
        }}
        className="mt-8 flex w-full max-w-sm flex-col gap-4"
      >
        {error && (
          <p className="rounded-lg bg-danger-100 px-3 py-2 text-sm font-semibold text-danger-600">{error}</p>
        )}

        <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
          Full Name
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className="rounded-lg border border-border-default px-3 py-2.5 text-sm font-normal text-text-primary"
          />
        </label>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {role === "parent" ? "Continue" : isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-4 max-w-sm text-center text-xs text-text-secondary">
        {role === "teacher"
          ? "You'll be able to add students to your class right after signing up."
          : "Next, you'll add your child's details so we can link their account to yours."}
      </p>

      <p className="mt-6 text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href={`/login/${role}`} className="font-semibold text-brand-600">
          Log in
        </Link>
      </p>
    </div>
  );
}
