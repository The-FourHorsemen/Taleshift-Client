import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, classroomStudents } from "@taleshift/db";

const AddStudentSchema = z.object({
  learnerProfileId: z.string().min(1),
});

/**
 * Owner: person 5.
 * POST adds one student to a classroom's roster.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { classroomId: string } }
) {
  try {
    const rawBody: unknown = await request.json();
    const { learnerProfileId } = AddStudentSchema.parse(rawBody);

    const db = getDb();
    const id = crypto.randomUUID();
    await db.insert(classroomStudents).values({
      id,
      classroomId: params.classroomId,
      learnerProfileId,
    });

    return NextResponse.json({
      success: true,
      data: { id, classroomId: params.classroomId, learnerProfileId },
    });
  } catch (error) {
    console.error("Add student to classroom error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add student to classroom." },
      { status: 500 }
    );
  }
}
