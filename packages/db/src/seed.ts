import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "./client";
import { parents, teachers, learnerProfiles } from "./schema";

/**
 * Owner: unassigned.
 * One-time seed for the mock accounts auth now runs against (see
 * apps/web/lib/auth/mock-accounts.ts - ids here must match there).
 * Safe to re-run: skips any row that already exists.
 *
 * Usage: from packages/db, with DATABASE_URL set,
 *   npx tsx src/seed.ts
 */

const MOCK_PARENT = {
  id: "mock-parent-1",
  fullName: "Jamie Rivera",
  email: "parent@taleshift.dev",
};

const MOCK_TEACHER = {
  id: "mock-teacher-1",
  fullName: "Morgan Lee",
  email: "teacher@taleshift.dev",
};

const MOCK_CHILD = {
  id: "mock-child-1",
  displayName: "Alex",
  pin: "1234",
  parentId: MOCK_PARENT.id,
};

async function main() {
  const db = getDb();

  const [existingParent] = await db.select().from(parents).where(eq(parents.id, MOCK_PARENT.id));
  if (!existingParent) {
    await db.insert(parents).values(MOCK_PARENT);
    console.log(`Seeded parent ${MOCK_PARENT.email}`);
  } else {
    console.log(`Parent ${MOCK_PARENT.email} already exists, skipping`);
  }

  const [existingTeacher] = await db.select().from(teachers).where(eq(teachers.id, MOCK_TEACHER.id));
  if (!existingTeacher) {
    await db.insert(teachers).values(MOCK_TEACHER);
    console.log(`Seeded teacher ${MOCK_TEACHER.email}`);
  } else {
    console.log(`Teacher ${MOCK_TEACHER.email} already exists, skipping`);
  }

  const [existingChild] = await db.select().from(learnerProfiles).where(eq(learnerProfiles.id, MOCK_CHILD.id));
  if (!existingChild) {
    const pinHash = await bcrypt.hash(MOCK_CHILD.pin, 10);
    await db.insert(learnerProfiles).values({
      id: MOCK_CHILD.id,
      displayName: MOCK_CHILD.displayName,
      parentId: MOCK_CHILD.parentId,
      pinHash,
    });
    console.log(`Seeded child ${MOCK_CHILD.displayName} (PIN ${MOCK_CHILD.pin})`);
  } else {
    console.log(`Child ${MOCK_CHILD.displayName} already exists, skipping`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
