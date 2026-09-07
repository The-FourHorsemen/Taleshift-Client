import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { recommendNextLevel } from "@taleshift/leveling-engine";

const LevelRequestSchema = z.object({
  score: z.number(),
  currentLevel: z.number(),
});

/**
 * Owner: person 5.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody: unknown = await request.json();
    const { score, currentLevel } = LevelRequestSchema.parse(rawBody);

    const recommendation = recommendNextLevel(score, currentLevel);

    // TODO(person-5): persist recommendation to reading_sessions via
    // @taleshift/db once the learner profile flow is wired up.

    return NextResponse.json({ success: true, data: recommendation });
  } catch (error) {
    console.error("Level route error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to compute level recommendation." },
      { status: 500 }
    );
  }
}
