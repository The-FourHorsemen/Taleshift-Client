/**
 * Owner: person 2.
 * TODO: pull the learner's real learned-word list (mastery status)
 * via @taleshift/db instead of the mocked words in MyWords - only the
 * bookmarked-while-reading words are real data so far.
 */
import { MyWords, MOCK_WORDS, type WordEntry } from "@/components/words/MyWords";
import { getBookmarkedWordsForLearner } from "@taleshift/db";
import { MOCK_CHILDREN } from "@/lib/mock-data";

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

async function loadWords(learnerProfileId: string): Promise<WordEntry[]> {
  try {
    const bookmarks = await getBookmarkedWordsForLearner(learnerProfileId);
    const bookmarkedEntries: WordEntry[] = bookmarks.map((b) => ({
      word: capitalize(b.word),
      meaning: "Bookmarked while reading - ask a grown-up what it means!",
      status: "Learning",
    }));
    return [...bookmarkedEntries, ...MOCK_WORDS];
  } catch {
    return MOCK_WORDS;
  }
}

export default async function WordsPage() {
  const words = await loadWords(MOCK_CHILDREN[0]!.id);
  return <MyWords words={words} />;
}
