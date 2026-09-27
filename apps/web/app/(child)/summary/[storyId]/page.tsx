/**
 * Owner: unassigned.
 * Shown right after a child hits "Finish" on a reading session -
 * records their spoken summary of the book before continuing on to
 * /feedback. See components/reading/SummaryRecorder.tsx.
 * TODO(unassigned): title/learner are hardcoded like the rest of the
 * (child) route group - wire real story lookup + logged-in learner
 * once that's threaded through.
 */
import { SummaryRecorder } from "@/components/reading/SummaryRecorder";

export default function ReadingSummaryPage({ params }: { params: { storyId: string } }) {
  return (
    <SummaryRecorder
      learnerProfileId="alex"
      learnerName="Alex"
      storyId={params.storyId}
      storyTitle="The Lost Explorer"
      nextHref="/feedback"
    />
  );
}
