import Anthropic from "@anthropic-ai/sdk";

/**
 * Owner: person 4.
 *
 * Used for the text level tasks only: grammar signals and
 * comprehension question generation/checking. Do NOT use this
 * to invent a confidence score from the transcript alone, that
 * was explicitly ruled out, see composite scoring notes. This
 * client's job is comprehension and grammar, hedging detection
 * is handled separately and deterministically in hedgingDetection.ts.
 */

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY must be set. Check .env.local.");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

export interface ComprehensionCheckInput {
  storyText: string;
  childAnswer: string;
  question: string;
}

export interface ComprehensionCheckResult {
  isCorrect: boolean;
  feedback: string;
}

export async function checkComprehensionAnswer(
  input: ComprehensionCheckInput
): Promise<ComprehensionCheckResult> {
  const anthropic = getClient();

  // TODO(person-4): finalize prompt, parse response into
  // ComprehensionCheckResult. Keep this function's signature stable,
  // the API route in apps/web/app/api/nlp depends on it.
  throw new Error("checkComprehensionAnswer not yet implemented");
}
