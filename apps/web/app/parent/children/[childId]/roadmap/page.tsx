/**
 * Owner: unassigned.
 * TODO: pull this child's real roadmap via @taleshift/db using
 * params.childId, instead of the mocked items below.
 */
import { ParentChildShell } from "@/components/layout/parent/ParentChildShell";
import { ActiveRoadmapCard } from "@/components/profile/ActiveRoadmapCard";

export default function ParentChildRoadmapPage({ params }: { params: { childId: string } }) {
  return (
    <ParentChildShell childId={params.childId} childName="Alex Johnson" active="Roadmap">
      <div className="max-w-2xl">
        <ActiveRoadmapCard
          items={[
            { title: "Phonics Foundations", subtitle: "Completed Oct 12", status: "completed" },
            { title: "Sight Word Fluency", subtitle: "Completed Oct 5", status: "completed" },
            { title: "Story: Whispering Woods", subtitle: "In progress", status: "current" },
            { title: "Vocabulary Builder: Nature", subtitle: "Up next", status: "locked" },
            { title: "Advanced Comprehension", subtitle: "Locked", status: "locked" },
          ]}
        />
      </div>
    </ParentChildShell>
  );
}
