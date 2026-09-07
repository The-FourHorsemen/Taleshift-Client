import { NextRequest, NextResponse } from "next/server";
import { assessPronunciation, normalizeAzureResult } from "@taleshift/asr-client";
import { TranscriptResultSchema } from "@taleshift/shared-types";

/**
 * Owner: person 1 (ASR and validation lead).
 *
 * Receives an uploaded audio file plus the story's reference text,
 * calls Azure Pronunciation Assessment, normalizes the response,
 * and returns it in the shared TranscriptResult shape.
 *
 * Response envelope follows the working agreement convention:
 * { success, data?, error? }
 */
export async function POST(request: NextRequest) {
  try {
    // TODO(person-1): parse multipart form data for audio file,
    // storyId, sessionId, and referenceText. Validate all of these
    // with zod before calling assessPronunciation.
    const raw = await assessPronunciation({
      audioFilePath: "", // placeholder until multipart parsing is wired up
      referenceText: "",
    });

    const normalized = normalizeAzureResult(raw, "story-placeholder", "session-placeholder");
    const validated = TranscriptResultSchema.parse(normalized);

    return NextResponse.json({ success: true, data: validated });
  } catch (error) {
    console.error("ASR route error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process audio." },
      { status: 500 }
    );
  }
}
