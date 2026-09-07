/**
 * Owner: person 4 (NLP and scoring layer).
 *
 * Deliberately simple, word list based detection for the hackathon
 * version. This is the confidence signal we committed to shipping,
 * as opposed to full prosodic analysis (pitch, jitter, shimmer),
 * which was scoped out of the September 25 build. See PRD notes.
 *
 * Kept as a pure function, no LLM call, so it stays fast, free,
 * and directly testable.
 */
const HEDGING_PHRASES = [
  "i think",
  "maybe",
  "i guess",
  "sort of",
  "kind of",
  "um",
  "uh",
  "like i said",
  "not sure",
];

export function countHedgingLanguage(transcriptText: string): number {
  const lowerText = transcriptText.toLowerCase();
  return HEDGING_PHRASES.reduce((count, phrase) => {
    const occurrences = lowerText.split(phrase).length - 1;
    return count + Math.max(occurrences, 0);
  }, 0);
}
