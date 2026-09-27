import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { assessPronunciation, normalizeAzureResult } from "@taleshift/asr-client";
import { TranscriptResultSchema } from "@taleshift/shared-types";
import { createReadingSummary } from "@taleshift/db";

/**
 * Owner: person 1 (ASR and validation lead).
 *
 * Receives the child's full read-aloud recording (see
 * components/reading/ReadingSession.tsx) plus the story's reference
 * text. Always saves the audio first so it's never lost even if
 * pronunciation scoring fails or isn't wired up yet, then calls Azure
 * Pronunciation Assessment, normalizes the response, and returns it in
 * the shared TranscriptResult shape.
 *
 * Response envelope follows the working agreement convention:
 * { success, data?, error? }. `data: null` with `success: true` means
 * the recording saved fine but scoring isn't available (e.g. Azure not
 * configured yet, see assessPronunciation) - that's not an error case
 * for the child's flow.
 */
export const runtime = "nodejs";

const AUDIO_DIR = path.join(process.cwd(), "public", "reading-audio");

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const audio = formData.get("audio");
  const storyId = formData.get("storyId");
  const sessionId = formData.get("sessionId");
  const referenceText = formData.get("referenceText");
  const learnerProfileId = formData.get("learnerProfileId");
  const storyTitle = formData.get("storyTitle");

  if (!(audio instanceof Blob) || typeof storyId !== "string" || typeof referenceText !== "string") {
    return NextResponse.json(
      { success: false, error: "audio, storyId, and referenceText are required." },
      { status: 400 },
    );
  }

  const resolvedSessionId = typeof sessionId === "string" && sessionId ? sessionId : randomUUID();
  const fileName = `${resolvedSessionId}.webm`;
  const filePath = path.join(AUDIO_DIR, fileName);
  const audioUrl = `/reading-audio/${fileName}`;

  try {
    await mkdir(AUDIO_DIR, { recursive: true });
    await writeFile(filePath, Buffer.from(await audio.arrayBuffer()));
  } catch (err) {
    console.error("Failed to save reading audio:", err);
    return NextResponse.json({ success: false, error: "Couldn't save the recording." }, { status: 500 });
  }

  if (typeof learnerProfileId === "string") {
    createReadingSummary({
      id: resolvedSessionId,
      learnerProfileId,
      storyId,
      storyTitle: typeof storyTitle === "string" && storyTitle ? storyTitle : "Untitled story",
      audioUrl,
      kind: "full_reading",
    }).catch((err) => {
      console.error("Failed to persist full-reading audio row:", err);
    });
  }

  try {
    // TODO(person-1): assessPronunciation currently expects a WAV file
    // via sdk.AudioConfig.fromWavFileInput (see
    // packages/asr_client/src/azureClient.ts) - the browser's
    // MediaRecorder output saved above is webm/opus, so this will need
    // transcoding once Azure is actually wired up.
    const raw = await assessPronunciation({ audioFilePath: filePath, referenceText });
    const normalized = normalizeAzureResult(raw, storyId, resolvedSessionId);
    const validated = TranscriptResultSchema.parse(normalized);
    return NextResponse.json({ success: true, data: validated, audioUrl });
  } catch (error) {
    console.error("ASR scoring not available:", error);
    return NextResponse.json({ success: true, data: null, audioUrl });
  }
}
