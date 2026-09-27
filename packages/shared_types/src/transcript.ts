import { z } from "zod";

/**
 * Normalized transcript shape produced by @taleshift/asr-client.
 * Every ASR provider response gets mapped into this shape before
 * anything else in the app touches it. If you change this, you
 * change it here first and update asr_client's normalize step,
 * not the other way around.
 */
export const WordResultSchema = z.object({
  text: z.string(),
  startMs: z.number().nonnegative(),
  endMs: z.number().nonnegative(),
  confidence: z.number().min(0).max(1),
  // Pronunciation-assessment scores from the ASR service; optional so
  // plain transcript-only providers still fit this shape.
  accuracyScore: z.number().min(0).max(100).optional(),
  fluencyScore: z.number().min(0).max(100).optional(),
});

export type WordResult = z.infer<typeof WordResultSchema>;

export const TranscriptResultSchema = z.object({
  storyId: z.string(),
  sessionId: z.string(),
  words: z.array(WordResultSchema),
  fullText: z.string(),
  durationMs: z.number().nonnegative(),
});

export type TranscriptResult = z.infer<typeof TranscriptResultSchema>;
