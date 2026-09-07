import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, assignments as assignmentsTable } from "@taleshift/db";
import { eq } from "drizzle-orm";
import { resolveAssignmentsForStudent } from "@taleshift/leveling-engine";
import { AssignmentSchema } from "@taleshift/shared-types";

const CreateAssignmentSchema = z.object({
  storyId: z.string().min(1),
  learnerProfileId: z.string().nullable().optional(),
  dueAt: z.string().datetime().nullable().optional(),
});

/**
 * Owner: person 5.
 *
 * POST assigns a story to the whole classroom, or to one student in
 * it if learnerProfileId is provided (an individual override).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { classroomId: string } }
) {
  try {
    const rawBody: unknown = await request.json();
    const { storyId, learnerProfileId, dueAt } = CreateAssignmentSchema.parse(rawBody);

    const db = getDb();
    const id = crypto.randomUUID();
    await db.insert(assignmentsTable).values({
      id,
      storyId,
      classroomId: learnerProfileId ? null : params.classroomId,
      learnerProfileId: learnerProfileId ?? null,
      dueAt: dueAt ? new Date(dueAt) : null,
    });

    return NextResponse.json({ success: true, data: { id, storyId, learnerProfileId, dueAt } });
  } catch (error) {
    console.error("Create assignment error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create assignment." },
      { status: 500 }
    );
  }
}

/**
 * GET ?learnerProfileId=... returns the resolved assignment list for
 * one student in this classroom: classroom wide assignments plus
 * their own individual overrides, deduplicated by story.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { classroomId: string } }
) {
  try {
    const learnerProfileId = request.nextUrl.searchParams.get("learnerProfileId");
    if (!learnerProfileId) {
      return NextResponse.json(
        { success: false, error: "learnerProfileId query param is required." },
        { status: 400 }
      );
    }

    const db = getDb();
    const classroomRows = await db
      .select()
      .from(assignmentsTable)
      .where(eq(assignmentsTable.classroomId, params.classroomId));

    const individualRows = await db
      .select()
      .from(assignmentsTable)
      .where(eq(assignmentsTable.learnerProfileId, learnerProfileId));

    const toAssignment = (row: typeof assignmentsTable.$inferSelect) =>
      AssignmentSchema.parse({
        id: row.id,
        storyId: row.storyId,
        classroomId: row.classroomId,
        learnerProfileId: row.learnerProfileId,
        dueAt: row.dueAt ? row.dueAt.toISOString() : null,
      });

    const resolved = resolveAssignmentsForStudent(
      classroomRows.map(toAssignment),
      individualRows.map(toAssignment)
    );

    return NextResponse.json({ success: true, data: resolved });
  } catch (error) {
    console.error("Resolve assignments error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to resolve assignments." },
      { status: 500 }
    );
  }
}
