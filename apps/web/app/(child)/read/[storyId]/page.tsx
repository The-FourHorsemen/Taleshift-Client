/**
 * Owner: person 2 (frontend and reading UI).
 *
 * Loads story copy from the in-memory catalog and hands mic capture /
 * ASR → score → level wiring to ReadingSession. struggleWords/
 * bookmarkedWords come from @taleshift/db (best-effort, falling back
 * to a small mocked list if the DB isn't reachable) - see
 * lib/hooks and components/reading/HighlightedStoryText.tsx.
 */
import { notFound } from "next/navigation";
import { ReadingSession } from "@/components/reading/ReadingSession";
import { getStoryById } from "@/lib/stories";
import { getLearnerProfileById, getBookmarkedWordsForLearner } from "@taleshift/db";
import { MOCK_CHILDREN } from "@/lib/mock-data";

// Vocabulary each story introduces - highlighted blue in the text.
// TODO(person-2): move this onto the story catalog itself once it has
// a real per-story vocab list instead of just `vocabFocus`'s category label.
const NEW_WORDS_BY_STORY: Record<string, string[]> = {
  "the-lost-explorer": ["ancient", "mysterious", "compass", "canopy"],
};

// Shown if this learner has no struggleWords on file yet (or the DB
// isn't reachable), so the highlight demoes something.
const FALLBACK_STRUGGLE_WORDS = ["mysterious", "canopy"];

async function loadWordLists(learnerProfileId: string) {
  try {
    const [learner, bookmarks] = await Promise.all([
      getLearnerProfileById(learnerProfileId),
      getBookmarkedWordsForLearner(learnerProfileId),
    ]);

    return {
      struggleWords: learner?.struggleWords?.length ? learner.struggleWords : FALLBACK_STRUGGLE_WORDS,
      bookmarkedWords: bookmarks.map((b) => b.word),
    };
  } catch {
    return { struggleWords: FALLBACK_STRUGGLE_WORDS, bookmarkedWords: [] as string[] };
  }
}

export default async function ReadStoryPage({
  params,
}: {
  params: { storyId: string };
}) {
  const story = getStoryById(params.storyId);
  if (!story) notFound();

  const text = story.paragraphs.join(" ");
  const learnerProfileId = MOCK_CHILDREN[0]!.id;
  const { struggleWords, bookmarkedWords } = await loadWordLists(learnerProfileId);

  return (
    <ReadingSession
      storyId={story.id}
      learnerProfileId={learnerProfileId}
      title={story.title}
      text={text}
      newWords={NEW_WORDS_BY_STORY[story.id] ?? []}
      struggleWords={struggleWords}
      initialBookmarkedWords={bookmarkedWords}
      currentLevel={story.level}
      expectedMinutes={story.durationMinutes}
      learnerName="Alex"
      dayStreak={4}
    />
  );
}
