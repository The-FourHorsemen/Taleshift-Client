import {
  TranscriptResultSchema,
  type TranscriptResult,
} from "@taleshift/shared-types";

/**
 * Owner: ASR and validation lead.
 *
 * HTTP client for the Python FastAPI ASR service.
 * Requires env var TALESHIFT_ASR_SERVICE_URL (e.g. http://localhost:8000).
 */

export interface TranscribeAudioInput {
  audioFile: File | Blob;
  storyId: string;
  sessionId: string;
}

export async function transcribeAudio(
  input: TranscribeAudioInput
): Promise<TranscriptResult> {
  const baseUrl = process.env.TALESHIFT_ASR_SERVICE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error(
      "TALESHIFT_ASR_SERVICE_URL must be set. Check .env.local."
    );
  }

  const formData = new FormData();
  const filename =
    input.audioFile instanceof File ? input.audioFile.name : "audio.wav";
  // FastAPI route expects the file field name "audio" (see Taleshift-Server
  // app/api/routes/audio.py). The Next.js /api/asr route still accepts
  // "audioFile" from the browser and remaps here.
  formData.append("audio", input.audioFile, filename);
  formData.append("storyId", input.storyId);
  formData.append("sessionId", input.sessionId);

  const response = await fetch(`${baseUrl}/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `ASR service /transcribe failed (${response.status})${detail ? `: ${detail}` : ""}`
    );
  }

  const json: unknown = await response.json();
  return TranscriptResultSchema.parse(json);
}

export interface AssessPronunciationInput {
  audioFilePath: string;
  referenceText: string;
}

export interface RawAsrWordResult {
  text: string;
  startMs: number;
  endMs: number;
  confidence: number;
  accuracyScore?: number;
}

export interface RawAsrAssessmentResult {
  words: RawAsrWordResult[];
  fluencyScore?: number;
  fullText: string;
  durationMs: number;
}

export async function assessPronunciation(
  input: AssessPronunciationInput
): Promise<RawAsrAssessmentResult> {
  void input;
  throw new Error("assessPronunciation not yet implemented");
}
