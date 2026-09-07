import { describe, it, expect } from "vitest";
import { resolveAssignmentsForStudent } from "./assignments";
import type { Assignment } from "@taleshift/shared-types";

function makeAssignment(overrides: Partial<Assignment>): Assignment {
  return {
    id: "a1",
    storyId: "story-1",
    classroomId: null,
    learnerProfileId: null,
    ...overrides,
  };
}

describe("resolveAssignmentsForStudent", () => {
  it("returns classroom assignments for a student in that classroom", () => {
    const classroomAssignments = [
      makeAssignment({ id: "a1", storyId: "story-1", classroomId: "class-1" }),
    ];
    const individualAssignments: Assignment[] = [];

    const result = resolveAssignmentsForStudent(classroomAssignments, individualAssignments);
    expect(result).toHaveLength(1);
    expect(result[0].storyId).toBe("story-1");
  });

  it("includes individual assignments alongside classroom ones for different stories", () => {
    const classroomAssignments = [
      makeAssignment({ id: "a1", storyId: "story-1", classroomId: "class-1" }),
    ];
    const individualAssignments = [
      makeAssignment({ id: "a2", storyId: "story-2", learnerProfileId: "student-1" }),
    ];

    const result = resolveAssignmentsForStudent(classroomAssignments, individualAssignments);
    expect(result).toHaveLength(2);
    expect(result.map((a) => a.storyId).sort()).toEqual(["story-1", "story-2"]);
  });

  it("individual assignment overrides classroom assignment for the same story", () => {
    const classroomAssignments = [
      makeAssignment({
        id: "a1",
        storyId: "story-1",
        classroomId: "class-1",
        dueAt: "2026-09-01T00:00:00.000Z",
      }),
    ];
    const individualAssignments = [
      makeAssignment({
        id: "a2",
        storyId: "story-1",
        learnerProfileId: "student-1",
        dueAt: "2026-10-01T00:00:00.000Z",
      }),
    ];

    const result = resolveAssignmentsForStudent(classroomAssignments, individualAssignments);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("a2");
    expect(result[0].dueAt).toBe("2026-10-01T00:00:00.000Z");
  });

  it("returns an empty list when nothing is assigned", () => {
    const result = resolveAssignmentsForStudent([], []);
    expect(result).toEqual([]);
  });

  it("deduplicates multiple individual assignments for the same story, keeping the most recent by id order given", () => {
    const individualAssignments = [
      makeAssignment({ id: "a1", storyId: "story-1", learnerProfileId: "student-1" }),
      makeAssignment({ id: "a2", storyId: "story-1", learnerProfileId: "student-1" }),
    ];

    const result = resolveAssignmentsForStudent([], individualAssignments);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("a2");
  });
});
