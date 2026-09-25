/**
 * Owner: unassigned.
 * Backs "Add Another Child" (components/parent/AddChildForm.tsx) for
 * an already-signed-in parent - identifies the parent from their
 * Supabase session rather than trusting a client-supplied parentId.
 */
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createLearnerProfile } from "@taleshift/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be logged in to add a child." }, { status: 401 });
  }

  const child = await request.json();
  if (!child?.name?.trim()) {
    return NextResponse.json({ error: "Child's name is required." }, { status: 400 });
  }

  const pinHash = child.pin ? await bcrypt.hash(child.pin, 10) : undefined;

  const learner = await createLearnerProfile({
    id: randomUUID(),
    displayName: child.name,
    parentId: user.id,
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

  return NextResponse.json({ ok: true, learner });
}
