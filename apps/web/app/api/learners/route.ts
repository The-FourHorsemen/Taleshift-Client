/**
 * Owner: unassigned.
 * Powers the "Who's reading today?" picker
 * (components/auth/StudentLoginPicker.tsx). Only returns the fields
 * needed to render a tile - never the pinHash.
 */
import { NextResponse } from "next/server";
import { listLearnerProfilesWithPin } from "@taleshift/db";

// Always hits the DB live - never statically prerender this route.
export const dynamic = "force-dynamic";

export async function GET() {
  const learners = await listLearnerProfilesWithPin();
  return NextResponse.json(
    learners.map((l) => ({ id: l.id, name: l.displayName, avatarEmoji: l.avatarEmoji })),
  );
}
