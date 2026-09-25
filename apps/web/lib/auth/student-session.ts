import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * Owner: unassigned.
 *
 * Learners authenticate with a PIN, not Supabase Auth (see
 * packages/db/src/schema.ts's comment on learnerProfiles.pinHash for
 * why). This issues our own short-lived, signed, httpOnly session
 * cookie after a successful PIN check in
 * app/api/auth/student-login/route.ts, and reads it back to identify
 * "the current learner" on child-facing pages/route handlers.
 *
 * Requires STUDENT_SESSION_SECRET in apps/web/.env.local (any long
 * random string - `openssl rand -hex 32` works).
 */

const COOKIE_NAME = "taleshift_student_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12; // 12 hours - a school/reading-session day

function getSecretKey() {
  const secret = process.env.STUDENT_SESSION_SECRET;
  if (!secret) {
    throw new Error("STUDENT_SESSION_SECRET must be set. Check .env.local.");
  }
  return new TextEncoder().encode(secret);
}

export async function createStudentSession(learnerProfileId: string) {
  const token = await new SignJWT({ learnerProfileId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function getStudentSession(): Promise<{ learnerProfileId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.learnerProfileId !== "string") return null;
    return { learnerProfileId: payload.learnerProfileId };
  } catch {
    return null; // Expired or tampered - treat as logged out.
  }
}

export async function clearStudentSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
