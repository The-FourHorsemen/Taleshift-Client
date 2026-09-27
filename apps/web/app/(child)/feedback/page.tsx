"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PostReadingSummary } from "@/components/feedback/PostReadingSummary";
import {
  clearReadingResult,
  loadReadingResult,
  type ReadingSessionResult,
} from "@/lib/reading-result";

function mapToSummaryProps(result: ReadingSessionResult) {
  const minutes = Math.max(
    1,
    Math.round(result.transcript.durationMs / 60_000)
  );
  const pointsEarned = Math.round(result.score.overallScore);
  const newWords = result.score.alignment.struggleWords.map(
    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  );

  return {
    learnerName: result.learnerName,
    storyTitle: result.storyTitle,
    minutes,
    dayStreak: result.dayStreak,
    pointsEarned,
    newWords,
    levelReason: result.level.reason,
    newLevel: result.level.newLevel,
  };
}

/**
 * Owner: person 2.
 * Reads the CompositeScore + LevelRecommendation stashed after Finish
 * on the reading session screen.
 */
export default function FeedbackPage() {
  const [result, setResult] = useState<ReadingSessionResult | null | undefined>(
    undefined
  );

  useEffect(() => {
    const stored = loadReadingResult();
    setResult(stored);
    if (stored) clearReadingResult();
  }, []);

  if (result === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-text-secondary">
        Loading results…
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8fafc] px-6 text-center">
        <p className="font-display text-2xl font-semibold text-text-primary">
          No reading session to show yet
        </p>
        <p className="max-w-sm text-text-secondary">
          Finish a story with the mic to see your score and level recommendation here.
        </p>
        <Link
          href="/read"
          className="mt-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white"
        >
          Start reading
        </Link>
      </div>
    );
  }

  const props = mapToSummaryProps(result);

  return (
    <PostReadingSummary
      learnerName={props.learnerName}
      storyTitle={props.storyTitle}
      minutes={props.minutes}
      dayStreak={props.dayStreak}
      pointsEarned={props.pointsEarned}
      newWords={props.newWords}
      levelReason={props.levelReason}
      newLevel={props.newLevel}
    />
  );
}
