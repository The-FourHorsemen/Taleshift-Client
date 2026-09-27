/**
 * Owner: unassigned.
 * Powers the "Who's reading today?" picker
 * (components/auth/StudentLoginPicker.tsx). MVP: returns the hardcoded
 * mock children instead of querying the DB - never the PIN.
 */
import { NextResponse } from "next/server";
import { MOCK_CHILDREN } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(MOCK_CHILDREN.map((c) => ({ id: c.id, name: c.name, avatarEmoji: c.avatarEmoji })));
}
