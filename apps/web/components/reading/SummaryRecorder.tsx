"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChildShell } from "@/components/layout/child/ChildShell";

interface SummaryRecorderProps {
  learnerProfileId: string;
  learnerName: string;
  storyId: string;
  storyTitle: string;
  /** Where to go once the child is done (recorded + sent, or skipped). */
  nextHref: string;
}

const MAX_RECORDING_SECONDS = 90;

type RecorderState = "idle" | "requesting" | "recording" | "recorded" | "uploading" | "sent" | "error";

export function SummaryRecorder({
  learnerProfileId,
  learnerName,
  storyId,
  storyTitle,
  nextHref,
}: SummaryRecorderProps) {
  const router = useRouter();
  const [state, setState] = useState<RecorderState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordedBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  async function startRecording() {
    setErrorMessage(null);
    setState("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        recordedBlobRef.current = blob;
        setAudioPreviewUrl(URL.createObjectURL(blob));
        setState("recorded");
        stopStream();
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setSeconds(0);
      setState("recording");

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          const next = s + 1;
          if (next >= MAX_RECORDING_SECONDS) stopRecording();
          return next;
        });
      }, 1000);
    } catch {
      setErrorMessage("We couldn't access the microphone. You can still skip this step.");
      setState("error");
    }
  }

  function stopRecording() {
    stopTimer();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }

  function retryRecording() {
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setAudioPreviewUrl(null);
    recordedBlobRef.current = null;
    setSeconds(0);
    setState("idle");
  }

  async function sendSummary() {
    const blob = recordedBlobRef.current;
    if (!blob) return;

    setState("uploading");
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("audio", blob, "summary.webm");
      formData.append("learnerProfileId", learnerProfileId);
      formData.append("storyId", storyId);
      formData.append("storyTitle", storyTitle);
      formData.append("durationSeconds", String(seconds));

      const res = await fetch("/api/reading-summary", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");

      setState("sent");
      router.push(nextHref);
    } catch {
      // Don't trap the child on this screen if the backend is
      // unreachable in this environment - let them continue either way.
      setErrorMessage("Couldn't send your summary right now, but that's okay!");
      setState("sent");
      router.push(nextHref);
    }
  }

  const minutes = Math.floor(seconds / 60);
  const remSeconds = seconds % 60;
  const timeLabel = `${minutes}:${remSeconds.toString().padStart(2, "0")}`;

  return (
    <ChildShell active="Read" learnerName={learnerName}>
      <div className="flex w-full max-w-[672px] flex-col items-center px-6 pt-12 text-center">
        <div className="relative mb-8 flex size-28 items-center justify-center rounded-full bg-indigo-100 dark:bg-slate-800">
          <Image src="/icons/reading-session/mic.svg" alt="" width={32} height={43} />
        </div>

        <h1 className="font-display text-[28px] font-bold leading-tight text-brand-600 dark:text-brand-400">
          Tell us about &lsquo;{storyTitle}&rsquo;!
        </h1>
        <p className="mt-2 max-w-sm text-lg text-text-secondary dark:text-slate-400">
          Record a quick summary of the book so Mom and Dad can hear how it went.
        </p>

        <div className="mt-10 flex w-full flex-col items-center gap-6">
          {(state === "idle" || state === "requesting" || state === "error") && (
            <button
              type="button"
              onClick={startRecording}
              disabled={state === "requesting"}
              className="flex size-24 items-center justify-center rounded-full bg-[#3b82f6] drop-shadow-[0px_6px_0px_#0058be] disabled:opacity-60"
              aria-label="Start recording"
            >
              <Image src="/icons/reading-session/mic.svg" alt="" width={23.3} height={31.7} />
            </button>
          )}

          {state === "recording" && (
            <button
              type="button"
              onClick={stopRecording}
              className="relative flex size-24 items-center justify-center rounded-full"
              aria-label="Stop recording"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-[#ef4444]/20" />
              <span className="relative flex size-24 items-center justify-center rounded-full bg-[#ef4444] drop-shadow-[0px_6px_0px_#a30000]">
                <span className="size-6 rounded-sm bg-white" />
              </span>
            </button>
          )}

          {(state === "recording" || state === "recorded" || state === "uploading") && (
            <p className="font-display text-2xl font-semibold text-text-primary dark:text-slate-100">{timeLabel}</p>
          )}

          {state === "recorded" && audioPreviewUrl && (
            <div className="flex w-full max-w-sm flex-col items-center gap-4">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio controls src={audioPreviewUrl} className="w-full" />
              <div className="flex w-full gap-3">
                <button
                  type="button"
                  onClick={retryRecording}
                  className="flex-1 rounded-full border-2 border-border-default py-3 text-sm font-semibold text-text-secondary dark:border-slate-700 dark:text-slate-400"
                >
                  Record Again
                </button>
                <button
                  type="button"
                  onClick={sendSummary}
                  className="flex-1 rounded-full bg-brand-600 py-3 text-sm font-semibold text-white shadow-[0px_4px_0px_#004395]"
                >
                  Send to Mom & Dad
                </button>
              </div>
            </div>
          )}

          {state === "uploading" && (
            <p className="text-sm font-semibold text-text-secondary dark:text-slate-400">Sending your summary...</p>
          )}

          {errorMessage && <p className="max-w-sm text-sm font-semibold text-danger-600">{errorMessage}</p>}

          {(state === "idle" || state === "error") && (
            <button
              type="button"
              onClick={() => router.push(nextHref)}
              className="text-sm font-semibold text-text-secondary underline dark:text-slate-400"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </ChildShell>
  );
}
