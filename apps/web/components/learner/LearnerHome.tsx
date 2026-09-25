import Link from "next/link";
import { ChildShell } from "@/components/layout/child/ChildShell";
import { PlayIcon, TargetIcon, ArrowRightIcon } from "@/components/icons/MiscIcons";

interface LearnerHomeProps {
  learnerName: string;
  level: number;
  levelPercent: number;
  streakDays: number;
  weekActivity: boolean[];
  continueReading: { storyId: string; title: string; percentComplete: number };
  todaysGoal: { minutesDone: number; minutesTarget: number };
  recommended: { title: string };
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function LearnerHome({
  learnerName,
  level,
  levelPercent,
  streakDays,
  weekActivity,
  continueReading,
  todaysGoal,
  recommended,
}: LearnerHomeProps) {
  return (
    <ChildShell active="Home" learnerName={learnerName} streakDays={streakDays}>
      <div className="flex w-full max-w-4xl flex-col gap-6 px-6 pt-6 md:pt-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-display text-[28px] font-bold leading-tight text-brand-600 dark:text-brand-400">
              Good evening, {learnerName}!
            </h1>
            <div className="flex items-center gap-2">
              <div className="h-2 w-40 overflow-hidden rounded-full bg-border-light dark:bg-slate-800">
                <div className="h-full rounded-full bg-success-500" style={{ width: `${levelPercent}%` }} />
              </div>
              <span className="text-sm font-semibold text-text-secondary dark:text-slate-400">
                Lvl {level} ({levelPercent}%)
              </span>
            </div>
          </div>
          <div className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-2xl dark:bg-slate-800">
            🐨
            <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-[#f8fafc] bg-amber-400 text-xs font-bold text-white dark:border-slate-950">
              {streakDays}
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_280px]">
          <Link
            href={`/read/${continueReading.storyId}`}
            className="flex flex-col gap-4 rounded-xl border border-border-light bg-white p-4 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex gap-4">
              <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-600 text-2xl">
                📖
              </div>
              <div className="flex flex-1 flex-col justify-center gap-1">
                <p className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary dark:text-slate-400">
                  Continue Reading
                </p>
                <p className="font-display text-xl font-bold text-text-primary dark:text-slate-100">
                  {continueReading.title}
                </p>
                <p className="text-xs font-medium text-text-secondary dark:text-slate-400">
                  {continueReading.percentComplete}% completed
                </p>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border-light dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-success-500"
                style={{ width: `${continueReading.percentComplete}%` }}
              />
            </div>
            <span className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-bold text-white">
              <PlayIcon width={14} height={14} />
              Continue Reading
            </span>
          </Link>

          <div className="flex flex-col gap-3 rounded-xl border border-border-light bg-white p-4 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary dark:text-slate-400">
              This Week
            </p>
            <div className="flex items-center justify-between">
              {weekActivity.map((didRead, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold text-text-secondary dark:text-slate-500">
                    {WEEKDAY_LABELS[i]}
                  </span>
                  <span
                    className={`flex size-7 items-center justify-center rounded-full text-xs ${
                      didRead
                        ? "bg-success-500 text-white"
                        : "bg-border-light text-text-secondary dark:bg-slate-800 dark:text-slate-500"
                    }`}
                  >
                    {didRead ? "✓" : ""}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-secondary dark:text-slate-400">
              {weekActivity.filter(Boolean).length} of 7 days this week
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 rounded-xl border border-border-light bg-white p-4 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <TargetIcon width={18} height={18} className="text-success-500" />
              <p className="text-sm font-semibold text-text-secondary dark:text-slate-400">Today&apos;s Goal</p>
            </div>
            <p className="font-display text-2xl font-bold text-text-primary dark:text-slate-100">
              {todaysGoal.minutesDone}
              <span className="text-base font-medium text-text-secondary dark:text-slate-400">
                {" "}
                / {todaysGoal.minutesTarget} min
              </span>
            </p>
            <span className="w-fit rounded-full bg-success-200 px-2 py-0.5 text-xs font-semibold text-[#00714d] dark:bg-emerald-500/20 dark:text-emerald-300">
              Keep going!
            </span>
          </div>

          <Link
            href="/read/secret-garden"
            className="flex flex-col justify-between gap-2 rounded-xl border border-border-light bg-white p-4 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary dark:text-slate-400">
              Recommended
            </p>
            <p className="font-display text-lg font-bold text-text-primary dark:text-slate-100">
              {recommended.title}
            </p>
            <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-slate-800 dark:text-brand-300">
              <ArrowRightIcon width={16} height={16} />
            </span>
          </Link>
        </div>
      </div>
    </ChildShell>
  );
}
