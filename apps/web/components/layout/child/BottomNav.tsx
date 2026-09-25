import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { HomeIcon, ProfileIcon, ReadIcon, WordsIcon } from "@/components/icons/NavIcons";

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

export function BottomNav({ active }: { active: (typeof NAV_ITEMS)[number]["label"] }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around gap-2 border-t border-border-light bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 shadow-[0px_-2px_10px_rgba(0,0,0,0.06)] backdrop-blur-sm md:hidden dark:border-slate-700 dark:bg-slate-900/95">
      {NAV_ITEMS.map(({ href, label, Icon, width, height }) => {
        const isActive = label === active;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 transition-colors ${
              isActive
                ? "bg-success-200 text-[#00714d] dark:bg-emerald-500/20 dark:text-emerald-300"
                : "text-text-secondary dark:text-slate-400"
            }`}
          >
            <Icon width={width} height={height} />
            <span className="text-xs font-semibold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
