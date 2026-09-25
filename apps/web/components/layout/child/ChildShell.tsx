import type { ReactNode } from "react";
import { ChildSideNav } from "@/components/layout/child/ChildSideNav";
import { BottomNav } from "@/components/layout/child/BottomNav";

type NavLabel = Parameters<typeof ChildSideNav>[0]["active"];

export function ChildShell({
  active,
  learnerName,
  avatarEmoji = "🐨",
  streakDays = 0,
  children,
}: {
  active: NavLabel;
  learnerName: string;
  avatarEmoji?: string;
  streakDays?: number;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] dark:bg-slate-950">
      <ChildSideNav active={active} learnerName={learnerName} avatarEmoji={avatarEmoji} streakDays={streakDays} />
      <div className="flex w-full flex-1 flex-col items-center pb-24 md:pb-10 md:pl-64">{children}</div>
      <BottomNav active={active} />
    </div>
  );
}
