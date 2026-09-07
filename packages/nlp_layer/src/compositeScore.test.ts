import { describe, it, expect } from "vitest";
import { computeCompositeScore } from "./compositeScore";
import type { AlignmentResult, ConfidenceSignals } from "@taleshift/shared-types";

describe("computeCompositeScore", () => {
  const perfectAlignment: AlignmentResult = {
    correctWords: 10,
    mispronouncedWords: 0,
    skippedWords: 0,
    totalWords: 10,
    struggleWords: [],
  };

  const confidentSignals: ConfidenceSignals = {
    hedgingLanguageCount: 0,
    averageWordConfidence: 0.95,
  };

  it("scores a perfect, confident read near 100", () => {
    const score = computeCompositeScore(
      "session-1",
      perfectAlignment,
      confidentSignals
    );
    expect(score.overallScore).toBeGreaterThanOrEqual(90);
  });

  it("penalizes skipped and mispronounced words", () => {
    const poorAlignment: AlignmentResult = {
      correctWords: 4,
      mispronouncedWords: 3,
      skippedWords: 3,
      totalWords: 10,
      struggleWords: ["cat", "sat", "mat"],
    };
    const score = computeCompositeScore(
      "session-2",
      poorAlignment,
      confidentSignals
    );
    expect(score.overallScore).toBeLessThan(60);
  });

  it("penalizes high hedging language even with good alignment", () => {
    const hedgingSignals: ConfidenceSignals = {
      hedgingLanguageCount: 8,
      averageWordConfidence: 0.6,
    };
    const score = computeCompositeScore(
      "session-3",
      perfectAlignment,
      hedgingSignals
    );
    expect(score.overallScore).toBeLessThan(90);
  });

  it("never returns a score outside 0 to 100", () => {
    const worstAlignment: AlignmentResult = {
      correctWords: 0,
      mispronouncedWords: 0,
      skippedWords: 10,
      totalWords: 10,
      struggleWords: [],
    };
    const worstSignals: ConfidenceSignals = {
      hedgingLanguageCount: 50,
      averageWordConfidence: 0,
    };
    const score = computeCompositeScore(
      "session-4",
      worstAlignment,
      worstSignals
    );
    expect(score.overallScore).toBeGreaterThanOrEqual(0);
    expect(score.overallScore).toBeLessThanOrEqual(100);
  });
});
