/**
 * Owner: unassigned.
 * TODO: pull real teacher/family message threads instead of the
 * mocked conversation below.
 */
import { ParentPageShell } from "@/components/layout/parent/ParentPageShell";

const MESSAGES = [
  {
    from: "Ms. Rivera (Teacher)",
    preview: "Alex had a great week — comprehension is really improving on nonfiction passages!",
    date: "2 days ago",
    unread: true,
  },
  {
    from: "Taleshift Team",
    preview: "Your weekly progress report for Alex is ready to view.",
    date: "5 days ago",
    unread: false,
  },
  {
    from: "Ms. Rivera (Teacher)",
    preview: "Just assigned a new intervention plan focused on fluency. Let me know if you have questions.",
    date: "1 week ago",
    unread: false,
  },
];

export default function ParentMessagesPage() {
  return (
    <ParentPageShell active="Messages">
      <h1 className="font-display text-[32px] font-bold text-text-primary">Messages</h1>
      <p className="text-text-secondary">Updates and notes from Alex&apos;s teacher.</p>

      <div className="mt-6 max-w-2xl overflow-hidden rounded-xl border border-border-light bg-surface shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col divide-y divide-border-light">
          {MESSAGES.map((m) => (
            <div key={m.preview} className="flex items-start gap-3 px-6 py-4">
              {m.unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-600" />}
              <div className={m.unread ? "" : "pl-5"}>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-text-primary">{m.from}</p>
                  <span className="text-xs text-text-secondary">{m.date}</span>
                </div>
                <p className="mt-1 text-sm text-text-secondary">{m.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ParentPageShell>
  );
}
