export function FluencyProgressionCard({ points }: { points: number[] }) {
  const width = 500;
  const height = 140;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const stepX = width / (points.length - 1);

  const coords = points.map((p, i) => [i * stepX, height - ((p - min) / range) * height] as const);
  const linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-text-primary">Fluency Progression</h3>
        <span className="text-xs font-semibold text-text-secondary">Last 30 Days</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fluencyFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2170e4" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2170e4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#fluencyFill)" />
        <path d={linePath} fill="none" stroke="#2170e4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-xs text-text-secondary">Progress Overview: Engagement Score (30 Days)</p>
    </div>
  );
}
