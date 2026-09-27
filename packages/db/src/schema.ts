import { pgTable, text, integer, timestamp, jsonb, real, boolean } from "drizzle-orm/pg-core";

/**
 * Owner: person 5.
 *
 * Backed by Supabase Postgres. `parents.id` / `teachers.id` are the
 * Supabase Auth user id (auth.users.id) for that account - there is no
 * separate password/credential storage here, Supabase Auth owns that.
 *
 * `learnerProfiles` intentionally has no Supabase Auth user of its own:
 * children authenticate via a PIN checked against `pinHash` (see
 * apps/web/app/api/auth/student-login/route.ts), not email+password,
 * so there's nothing to put in auth.users for them.
 */

/**
 * Predates the parents/teachers split below and isn't referenced
 * anywhere in the app - kept as-is rather than dropped in case it was
 * intentional early scaffolding. Remove once confirmed unused, or wire
 * it up if it was meant for something else.
 */
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  role: text("role").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const parents = pgTable("parents", {
  id: text("id").primaryKey(), // Supabase auth.users.id
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const teachers = pgTable("teachers", {
  id: text("id").primaryKey(), // Supabase auth.users.id
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const stories = pgTable("stories", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  level: integer("level").notNull(),
  genre: text("genre"),
  vocabFocus: text("vocab_focus"),
  durationMinutes: integer("duration_minutes"),
  coverEmoji: text("cover_emoji"),
  summary: text("summary"),
  /** Paragraphs stored as an ordered string array, joined for the reading session view. */
  paragraphs: jsonb("paragraphs").$type<string[]>().notNull().default([]),
  text: text("text"),
});

/**
 * A book a parent or teacher uploaded (PDF), separate from the curated
 * `stories` catalog. `fileUrl` is a Supabase Storage object path, e.g.
 * "custom-books/<uploaderId>/<uuid>.pdf" - resolve to a signed URL at
 * read time, don't store a public URL.
 */
export const customBooks = pgTable("custom_books", {
  id: text("id").primaryKey(),
  uploaderId: text("uploader_id").notNull(), // parents.id or teachers.id
  uploaderRole: text("uploader_role", { enum: ["parent", "teacher"] }).notNull(),
  title: text("title").notNull(),
  level: integer("level").notNull(),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const learnerProfiles = pgTable("learner_profiles", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  currentLevel: integer("current_level").notNull().default(1),
  struggleWords: jsonb("struggle_words").$type<string[]>().notNull().default([]),

  /** Set when this learner was linked by a parent during sign-up / "Add Another Child". Nullable so a teacher-only-created student still works. */
  parentId: text("parent_id").references(() => parents.id),

  /**
   * bcrypt hash of the child's 4-digit login PIN - never store the raw
   * PIN. Nullable only because a learner created before PIN login shipped
   * needs a migration step to backfill one.
   */
  pinHash: text("pin_hash"),

  avatarEmoji: text("avatar_emoji").notNull().default("🐨"),
  age: integer("age"),
  grade: text("grade"),

  /** Demographics - all optional, collected once during parent sign-up / add-child. See ChildQuestionnaireFields.tsx for the exact option lists. */
  gender: text("gender"),
  genderSelfDescribe: text("gender_self_describe"),
  race: text("race"),
  raceSelfDescribe: text("race_self_describe"),

  /** e.g. ["ADHD", "Autism Spectrum"] - see SUPPORT_NEED_OPTIONS in ChildQuestionnaireFields.tsx for the controlled vocabulary. */
  supportNeeds: jsonb("support_needs").$type<string[]>().notNull().default([]),
  supportNotes: text("support_notes"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const readingSessions = pgTable("reading_sessions", {
  id: text("id").primaryKey(),
  learnerProfileId: text("learner_profile_id")
    .notNull()
    .references(() => learnerProfiles.id),
  storyId: text("story_id").references(() => stories.id),
  customBookId: text("custom_book_id").references(() => customBooks.id),
  overallScore: real("overall_score").notNull(),
  levelDirection: text("level_direction").notNull(),
  levelReason: text("level_reason").notNull(),
  durationMinutes: real("duration_minutes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * A child's spoken summary of a book, recorded right after they finish
 * reading it (see apps/web/components/reading/SummaryRecorder.tsx).
 * `audioUrl` is a path under apps/web/public/audio-summaries for now -
 * an MVP placeholder for real object storage, same caveat as
 * `customBooks.fileUrl` above. `transcript`/`status` are filled in
 * best-effort after upload by packages/asr_client's
 * `transcribeSummaryAudio` - a child's recording still counts as
 * "sent" even if transcription fails or isn't wired up yet.
 */
export const readingSummaries = pgTable("reading_summaries", {
  id: text("id").primaryKey(),
  learnerProfileId: text("learner_profile_id")
    .notNull()
    .references(() => learnerProfiles.id),
  storyId: text("story_id").references(() => stories.id),
  customBookId: text("custom_book_id").references(() => customBooks.id),
  storyTitle: text("story_title").notNull(),
  audioUrl: text("audio_url").notNull(),
  durationSeconds: real("duration_seconds"),
  transcript: text("transcript"),
  status: text("status", { enum: ["processing", "ready", "failed"] }).notNull().default("processing"),
  /**
   * "summary" = the post-reading spoken recap (SummaryRecorder.tsx).
   * "full_reading" = the child reading the whole book aloud
   * (ReadingSession.tsx), uploaded via app/api/asr/route.ts.
   */
  kind: text("kind", { enum: ["summary", "full_reading"] }).notNull().default("summary"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * A word a child tapped while reading to flag "I don't know this one" -
 * surfaced back on the My Words page (components/words/MyWords.tsx) so
 * they can practice it later. `word` is stored lowercased.
 */
export const bookmarkedWords = pgTable("bookmarked_words", {
  id: text("id").primaryKey(),
  learnerProfileId: text("learner_profile_id")
    .notNull()
    .references(() => learnerProfiles.id),
  word: text("word").notNull(),
  storyId: text("story_id").references(() => stories.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * LMS tables, added for teacher/student classroom features.
 * teacherId references teachers.id now that real teacher accounts exist.
 */
export const classrooms = pgTable("classrooms", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id")
    .notNull()
    .references(() => teachers.id),
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
 * An assignment targets either a whole classroom or one student (not
 * both), and either a catalog story or a custom uploaded book (not
 * both). This override/target resolution is application logic, not
 * enforced here - this table just stores the raw rows.
 */
export const assignments = pgTable("assignments", {
  id: text("id").primaryKey(),
  classroomId: text("classroom_id").references(() => classrooms.id),
  learnerProfileId: text("learner_profile_id").references(() => learnerProfiles.id),
  storyId: text("story_id").references(() => stories.id),
  customBookId: text("custom_book_id").references(() => customBooks.id),
  // Nullable: existing classroom-wide assignment code
  // (app/api/classroom/[classroomId]/assignments/route.ts, owned by
  // person 5) predates attribution tracking and doesn't set these.
  assignedById: text("assigned_by_id"), // parents.id or teachers.id
  assignedByRole: text("assigned_by_role", { enum: ["parent", "teacher"] }),
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
  dueAt: timestamp("due_at"),
  completedAt: timestamp("completed_at"),
});

/** A teacher's note/plan for a struggling student, or a parent's note for their own child. Backs the Intervention History / Intervention Plan screens. */
export const interventionNotes = pgTable("intervention_notes", {
  id: text("id").primaryKey(),
  learnerProfileId: text("learner_profile_id")
    .notNull()
    .references(() => learnerProfiles.id),
  authorId: text("author_id").notNull(), // parents.id or teachers.id
  authorRole: text("author_role", { enum: ["parent", "teacher"] }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ["active", "completed"] }).notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** A message thread between a parent and a teacher about one learner. */
export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  learnerProfileId: text("learner_profile_id").references(() => learnerProfiles.id),
  fromId: text("from_id").notNull(),
  fromRole: text("from_role", { enum: ["parent", "teacher"] }).notNull(),
  toId: text("to_id").notNull(),
  toRole: text("to_role", { enum: ["parent", "teacher"] }).notNull(),
  body: text("body").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
