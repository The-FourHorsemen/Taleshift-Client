import type { ReactNode } from "react";
import { TeacherSideNav } from "@/components/layout/teacher/TeacherSideNav";

type NavLabel = Parameters<typeof TeacherSideNav>[0]["active"];

export function TeacherPageShell({ active, children }: { active: NavLabel; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-start justify-center bg-app-bg pl-64">
      <TeacherSideNav active={active} />
      <main className="flex w-full flex-1 flex-col items-start gap-8 p-10">
        <div className="w-full max-w-[1280px]">{children}</div>
      </main>
    </div>
  );
}
