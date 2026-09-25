import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { StudentCapIcon, ParentHeartIcon, TeacherBoardIcon, ArrowRightBigIcon } from "@/components/icons/RoleIcons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface Role {
  href: string;
  title: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  accent: string;
}

const ROLES: Role[] = [
  {
    href: "/login/student",
    title: "I'm a Student",
    description: "Tap your name to start reading.",
    Icon: StudentCapIcon,
    accent: "bg-success-200 text-[#00714d]",
  },
  {
    href: "/login/parent",
    title: "I'm a Parent",
    description: "Track your child's reading progress.",
    Icon: ParentHeartIcon,
    accent: "bg-indigo-100 text-brand-700",
  },
  {
    href: "/login/teacher",
    title: "I'm a Teacher",
    description: "Manage your classroom and students.",
    Icon: TeacherBoardIcon,
    accent: "bg-brand-100 text-brand-700",
  },
];

export function RoleSelector() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app-bg px-6 py-12">
      <ThemeToggle className="absolute right-6 top-6" />
      <div className="flex w-full max-w-2xl flex-col items-center gap-2 text-center">
        <p className="font-display text-3xl font-extrabold text-brand-600">Taleshift</p>
        <h1 className="font-display text-2xl font-bold text-text-primary">Who&apos;s logging in?</h1>
        <p className="text-text-secondary">Choose your role to continue.</p>
      </div>

      <div className="mt-10 grid w-full max-w-2xl gap-4 sm:grid-cols-3">
        {ROLES.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border-light bg-surface p-6 text-center shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:border-brand-500"
          >
            <span className={`flex size-14 items-center justify-center rounded-full ${role.accent}`}>
              <role.Icon width={28} height={28} />
            </span>
            <div>
              <p className="font-display text-lg font-bold text-text-primary">{role.title}</p>
              <p className="mt-1 text-sm text-text-secondary">{role.description}</p>
            </div>
            <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-brand-600">
              Continue
              <ArrowRightBigIcon width={16} height={16} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
