import { TrendChartIcon } from "@/components/icons/AnalyticsIcons";

interface Point {
  label: string;
  value: number;
}

export function FluencyTrendCard({ points, latestLabel }: { points: Point[]; latestLabel: string }) {
  const max = 90;
  return (
    <div className="flex flex-1 flex-col gap-1 rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <TrendChartIcon width={18} height={18} className="text-brand-600" />
          <h3 className="font-display text-lg font-bold text-text-primary">Reading Fluency Trend</h3>
        </div>
        <span className="rounded-full bg-success-200 px-2 py-0.5 text-xs font-semibold text-[#00714d]">
          On Track
        </span>
      </div>
      <p className="mb-4 text-xs text-text-secondary">Words per minute (WPM) progress vs target</p>

      <div className="flex flex-1 items-end gap-4">
        <div className="flex flex-col justify-between text-xs text-text-secondary" style={{ height: 140 }}>
          {[90, 70, 50, 30].map((v) => (
            <span key={v}>{v}</span>
          ))}
        </div>
        <div className="flex flex-1 items-end justify-between gap-3" style={{ height: 140 }}>
          {points.map((point, i) => {
            const isLast = i === points.length - 1;
            return (
              <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end justify-center">
                  {isLast && (
                    <span className="absolute -top-6 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      {latestLabel}
                    </span>
                  )}
                  <div
                    className={`w-6 rounded-t-md ${isLast ? "bg-brand-600" : "bg-brand-100"}`}
                    style={{ height: `${(point.value / max) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-text-secondary">{point.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
