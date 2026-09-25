/**
 * Owner: unassigned.
 * Renders real linked children via @taleshift/db (see
 * components/parent/ChildRoster.tsx), falling back to mock data if
 * Supabase isn't connected yet.
 */
import { ChildRoster } from "@/components/parent/ChildRoster";

// Reads the signed-in parent's session and their live children list -
// must never be baked in at build time.
export const dynamic = "force-dynamic";

export default function ParentChildrenPage() {
  return <ChildRoster />;
}
