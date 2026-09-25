import Image from "next/image";
import { ParentSideNav } from "@/components/layout/parent/ParentSideNav";
import { StatCard } from "@/components/dashboard/parent/StatCard";
import { ReadingProfileCard } from "@/components/dashboard/parent/ReadingProfileCard";
import { StruggleInsightCard } from "@/components/dashboard/parent/StruggleInsightCard";
import { AdaptiveEngineCard } from "@/components/dashboard/parent/AdaptiveEngineCard";
import { TrendUpIcon, ClockIcon, BookIcon, VocabCheckIcon, BellIcon, ChevronDownIcon, AlertIcon, AdjustIcon, CheckCircleIcon } from "@/components/icons/DashboardIcons";

export default function ParentDashboardPage() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-app-bg pl-64">
      <ParentSideNav active="Dashboard" />

      <main className="flex w-full flex-1 flex-col items-start gap-8 p-10">
        <div className="w-full max-w-[1280px]">
          <div className="flex w-full items-center justify-between pb-6">
            <h1 className="font-display text-[32px] font-bold text-text-primary">Dashboard Overview</h1>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 rounded-full border border-border-light bg-surface py-1.5 pl-1.5 pr-3">
                <div className="relative size-9 overflow-hidden rounded-full">
                  <Image src="/images/teacher-avatar.jpg" alt="" fill sizes="36px" className="object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold leading-tight text-text-primary">Alex</p>
                  <p className="text-xs leading-tight text-text-secondary">Level 4</p>
                </div>
                <ChevronDownIcon width={12} height={8} className="text-text-secondary" />
              </button>
              <button
                aria-label="Notifications"
                className="flex size-10 items-center justify-center rounded-full border border-border-light bg-surface text-text-secondary"
              >
                <BellIcon width={18} height={20} />
              </button>
            </div>
          </div>

          <div className="grid w-full grid-cols-4 gap-6">
            <StatCard label="Weekly Progress" icon={TrendUpIcon} iconClassName="text-success-500" value="82%" trend="↑4%" />
            <StatCard label="Reading Time" icon={ClockIcon} value="2h 15m" caption="This week" />
            <StatCard label="Stories Completed" icon={BookIcon} value="6" />
            <StatCard label="Vocabulary Learned" icon={VocabCheckIcon} iconClassName="text-success-500" value="+24" caption="words" />
          </div>

          <div className="mt-6 grid w-full grid-cols-[1fr_320px] gap-6">
            <div className="flex flex-col gap-6">
              <ReadingProfileCard
                metrics={[
                  { label: "Comprehension", percent: 84, status: "excelling" },
                  { label: "Vocabulary", percent: 78, status: "onTrack" },
                  { label: "Fluency", percent: 70, status: "needsSupport" },
                ]}
              />
              <StruggleInsightCard
                heading="Struggle Insight"
                description={'Alex has struggled with words related to "environment" (habitat, ecosystem, conservation) during recent reading sessions, affecting overall fluency.'}
                actionLabel="Introduce Simpler Stories"
              />
            </div>

            <AdaptiveEngineCard
              description="The Taleshift engine continuously monitors reading patterns to keep learners in their optimal zone of proximal development."
              items={[
                {
                  icon: AlertIcon,
                  iconClassName: "bg-amber-100 text-amber-600",
                  title: "Fluency Drop Detected",
                  description: "Reading speed slowed by 15% on non-fiction passages.",
                },
                {
                  icon: AdjustIcon,
                  iconClassName: "bg-brand-100 text-brand-700",
                  title: "Difficulty Adjusted",
                  description: "Temporarily lowered Lexile level to rebuild confidence.",
                },
                {
                  icon: CheckCircleIcon,
                  iconClassName: "bg-brand-600 text-white",
                  title: "Recovery Phase",
                  description: "Currently introducing targeted vocabulary in low-pressure contexts.",
                },
              ]}
              actionLabel="View Detailed Intervention Plan"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
