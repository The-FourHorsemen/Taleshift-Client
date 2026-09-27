import type { TranscriptResult, WordResult } from "@taleshift/shared-types";
import type { RawAsrAssessmentResult } from "./client";

/**
 * Maps the Python ASR service response into the shared TranscriptResult
 * shape. If the service response schema changes, update only this file —
 * nothing downstream depends on RawAsrAssessmentResult.
 */
export function normalizeAsrResult(
  raw: RawAsrAssessmentResult,
  storyId: string,
  sessionId: string
): TranscriptResult {
  const words: WordResult[] = raw.words.map((w) => ({
    text: w.text,
    startMs: w.startMs,
    endMs: w.endMs,
    confidence: w.confidence,
    accuracyScore: w.accuracyScore,
    fluencyScore: raw.fluencyScore,
  }));

  return {
    storyId,
    sessionId,
    words,
    fullText: raw.fullText,
    durationMs: raw.durationMs,
  };
}
