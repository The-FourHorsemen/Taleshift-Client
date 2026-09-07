import type { TranscriptResult, WordResult } from "@taleshift/shared-types";
import type { RawAzureAssessmentResult } from "./azureClient";

/**
 * The rest of the app never sees Azure's response shape directly.
 * If you swap providers later (AssemblyAI, Deepgram), you only
 * write a new normalize function here, nothing downstream changes.
 */
export function normalizeAzureResult(
  raw: RawAzureAssessmentResult,
  storyId: string,
  sessionId: string
): TranscriptResult {
  const words: WordResult[] = raw.words.map((w) => ({
    text: w.Word,
    startMs: w.Offset / 10000, // Azure offsets are in 100-nanosecond units
    endMs: (w.Offset + w.Duration) / 10000,
    confidence: (w.PronunciationAssessment?.AccuracyScore ?? 0) / 100,
    accuracyScore: w.PronunciationAssessment?.AccuracyScore,
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
