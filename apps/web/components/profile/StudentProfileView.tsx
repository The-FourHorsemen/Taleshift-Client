import { StudentProfileShell } from "@/components/profile/StudentProfileShell";
import { StatCard } from "@/components/dashboard/parent/StatCard";
import { FluencyProgressionCard } from "@/components/profile/FluencyProgressionCard";
import { ActiveRoadmapCard } from "@/components/profile/ActiveRoadmapCard";
import { ComprehensionBreakdownCard } from "@/components/analytics/ComprehensionBreakdownCard";
import { RecentSessionsCard } from "@/components/profile/RecentSessionsCard";
import { StruggleInsightsPanel } from "@/components/profile/StruggleInsightsPanel";
import { TrendUpIcon, BookIcon, VocabCheckIcon } from "@/components/icons/DashboardIcons";

export function StudentProfileView({ studentId }: { studentId: string }) {
  return (
    <StudentProfileShell
      studentId={studentId}
      name="Alex Johnson"
      gradeLevel="Grade 3 • Level M"
      status="Making Progress"
      active="Student Overview"
    >
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Average Fluency" icon={TrendUpIcon} iconClassName="text-success-500" value="82" caption="WPM" trend="↑+4 from last month" />
        <StatCard label="Comprehension Avg" icon={VocabCheckIcon} iconClassName="text-brand-600" value="78%" trend="↑+2% from last month" />
        <StatCard label="Stories Completed" icon={BookIcon} value="12" caption="This Month" />
        <StatCard label="Active Interventions" icon={TrendUpIcon} iconClassName="text-amber-500" value="5" />
      </div>

      <div className="mt-6 grid grid-cols-[1fr_320px] gap-6">
        <FluencyProgressionCard points={[58, 62, 60, 66, 70, 68, 74, 78, 82]} />
        <ActiveRoadmapCard
          items={[
            { title: "Phonics Foundations", subtitle: "Completed Oct 12", status: "completed" },
            { title: "Story: Whispering Woods", subtitle: "In progress", status: "current" },
            { title: "Vocabulary Builder: Nature", subtitle: "Up next", status: "locked" },
            { title: "Advanced Comprehension", subtitle: "Locked", status: "locked" },
          ]}
        />
      </div>

      <div className="mt-6 grid grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-6">
          <ComprehensionBreakdownCard
            metrics={[
              { label: "Main Idea", percent: 85, color: "#10b981" },
              { label: "Inference", percent: 62, color: "#f59e0b" },
              { label: "Context Clues", percent: 74, color: "#2170e4" },
            ]}
          />
          <RecentSessionsCard
            sessions={[
              { date: "Oct 24, 2023", storyTitle: "The Great Coral Reef", durationMinutes: 15 },
              { date: "Oct 22, 2023", storyTitle: "Mystery of the Missing Acorn", durationMinutes: 12 },
            ]}
          />
        </div>

        <StruggleInsightsPanel
          insights={[
            {
              title: "Environmental Vocabulary",
              description: 'Consistently struggles with multisyllabic science terms (e.g., ecosystem, habitat).',
              actionLabel: "Assign Vocabulary Builder",
            },
            {
              title: "Multi-clause Sentences",
              description: "Comprehension drops significantly with sentences containing multiple clauses.",
              actionLabel: "Adjust Sentence Complexity",
            },
          ]}
        />
      </div>
    </StudentProfileShell>
  );
}
