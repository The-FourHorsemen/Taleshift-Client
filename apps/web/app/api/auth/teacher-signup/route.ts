import { NextResponse } from "next/server";
import { createTeacher } from "@taleshift/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { fullName, email, password } = await request.json();
  if (!fullName || !email || !password) {
    return NextResponse.json({ error: "Full name, email, and password are required." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) {
    return NextResponse.json({ error: error?.message ?? "Could not create account." }, { status: 400 });
  }

  await createTeacher({ id: data.user.id, fullName, email });
  return NextResponse.json({ ok: true });
}
