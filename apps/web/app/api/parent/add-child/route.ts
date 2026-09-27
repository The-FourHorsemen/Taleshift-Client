/**
 * Owner: unassigned.
 * Backs "Add Another Child" (components/parent/AddChildForm.tsx).
 * MVP: no Supabase session to identify the parent from - every child
 * gets linked to the single hardcoded mock parent in lib/mock-data.ts.
 */
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createLearnerProfile } from "@taleshift/db";
import { MOCK_PARENT } from "@/lib/mock-data";

export async function POST(request: Request) {
  const child = await request.json();
  if (!child?.name?.trim()) {
    return NextResponse.json({ error: "Child's name is required." }, { status: 400 });
  }

  const pinHash = child.pin ? await bcrypt.hash(child.pin, 10) : undefined;

  const learner = await createLearnerProfile({
    id: randomUUID(),
    displayName: child.name,
    parentId: MOCK_PARENT.id,
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
