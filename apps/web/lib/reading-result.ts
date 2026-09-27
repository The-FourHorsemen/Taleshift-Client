import type { CompositeScore, TranscriptResult } from "@taleshift/shared-types";

/**
 * Client-side stash for the read → score → level → feedback handoff.
 * Cleared after feedback reads it (or on overwrite of the next session).
 */

export const READING_RESULT_KEY = "taleshift-reading-result";

export interface LevelRecommendationResult {
  direction: "up" | "stay" | "down";
  newLevel: number;
  reason: string;
}

export interface ReadingSessionResult {
  storyId: string;
  storyTitle: string;
  learnerName: string;
  dayStreak: number;
  transcript: TranscriptResult;
  score: CompositeScore;
  level: LevelRecommendationResult;
}

export function saveReadingResult(result: ReadingSessionResult): void {
  try {
    sessionStorage.setItem(READING_RESULT_KEY, JSON.stringify(result));
  } catch {
    // Private mode / quota — feedback will fall back to empty state.
  }
}

export function loadReadingResult(): ReadingSessionResult | null {
  try {
    const raw = sessionStorage.getItem(READING_RESULT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReadingSessionResult;
  } catch {
    return null;
  }
}

export function clearReadingResult(): void {
  try {
    sessionStorage.removeItem(READING_RESULT_KEY);
  } catch {
    // ignore
  }
}
