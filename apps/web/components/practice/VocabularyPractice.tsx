"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, SpeakerIcon, CheckIcon } from "@/components/icons/PracticeIcons";
import { useAudioRecorder } from "@/lib/hooks/useAudioRecorder";

export interface VocabWord {
  word: string;
  meaning: string;
  storyQuote: string;
  highlightedWord: string;
}

export function VocabularyPractice({ words }: { words: VocabWord[] }) {
  const [index, setIndex] = useState(0);
  const recorder = useAudioRecorder();
  const current = words[index]!;
  const isLast = index === words.length - 1;

  useEffect(() => {
    recorder.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function handleRecordClick() {
    if (recorder.status === "recording") recorder.stop();
    else recorder.start();
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#f8fafc]">
      <div className="flex w-full max-w-[500px] flex-1 flex-col px-6 pb-8 pt-8">
        <header className="mb-8 flex items-center gap-4">
          <Link href="/" aria-label="Back" className="text-brand-600">
            <ArrowLeftIcon width={16} height={16} />
          </Link>
          <h1 className="font-display text-2xl font-bold text-brand-600">Practice Time</h1>
        </header>

        <div className="flex flex-1 flex-col items-center gap-6 rounded-2xl bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.08)]">
          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-brand-100 via-brand-500 to-brand-600" />

          <button
            type="button"
            aria-label={`Play pronunciation of ${current.word}`}
            className="flex size-14 items-center justify-center rounded-full bg-indigo-100 text-brand-600"
          >
            <SpeakerIcon width={20} height={20} />
          </button>

          <h2 className="text-center font-display text-3xl font-bold text-text-primary">{current.word}</h2>

          <div className="w-full rounded-xl bg-[#fff8e1] p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.6px] text-amber-600">Meaning</p>
            <p className="text-sm text-text-primary">{current.meaning}</p>
          </div>

          <div className="w-full rounded-xl bg-indigo-100 p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.6px] text-brand-700">From the story</p>
            <p className="text-sm italic text-text-primary">
              &ldquo;
              {current.storyQuote.split(current.highlightedWord).map((chunk, i, arr) => (
                <span key={i}>
                  {chunk}
                  {i < arr.length - 1 && <span className="font-bold not-italic text-brand-600">{current.highlightedWord}</span>}
                </span>
              ))}
              &rdquo;
            </p>
          </div>

          {recorder.status === "stopped" && recorder.audioUrl ? (
            <div className="mt-auto flex w-full flex-col items-center gap-3">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio controls src={recorder.audioUrl} className="w-full" />
              <button
                type="button"
                onClick={() => recorder.reset()}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-border-default text-base font-bold text-text-secondary"
              >
                <Image src="/icons/reading-session/mic.svg" alt="" width={16} height={22} />
                Record Again
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRecordClick}
              disabled={recorder.status === "requesting"}
              className={`mt-auto flex h-14 w-full items-center justify-center gap-2 rounded-full text-base font-bold text-white shadow-[0px_4px_0px_#004395] disabled:opacity-60 ${
                recorder.status === "recording" ? "bg-red-600" : "bg-brand-600"
              }`}
            >
              <Image src="/icons/reading-session/mic.svg" alt="" width={16} height={22} />
              {recorder.status === "recording"
                ? `Stop Recording (${recorder.seconds}s)`
                : recorder.status === "requesting"
                  ? "Listening..."
                  : "Record & Say it"}
            </button>
          )}
          {recorder.errorMessage && (
            <p className="text-center text-xs font-semibold text-danger-600">{recorder.errorMessage}</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">Progress</p>
            <div className="flex gap-1">
              {words.map((w, i) => (
                <span
                  key={w.word}
                  className={`size-2 rounded-full ${i <= index ? "bg-success-500" : "bg-border-light"}`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-text-secondary">
              Word {index + 1} of {words.length}
            </span>
          </div>

          {isLast ? (
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full bg-success-500 px-4 py-2 text-sm font-bold text-white"
            >
              Finish
              <CheckIcon width={14} height={14} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(i + 1, words.length - 1))}
              className="rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
