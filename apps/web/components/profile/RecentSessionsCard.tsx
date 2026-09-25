interface Session {
  date: string;
  storyTitle: string;
  durationMinutes: number;
}

export function RecentSessionsCard({ sessions }: { sessions: Session[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-text-primary">Recent Sessions</h3>
        <button type="button" className="text-xs font-semibold text-brand-600">
          View All
        </button>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">
            <th className="pb-2 font-semibold">Date</th>
            <th className="pb-2 font-semibold">Story Title</th>
            <th className="pb-2 font-semibold">Duration</th>
            <th className="pb-2 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {sessions.map((s) => (
            <tr key={s.storyTitle}>
              <td className="py-3 text-text-secondary">{s.date}</td>
              <td className="py-3 font-semibold text-text-primary">{s.storyTitle}</td>
              <td className="py-3 text-text-secondary">{s.durationMinutes} mins</td>
              <td className="py-3">
                <button type="button" className="rounded-full border border-border-default px-3 py-1 text-xs font-semibold text-text-secondary">
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
