/**
 * Owner: unassigned.
 * Verifies a learner's PIN and, on success, issues the signed student
 * session cookie (see lib/auth/student-session.ts). This intentionally
 * does NOT use Supabase Auth - see the comment on
 * packages/db/src/schema.ts's learnerProfiles.pinHash for why.
 */
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getLearnerProfileById } from "@taleshift/db";
import { createStudentSession } from "@/lib/auth/student-session";

export async function POST(request: Request) {
  const { learnerProfileId, pin } = await request.json();

  if (typeof learnerProfileId !== "string" || typeof pin !== "string") {
    return NextResponse.json({ error: "learnerProfileId and pin are required." }, { status: 400 });
  }

  const learner = await getLearnerProfileById(learnerProfileId);
  if (!learner || !learner.pinHash) {
    return NextResponse.json({ error: "That profile isn't set up for PIN login yet." }, { status: 404 });
  }

  const isValid = await bcrypt.compare(pin, learner.pinHash);
  if (!isValid) {
    return NextResponse.json({ error: "Incorrect PIN." }, { status: 401 });
  }

  await createStudentSession(learner.id);
  return NextResponse.json({ ok: true });
}
