/**
 * Owner: unassigned.
 * Toggles a bookmarked word for a learner (tapped while reading, see
 * components/reading/HighlightedStoryText.tsx) so it later shows up
 * on the My Words page. The client sends the desired end state
 * directly rather than this route inferring add/remove.
 */
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { addBookmarkedWord, removeBookmarkedWord } from "@taleshift/db";

export async function POST(request: Request) {
  const { learnerProfileId, word, storyId, bookmarked } = await request.json();

  if (typeof learnerProfileId !== "string" || typeof word !== "string" || typeof bookmarked !== "boolean") {
    return NextResponse.json(
      { error: "learnerProfileId, word, and bookmarked are required." },
      { status: 400 },
    );
  }

  try {
    const normalizedWord = word.toLowerCase();
    if (bookmarked) {
      await addBookmarkedWord({
        id: randomUUID(),
        learnerProfileId,
        word: normalizedWord,
        storyId: typeof storyId === "string" && storyId ? storyId : undefined,
      });
    } else {
      await removeBookmarkedWord(learnerProfileId, normalizedWord);
    }
  } catch (err) {
    // Bookmarking is a nice-to-have - a demo-env DB hiccup shouldn't
    // interrupt the child's reading.
    console.error("Failed to update bookmarked word:", err);
  }

  return NextResponse.json({ ok: true });
}
