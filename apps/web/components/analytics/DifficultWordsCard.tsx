import { LetterIcon } from "@/components/icons/AnalyticsIcons";

interface WordEntry {
  word: string;
  struggledTimes: number;
}

export function DifficultWordsCard({ words }: { words: WordEntry[] }) {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LetterIcon width={18} height={18} className="text-brand-600" />
          <h3 className="font-display text-lg font-bold text-text-primary">Recent Difficult Words</h3>
        </div>
        <button type="button" className="text-xs font-semibold text-brand-600">
          View All
        </button>
      </div>
      <div className="flex flex-col divide-y divide-border-light">
        {words.map((w) => (
          <div key={w.word} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <p className="text-sm font-semibold text-text-primary">{w.word}</p>
            <p className="text-xs text-text-secondary">Struggled {w.struggledTimes} times this week</p>
          </div>
        ))}
      </div>
    </div>
  );
}
