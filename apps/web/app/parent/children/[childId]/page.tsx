/**
 * Owner: unassigned.
 * TODO: pull this child's real stats via @taleshift/db using
 * params.childId, instead of the mocked "Alex" data below.
 */
import { ParentChildShell } from "@/components/layout/parent/ParentChildShell";
import { StatCard } from "@/components/dashboard/parent/StatCard";
import { FluencyProgressionCard } from "@/components/profile/FluencyProgressionCard";
import { ActiveRoadmapCard } from "@/components/profile/ActiveRoadmapCard";
import { StruggleInsightsPanel } from "@/components/profile/StruggleInsightsPanel";
import { TrendUpIcon, BookIcon, VocabCheckIcon } from "@/components/icons/DashboardIcons";

export default function ParentChildOverviewPage({ params }: { params: { childId: string } }) {
  return (
    <ParentChildShell childId={params.childId} childName="Alex Johnson" active="Overview">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Average Fluency" icon={TrendUpIcon} iconClassName="text-success-500" value="82" caption="WPM" trend="↑+4 from last month" />
        <StatCard label="Comprehension Avg" icon={VocabCheckIcon} iconClassName="text-brand-600" value="78%" trend="↑+2% from last month" />
        <StatCard label="Stories Completed" icon={BookIcon} value="12" caption="This Month" />
        <StatCard label="Day Streak" icon={TrendUpIcon} iconClassName="text-amber-500" value="4" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <FluencyProgressionCard points={[58, 62, 60, 66, 70, 68, 74, 78, 82]} />
        <ActiveRoadmapCard
          items={[
            { title: "Phonics Foundations", subtitle: "Completed Oct 12", status: "completed" },
            { title: "Story: Whispering Woods", subtitle: "In progress", status: "current" },
            { title: "Vocabulary Builder: Nature", subtitle: "Up next", status: "locked" },
          ]}
        />
      </div>

      <div className="mt-6">
        <StruggleInsightsPanel
          insights={[
            {
              title: "Environmental Vocabulary",
              description: "Consistently struggles with multisyllabic science terms (e.g., ecosystem, habitat).",
              actionLabel: "Assign Vocabulary Builder",
            },
          ]}
        />
      </div>
    </ParentChildShell>
  );
}
