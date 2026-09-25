import type { ReactNode } from "react";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { StudentProfileSideNav } from "@/components/profile/StudentProfileSideNav";

const NAV_LABELS = ["Student Overview", "Progress Analytics", "Reading Log", "Learning Roadmap", "Intervention History"] as const;

export function StudentProfileShell({
  studentId,
  name,
  gradeLevel,
  status,
  active,
  children,
}: {
  studentId: string;
  name: string;
  gradeLevel: string;
  status: string;
  active: (typeof NAV_LABELS)[number];
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-app-bg">
      <TopAppBar active="Classroom" />

      <div className="flex flex-1">
        <StudentProfileSideNav
          studentId={studentId}
          name={name}
          gradeLevel={gradeLevel}
          status={status}
          active={active}
        />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
