import { WarningIcon } from "@/components/icons/AnalyticsIcons";

interface Insight {
  title: string;
  description: string;
  actionLabel: string;
}

export function StruggleInsightsPanel({ insights }: { insights: Insight[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-amber-200 bg-gradient-to-b from-amber-50 to-orange-100 p-6 dark:border-amber-900 dark:from-amber-950 dark:to-orange-950">
      <h3 className="font-display text-lg font-bold text-text-primary">Struggle Insights</h3>
      <p className="-mt-2 text-xs text-text-secondary">AI-detected patterns requiring attention.</p>
      <div className="flex flex-col gap-3">
        {insights.map((insight) => (
          <div key={insight.title} className="rounded-lg border border-amber-200 bg-white/70 p-4 dark:border-amber-800 dark:bg-slate-900/70">
            <p className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <WarningIcon width={14} height={14} className="text-amber-600 dark:text-amber-400" />
              {insight.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">{insight.description}</p>
            <button
              type="button"
              className="mt-3 w-full rounded-full border border-amber-300 bg-white py-1.5 text-xs font-semibold text-text-primary dark:border-amber-800 dark:bg-slate-900"
            >
              {insight.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
