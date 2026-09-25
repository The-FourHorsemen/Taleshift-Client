/**
 * Owner: person 5.
 * TODO: pull this learner's full session history via @taleshift/db
 * using params.studentId, instead of the mocked rows below.
 */
import { StudentProfileShell } from "@/components/profile/StudentProfileShell";

const SESSIONS = [
  { date: "Oct 24, 2023", storyTitle: "The Great Coral Reef", durationMinutes: 15, comprehension: "88%", fluency: "82 WPM" },
  { date: "Oct 22, 2023", storyTitle: "Mystery of the Missing Acorn", durationMinutes: 12, comprehension: "76%", fluency: "78 WPM" },
  { date: "Oct 19, 2023", storyTitle: "The Lost Explorer", durationMinutes: 18, comprehension: "81%", fluency: "74 WPM" },
  { date: "Oct 15, 2023", storyTitle: "Volcano Explorer", durationMinutes: 14, comprehension: "70%", fluency: "69 WPM" },
  { date: "Oct 11, 2023", storyTitle: "The Secret Garden", durationMinutes: 20, comprehension: "85%", fluency: "71 WPM" },
];

export default function StudentReadingLogPage({ params }: { params: { studentId: string } }) {
  return (
    <StudentProfileShell
      studentId={params.studentId}
      name="Alex Johnson"
      gradeLevel="Grade 3 • Level M"
      status="Making Progress"
      active="Reading Log"
    >
      <div className="rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        <h1 className="mb-4 font-display text-2xl font-bold text-text-primary">Reading Log</h1>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">
              <th className="pb-2">Date</th>
              <th className="pb-2">Story Title</th>
              <th className="pb-2">Duration</th>
              <th className="pb-2">Comprehension</th>
              <th className="pb-2">Fluency</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {SESSIONS.map((s) => (
              <tr key={s.date + s.storyTitle}>
                <td className="py-3 text-text-secondary">{s.date}</td>
                <td className="py-3 font-semibold text-text-primary">{s.storyTitle}</td>
                <td className="py-3 text-text-secondary">{s.durationMinutes} mins</td>
                <td className="py-3 text-text-secondary">{s.comprehension}</td>
                <td className="py-3 text-text-secondary">{s.fluency}</td>
                <td className="py-3">
                  <button
                    type="button"
                    className="rounded-full border border-border-default px-3 py-1 text-xs font-semibold text-text-secondary"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StudentProfileShell>
  );
}
