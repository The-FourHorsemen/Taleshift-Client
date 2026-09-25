/**
 * Owner: person 2 (frontend and reading UI).
 *
 * TODO(person-2): wire mic capture, live word highlighting driven by
 * real ASR partials, and the recording upload to /api/asr. Currently
 * rendered with mocked TranscriptResult-shaped data, see
 * @taleshift/shared-types for the expected shape.
 */
import { ReadingSession } from "@/components/reading/ReadingSession";

export default function ReadStoryPage({
  params,
}: {
  params: { storyId: string };
}) {
  return (
    <ReadingSession
      storyId={params.storyId}
      title="The Lost Explorer"
      text="The ancient map led them deep into the heart of the jungle. Everywhere they looked, there were strange plants and mysterious shadows dancing across the path. Amelia held her compass tight, hoping it would point the way home before the sun disappeared below the dense canopy."
      highlightedWord="mysterious"
      progressPercent={64}
    />
  );
}
