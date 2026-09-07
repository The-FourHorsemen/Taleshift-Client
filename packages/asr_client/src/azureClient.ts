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
