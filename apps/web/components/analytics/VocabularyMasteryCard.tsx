interface Segment {
  label: string;
  value: number;
  color: string;
}

export function VocabularyMasteryCard({ total, segments }: { total: number; segments: Segment[] }) {
  const sum = segments.reduce((acc, s) => acc + s.value, 0);
  let cumulative = 0;
  const stops = segments.map((s) => {
    const start = (cumulative / sum) * 360;
    cumulative += s.value;
    const end = (cumulative / sum) * 360;
    return `${s.color} ${start}deg ${end}deg`;
  });

  return (
    <div className="flex w-[280px] flex-col gap-4 rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <h3 className="font-display text-lg font-bold text-text-primary">Vocabulary Mastery</h3>
      <div className="flex items-center gap-6">
        <div
          className="relative flex size-32 shrink-0 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(${stops.join(", ")})` }}
        >
          <div className="flex size-[88px] flex-col items-center justify-center rounded-full bg-surface text-center">
            <p className="font-display text-2xl font-bold text-text-primary">{total}</p>
            <p className="text-[10px] text-text-secondary">Total Words</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-sm">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-text-secondary">{s.label}</span>
              <span className="font-semibold text-text-primary">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
