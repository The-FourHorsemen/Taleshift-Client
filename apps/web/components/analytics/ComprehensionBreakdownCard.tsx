interface Metric {
  label: string;
  percent: number;
  color: string;
}

export function ComprehensionBreakdownCard({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <div>
        <h3 className="font-display text-lg font-bold text-text-primary">Comprehension Breakdown</h3>
        <p className="text-xs text-text-secondary">Performance by question type.</p>
      </div>
      <div className="flex flex-col gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center gap-4">
            <span className="w-28 shrink-0 text-sm text-text-secondary">{m.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-border-light">
              <div className="h-full rounded-full" style={{ width: `${m.percent}%`, backgroundColor: m.color }} />
            </div>
            <span className="w-10 shrink-0 text-right text-sm font-semibold text-text-primary">{m.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
