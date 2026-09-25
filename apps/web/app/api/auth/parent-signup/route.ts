/**
 * Owner: unassigned.
 * Creates a Supabase Auth user for the parent, a matching row in
 * `parents`, and one `learnerProfiles` row per child the sign-up form
 * collected (see components/auth/SignUpForm.tsx). Runs as a single
 * request since the UI only submits once "Finish Setting Up" is
 * pressed - if this needs to be resilient to partial failures later,
 * wrap the parents/learnerProfiles inserts in a transaction.
 */
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createParent, createLearnerProfile } from "@taleshift/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface ChildPayload {
  name: string;
  age: string;
  grade: string;
  pin: string;
  gender: string;
  genderSelfDescribe: string;
  race: string;
  raceSelfDescribe: string;
  supportNeeds: string[];
  supportNotes: string;
}

export async function POST(request: Request) {
  const { fullName, email, password, children } = (await request.json()) as {
    fullName: string;
    email: string;
    password: string;
    children: ChildPayload[];
  };

  if (!fullName || !email || !password) {
    return NextResponse.json({ error: "Full name, email, and password are required." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) {
    return NextResponse.json({ error: error?.message ?? "Could not create account." }, { status: 400 });
  }

  await createParent({ id: data.user.id, fullName, email });

  for (const child of children ?? []) {
    if (!child.name.trim()) continue;
    const pinHash = child.pin ? await bcrypt.hash(child.pin, 10) : undefined;
    await createLearnerProfile({
      id: randomUUID(),
      displayName: child.name,
      parentId: data.user.id,
      pinHash,
      age: child.age ? Number(child.age) : undefined,
      grade: child.grade || undefined,
      gender: child.gender || undefined,
      genderSelfDescribe: child.genderSelfDescribe || undefined,
      race: child.race || undefined,
      raceSelfDescribe: child.raceSelfDescribe || undefined,
      supportNeeds: child.supportNeeds ?? [],
      supportNotes: child.supportNotes || undefined,
    });
  }

  return NextResponse.json({ ok: true });
}
