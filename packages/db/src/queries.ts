import { eq, desc, and } from "drizzle-orm";
import { getDb } from "./client";
import {
  parents,
  teachers,
  learnerProfiles,
  classrooms,
  classroomStudents,
  readingSummaries,
  bookmarkedWords,
} from "./schema";

/**
 * Owner: person 5.
 * Thin, typed data-access helpers for the flows the UI actually needs.
 * Keep these free of Next.js-specific concerns (cookies, request
 * objects) so they're testable and reusable from any server context.
 */

export interface NewParentInput {
  id: string; // Supabase auth.users.id
  fullName: string;
  email: string;
}

export async function createParent(input: NewParentInput) {
  const db = getDb();
  const [row] = await db.insert(parents).values(input).returning();
  return row;
}

export interface NewTeacherInput {
  id: string; // Supabase auth.users.id
  fullName: string;
  email: string;
}

export async function createTeacher(input: NewTeacherInput) {
  const db = getDb();
  const [row] = await db.insert(teachers).values(input).returning();
  return row;
}

export interface NewLearnerProfileInput {
  id: string;
  displayName: string;
  parentId?: string;
  pinHash?: string;
  avatarEmoji?: string;
  age?: number;
  grade?: string;
  gender?: string;
  genderSelfDescribe?: string;
  race?: string;
  raceSelfDescribe?: string;
  supportNeeds?: string[];
  supportNotes?: string;
}

export async function createLearnerProfile(input: NewLearnerProfileInput) {
  const db = getDb();
  const [row] = await db.insert(learnerProfiles).values(input).returning();
  return row;
}

export async function getChildrenForParent(parentId: string) {
  const db = getDb();
  return db.select().from(learnerProfiles).where(eq(learnerProfiles.parentId, parentId));
}

export async function getLearnerProfileById(id: string) {
  const db = getDb();
  const [row] = await db.select().from(learnerProfiles).where(eq(learnerProfiles.id, id));
  return row;
}

/**
 * Every learner profile that has a PIN set, for the "Who's reading
 * today?" picker. Scoping this to a single household/classroom device
 * is a product decision for later - for now this lists every learner
 * with a PIN, which is fine for a single-teacher/single-family demo but
 * needs a device/session scope before this is a real multi-tenant app.
 */
export async function listLearnerProfilesWithPin() {
  const db = getDb();
  const rows = await db.select().from(learnerProfiles);
  return rows.filter((r) => r.pinHash !== null);
}

export async function createClassroom(input: { id: string; teacherId: string; name: string }) {
  const db = getDb();
  const [row] = await db.insert(classrooms).values(input).returning();
  return row;
}

export async function getClassroomsForTeacher(teacherId: string) {
  const db = getDb();
  return db.select().from(classrooms).where(eq(classrooms.teacherId, teacherId));
}

export async function addStudentToClassroom(input: { id: string; classroomId: string; learnerProfileId: string }) {
  const db = getDb();
  const [row] = await db.insert(classroomStudents).values(input).returning();
  return row;
}

export async function getRosterForClassroom(classroomId: string) {
  const db = getDb();
  return db
    .select({ learner: learnerProfiles })
    .from(classroomStudents)
    .innerJoin(learnerProfiles, eq(classroomStudents.learnerProfileId, learnerProfiles.id))
    .where(eq(classroomStudents.classroomId, classroomId));
}

export interface NewReadingSummaryInput {
  id: string;
  learnerProfileId: string;
  storyId?: string;
  customBookId?: string;
  storyTitle: string;
  audioUrl: string;
  durationSeconds?: number;
  kind?: "summary" | "full_reading";
}

export async function createReadingSummary(input: NewReadingSummaryInput) {
  const db = getDb();
  const [row] = await db.insert(readingSummaries).values(input).returning();
  return row;
}

export async function updateReadingSummaryTranscript(
  id: string,
  transcript: string,
  status: "ready" | "failed",
) {
  const db = getDb();
  const [row] = await db
    .update(readingSummaries)
    .set({ transcript, status })
    .where(eq(readingSummaries.id, id))
    .returning();
  return row;
}

export async function getReadingSummariesForLearner(learnerProfileId: string) {
  const db = getDb();
  return db
    .select()
    .from(readingSummaries)
    .where(eq(readingSummaries.learnerProfileId, learnerProfileId))
    .orderBy(desc(readingSummaries.createdAt));
}

export async function getBookmarkedWordsForLearner(learnerProfileId: string) {
  const db = getDb();
  return db
    .select()
    .from(bookmarkedWords)
    .where(eq(bookmarkedWords.learnerProfileId, learnerProfileId))
    .orderBy(desc(bookmarkedWords.createdAt));
}

export interface NewBookmarkedWordInput {
  id: string;
  learnerProfileId: string;
  word: string;
  storyId?: string;
}

export async function addBookmarkedWord(input: NewBookmarkedWordInput) {
  const db = getDb();
  const existing = await db
    .select()
    .from(bookmarkedWords)
    .where(and(eq(bookmarkedWords.learnerProfileId, input.learnerProfileId), eq(bookmarkedWords.word, input.word)));
  if (existing[0]) return existing[0];

  const [row] = await db.insert(bookmarkedWords).values(input).returning();
  return row;
}

export async function removeBookmarkedWord(learnerProfileId: string, word: string) {
  const db = getDb();
  await db
    .delete(bookmarkedWords)
    .where(and(eq(bookmarkedWords.learnerProfileId, learnerProfileId), eq(bookmarkedWords.word, word)));
}