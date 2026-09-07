import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, classrooms } from "@taleshift/db";
import { eq } from "drizzle-orm";

const CreateClassroomSchema = z.object({
  teacherId: z.string().min(1),
  name: z.string().min(1),
});

/**
 * Owner: person 5.
 *
 * POST creates a classroom. GET ?teacherId=... lists a teacher's
 * classrooms. Kept as one route file since both are small, split
 * into separate files if this grows.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody: unknown = await request.json();
    const { teacherId, name } = CreateClassroomSchema.parse(rawBody);

    const db = getDb();
    const id = crypto.randomUUID();
    await db.insert(classrooms).values({ id, teacherId, name });

    return NextResponse.json({ success: true, data: { id, teacherId, name } });
  } catch (error) {
    console.error("Create classroom error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create classroom." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const teacherId = request.nextUrl.searchParams.get("teacherId");
    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: "teacherId query param is required." },
        { status: 400 }
      );
    }

    const db = getDb();
    const rows = await db
      .select()
      .from(classrooms)
      .where(eq(classrooms.teacherId, teacherId));

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("List classrooms error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to list classrooms." },
      { status: 500 }
    );
  }
}
