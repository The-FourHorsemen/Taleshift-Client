import Image from "next/image";
import Link from "next/link";
import { ChildShell } from "@/components/layout/child/ChildShell";

interface PostReadingSummaryProps {
  learnerName: string;
  storyTitle: string;
  minutes: number;
  dayStreak: number;
  pointsEarned: number;
  newWords: string[];
}

export function PostReadingSummary({
  learnerName,
  storyTitle,
  minutes,
  dayStreak,
  pointsEarned,
  newWords,
}: PostReadingSummaryProps) {
  return (
    <ChildShell active="Read" learnerName={learnerName} streakDays={dayStreak}>
      <div className="flex w-full max-w-[672px] flex-col items-center px-6 pt-12">
        <div className="relative mb-8 flex size-32 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-indigo-100 opacity-50 blur-xl" />
          <div className="relative size-full overflow-hidden rounded-full border-4 border-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
            <Image src="/images/celebration.jpg" alt="Great job celebration" fill sizes="128px" className="object-cover" />
          </div>
        </div>

        <h1 className="text-center font-display text-[32px] font-bold leading-[38.4px] text-brand-600 dark:text-brand-400">
          Great reading, {learnerName}!
        </h1>
        <p className="mt-2 text-center text-lg text-text-secondary dark:text-slate-400">
          You finished &lsquo;{storyTitle}&rsquo;
        </p>

        <div className="mt-8 grid w-full grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-[#e1e2ec] bg-white py-4 shadow-[0px_4px_6px_rgba(0,0,0,0.08)] dark:border-slate-700 dark:bg-slate-900">
            <Image src="/icons/feedback/timer.svg" alt="" width={27} height={39.5} />
            <div className="flex flex-col items-center">
              <p className="font-display text-2xl font-semibold text-[#191b23] dark:text-slate-100">{minutes}</p>
              <p className="text-sm font-semibold text-text-secondary dark:text-slate-400">Minutes</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-[#e1e2ec] bg-white py-4 shadow-[0px_4px_6px_rgba(0,0,0,0.08)] dark:border-slate-700 dark:bg-slate-900">
            <Image src="/icons/feedback/flame.svg" alt="" width={24} height={35} />
            <div className="flex flex-col items-center">
              <p className="font-display text-2xl font-semibold text-[#191b23] dark:text-slate-100">{dayStreak}</p>
              <p className="text-sm font-semibold text-text-secondary dark:text-slate-400">Day Streak!</p>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-4 rounded-xl border border-success-200 bg-[#6ffbbe] p-[17px] shadow-[0px_4px_6px_rgba(0,0,0,0.08)] dark:border-emerald-700 dark:bg-emerald-500/20">
            <Image src="/icons/feedback/star.svg" alt="" width={41} height={44.75} />
            <div>
              <p className="font-display text-2xl font-semibold text-[#005236] dark:text-emerald-300">Story completed!</p>
              <p className="text-sm text-[#005236] opacity-90 dark:text-emerald-300">+{pointsEarned} points earned</p>
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-4 rounded-xl border border-brand-100 bg-indigo-100 p-[21px] shadow-[0px_4px_6px_rgba(0,0,0,0.08)] dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <Image src="/icons/feedback/vocab-book.svg" alt="" width={18.15} height={19} />
              <h3 className="font-display text-2xl font-semibold text-brand-700 dark:text-brand-300">
                {newWords.length} new words learned
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {newWords.map((word) => (
                <span
                  key={word}
                  className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#2170e4] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:bg-slate-900 dark:text-brand-400"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col gap-4">
          <Link
            href="/words/practice"
            className="flex h-14 items-center justify-center gap-4 rounded-full bg-brand-600 text-2xl font-semibold text-white shadow-[0px_4px_0px_#004395]"
          >
            <Image src="/icons/feedback/book-outline.svg" alt="" width={19} height={20} />
            Practice New Words
          </Link>
          <Link
            href="/"
            className="flex h-14 items-center justify-center gap-2 rounded-full border-2 border-border-default text-sm font-semibold text-text-secondary dark:border-slate-700 dark:text-slate-400"
          >
            <Image src="/icons/feedback/home-outline.svg" alt="" width={16} height={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </ChildShell>
  );
}
