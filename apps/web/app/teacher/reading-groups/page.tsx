/**
 * Owner: person 5.
 * TODO: pull real reading groups (membership, current title, meeting
 * cadence) via @taleshift/db instead of the mocked groups below.
 */
import { TeacherPageShell } from "@/components/layout/teacher/TeacherPageShell";

const GROUPS = [
  { name: "Fluent Foxes", level: "Level N-P", members: 5, currentTitle: "The Secret Garden" },
  { name: "Rising Readers", level: "Level K-M", members: 6, currentTitle: "The Lost Explorer" },
  { name: "Word Wizards", level: "Level L-N", members: 4, currentTitle: "Volcano Explorer" },
  { name: "Story Scouts", level: "Level M-O", members: 5, currentTitle: "Deep Sea Mystery" },
];

export default function ReadingGroupsPage() {
  return (
    <TeacherPageShell active="Reading Groups">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[32px] font-bold text-text-primary">Reading Groups</h1>
          <p className="text-text-secondary">Small-group reading rotations for Grade 4A.</p>
        </div>
        <button className="rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white">Create Group</button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        {GROUPS.map((group) => (
          <div key={group.name} className="rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-lg font-bold text-text-primary">{group.name}</h2>
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">{group.level}</span>
            </div>
            <p className="mt-2 text-sm text-text-secondary">{group.members} students</p>
            <p className="mt-3 text-sm">
              <span className="font-semibold text-text-secondary">Currently reading: </span>
              <span className="font-semibold text-text-primary">{group.currentTitle}</span>
            </p>
            <button className="mt-4 w-full rounded-full border-2 border-border-default py-2 text-sm font-semibold text-text-secondary">
              Manage Group
            </button>
          </div>
        ))}
      </div>
    </TeacherPageShell>
  );
}
