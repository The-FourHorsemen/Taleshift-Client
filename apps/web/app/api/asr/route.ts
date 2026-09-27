import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { transcribeAudio } from "@taleshift/asr-client";

/**
 * Owner: person 1 (ASR and validation lead).
 *
 * Receives multipart form data (audio + story/session ids + reference
 * text), forwards the audio to the Python FastAPI ASR service via
 * transcribeAudio, and returns a TranscriptResult.
 *
 * Response envelope follows the working agreement convention:
 * { success, data?, error? }
 */

const AsrFieldsSchema = z.object({
  storyId: z.string().min(1),
  sessionId: z.string().min(1),
  referenceText: z.string().min(1),
});

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error("ASR route: failed to parse multipart body", error);
    return NextResponse.json(
      { success: false, error: "Expected multipart form data." },
      { status: 400 }
    );
  }

  const audioFile = formData.get("audioFile");
  if (!(audioFile instanceof Blob) || audioFile.size === 0) {
    return NextResponse.json(
      { success: false, error: "Audio file is required." },
      { status: 400 }
    );
  }

  const fields = AsrFieldsSchema.safeParse({
    storyId: formData.get("storyId"),
    sessionId: formData.get("sessionId"),
    referenceText: formData.get("referenceText"),
  });

  if (!fields.success) {
    console.error("ASR route validation error:", fields.error.flatten());
    return NextResponse.json(
      {
        success: false,
        error:
          "Invalid request. Provide storyId, sessionId, and referenceText.",
      },
      { status: 400 }
    );
  }

  try {
    // referenceText is required on the request contract; forward to the
    // FastAPI service once /transcribe accepts it.
    const { storyId, sessionId } = fields.data;

    const data = await transcribeAudio({
      audioFile,
      storyId,
      sessionId,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("ASR route error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "ASR service returned an invalid transcript.",
        },
        { status: 502 }
      );
    }

    const message = error instanceof Error ? error.message : "";

    if (message.includes("TALESHIFT_ASR_SERVICE_URL")) {
      return NextResponse.json(
        { success: false, error: "ASR service is not configured." },
        { status: 500 }
      );
    }

    if (message.includes("ASR service /transcribe failed")) {
      return NextResponse.json(
        { success: false, error: "ASR service failed to process audio." },
        { status: 502 }
      );
    }

    // Network failure, timeout, DNS, connection refused, etc.
    return NextResponse.json(
      { success: false, error: "Could not reach the ASR service." },
      { status: 503 }
    );
  }
}
