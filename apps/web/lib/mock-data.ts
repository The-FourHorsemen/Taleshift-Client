/**
 * Owner: unassigned.
 *
 * MVP auth is mocked, not backed by Supabase Auth: there's one
 * hardcoded parent account and two hardcoded child profiles linked to
 * it. Every route that used to call `supabase.auth.getUser()` or check
 * a real password now reads from here instead. Swap this out for real
 * accounts (Supabase Auth + `learnerProfiles.pinHash`, already modeled
 * in packages/db/src/schema.ts) once real sign-up is wired back in.
 */

export const MOCK_PARENT = {
  id: "mock-parent-001",
  fullName: "Jordan Rivera",
  email: "parent@taleshift.dev",
  password: "ReadWithMe123",
};

export interface MockChild {
  id: string;
  name: string;
  avatarEmoji: string;
  pin: string;
  age: number;
  grade: string;
  parentId: string;
}

export const MOCK_CHILDREN: MockChild[] = [
  { id: "alex", name: "Alex", avatarEmoji: "🐨", pin: "1234", age: 8, grade: "Grade 3", parentId: MOCK_PARENT.id },
  { id: "jamie", name: "Jamie", avatarEmoji: "🦊", pin: "1234", age: 10, grade: "Grade 5", parentId: MOCK_PARENT.id },
];

export function findMockChild(learnerProfileId: string): MockChild | undefined {
  return MOCK_CHILDREN.find((c) => c.id === learnerProfileId);
}
