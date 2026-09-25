import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { HomeGridIcon, LibraryBooksIcon, TrendLineIcon, ChatIcon, GearIcon, PlusChildIcon } from "@/components/icons/ParentNavIcons";
import { RosterIcon } from "@/components/icons/ClassNavIcons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_ITEMS: { href: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { href: "/parent", label: "Dashboard", Icon: HomeGridIcon },
  { href: "/parent/children", label: "My Children", Icon: RosterIcon },
  { href: "/parent/library", label: "Reading Library", Icon: LibraryBooksIcon },
  { href: "/progress", label: "Progress", Icon: TrendLineIcon },
  { href: "/parent/messages", label: "Messages", Icon: ChatIcon },
  { href: "/parent/settings", label: "Settings", Icon: GearIcon },
];

type NavLabel = (typeof NAV_ITEMS)[number]["label"] | "Help Center" | "Logout" | "None";

export function ParentSideNav({ active }: { active: NavLabel }) {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col gap-4 border-r border-border-default bg-sidebar-bg py-6 pl-4 pr-[17px]">
      <div className="flex items-center gap-3 px-2 pb-4">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
          <Image src="/images/teacher-avatar.jpg" alt="Parent profile" fill sizes="40px" className="object-cover" />
        </div>
        <div className="flex-1">
          <p className="font-display text-2xl font-extrabold leading-[1.3] tracking-[-0.6px] text-brand-600">
            Taleshift
          </p>
          <p className="text-xs font-medium tracking-[0.24px] text-text-secondary">Family Dashboard</p>
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
              <item.Icon width={18} height={18} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pb-4">
        <Link
          href="/parent/add-child"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-bold tracking-[0.14px] text-white hover:bg-brand-700"
        >
          <PlusChildIcon width={11} height={11} />
          Add Another Child
        </Link>
      </div>

      <div className="flex flex-col gap-1 border-t border-border-faint pt-4">
        <Link
          href="/parent/help"
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
