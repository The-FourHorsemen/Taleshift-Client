/**
 * Owner: unassigned.
 * MVP: no Supabase Auth call - checks against the single hardcoded
 * mock parent in lib/mock-data.ts instead. See that file for the
 * credentials.
 */
import { NextResponse } from "next/server";
import { MOCK_PARENT } from "@/lib/mock-data";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (email !== MOCK_PARENT.email || password !== MOCK_PARENT.password) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("taleshift_parent_id", MOCK_PARENT.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
