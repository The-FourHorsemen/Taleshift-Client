import * as sdk from "microsoft-cognitiveservices-speech-sdk";

/**
 * Owner: ASR and validation lead.
 *
 * This wraps Azure's Pronunciation Assessment API. It intentionally
 * does not export Azure's raw response type anywhere outside this
 * file. Everything downstream imports from normalize.ts instead.
 *
 * Requires env vars AZURE_SPEECH_KEY and AZURE_SPEECH_REGION.
 * Validate these at startup, not deep inside a request handler.
 */

export interface AssessPronunciationInput {
  audioFilePath: string;
  referenceText: string;
}

export interface RawAzureWordResult {
  Word: string;
  Offset: number;
  Duration: number;
  PronunciationAssessment?: {
    AccuracyScore: number;
    ErrorType: string;
  };
}

export interface RawAzureAssessmentResult {
  words: RawAzureWordResult[];
  fluencyScore: number;
  fullText: string;
  durationMs: number;
}

export async function assessPronunciation(
  input: AssessPronunciationInput
): Promise<RawAzureAssessmentResult> {
  const speechKey = process.env.AZURE_SPEECH_KEY;
  const speechRegion = process.env.AZURE_SPEECH_REGION;

  if (!speechKey || !speechRegion) {
    throw new Error(
      "AZURE_SPEECH_KEY and AZURE_SPEECH_REGION must be set. Check .env.local."
    );
  }

  // TODO(asr-lead): wire up sdk.SpeechConfig, sdk.PronunciationAssessmentConfig,
  // and sdk.AudioConfig.fromWavFileInput here once validation testing
  // confirms Azure's word level scores are reliable on child speech.
  // Keep this function's return shape stable even if the internals change,
  // everything downstream depends on RawAzureAssessmentResult.
  throw new Error("assessPronunciation not yet implemented");
}

export interface TranscribeSummaryAudioInput {
  /** Local file path to the recorded audio (see apps/web/app/api/reading-summary/route.ts). */
  audioFilePath: string;
}

/**
 * Plain speech-to-text (no pronunciation scoring) for a child's spoken
 * book summary - just enough for a parent-facing text preview
 * alongside the audio playback itself.
 *
 * TODO(asr-lead): wire up sdk.SpeechConfig + sdk.SpeechRecognizer with
 * sdk.AudioConfig.fromWavFileInput, matching assessPronunciation's
 * setup above. The uploader currently saves the browser's native
 * MediaRecorder output (webm/opus in Chrome, mp4/aac in Safari) - that
 * will need transcoding to WAV/PCM before this call, or fromWavFileInput
 * swapped for a push/pull audio stream that accepts compressed input.
 */
export async function transcribeSummaryAudio(
  input: TranscribeSummaryAudioInput
): Promise<string> {
  const speechKey = process.env.AZURE_SPEECH_KEY;
  const speechRegion = process.env.AZURE_SPEECH_REGION;

  if (!speechKey || !speechRegion) {
    throw new Error(
      "AZURE_SPEECH_KEY and AZURE_SPEECH_REGION must be set. Check .env.local."
    );
  }

  throw new Error("transcribeSummaryAudio not yet implemented");
}
