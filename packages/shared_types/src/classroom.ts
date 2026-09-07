import { z } from "zod";

/**
 * Shapes for the classroom/roster/assignment LMS features.
 * Mirrors packages/db/src/schema.ts, keep both in sync on changes.
 */

export const ClassroomSchema = z.object({
  id: z.string(),
  teacherId: z.string(),
  name: z.string().min(1),
});

export type Classroom = z.infer<typeof ClassroomSchema>;

export const AssignmentSchema = z.object({
  id: z.string(),
  storyId: z.string(),
  classroomId: z.string().nullable(),
  learnerProfileId: z.string().nullable(),
  dueAt: z.string().datetime().nullable().optional(),
});

export type Assignment = z.infer<typeof AssignmentSchema>;
