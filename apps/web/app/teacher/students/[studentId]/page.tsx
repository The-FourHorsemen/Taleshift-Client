/**
 * Owner: person 5.
 * TODO: fetch this learner's real profile, roadmap, and session
 * history via @taleshift/db using params.studentId, instead of the
 * mocked "Alex Johnson" data below.
 */
import { StudentProfileView } from "@/components/profile/StudentProfileView";

export default function StudentProfilePage({ params }: { params: { studentId: string } }) {
  return <StudentProfileView studentId={params.studentId} />;
}
