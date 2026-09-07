/**
 * Owner: person 2 (frontend and reading UI).
 *
 * TODO(person-2): mic capture flow, live word highlighting as the
 * child reads, and the recording upload to /api/asr. Can be built
 * against mocked TranscriptResult data before the ASR route is live,
 * see @taleshift/shared-types for the expected shape.
 */
export default function ReadStoryPage({
  params,
}: {
  params: { storyId: string };
}) {
  return (
    <main>
      <h1>Reading story {params.storyId}</h1>
      <p>Mic capture and live highlighting go here.</p>
    </main>
  );
}
