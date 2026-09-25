import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { GridIcon, RosterIcon, PulseIcon, LineUpIcon, ResourcesIcon } from "@/components/icons/ClassNavIcons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_ITEMS: { href: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { href: "/teacher", label: "Dashboard", Icon: GridIcon },
  { href: "/teacher/students", label: "Class Roster", Icon: RosterIcon },
  { href: "/teacher/interventions", label: "Interventions", Icon: PulseIcon },
  { href: "/progress", label: "Reading Progress", Icon: LineUpIcon },
  { href: "/teacher/resources", label: "Resources", Icon: ResourcesIcon },
];

export function ClassSideNav({
  className,
  studentCount,
  active,
}: {
  className: string;
  studentCount: number;
  active: (typeof NAV_ITEMS)[number]["label"];
}) {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col gap-6 border-r border-border-default bg-surface p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-bold text-brand-600">{className}</p>
          <p className="text-xs text-text-secondary">{studentCount} Students</p>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = label === active;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                isActive ? "bg-success-200 font-bold text-[#00714d]" : "font-semibold text-text-secondary hover:bg-app-bg"
              }`}
            >
              <Icon width={18} height={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <button className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white">
        Create Intervention
      </button>

      <div className="flex flex-col gap-1 border-t border-border-faint pt-4 text-sm font-semibold text-text-secondary">
        <Link href="/teacher/help" className="rounded-lg px-3 py-2 hover:bg-app-bg">
          Help Center
        </Link>
        <Link href="/logout" className="rounded-lg px-3 py-2 hover:bg-app-bg">
          Log Out
        </Link>
      </div>
    </aside>
  );
}
