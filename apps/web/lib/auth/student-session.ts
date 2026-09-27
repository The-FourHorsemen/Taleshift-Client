import { cookies } from "next/headers";

/**
 * Owner: unassigned.
 *
 * MVP: identifies "the current learner" with a plain cookie holding
 * the mock learner id from lib/mock-data.ts, set after a successful
 * PIN check in app/api/auth/student-login/route.ts. This used to be a
 * signed JWT requiring STUDENT_SESSION_SECRET, but nothing reads real
 * per-user secrets here anymore now that auth is mocked - swap this
 * back to a signed cookie once real PIN-backed accounts return.
 */

const COOKIE_NAME = "taleshift_student_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12; // 12 hours - a school/reading-session day

export async function createStudentSession(learnerProfileId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, learnerProfileId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function getStudentSession(): Promise<{ learnerProfileId: string } | null> {
  const cookieStore = await cookies();
  const learnerProfileId = cookieStore.get(COOKIE_NAME)?.value;
  if (!learnerProfileId) return null;
  return { learnerProfileId };
}

export async function clearStudentSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
