/**
 * Owner: unassigned.
 * TODO: pull this child's full reading-session history (duration,
 * story) via @taleshift/db using params.childId - only the recorded
 * book-summary audio is real data so far (via getReadingSummariesForLearner),
 * merged into the mocked rows below by matching story title.
 */
import { ParentChildShell } from "@/components/layout/parent/ParentChildShell";
import { RecentSessionsCard } from "@/components/profile/RecentSessionsCard";
import { getReadingSummariesForLearner } from "@taleshift/db";

const MOCK_SESSIONS = [
  { date: "Oct 24, 2023", storyTitle: "The Great Coral Reef", durationMinutes: 15 },
  { date: "Oct 22, 2023", storyTitle: "Mystery of the Missing Acorn", durationMinutes: 12 },
  { date: "Oct 19, 2023", storyTitle: "The Lost Explorer", durationMinutes: 18 },
  { date: "Oct 15, 2023", storyTitle: "Volcano Explorer", durationMinutes: 14 },
  { date: "Oct 11, 2023", storyTitle: "The Secret Garden", durationMinutes: 20 },
];

async function loadSessions(childId: string) {
  try {
    const summaries = await getReadingSummariesForLearner(childId);

    const latestAudioByTitle = new Map<string, string>();
    for (const summary of summaries) {
      if (!latestAudioByTitle.has(summary.storyTitle)) {
        latestAudioByTitle.set(summary.storyTitle, summary.audioUrl);
      }
    }

    const merged = MOCK_SESSIONS.map((session) => ({
      ...session,
      summaryAudioUrl: latestAudioByTitle.get(session.storyTitle) ?? null,
    }));

    // Any recorded summary for a story not in the mocked rows still
    // shows up, most recent first, so a freshly recorded summary is
    // always visible even before real session history is wired up.
    const mockedTitles = new Set(MOCK_SESSIONS.map((s) => s.storyTitle));
    const extraRows = summaries
      .filter((s) => !mockedTitles.has(s.storyTitle))
      .map((s) => ({
        date: s.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        storyTitle: s.storyTitle,
        durationMinutes: null,
        summaryAudioUrl: s.audioUrl,
      }));

    return [...extraRows, ...merged];
  } catch {
    return MOCK_SESSIONS.map((session) => ({ ...session, summaryAudioUrl: null }));
  }
}

export default async function ParentChildReadingLogPage({ params }: { params: { childId: string } }) {
  const sessions = await loadSessions(params.childId);

  return (
    <ParentChildShell childId={params.childId} childName="Alex Johnson" active="Reading Log">
      <RecentSessionsCard sessions={sessions} />
    </ParentChildShell>
  );
}
