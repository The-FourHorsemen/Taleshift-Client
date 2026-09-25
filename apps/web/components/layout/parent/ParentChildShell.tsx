import Link from "next/link";
import type { ReactNode } from "react";
import { ParentSideNav } from "@/components/layout/parent/ParentSideNav";

const TABS = [
  { label: "Overview", path: "" },
  { label: "Progress", path: "/progress" },
  { label: "Reading Log", path: "/reading-log" },
  { label: "Roadmap", path: "/roadmap" },
] as const;

export function ParentChildShell({
  childId,
  childName,
  active,
  children,
}: {
  childId: string;
  childName: string;
  active: (typeof TABS)[number]["label"];
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-start justify-center bg-app-bg pl-64">
      <ParentSideNav active="My Children" />

      <main className="flex w-full flex-1 flex-col items-start gap-6 p-10">
        <div className="w-full max-w-[1280px]">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Link href="/parent/children" className="font-semibold text-brand-600">
              My Children
            </Link>
            <span>/</span>
            <span>{childName}</span>
          </div>

          <nav className="mt-4 flex items-center gap-6 border-b border-border-light">
            {TABS.map((tab) => (
              <Link
                key={tab.label}
                href={`/parent/children/${childId}${tab.path}`}
                className={`border-b-2 py-3 text-sm font-semibold ${
                  tab.label === active ? "border-brand-600 text-brand-600" : "border-transparent text-text-secondary"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
