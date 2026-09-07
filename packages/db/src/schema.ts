import { pgTable, text, integer, timestamp, jsonb, real } from "drizzle-orm/pg-core";

/**
 * Owner: person 5.
 *
 * Kept intentionally small for the hackathon build. Only what the
 * demo needs: a story catalog, a session record per reading attempt,
 * and a per child learner profile tracking level and struggle words
 * across sessions. Resist adding tables that aren't on the demo path,
 * see the anniversary project review for why that matters.
 */

export const stories = pgTable("stories", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  level: integer("level").notNull(),
  text: text("text").notNull(),
});

export const learnerProfiles = pgTable("learner_profiles", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  currentLevel: integer("current_level").notNull().default(1),
  struggleWords: jsonb("struggle_words").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const readingSessions = pgTable("reading_sessions", {
  id: text("id").primaryKey(),
  learnerProfileId: text("learner_profile_id")
    .notNull()
    .references(() => learnerProfiles.id),
  storyId: text("story_id")
    .notNull()
    .references(() => stories.id),
  overallScore: real("overall_score").notNull(),
  levelDirection: text("level_direction").notNull(),
  levelReason: text("level_reason").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * LMS tables, added for teacher/student classroom features.
 * A teacher is not a separate role table for the hackathon build,
 * teacherId is just an identifying string (email or auth provider id).
 * Add a real teachers table later if auth requires it.
 */
export const classrooms = pgTable("classrooms", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const classroomStudents = pgTable("classroom_students", {
  id: text("id").primaryKey(),
  classroomId: text("classroom_id")
    .notNull()
    .references(() => classrooms.id),
  learnerProfileId: text("learner_profile_id")
    .notNull()
    .references(() => learnerProfiles.id),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

/**
 * An assignment targets either a whole classroom or one student, not
 * both. learnerProfileId set + classroomId null means an individual
 * assignment overriding whatever the classroom has assigned, this
 * override behavior is resolved in packages/leveling_engine/src/assignments.ts,
 * not here, this table just stores the raw rows.
 */
export const assignments = pgTable("assignments", {
  id: text("id").primaryKey(),
  classroomId: text("classroom_id").references(() => classrooms.id),
  learnerProfileId: text("learner_profile_id").references(() => learnerProfiles.id),
  storyId: text("story_id")
    .notNull()
    .references(() => stories.id),
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
  dueAt: timestamp("due_at"),
});
