import { WarningIcon } from "@/components/icons/AnalyticsIcons";

interface AttentionItem {
  title: string;
  tag: string;
  tagTone: "danger" | "warning";
  description: string;
  actionLabel: string;
}

export function AttentionAreasCard({ items }: { items: AttentionItem[] }) {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-2">
        <WarningIcon width={18} height={18} className="text-amber-600" />
        <h3 className="font-display text-lg font-bold text-text-primary">Areas Requiring Attention</h3>
      </div>
      <p className="-mt-2 text-xs text-text-secondary">
        Based on the last 5 reading sessions, Alex consistently struggles with these patterns.
      </p>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-lg border border-border-light p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-text-primary">{item.title}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  item.tagTone === "danger" ? "bg-danger-100 text-danger-600" : "bg-brand-100 text-brand-700"
                }`}
              >
                {item.tag}
              </span>
            </div>
            <p className="mt-1 text-xs text-text-secondary">{item.description}</p>
            <p className="mt-3 text-xs">
              <span className="font-semibold text-text-secondary">Recommended Action: </span>
              <button type="button" className="font-semibold text-brand-600 underline-offset-2 hover:underline">
                {item.actionLabel}
              </button>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
