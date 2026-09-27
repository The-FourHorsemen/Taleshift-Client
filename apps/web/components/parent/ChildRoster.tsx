import Link from "next/link";
import { ParentPageShell } from "@/components/layout/parent/ParentPageShell";
import { getChildrenForParent } from "@taleshift/db";
import { MOCK_CHILDREN, MOCK_PARENT } from "@/lib/mock-data";

interface LinkedChild {
  id: string;
  name: string;
  age: number | null;
  grade: string | null;
  level: string;
  status: "On Track" | "Excelling" | "Needs Support";
  avatarEmoji: string;
}

/**
 * Owner: unassigned.
 * MVP: auth is mocked (see lib/mock-data.ts), so there's no real
 * Supabase session to read the parent's id from. Used whenever the DB
 * query below fails (e.g. the mock parent hasn't been seeded into
 * Postgres yet), so this page still demos something instead of an
 * empty roster.
 */
const FALLBACK_CHILDREN: LinkedChild[] = MOCK_CHILDREN.map((c) => ({
  id: c.id,
  name: c.name,
  age: c.age,
  grade: c.grade,
  level: "Level M",
  status: "On Track" as const,
  avatarEmoji: c.avatarEmoji,
}));

const STATUS_STYLES: Record<LinkedChild["status"], string> = {
  "On Track": "bg-brand-100 text-brand-700 dark:bg-slate-800 dark:text-brand-300",
  Excelling: "bg-success-200 text-[#00714d] dark:bg-emerald-500/20 dark:text-emerald-300",
  "Needs Support": "bg-danger-100 text-danger-600",
};

async function loadChildren(): Promise<LinkedChild[]> {
  try {
    const rows = await getChildrenForParent(MOCK_PARENT.id);
    if (rows.length === 0) return FALLBACK_CHILDREN;

    // TODO(unassigned): "status" needs a real progress/analytics
    // pipeline behind it - defaulting to "On Track" until that exists.
    return rows.map((r) => ({
      id: r.id,
      name: r.displayName,
      age: r.age,
      grade: r.grade,
      level: `Level ${r.currentLevel}`,
      status: "On Track" as const,
      avatarEmoji: r.avatarEmoji,
    }));
  } catch {
    return FALLBACK_CHILDREN;
  }
}

export async function ChildRoster() {
  const children = await loadChildren();

  return (
    <ParentPageShell active="My Children">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[32px] font-bold text-text-primary">My Children</h1>
          <p className="text-text-secondary">
            {children.length} learner{children.length === 1 ? "" : "s"} linked to your account
          </p>
        </div>
        <Link href="/parent/add-child" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white">
          + Add Another Child
        </Link>
      </div>

      <div className="mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {children.map((child) => (
          <Link
            key={child.id}
            href={`/parent/children/${child.id}`}
            className="flex items-center gap-4 rounded-xl border border-border-light bg-surface p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:border-brand-500"
          >
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-3xl dark:bg-slate-800">
              {child.avatarEmoji}
            </span>
            <div className="flex-1">
              <p className="font-display text-lg font-bold text-text-primary">{child.name}</p>
              <p className="text-sm text-text-secondary">
                {[child.grade, child.age ? `Age ${child.age}` : null, child.level].filter(Boolean).join(" • ")}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[child.status]}`}>
              {child.status}
            </span>
          </Link>
        ))}
      </div>
    </ParentPageShell>
  );
}
