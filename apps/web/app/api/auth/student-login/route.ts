/**
 * Owner: unassigned.
 * MVP: no DB/bcrypt lookup - checks the PIN against the hardcoded mock
 * children in lib/mock-data.ts. On success still issues the real
 * signed student session cookie (see lib/auth/student-session.ts).
 */
import { NextResponse } from "next/server";
import { findMockChild } from "@/lib/mock-data";
import { createStudentSession } from "@/lib/auth/student-session";

export async function POST(request: Request) {
  const { learnerProfileId, pin } = await request.json();

  if (typeof learnerProfileId !== "string" || typeof pin !== "string") {
    return NextResponse.json({ error: "learnerProfileId and pin are required." }, { status: 400 });
  }

  const learner = findMockChild(learnerProfileId);
  if (!learner) {
    return NextResponse.json({ error: "That profile isn't set up for PIN login yet." }, { status: 404 });
  }

  if (learner.pin !== pin) {
    return NextResponse.json({ error: "Incorrect PIN." }, { status: 401 });
  }

  await createStudentSession(learner.id);
  return NextResponse.json({ ok: true });
}
