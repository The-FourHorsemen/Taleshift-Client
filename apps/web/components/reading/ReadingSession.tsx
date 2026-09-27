"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAudioRecorder } from "@/lib/hooks/useAudioRecorder";
import { HighlightedStoryText } from "@/components/reading/HighlightedStoryText";

interface ReadingSessionProps {
  storyId: string;
  learnerProfileId: string;
  title: string;
  text: string;
  /** Vocabulary this story introduces - highlighted blue in the text. */
  newWords: string[];
  /** Words this learner has struggled with before - highlighted red. */
  struggleWords: string[];
  /** Words the child already bookmarked from a previous session. */
  initialBookmarkedWords: string[];
  progressPercent: number;
}

export function ReadingSession({
  storyId,
  learnerProfileId,
  title,
  text,
  newWords,
  struggleWords,
  initialBookmarkedWords,
  progressPercent,
}: ReadingSessionProps) {
  const router = useRouter();
  const recorder = useAudioRecorder();
  const [bookmarkedWords, setBookmarkedWords] = useState(() => new Set(initialBookmarkedWords));
  const [isFinishing, setIsFinishing] = useState(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Start capturing as soon as the child opens the story - the mic
    // button below just pauses/resumes this, it doesn't start a
    // separate recording.
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    recorder.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleWordBookmark(word: string) {
    const nextBookmarked = !bookmarkedWords.has(word);
    setBookmarkedWords((prev) => {
      const next = new Set(prev);
      if (nextBookmarked) next.add(word);
      else next.delete(word);
      return next;
    });

    fetch("/api/words/bookmark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ learnerProfileId, storyId, word, bookmarked: nextBookmarked }),
    }).catch(() => {
      // Bookmarking a word to look up later is a nice-to-have - don't
      // interrupt the child's reading over a failed network request.
    });
  }

  function toggleMic() {
    if (recorder.status === "recording") recorder.pause();
    else if (recorder.status === "paused") recorder.resume();
    else if (recorder.status === "idle" || recorder.status === "error") recorder.start();
  }

  async function handleFinish() {
    setIsFinishing(true);
    try {
      const blob = await recorder.stop();
      if (blob) {
        const formData = new FormData();
        formData.append("audio", blob, "reading.webm");
        formData.append("storyId", storyId);
        formData.append("sessionId", crypto.randomUUID());
        formData.append("referenceText", text);
        formData.append("learnerProfileId", learnerProfileId);
        formData.append("storyTitle", title);
        await fetch("/api/asr", { method: "POST", body: formData }).catch(() => {});
      }
    } finally {
      router.push(`/summary/${storyId}`);
    }
  }

  const isListening = recorder.status === "recording";

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f8fafc]">
      <header className="z-20 flex w-full items-center justify-between px-6 pb-4 pt-8">
        <button
          type="button"
          aria-label="Close reading session"
          onClick={() => router.push("/")}
          className="flex size-8 items-center justify-center rounded-full"
        >
          <Image src="/icons/reading-session/close.svg" alt="" width={16.3} height={16.3} />
        </button>

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
        <article className="flex w-full max-w-[500px] flex-col items-center gap-6">
          <h1 className="text-center font-display text-[32px] font-bold leading-[38.4px] tracking-[-0.8px] text-[#0f172a]">
            {title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-indigo-100 ring-1 ring-brand-600" /> New word
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-red-100 ring-1 ring-red-600" /> Practice word
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 border-b-2 border-amber-500" /> Tap a word to bookmark it
            </span>
          </div>

          <p className="w-full font-display text-2xl font-semibold leading-[48px] text-[#0f172a]">
            <HighlightedStoryText
              text={text}
              newWords={newWords}
              struggleWords={struggleWords}
              bookmarkedWords={bookmarkedWords}
              onToggleWord={toggleWordBookmark}
            />
          </p>
        </article>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2 bg-gradient-to-t from-[#f8fafc] from-0% via-[rgba(248,250,252,0.95)] via-50% to-[rgba(248,250,252,0)] px-6 pb-10 pt-14">
        {recorder.errorMessage && (
          <p className="max-w-sm text-center text-xs font-semibold text-danger-600">
            {recorder.errorMessage} Your reading won&apos;t be recorded, but you can keep going.
          </p>
        )}
        <div className="relative flex w-full max-w-[500px] items-center justify-center">
          <button
            type="button"
            onClick={toggleMic}
            aria-pressed={isListening}
            aria-label={isListening ? "Pause recording" : "Start or resume recording"}
            className="relative flex size-24 items-center justify-center rounded-full"
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
            onClick={handleFinish}
            disabled={isFinishing}
            className="absolute right-0 flex items-center justify-center rounded-full border-2 border-border-default bg-[rgba(248,250,252,0.8)] px-[26px] py-3.5 text-sm font-semibold tracking-[0.14px] text-text-secondary shadow-[0px_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-[2px] disabled:opacity-60"
          >
            {isFinishing ? "Saving..." : "Finish"}
          </button>
        </div>
      </div>
    </div>
  );
}
