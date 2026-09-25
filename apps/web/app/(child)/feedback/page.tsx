/**
 * Owner: person 2.
 * TODO: render real CompositeScore and LevelRecommendation after a
 * session instead of the mocked values below.
 */
import { PostReadingSummary } from "@/components/feedback/PostReadingSummary";

export default function FeedbackPage() {
  return (
    <PostReadingSummary
      learnerName="Alex"
      storyTitle="The Lost Explorer"
      minutes={12}
      dayStreak={4}
      pointsEarned={50}
      newWords={["Curious", "Discover", "Journey", "Explore", "Mysterious"]}
    />
  );
}
