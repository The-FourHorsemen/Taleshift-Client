/**
 * Owner: person 2.
 * TODO: pull learner name, level, streak, and continue-reading state
 * from the DB instead of the mocked values below.
 */
import { LearnerHome } from "@/components/learner/LearnerHome";

export default function LearnerHomePage() {
  return (
    <LearnerHome
      learnerName="Alex"
      level={4}
      levelPercent={72}
      streakDays={4}
      weekActivity={[true, true, false, true, true, false, false]}
      continueReading={{ storyId: "lost-explorer", title: "The Lost Explorer", percentComplete: 64 }}
      todaysGoal={{ minutesDone: 9, minutesTarget: 15 }}
      recommended={{ title: "The Secret Garden" }}
    />
  );
}
