import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { HomeIcon, ProfileIcon, ReadIcon, WordsIcon } from "@/components/icons/NavIcons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_ITEMS: {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  width: number;
  height: number;
}[] = [
  { href: "/", label: "Home", Icon: HomeIcon, width: 16, height: 18 },
  { href: "/read", label: "Read", Icon: ReadIcon, width: 18, height: 23 },
  { href: "/words", label: "Words", Icon: WordsIcon, width: 16, height: 20 },
  { href: "/profile", label: "Profile", Icon: ProfileIcon, width: 22, height: 20 },
];

export function ChildSideNav({
  active,
  learnerName,
  avatarEmoji,
  streakDays,
}: {
  active: (typeof NAV_ITEMS)[number]["label"];
  learnerName: string;
  avatarEmoji: string;
  streakDays: number;
}) {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col gap-4 border-r border-border-default bg-sidebar-bg py-6 pl-4 pr-[17px] md:flex dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3 px-2 pb-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl dark:bg-slate-800">
          {avatarEmoji}
        </span>
        <div className="flex-1">
          <p className="font-display text-2xl font-extrabold leading-[1.3] tracking-[-0.6px] text-success-500">
            Taleshift
          </p>
          <p className="text-xs font-medium tracking-[0.24px] text-text-secondary dark:text-slate-400">
            Reading Adventures
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="mx-2 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:bg-slate-800">
        <span className="text-lg">🔥</span>
        <p className="text-sm font-semibold text-text-primary dark:text-slate-100">
          {streakDays} day streak, {learnerName}!
        </p>
      </div>

      <nav className="flex min-h-px flex-1 flex-col gap-1 pt-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.label === active;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg py-2.5 pl-3 pr-4 text-sm tracking-[0.14px] ${
                isActive
                  ? "border-r-4 border-success-500 bg-success-200 font-bold text-[#00714d] dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "font-semibold text-text-secondary hover:bg-white/50 dark:text-slate-400 dark:hover:bg-white/5"
              }`}
            >
              <item.Icon width={item.width} height={item.height} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-border-faint pt-4 dark:border-slate-700">
        <Link
          href="/login/student"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold tracking-[0.14px] text-text-secondary hover:bg-white/50 dark:text-slate-400 dark:hover:bg-white/5"
        >
          Switch Reader
        </Link>
      </div>
    </aside>
  );
}
