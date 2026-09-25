/**
 * Owner: person 2.
 * TODO: source the word list (meaning, story quote) from the session's
 * NLP-layer output instead of the mocked list below.
 */
import { VocabularyPractice } from "@/components/practice/VocabularyPractice";

export default function VocabularyPracticePage() {
  return (
    <VocabularyPractice
      words={[
        { word: "Curious", meaning: "Eager to learn or know something.", storyQuote: "She was curious about the old map.", highlightedWord: "curious" },
        { word: "Discover", meaning: "To find something for the first time.", storyQuote: "They hoped to discover the hidden temple.", highlightedWord: "discover" },
        { word: "Journey", meaning: "A trip from one place to another.", storyQuote: "The journey through the jungle was long.", highlightedWord: "journey" },
        { word: "Explore", meaning: "To travel through a place to learn about it.", storyQuote: "It was time to explore the ruins.", highlightedWord: "explore" },
        {
          word: "Mysterious",
          meaning: "Something that is strange and hard to explain.",
          storyQuote: "There were strange plants and mysterious shadows.",
          highlightedWord: "mysterious",
        },
      ]}
    />
  );
}
