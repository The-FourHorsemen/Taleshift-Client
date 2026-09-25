import Link from "next/link";
import { ChildShell } from "@/components/layout/child/ChildShell";

export function LearnerProfile({
  name,
  level,
  levelPercent,
  streakDays,
  storiesCompleted,
  wordsLearned,
  badges,
}: {
  name: string;
  level: number;
  levelPercent: number;
  streakDays: number;
  storiesCompleted: number;
  wordsLearned: number;
  badges: { emoji: string; label: string }[];
}) {
  return (
    <ChildShell active="Profile" learnerName={name} streakDays={streakDays}>
      <div className="flex w-full max-w-[672px] flex-col items-center gap-6 px-6 pt-10">
        <div className="flex size-24 items-center justify-center rounded-full bg-indigo-100 text-5xl dark:bg-slate-800">
          🐨
        </div>
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-text-primary dark:text-slate-100">{name}</h1>
          <p className="text-sm text-text-secondary dark:text-slate-400">Level {level} Reader</p>
        </div>

        <div className="flex w-full items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-border-light dark:bg-slate-800">
            <div className="h-full rounded-full bg-success-500" style={{ width: `${levelPercent}%` }} />
          </div>
          <span className="text-xs font-semibold text-text-secondary dark:text-slate-400">
            {levelPercent}% to Level {level + 1}
          </span>
        </div>

        <div className="grid w-full grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border-light bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-display text-2xl font-bold text-text-primary dark:text-slate-100">{streakDays}</p>
            <p className="text-xs text-text-secondary dark:text-slate-400">Day Streak</p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border-light bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-display text-2xl font-bold text-text-primary dark:text-slate-100">{storiesCompleted}</p>
            <p className="text-xs text-text-secondary dark:text-slate-400">Stories</p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border-light bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-display text-2xl font-bold text-text-primary dark:text-slate-100">{wordsLearned}</p>
            <p className="text-xs text-text-secondary dark:text-slate-400">Words</p>
          </div>
        </div>

        <div className="w-full">
          <h2 className="mb-3 font-display text-lg font-bold text-text-primary dark:text-slate-100">My Badges</h2>
          <div className="grid grid-cols-4 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center gap-1 rounded-xl border border-border-light bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-900"
              >
                <span className="text-2xl">{badge.emoji}</span>
                <span className="text-[10px] font-semibold text-text-secondary dark:text-slate-400">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/login/student"
          className="mt-2 rounded-full border-2 border-border-default px-6 py-2 text-sm font-semibold text-text-secondary md:hidden dark:border-slate-700 dark:text-slate-400"
        >
          Switch Reader
        </Link>
      </div>
    </ChildShell>
  );
}
