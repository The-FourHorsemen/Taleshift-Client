import type {
  AlignmentResult,
  ConfidenceSignals,
  CompositeScore,
} from "@taleshift/shared-types";

/**
 * Owner: person 4.
 *
 * Weights below are a starting point, not calibrated against real
 * data. Per the earlier discussion: before trusting this in a demo,
 * sanity check the weights against a handful of recordings the team
 * already agrees sound "confident" versus "unconfident." Do not
 * treat these numbers as final.
 */
const WEIGHTS = {
  accuracy: 0.7, // correct words / total words, dominant signal by design
  hedging: 0.1, // inverse of hedging language density
  asrConfidence: 0.2, // average ASR word confidence
};

const HEDGING_PENALTY_CAP = 10; // hedging counts beyond this stop reducing score further

export function computeCompositeScore(
  sessionId: string,
  alignment: AlignmentResult,
  confidence: ConfidenceSignals
): CompositeScore {
  const accuracyRatio = alignment.correctWords / alignment.totalWords;

  const hedgingRatio =
    1 - Math.min(confidence.hedgingLanguageCount, HEDGING_PENALTY_CAP) / HEDGING_PENALTY_CAP;

  const asrConfidenceRatio = confidence.averageWordConfidence;

  const rawScore =
    accuracyRatio * WEIGHTS.accuracy +
    hedgingRatio * WEIGHTS.hedging +
    asrConfidenceRatio * WEIGHTS.asrConfidence;

  const overallScore = Math.round(Math.min(Math.max(rawScore * 100, 0), 100));

  return {
    sessionId,
    alignment,
    confidence,
    overallScore,
  };
}
