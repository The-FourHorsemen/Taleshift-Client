/**
 * Owner: unassigned.
 * TODO: pull the real list of learner profiles linked to this
 * device/classroom via @taleshift/db instead of the mocked
 * LINKED_LEARNERS in StudentLoginPicker, and create a real session
 * on selection instead of just navigating to "/".
 */
import { StudentLoginPicker } from "@/components/auth/StudentLoginPicker";

export default function StudentLoginPage() {
  return <StudentLoginPicker />;
}
