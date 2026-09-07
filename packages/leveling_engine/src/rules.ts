/**
 * Owner: person 5.
 *
 * Deliberately a rules engine, not an LLM call, so every
 * recommendation is auditable and explainable to a parent or
 * teacher without a black box in the loop. This mirrors the
 * decision made in the earlier hackathon prototype build.
 */
export type LevelDirection = "up" | "stay" | "down";

export interface LevelRecommendation {
  direction: LevelDirection;
  newLevel: number;
  reason: string;
}

const LEVEL_UP_THRESHOLD = 85;
const LEVEL_DOWN_THRESHOLD = 50;
const MIN_LEVEL = 1;
const MAX_LEVEL = 5;

export function recommendNextLevel(
  score: number,
  currentLevel: number
): LevelRecommendation {
  if (score >= LEVEL_UP_THRESHOLD) {
    const newLevel = Math.min(currentLevel + 1, MAX_LEVEL);
    return {
      direction: "up",
      newLevel,
      reason:
        newLevel === currentLevel
          ? `Great reading! Already at the highest level, so we'll keep the challenge here.`
          : `Scored ${score}, well above the level up mark of ${LEVEL_UP_THRESHOLD}. Moving up to give a bit more challenge.`,
    };
  }

  if (score <= LEVEL_DOWN_THRESHOLD) {
    const newLevel = Math.max(currentLevel - 1, MIN_LEVEL);
    return {
      direction: "down",
      newLevel,
      reason:
        newLevel === currentLevel
          ? `Scored ${score}, which is a struggle at this level, but it's already the easiest level available.`
          : `Scored ${score}, below the ${LEVEL_DOWN_THRESHOLD} mark. Stepping down a level to build confidence before trying harder text again.`,
    };
  }

  return {
    direction: "stay",
    newLevel: currentLevel,
    reason: `Scored ${score}, a solid score for this level. Staying here for more practice before moving up.`,
  };
}
