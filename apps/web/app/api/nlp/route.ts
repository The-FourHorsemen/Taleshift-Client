import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkComprehensionAnswer } from "@taleshift/nlp-layer";

const NlpRequestSchema = z.object({
  storyText: z.string(),
  question: z.string(),
  childAnswer: z.string(),
});

/**
 * Owner: person 4.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody: unknown = await request.json();
    const { storyText, question, childAnswer } = NlpRequestSchema.parse(rawBody);

    const result = await checkComprehensionAnswer({
      storyText,
      question,
      childAnswer,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("NLP route error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check comprehension answer." },
      { status: 500 }
    );
  }
}
