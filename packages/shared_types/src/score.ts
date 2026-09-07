import { z } from "zod";

/**
 * Output of the composite scoring module (packages/nlp_layer).
 * The leveling engine (packages/leveling_engine) reads this shape,
 * it does not read raw transcripts or ASR output directly.
 */
export const ConfidenceSignalsSchema = z.object({
  hedgingLanguageCount: z.number().nonnegative(),
  averageWordConfidence: z.number().min(0).max(1),
  fluencyScore: z.number().min(0).max(100).optional(),
});

export type ConfidenceSignals = z.infer<typeof ConfidenceSignalsSchema>;

export const AlignmentResultSchema = z.object({
  correctWords: z.number().nonnegative(),
  mispronouncedWords: z.number().nonnegative(),
  skippedWords: z.number().nonnegative(),
  totalWords: z.number().positive(),
  struggleWords: z.array(z.string()),
});

export type AlignmentResult = z.infer<typeof AlignmentResultSchema>;

export const CompositeScoreSchema = z.object({
  sessionId: z.string(),
  alignment: AlignmentResultSchema,
  confidence: ConfidenceSignalsSchema,
  overallScore: z.number().min(0).max(100),
});

export type CompositeScore = z.infer<typeof CompositeScoreSchema>;
