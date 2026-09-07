import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { alignReadingToReference } from "@taleshift/alignment-engine";
import { countHedgingLanguage, computeCompositeScore } from "@taleshift/nlp-layer";
import { TranscriptResultSchema } from "@taleshift/shared-types";

const ScoreRequestSchema = z.object({
  transcript: TranscriptResultSchema,
  referenceText: z.string(),
});

/**
 * Owner: person 4 (NLP and scoring layer), consumes alignment_engine
 * as a dependency rather than owning it, per the repo README.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody: unknown = await request.json();
    const { transcript, referenceText } = ScoreRequestSchema.parse(rawBody);

    const referenceWords = referenceText.split(/\s+/).filter(Boolean);
    const spokenWords = transcript.words.map((w) => w.text);

    const alignment = alignReadingToReference(spokenWords, referenceWords);

    const averageWordConfidence =
      transcript.words.reduce((sum, w) => sum + w.confidence, 0) /
      Math.max(transcript.words.length, 1);

    const confidence = {
      hedgingLanguageCount: countHedgingLanguage(transcript.fullText),
      averageWordConfidence,
    };

    const score = computeCompositeScore(transcript.sessionId, alignment, confidence);

    return NextResponse.json({ success: true, data: score });
  } catch (error) {
    console.error("Score route error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to compute score." },
      { status: 500 }
    );
  }
}
