import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_ITEMS = [
  { href: "/teacher", label: "Overview", icon: "/icons/teacher-dashboard/nav-overview.svg", width: 18, height: 18 },
  { href: "/teacher/students", label: "Students", icon: "/icons/teacher-dashboard/nav-students.svg", width: 22, height: 16 },
  { href: "/progress", label: "Insights", icon: "/icons/teacher-dashboard/nav-insights.svg", width: 22, height: 17 },
  { href: "/teacher/reading-groups", label: "Reading Groups", icon: "/icons/teacher-dashboard/nav-reading-groups.svg", width: 22, height: 19.5 },
  { href: "/teacher/library", label: "Reading Library", icon: "/icons/teacher-dashboard/nav-reading-library.svg", width: 20, height: 18 },
  { href: "/teacher/settings", label: "Settings", icon: "/icons/teacher-dashboard/nav-settings.svg", width: 20.1, height: 20 },
] as const;

type NavLabel = (typeof NAV_ITEMS)[number]["label"] | "Help Center" | "Logout" | "None";

export function TeacherSideNav({ active }: { active: NavLabel }) {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col gap-4 border-r border-border-default bg-sidebar-bg py-6 pl-4 pr-[17px]">
      <div className="flex items-center gap-3 px-2 pb-4">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
          <Image src="/images/teacher-avatar.jpg" alt="Teacher profile" fill sizes="40px" className="object-cover" />
        </div>
        <div className="flex-1">
          <p className="font-display text-2xl font-extrabold leading-[1.3] tracking-[-0.6px] text-brand-600">
            Taleshift Pro
          </p>
          <p className="text-xs font-medium tracking-[0.24px] text-text-secondary">Educator Dashboard</p>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex min-h-px flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.label === active;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg py-2 pl-3 pr-4 text-sm tracking-[0.14px] ${
                isActive
                  ? "border-r-4 border-brand-600 bg-brand-100 font-bold text-brand-700"
                  : "font-semibold text-text-secondary hover:bg-white/50 dark:hover:bg-white/5"
              }`}
            >
              <span className="flex size-[18px] shrink-0 items-center justify-center">
                <Image src={item.icon} alt="" width={item.width} height={item.height} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pb-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-bold tracking-[0.14px] text-white hover:bg-brand-700">
          <Image src="/icons/teacher-dashboard/plus.svg" alt="" width={11} height={11} />
          Add New Student
        </button>
      </div>

      <div className="flex flex-col gap-1 border-t border-border-faint pt-4">
        <Link
          href="/teacher/help"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm tracking-[0.14px] hover:bg-white/50 dark:hover:bg-white/5 ${
            active === "Help Center" ? "font-bold text-brand-700" : "font-semibold text-text-secondary"
          }`}
        >
          <Image src="/icons/teacher-dashboard/help-circle.svg" alt="" width={20} height={20} />
          Help Center
        </Link>
        <Link
          href="/logout"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm tracking-[0.14px] hover:bg-white/50 dark:hover:bg-white/5 ${
            active === "Logout" ? "font-bold text-brand-700" : "font-semibold text-text-secondary"
          }`}
        >
          <Image src="/icons/teacher-dashboard/logout.svg" alt="" width={18} height={18} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
