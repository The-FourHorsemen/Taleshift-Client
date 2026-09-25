/**
 * Owner: unassigned.
 * Shared logout for parent/teacher (Supabase Auth session) - also
 * clears the student session cookie unconditionally since it's cheap
 * and harmless to clear a cookie that was never set.
 */
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { clearStudentSession } from "@/lib/auth/student-session";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  await clearStudentSession();
  return NextResponse.json({ ok: true });
}
