import type { ReactNode } from "react";
import { ParentSideNav } from "@/components/layout/parent/ParentSideNav";

type NavLabel = Parameters<typeof ParentSideNav>[0]["active"];

export function ParentPageShell({ active, children }: { active: NavLabel; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-start justify-center bg-app-bg pl-64">
      <ParentSideNav active={active} />
      <main className="flex w-full flex-1 flex-col items-start gap-8 p-10">
        <div className="w-full max-w-[1280px]">{children}</div>
      </main>
    </div>
  );
}
