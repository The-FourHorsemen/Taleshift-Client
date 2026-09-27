"use client";

import { useMemo } from "react";

interface HighlightedStoryTextProps {
  text: string;
  /** Vocabulary the story is introducing - highlighted blue. */
  newWords: string[];
  /** Words this learner has struggled with before - highlighted red. */
  struggleWords: string[];
  /** Words the child has bookmarked to review later on My Words. */
  bookmarkedWords: Set<string>;
  onToggleWord: (word: string) => void;
}

/**
 * Owner: unassigned.
 * Splits the story paragraph into clickable word tokens (punctuation
 * and whitespace pass through untouched) so a child can tap any word
 * to bookmark it, while new-vocabulary and known-struggle words get a
 * color highlight. Word matching is case-insensitive and ignores
 * trailing punctuation.
 */
export function HighlightedStoryText({
  text,
  newWords,
  struggleWords,
  bookmarkedWords,
  onToggleWord,
}: HighlightedStoryTextProps) {
  const newWordSet = useMemo(() => new Set(newWords.map((w) => w.toLowerCase())), [newWords]);
  const struggleWordSet = useMemo(() => new Set(struggleWords.map((w) => w.toLowerCase())), [struggleWords]);

  const nodes: React.ReactNode[] = [];
  const wordRegex = /[A-Za-z']+/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = wordRegex.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }

    const rawWord = match[0];
    const normalized = rawWord.toLowerCase();
    const isStruggle = struggleWordSet.has(normalized);
    const isNew = newWordSet.has(normalized);
    const isBookmarked = bookmarkedWords.has(normalized);

    nodes.push(
      <button
        key={key++}
        type="button"
        onClick={() => onToggleWord(normalized)}
        aria-pressed={isBookmarked}
        aria-label={`${rawWord}${isBookmarked ? " - bookmarked, tap to remove" : " - tap to bookmark"}`}
        className={[
          "rounded px-0.5 transition-colors",
          isStruggle
            ? "bg-red-100 font-bold text-red-600 dark:bg-red-500/20 dark:text-red-300"
            : isNew
              ? "bg-indigo-100 font-bold text-brand-600 dark:bg-slate-800 dark:text-brand-300"
              : "hover:bg-slate-100 dark:hover:bg-slate-800",
          isBookmarked ? "underline decoration-2 decoration-amber-500 underline-offset-4" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {rawWord}
      </button>,
    );

    lastIndex = match.index + rawWord.length;
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return <>{nodes}</>;
}
