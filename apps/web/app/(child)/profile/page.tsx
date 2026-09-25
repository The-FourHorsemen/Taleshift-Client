/**
 * Owner: person 2.
 * TODO: pull the learner's real level, streak, and badges via
 * @taleshift/db instead of the mocked values below.
 */
import { LearnerProfile } from "@/components/learner/LearnerProfile";

export default function ProfilePage() {
  return (
    <LearnerProfile
      name="Alex"
      level={4}
      levelPercent={72}
      streakDays={4}
      storiesCompleted={12}
      wordsLearned={24}
      badges={[
        { emoji: "🏆", label: "First Story" },
        { emoji: "🔥", label: "4-Day Streak" },
        { emoji: "📚", label: "Bookworm" },
        { emoji: "🧠", label: "Word Master" },
      ]}
    />
  );
}
