/**
 * Owner: person 5.
 * Renders the real class roster via @taleshift/db (see
 * components/roster/StudentRoster.tsx), falling back to mock data if
 * Supabase isn't connected yet.
 */
import { StudentRoster } from "@/components/roster/StudentRoster";

// Reads the signed-in teacher's session and their live roster - must
// never be baked in at build time.
export const dynamic = "force-dynamic";

export default function StudentsPage() {
  return <StudentRoster />;
}
