/**
 * Owner: unassigned.
 * TODO: pull this child's full session history via @taleshift/db
 * using params.childId, instead of the mocked rows below.
 */
import { ParentChildShell } from "@/components/layout/parent/ParentChildShell";
import { RecentSessionsCard } from "@/components/profile/RecentSessionsCard";

export default function ParentChildReadingLogPage({ params }: { params: { childId: string } }) {
  return (
    <ParentChildShell childId={params.childId} childName="Alex Johnson" active="Reading Log">
      <RecentSessionsCard
        sessions={[
          { date: "Oct 24, 2023", storyTitle: "The Great Coral Reef", durationMinutes: 15 },
          { date: "Oct 22, 2023", storyTitle: "Mystery of the Missing Acorn", durationMinutes: 12 },
          { date: "Oct 19, 2023", storyTitle: "The Lost Explorer", durationMinutes: 18 },
          { date: "Oct 15, 2023", storyTitle: "Volcano Explorer", durationMinutes: 14 },
          { date: "Oct 11, 2023", storyTitle: "The Secret Garden", durationMinutes: 20 },
        ]}
      />
    </ParentChildShell>
  );
}
