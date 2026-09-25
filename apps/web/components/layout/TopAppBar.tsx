import Image from "next/image";
import Link from "next/link";
import { BellIcon } from "@/components/icons/DashboardIcons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const TABS = [
  { label: "Dashboard", href: "/teacher" },
  { label: "Classroom", href: "/teacher/students" },
  { label: "Reports", href: "/progress" },
  { label: "Library", href: "/teacher/library" },
] as const;

export function TopAppBar({ active }: { active: (typeof TABS)[number]["label"] }) {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border-light bg-surface px-10">
      <div className="flex items-center gap-8">
        <p className="font-display text-xl font-extrabold text-brand-600">TaleGrow Educator</p>
        <nav className="flex items-center gap-6">
          {TABS.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`border-b-2 py-5 text-sm font-semibold ${
                tab.label === active ? "border-brand-600 text-brand-600" : "border-transparent text-text-secondary"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search students..."
          className="w-48 rounded-full border border-border-default px-4 py-1.5 text-sm"
        />
        <button aria-label="Notifications" className="text-text-secondary">
          <BellIcon width={18} height={20} />
        </button>
        <ThemeToggle />
        <div className="relative size-8 overflow-hidden rounded-full">
          <Image src="/images/teacher-avatar.jpg" alt="" fill sizes="32px" className="object-cover" />
        </div>
      </div>
    </header>
  );
}
