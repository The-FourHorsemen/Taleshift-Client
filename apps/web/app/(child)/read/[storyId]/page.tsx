/**
 * Owner: person 2 (frontend and reading UI).
 *
 * Loads story copy from the in-memory catalog and hands mic capture /
 * ASR → score → level wiring to ReadingSession.
 */
import { notFound } from "next/navigation";
import { ReadingSession } from "@/components/reading/ReadingSession";
import { getStoryById } from "@/lib/stories";

export default function ReadStoryPage({
  params,
}: {
  params: { storyId: string };
}) {
  const story = getStoryById(params.storyId);
  if (!story) notFound();

  const text = story.paragraphs.join(" ");
  // Prefer a vocab-ish highlight from the first paragraph when present.
  const highlightedWord =
    story.id === "the-lost-explorer" ? "mysterious" : "";

  return (
    <ReadingSession
      storyId={story.id}
      title={story.title}
      text={text}
      highlightedWord={highlightedWord}
      currentLevel={story.level}
      expectedMinutes={story.durationMinutes}
      learnerName="Alex"
      dayStreak={4}
    />
  );
}
