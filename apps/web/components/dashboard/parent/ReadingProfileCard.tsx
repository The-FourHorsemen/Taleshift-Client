const STATUS_STYLES = {
  excelling: { label: "Excelling", bar: "bg-success-500", text: "text-success-500" },
  onTrack: { label: "On Track", bar: "bg-brand-500", text: "text-brand-500" },
  needsSupport: { label: "Needs Support", bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
} as const;

interface Metric {
  label: string;
  percent: number;
  status: keyof typeof STATUS_STYLES;
}

export function ReadingProfileCard({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border-light bg-surface p-[25px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <h3 className="font-display text-2xl font-bold text-text-primary">Reading Profile</h3>
      <div className="flex flex-col gap-4">
        {metrics.map((metric) => {
          const style = STATUS_STYLES[metric.status];
          return (
            <div key={metric.label} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-primary">
                  {metric.label} ({metric.percent}%)
                </span>
                <span className={`font-semibold ${style.text}`}>{style.label}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-border-light">
                <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${metric.percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
