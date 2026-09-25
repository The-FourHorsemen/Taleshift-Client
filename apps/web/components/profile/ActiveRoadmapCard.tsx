interface RoadmapItem {
  title: string;
  subtitle: string;
  status: "completed" | "current" | "locked";
}

export function ActiveRoadmapCard({ items }: { items: RoadmapItem[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <h3 className="font-display text-lg font-bold text-text-primary">Active Roadmap</h3>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs ${
                item.status === "completed"
                  ? "bg-success-500 text-white"
                  : item.status === "current"
                    ? "bg-brand-600 text-white"
                    : "bg-border-light text-text-secondary"
              }`}
            >
              {item.status === "completed" ? "✓" : item.status === "current" ? "▶" : "🔒"}
            </span>
            <div>
              <p className="text-sm font-semibold text-text-primary">{item.title}</p>
              <p className="text-xs text-text-secondary">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
