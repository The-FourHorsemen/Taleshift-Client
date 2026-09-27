import Link from "next/link";
import { ChildShell } from "@/components/layout/child/ChildShell";

export interface WordEntry {
  word: string;
  meaning: string;
  status: "Mastered" | "Learning";
}

export const MOCK_WORDS: WordEntry[] = [
  { word: "Curious", meaning: "Eager to learn or know something.", status: "Mastered" },
  { word: "Discover", meaning: "To find something for the first time.", status: "Mastered" },
  { word: "Journey", meaning: "A trip from one place to another.", status: "Learning" },
  { word: "Explore", meaning: "To travel through a place to learn about it.", status: "Learning" },
  { word: "Mysterious", meaning: "Something that is strange and hard to explain.", status: "Learning" },
];

const STATUS_STYLES: Record<WordEntry["status"], string> = {
  Mastered: "bg-success-200 text-[#00714d] dark:bg-emerald-500/20 dark:text-emerald-300",
  Learning: "bg-brand-100 text-brand-700 dark:bg-slate-800 dark:text-brand-300",
};

export function MyWords({ learnerName = "Alex", words = MOCK_WORDS }: { learnerName?: string; words?: WordEntry[] }) {
  return (
    <ChildShell active="Words" learnerName={learnerName}>
      <div className="flex w-full max-w-2xl flex-col gap-6 px-6 pt-8">
        <div>
          <h1 className="font-display text-[28px] font-bold text-brand-600 dark:text-brand-400">My Words</h1>
          <p className="text-text-secondary dark:text-slate-400">{words.length} words you&apos;ve learned so far.</p>
        </div>

        <div className="flex flex-col gap-3">
          {words.map((entry) => (
            <div
              key={entry.word}
              className="flex items-center justify-between rounded-xl border border-border-light bg-white p-4 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-slate-700 dark:bg-slate-900"
            >
              <div>
                <p className="font-display text-lg font-bold text-text-primary dark:text-slate-100">{entry.word}</p>
                <p className="text-sm text-text-secondary dark:text-slate-400">{entry.meaning}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[entry.status]}`}>
                {entry.status}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/words/practice"
          className="flex h-14 w-full items-center justify-center rounded-full bg-brand-600 text-base font-bold text-white shadow-[0px_4px_0px_#004395]"
        >
          Practice My Words
        </Link>
      </div>
    </ChildShell>
  );
}
