import Link from "next/link";
import { TeacherSideNav } from "@/components/layout/teacher/TeacherSideNav";
import { getClassroomsForTeacher, getRosterForClassroom } from "@taleshift/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface RosterStudent {
  id: string;
  name: string;
  level: string;
  status: "On Track" | "Excelling" | "Needs Support";
  fluency: string;
}

/**
 * Owner: unassigned.
 * Shown only if Supabase isn't connected yet / the teacher has no
 * classroom yet, so this page still demos something instead of an
 * empty roster.
 */
const FALLBACK_STUDENTS: RosterStudent[] = [
  { id: "alex-johnson", name: "Alex Johnson", level: "Level M", status: "On Track", fluency: "82 WPM" },
  { id: "sam", name: "Sam Rivera", level: "Level K", status: "Needs Support", fluency: "58 WPM" },
  { id: "jordan", name: "Jordan Lee", level: "Level L", status: "Needs Support", fluency: "64 WPM" },
  { id: "casey", name: "Casey Kim", level: "Level N", status: "Needs Support", fluency: "61 WPM" },
  { id: "taylor", name: "Taylor Brooks", level: "Level L", status: "Needs Support", fluency: "66 WPM" },
  { id: "morgan", name: "Morgan Diaz", level: "Level P", status: "Excelling", fluency: "94 WPM" },
  { id: "riley", name: "Riley Chen", level: "Level N", status: "On Track", fluency: "80 WPM" },
];

const STATUS_STYLES: Record<RosterStudent["status"], string> = {
  "On Track": "bg-brand-100 text-brand-700",
  Excelling: "bg-success-200 text-[#00714d]",
  "Needs Support": "bg-danger-100 text-danger-600",
};

async function loadRoster(): Promise<{ students: RosterStudent[]; className: string }> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { students: FALLBACK_STUDENTS, className: "Grade 4A" };

    const classrooms = await getClassroomsForTeacher(user.id);
    const classroom = classrooms[0];
    if (!classroom) return { students: FALLBACK_STUDENTS, className: "Grade 4A" };

    const rows = await getRosterForClassroom(classroom.id);
    if (rows.length === 0) return { students: [], className: classroom.name };

    // TODO(unassigned): "status" and "fluency" need a real reading-session
    // analytics pipeline behind them - defaulting until that exists.
    return {
      className: classroom.name,
      students: rows.map(({ learner }) => ({
        id: learner.id,
        name: learner.displayName,
        level: `Level ${learner.currentLevel}`,
        status: "On Track" as const,
        fluency: "—",
      })),
    };
  } catch {
    return { students: FALLBACK_STUDENTS, className: "Grade 4A" };
  }
}

export async function StudentRoster() {
  const { students, className } = await loadRoster();

  return (
    <div className="flex min-h-screen items-start justify-center bg-app-bg pl-64">
      <TeacherSideNav active="Students" />

      <main className="flex w-full flex-1 flex-col items-start gap-8 p-10">
        <div className="w-full max-w-[1280px]">
          <h1 className="font-display text-[32px] font-bold text-text-primary">Class Roster</h1>
          <p className="text-text-secondary">
            {students.length} student{students.length === 1 ? "" : "s"} in {className}
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-border-light bg-surface shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-sidebar-bg">
                <tr className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Reading Level</th>
                  <th className="px-6 py-3">Fluency</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-3 font-semibold text-text-primary">{s.name}</td>
                    <td className="px-6 py-3 text-text-secondary">{s.level}</td>
                    <td className="px-6 py-3 text-text-secondary">{s.fluency}</td>
                    <td className="px-6 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/teacher/students/${s.id}`}
                        className="rounded-full border border-border-default px-3 py-1 text-xs font-semibold text-text-secondary"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
