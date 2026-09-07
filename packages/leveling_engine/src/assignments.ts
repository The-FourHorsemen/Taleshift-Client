import type { Assignment } from "@taleshift/shared-types";

/**
 * Owner: person 5.
 *
 * A student can have a story assigned two ways: through their
 * classroom, or individually (a teacher overriding the default for
 * one student). This resolves both into one list per student, with
 * individual assignments winning over classroom ones for the same
 * story. Later individual assignments for the same story win over
 * earlier ones, callers should pass individualAssignments in the
 * order they were created.
 *
 * This does not query the database, it operates on already fetched
 * rows, the caller is responsible for filtering to the right
 * classroomId/learnerProfileId before calling this.
 */
export function resolveAssignmentsForStudent(
  classroomAssignments: Assignment[],
  individualAssignments: Assignment[]
): Assignment[] {
  const byStoryId = new Map<string, Assignment>();

  for (const assignment of classroomAssignments) {
    byStoryId.set(assignment.storyId, assignment);
  }

  // Individual assignments are applied after, so they override
  // classroom assignments for the same story, and later individual
  // assignments override earlier ones for the same story.
  for (const assignment of individualAssignments) {
    byStoryId.set(assignment.storyId, assignment);
  }

  return Array.from(byStoryId.values());
}
