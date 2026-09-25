/**
 * Owner: person 5.
 * TODO: pull this learner's real roadmap via @taleshift/db using
 * params.studentId, instead of the mocked items below.
 */
import { StudentProfileShell } from "@/components/profile/StudentProfileShell";
import { ActiveRoadmapCard } from "@/components/profile/ActiveRoadmapCard";

export default function StudentRoadmapPage({ params }: { params: { studentId: string } }) {
  return (
    <StudentProfileShell
      studentId={params.studentId}
      name="Alex Johnson"
      gradeLevel="Grade 3 • Level M"
      status="Making Progress"
      active="Learning Roadmap"
    >
      <div className="max-w-2xl">
        <h1 className="mb-4 font-display text-2xl font-bold text-text-primary">Learning Roadmap</h1>
        <ActiveRoadmapCard
          items={[
            { title: "Phonics Foundations", subtitle: "Completed Oct 12", status: "completed" },
            { title: "Sight Word Fluency", subtitle: "Completed Oct 5", status: "completed" },
            { title: "Story: Whispering Woods", subtitle: "In progress", status: "current" },
            { title: "Vocabulary Builder: Nature", subtitle: "Up next", status: "locked" },
            { title: "Advanced Comprehension", subtitle: "Locked", status: "locked" },
            { title: "Multi-clause Sentence Practice", subtitle: "Locked", status: "locked" },
          ]}
        />
      </div>
    </StudentProfileShell>
  );
}
