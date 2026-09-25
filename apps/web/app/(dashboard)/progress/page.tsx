/**
 * Owner: person 5.
 * TODO: pull reading_sessions for a learner profile via @taleshift/db
 * and show progress over time, plus the plain language level
 * recommendation reasons, instead of the mocked data below.
 */
import { TeacherSideNav } from "@/components/layout/teacher/TeacherSideNav";
import { FluencyTrendCard } from "@/components/analytics/FluencyTrendCard";
import { VocabularyMasteryCard } from "@/components/analytics/VocabularyMasteryCard";
import { ComprehensionBreakdownCard } from "@/components/analytics/ComprehensionBreakdownCard";
import { AttentionAreasCard } from "@/components/analytics/AttentionAreasCard";
import { DifficultWordsCard } from "@/components/analytics/DifficultWordsCard";
import { DownloadIcon } from "@/components/icons/AnalyticsIcons";
import { ChevronDownIcon } from "@/components/icons/DashboardIcons";

export default function ProgressPage() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-app-bg pl-64">
      <TeacherSideNav active="Insights" />

      <main className="flex w-full flex-1 flex-col items-start gap-8 p-10">
        <div className="w-full max-w-[1280px]">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-[32px] font-bold text-text-primary">Progress Analytics</h1>
              <p className="text-text-secondary">Detailed performance breakdown for Alex</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-full border border-border-default bg-surface px-4 py-2 text-sm font-semibold text-text-secondary">
                Last 30 Days
                <ChevronDownIcon width={10} height={7} />
              </button>
              <button className="flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white">
                <DownloadIcon width={14} height={14} />
                Export
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-6">
            <FluencyTrendCard
              points={[
                { label: "W1", value: 42 },
                { label: "W2", value: 55 },
                { label: "W3", value: 61 },
                { label: "W4", value: 58 },
                { label: "Now", value: 74 },
              ]}
              latestLabel="74 WPM"
            />
            <VocabularyMasteryCard
              total={124}
              segments={[
                { label: "Mastered", value: 81, color: "#10b981" },
                { label: "Learning", value: 31, color: "#2170e4" },
                { label: "Struggling", value: 12, color: "#c2c6d6" },
              ]}
            />
          </div>

          <div className="mt-6">
            <ComprehensionBreakdownCard
              metrics={[
                { label: "Main Idea", percent: 85, color: "#10b981" },
                { label: "Detail Recall", percent: 72, color: "#2170e4" },
                { label: "Inference", percent: 14, color: "#f59e0b" },
                { label: "Context Clues", percent: 68, color: "#2170e4" },
              ]}
            />
          </div>

          <div className="mt-6 flex gap-6">
            <AttentionAreasCard
              items={[
                {
                  title: "Consonant Blends (br, tr, pl)",
                  tag: "High Priority",
                  tagTone: "danger",
                  description: "Found in words like: branch, tree, play",
                  actionLabel: "Add Phonics Exercise to Roadmap",
                },
                {
                  title: "Science Vocabulary",
                  tag: "Monitor",
                  tagTone: "warning",
                  description: "Struggles with multisyllabic topic words.",
                  actionLabel: "Assign 'Nature Explorer' Story",
                },
              ]}
            />
            <DifficultWordsCard
              words={[
                { word: "environment", struggledTimes: 4 },
                { word: "conservation", struggledTimes: 3 },
                { word: "ecosystem", struggledTimes: 2 },
                { word: "habitat", struggledTimes: 2 },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
