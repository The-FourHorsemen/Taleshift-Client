/**
 * Owner: unassigned.
 * MVP: no Supabase session to sign out of - just clears the mock
 * parent cookie and the student session cookie (cheap and harmless to
 * clear a cookie that was never set).
 */
import { NextResponse } from "next/server";
import { clearStudentSession } from "@/lib/auth/student-session";

export async function POST() {
  await clearStudentSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("taleshift_parent_id");
  return response;
}
