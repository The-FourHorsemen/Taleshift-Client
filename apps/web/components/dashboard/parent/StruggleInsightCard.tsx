import { AlertIcon } from "@/components/icons/DashboardIcons";
import { ArrowRightIcon } from "@/components/icons/MiscIcons";

export function StruggleInsightCard({
  heading,
  description,
  actionLabel,
}: {
  heading: string;
  description: string;
  actionLabel: string;
}) {
  return (
    <div className="flex gap-6 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-100 p-[25px] dark:border-amber-900 dark:from-amber-950 dark:to-orange-950">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-200/60 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
        <AlertIcon width={20} height={20} />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <h3 className="font-display text-2xl font-bold text-text-primary">{heading}</h3>
        <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
        <div className="mt-2 flex items-center justify-between border-t border-amber-300/50 pt-4 dark:border-amber-800/50">
          <p className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">
            Recommended Action
          </p>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-text-primary dark:border-amber-800 dark:bg-slate-900"
          >
            {actionLabel}
            <ArrowRightIcon width={12} height={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
