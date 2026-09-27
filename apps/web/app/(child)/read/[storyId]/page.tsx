/**
 * Owner: person 2 (frontend and reading UI).
 *
 * Title/text/newWords are still hardcoded like the rest of the (child)
 * route group - TODO(person-2): pull the real story record and its
 * curated vocab list via @taleshift/db once the story catalog is
 * wired up. struggleWords/bookmarkedWords are real (best-effort,
 * falling back to a small mocked list if the DB isn't reachable).
 */
import { ReadingSession } from "@/components/reading/ReadingSession";
import { getLearnerProfileById, getBookmarkedWordsForLearner } from "@taleshift/db";
import { MOCK_CHILDREN } from "@/lib/mock-data";

const STORY_TITLE = "The Lost Explorer";
const STORY_TEXT =
  "The ancient map led them deep into the heart of the jungle. Everywhere they looked, there were strange plants and mysterious shadows dancing across the path. Amelia held her compass tight, hoping it would point the way home before the sun disappeared below the dense canopy.";

// This story's introduced vocabulary - highlighted blue in the text.
const NEW_WORDS = ["ancient", "mysterious", "compass", "canopy"];

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
  const learnerProfileId = MOCK_CHILDREN[0]!.id;
  const { struggleWords, bookmarkedWords } = await loadWordLists(learnerProfileId);

  return (
    <ReadingSession
      storyId={params.storyId}
      learnerProfileId={learnerProfileId}
      title={STORY_TITLE}
      text={STORY_TEXT}
      newWords={NEW_WORDS}
      struggleWords={struggleWords}
      initialBookmarkedWords={bookmarkedWords}
      progressPercent={64}
    />
  );
}
