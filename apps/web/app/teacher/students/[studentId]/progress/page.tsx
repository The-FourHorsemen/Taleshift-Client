/**
 * Owner: person 5.
 * TODO: pull this learner's real fluency/comprehension/vocabulary
 * history via @taleshift/db using params.studentId.
 */
import { StudentProfileShell } from "@/components/profile/StudentProfileShell";
import { FluencyProgressionCard } from "@/components/profile/FluencyProgressionCard";
import { ComprehensionBreakdownCard } from "@/components/analytics/ComprehensionBreakdownCard";
import { VocabularyMasteryCard } from "@/components/analytics/VocabularyMasteryCard";

export default function StudentProgressPage({ params }: { params: { studentId: string } }) {
  return (
    <StudentProfileShell
      studentId={params.studentId}
      name="Alex Johnson"
      gradeLevel="Grade 3 • Level M"
      status="Making Progress"
      active="Progress Analytics"
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-[1fr_320px] gap-6">
          <FluencyProgressionCard points={[58, 62, 60, 66, 70, 68, 74, 78, 82]} />
          <VocabularyMasteryCard
            total={124}
            segments={[
              { label: "Mastered", value: 81, color: "#10b981" },
              { label: "Learning", value: 31, color: "#2170e4" },
              { label: "Struggling", value: 12, color: "#c2c6d6" },
            ]}
          />
        </div>
        <ComprehensionBreakdownCard
          metrics={[
            { label: "Main Idea", percent: 85, color: "#10b981" },
            { label: "Detail Recall", percent: 72, color: "#2170e4" },
            { label: "Inference", percent: 62, color: "#f59e0b" },
            { label: "Context Clues", percent: 74, color: "#2170e4" },
          ]}
        />
      </div>
    </StudentProfileShell>
  );
}
