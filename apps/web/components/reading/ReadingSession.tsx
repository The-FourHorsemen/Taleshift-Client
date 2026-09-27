"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CompositeScore, TranscriptResult } from "@taleshift/shared-types";
import {
  saveReadingResult,
  type LevelRecommendationResult,
} from "@/lib/reading-result";

interface ReadingSessionProps {
  storyId: string;
  title: string;
  text: string;
  highlightedWord: string;
  /** Learner reading level used for /api/level. Defaults to story level. */
  currentLevel: number;
  learnerName?: string;
  dayStreak?: number;
  /** Soft target for the progress bar while recording (minutes). */
  expectedMinutes?: number;
}

type ApiEnvelope<T> = { success: boolean; data?: T; error?: string };

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok || !json.success || json.data === undefined) {
    throw new Error(json.error ?? `Request to ${url} failed`);
  }
  return json.data;
}

function pickRecorderMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg",
  ];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t));
}

export function ReadingSession({
  storyId,
  title,
  text,
  highlightedWord,
  currentLevel,
  learnerName = "Alex",
  dayStreak = 4,
  expectedMinutes = 10,
}: ReadingSessionProps) {
  const router = useRouter();
  const sessionIdRef = useRef(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `session-${Date.now()}`
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingStartedAtRef = useRef<number | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopTracks = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  }, []);

  const stopRecorder = useCallback((): Promise<Blob | null> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      const chunks = chunksRef.current;
      if (chunks.length === 0) return Promise.resolve(null);
      const type = chunks[0]?.type || "audio/webm";
      return Promise.resolve(new Blob(chunks, { type }));
    }

    return new Promise((resolve) => {
      recorder.addEventListener(
        "stop",
        () => {
          const chunks = chunksRef.current;
          const type = recorder.mimeType || chunks[0]?.type || "audio/webm";
          resolve(chunks.length > 0 ? new Blob(chunks, { type }) : null);
          mediaRecorderRef.current = null;
          stopTracks();
        },
        { once: true }
      );
      recorder.stop();
    });
  }, [stopTracks]);

  const startRecording = useCallback(async () => {
    setError(null);
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Microphone recording isn't supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      chunksRef.current = [];

      const mimeType = pickRecorderMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current = recorder;
      recordingStartedAtRef.current = Date.now();
      recorder.start(250);
      setIsListening(true);
    } catch (err) {
      console.error("Mic permission / start error:", err);
      setError("Couldn't access the microphone. Check permissions and try again.");
      setIsListening(false);
      stopTracks();
    }
  }, [stopTracks]);

  const pauseRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.pause();
    }
    setIsListening(false);
  }, []);

  const resumeRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "paused") {
      recorder.resume();
      setIsListening(true);
      setError(null);
      return;
    }
    void startRecording();
  }, [startRecording]);

  const toggleListening = useCallback(() => {
    if (isSubmitting) return;
    if (isListening) {
      pauseRecording();
    } else {
      resumeRecording();
    }
  }, [isListening, isSubmitting, pauseRecording, resumeRecording]);

  // Soft progress while recording against expected duration.
  useEffect(() => {
    if (!isListening) return;
    const targetMs = Math.max(expectedMinutes, 1) * 60 * 1000;
    const id = window.setInterval(() => {
      const started = recordingStartedAtRef.current;
      if (!started) return;
      const pct = Math.min(99, Math.floor(((Date.now() - started) / targetMs) * 100));
      setProgressPercent(pct);
    }, 500);
    return () => window.clearInterval(id);
  }, [isListening, expectedMinutes]);

  const startRecordingRef = useRef(startRecording);
  startRecordingRef.current = startRecording;
  const stopTracksRef = useRef(stopTracks);
  stopTracksRef.current = stopTracks;

  useEffect(() => {
    void startRecordingRef.current();
    return () => {
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.ondataavailable = null;
        try {
          recorder.stop();
        } catch {
          // already stopped
        }
      }
      mediaRecorderRef.current = null;
      stopTracksRef.current();
    };
  }, []);

  const handleFinish = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    setIsListening(false);

    try {
      const audioBlob = await stopRecorder();
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error("No audio was recorded. Tap the mic and try reading again.");
      }

      const extension = audioBlob.type.includes("mp4")
        ? "mp4"
        : audioBlob.type.includes("ogg")
          ? "ogg"
          : "webm";

      const formData = new FormData();
      formData.append(
        "audioFile",
        audioBlob,
        `reading-${sessionIdRef.current}.${extension}`
      );
      formData.append("storyId", storyId);
      formData.append("sessionId", sessionIdRef.current);
      formData.append("referenceText", text);

      const elapsedMs = recordingStartedAtRef.current
        ? Date.now() - recordingStartedAtRef.current
        : 0;

      const asrRes = await fetch("/api/asr", { method: "POST", body: formData });
      const asrJson = (await asrRes.json()) as ApiEnvelope<TranscriptResult>;
      if (!asrRes.ok || !asrJson.success || !asrJson.data) {
        throw new Error(asrJson.error ?? "Failed to transcribe audio.");
      }
      const transcript: TranscriptResult = {
        ...asrJson.data,
        durationMs: asrJson.data.durationMs || elapsedMs,
      };

      const score = await postJson<CompositeScore>("/api/score", {
        transcript,
        referenceText: text,
      });

      const level = await postJson<LevelRecommendationResult>("/api/level", {
        score: score.overallScore,
        currentLevel,
      });

      saveReadingResult({
        storyId,
        storyTitle: title,
        learnerName,
        dayStreak,
        transcript,
        score,
        level,
      });

      setProgressPercent(100);
      router.push("/feedback");
    } catch (err) {
      console.error("Reading session finish error:", err);
      setError(
        err instanceof Error ? err.message : "Something went wrong finishing the session."
      );
      setIsSubmitting(false);
    }
  }, [
    currentLevel,
    dayStreak,
    isSubmitting,
    learnerName,
    router,
    stopRecorder,
    storyId,
    text,
    title,
  ]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f8fafc]">
      <header className="z-20 flex w-full items-center justify-between px-6 pb-4 pt-8">
        <Link
          href="/"
          aria-label="Close reading session"
          className="flex size-8 items-center justify-center rounded-full"
        >
          <Image src="/icons/reading-session/close.svg" alt="" width={16.3} height={16.3} />
        </Link>

        <div className="flex flex-1 flex-col items-center gap-1.5 px-6">
          <div className="h-3 w-full max-w-[240px] overflow-hidden rounded-full bg-border-light shadow-[inset_0px_2px_4px_rgba(0,0,0,0.05)]">
            <div
              className="h-full rounded-full bg-success-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs font-medium tracking-[0.24px] text-text-secondary">
            {progressPercent}%
          </p>
        </div>

        <div className="size-12 shrink-0" />
      </header>

      <main className="z-10 flex flex-1 flex-col items-center px-6 pb-48 pt-6">
        <article className="flex w-full max-w-[500px] flex-col items-center gap-10">
          <h1 className="text-center font-display text-[32px] font-bold leading-[38.4px] tracking-[-0.8px] text-[#0f172a]">
            {title}
          </h1>
          <p className="w-full font-display text-2xl font-semibold leading-[48px] text-[#0f172a]">
            {highlightedWord
              ? text.split(highlightedWord).map((chunk, j, arr) => (
                  <span key={j}>
                    {chunk}
                    {j < arr.length - 1 && (
                      <span className="rounded-lg bg-indigo-100 font-bold text-brand-600 shadow-[0px_2px_8px_rgba(59,130,246,0.15)]">
                        {highlightedWord}
                      </span>
                    )}
                  </span>
                ))
              : text}
          </p>
          {error && (
            <p
              role="alert"
              className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
        </article>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-end justify-center bg-gradient-to-t from-[#f8fafc] from-0% via-[rgba(248,250,252,0.95)] via-50% to-[rgba(248,250,252,0)] px-6 pb-10 pt-14">
        <div className="relative flex w-full max-w-[500px] items-center justify-center">
          <button
            type="button"
            onClick={toggleListening}
            disabled={isSubmitting}
            aria-pressed={isListening}
            aria-label={isListening ? "Pause listening" : "Start listening"}
            className="relative flex size-24 items-center justify-center rounded-full disabled:opacity-60"
          >
            {isListening && (
              <>
                <span className="absolute inset-0 animate-ping rounded-full bg-[#3b82f6]/20" />
                <span className="absolute inset-0 rounded-full bg-[#3b82f6]/30" />
              </>
            )}
            <span className="relative flex size-24 items-center justify-center rounded-full bg-[#3b82f6] drop-shadow-[0px_6px_0px_#0058be]">
              <Image src="/icons/reading-session/mic.svg" alt="" width={23.3} height={31.7} />
            </span>
          </button>
          <button
            type="button"
            onClick={() => void handleFinish()}
            disabled={isSubmitting}
            className="absolute right-0 flex items-center justify-center rounded-full border-2 border-border-default bg-[rgba(248,250,252,0.8)] px-[26px] py-3.5 text-sm font-semibold tracking-[0.14px] text-text-secondary shadow-[0px_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-[2px] disabled:opacity-60"
          >
            {isSubmitting ? "Scoring…" : "Finish"}
          </button>
        </div>
      </div>
    </div>
  );
}
