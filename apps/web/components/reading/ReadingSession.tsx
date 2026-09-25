"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ReadingSessionProps {
  storyId: string;
  title: string;
  text: string;
  highlightedWord: string;
  progressPercent: number;
}

export function ReadingSession({
  title,
  text,
  highlightedWord,
  progressPercent,
}: ReadingSessionProps) {
  const [isListening, setIsListening] = useState(true);

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
            {text.split(highlightedWord).map((chunk, j, arr) => (
              <span key={j}>
                {chunk}
                {j < arr.length - 1 && (
                  <span className="rounded-lg bg-indigo-100 font-bold text-brand-600 shadow-[0px_2px_8px_rgba(59,130,246,0.15)]">
                    {highlightedWord}
                  </span>
                )}
              </span>
            ))}
          </p>
        </article>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-end justify-center bg-gradient-to-t from-[#f8fafc] from-0% via-[rgba(248,250,252,0.95)] via-50% to-[rgba(248,250,252,0)] px-6 pb-10 pt-14">
        <div className="relative flex w-full max-w-[500px] items-center justify-center">
          <button
            type="button"
            onClick={() => setIsListening((v) => !v)}
            aria-pressed={isListening}
            aria-label={isListening ? "Pause listening" : "Start listening"}
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
          <Link
            href="/feedback"
            className="absolute right-0 flex items-center justify-center rounded-full border-2 border-border-default bg-[rgba(248,250,252,0.8)] px-[26px] py-3.5 text-sm font-semibold tracking-[0.14px] text-text-secondary shadow-[0px_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-[2px]"
          >
            Finish
          </Link>
        </div>
      </div>
    </div>
  );
}
