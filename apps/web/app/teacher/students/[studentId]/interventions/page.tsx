/**
 * Owner: person 5.
 * TODO: pull this learner's real intervention history via
 * @taleshift/db using params.studentId, instead of the mocked
 * entries below.
 */
import { StudentProfileShell } from "@/components/profile/StudentProfileShell";
import { CheckCircleIcon } from "@/components/icons/DashboardIcons";

const HISTORY = [
  {
    date: "Oct 10, 2023",
    title: "Assign Shorter Passages",
    outcome: "Active",
    description: "Break down complex texts into manageable chunks for reading comprehension.",
  },
  {
    date: "Sep 18, 2023",
    title: "Daily Phoneme Drills",
    outcome: "Completed",
    description: "5 minutes of targeted blending practice each morning. Fluency improved by 12%.",
  },
  {
    date: "Aug 30, 2023",
    title: "Context Clue Practice",
    outcome: "Completed",
    description: "Guided exercises inferring meaning from surrounding text.",
  },
];

export default function StudentInterventionHistoryPage({ params }: { params: { studentId: string } }) {
  return (
    <StudentProfileShell
      studentId={params.studentId}
      name="Alex Johnson"
      gradeLevel="Grade 3 • Level M"
      status="Making Progress"
      active="Intervention History"
    >
      <div className="max-w-2xl rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        <h1 className="mb-4 font-display text-2xl font-bold text-text-primary">Intervention History</h1>
        <div className="flex flex-col divide-y divide-border-light">
          {HISTORY.map((h) => (
            <div key={h.title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <span
                className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${
                  h.outcome === "Completed" ? "bg-success-500 text-white" : "bg-brand-100 text-brand-700"
                }`}
              >
                <CheckCircleIcon width={16} height={16} />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-text-primary">{h.title}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      h.outcome === "Completed" ? "bg-success-200 text-[#00714d]" : "bg-brand-100 text-brand-700"
                    }`}
                  >
                    {h.outcome}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{h.date}</p>
                <p className="mt-1 text-sm text-text-secondary">{h.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StudentProfileShell>
  );
}
