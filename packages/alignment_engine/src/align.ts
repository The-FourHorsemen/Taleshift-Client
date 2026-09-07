import type { AlignmentResult } from "@taleshift/shared-types";

/**
 * Owner: alignment engine (shared, no single person, changes here
 * affect scoring for everyone, get a review before merging).
 *
 * Aligns what the child actually said (spokenWords) against the
 * reference story text (referenceWords) using a longest common
 * subsequence backbone, then classifies the remaining reference
 * words as correct, mispronounced (substitution), or skipped.
 *
 * This deliberately does not attempt phoneme level matching.
 * Text level LCS diffing cannot distinguish an accent from a
 * genuine misread. That limitation is inherited from Web Speech
 * API style text output and is documented, not hidden.
 */
export function alignReadingToReference(
  spokenWords: string[],
  referenceWords: string[]
): AlignmentResult {
  const spoken = spokenWords.map((w) => w.toLowerCase());
  const reference = referenceWords.map((w) => w.toLowerCase());

  const lcsTable = buildLcsTable(spoken, reference);
  const matchedReferenceIndices = backtrackMatches(lcsTable, spoken, reference);

  let correctWords = 0;
  let mispronouncedWords = 0;
  let skippedWords = 0;
  const struggleWords: string[] = [];

  for (let i = 0; i < reference.length; i++) {
    if (matchedReferenceIndices.has(i)) {
      correctWords++;
      continue;
    }

    // A reference word that has no LCS match is either substituted
    // (the child said something else in roughly that position) or
    // skipped entirely. We treat any unmatched reference word as
    // "attempted" (mispronounced) only if spoken has more words
    // left unmatched than a pure skip would explain. For an MVP,
    // a simpler and more defensible rule: if spoken is shorter than
    // reference by exactly the unmatched count, call them skips.
    // Otherwise call them substitutions.
    if (spoken.length < reference.length) {
      skippedWords++;
    } else {
      mispronouncedWords++;
    }
    const struggleWord = referenceWords[i];
    if (struggleWord !== undefined) {
      struggleWords.push(struggleWord);
    }
  }

  return {
    correctWords,
    mispronouncedWords,
    skippedWords,
    totalWords: reference.length,
    struggleWords,
  };
}

function buildLcsTable(a: string[], b: string[]): number[][] {
  const table: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );

  for (let i = 1; i <= a.length; i++) {
    const row = table[i];
    const prevRow = table[i - 1];
    if (!row || !prevRow) continue; // unreachable given loop bounds, satisfies strict null checks

    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        row[j] = (prevRow[j - 1] ?? 0) + 1;
      } else {
        row[j] = Math.max(prevRow[j] ?? 0, row[j - 1] ?? 0);
      }
    }
  }

  return table;
}

function backtrackMatches(
  table: number[][],
  a: string[],
  b: string[]
): Set<number> {
  const matchedBIndices = new Set<number>();
  let i = a.length;
  let j = b.length;

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      matchedBIndices.add(j - 1);
      i--;
      j--;
    } else if ((table[i - 1]?.[j] ?? 0) >= (table[i]?.[j - 1] ?? 0)) {
      i--;
    } else {
      j--;
    }
  }

  return matchedBIndices;
}
