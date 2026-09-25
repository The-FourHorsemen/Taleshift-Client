import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Student Overview", path: "" },
  { label: "Progress Analytics", path: "/progress" },
  { label: "Reading Log", path: "/reading-log" },
  { label: "Learning Roadmap", path: "/roadmap" },
  { label: "Intervention History", path: "/interventions" },
] as const;

export function StudentProfileSideNav({
  studentId,
  name,
  gradeLevel,
  status,
  active,
}: {
  studentId: string;
  name: string;
  gradeLevel: string;
  status: string;
  active: (typeof NAV_ITEMS)[number]["label"];
}) {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-6 border-r border-border-light bg-surface p-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative size-16 overflow-hidden rounded-full">
          <Image src="/images/teacher-avatar.jpg" alt={name} fill sizes="64px" className="object-cover" />
        </div>
        <p className="mt-3 font-display text-lg font-bold text-text-primary">{name}</p>
        <p className="text-xs text-text-secondary">{gradeLevel}</p>
        <span className="mt-2 rounded-full bg-success-200 px-2 py-0.5 text-xs font-semibold text-[#00714d]">
          ↗ {status}
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={`/teacher/students/${studentId}${item.path}`}
            className={`rounded-lg px-3 py-2 text-sm ${
              item.label === active ? "bg-success-200 font-bold text-[#00714d]" : "font-semibold text-text-secondary hover:bg-app-bg"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <button className="w-full rounded-full border-2 border-border-default py-2 text-sm font-semibold text-text-secondary">
          Adjust Roadmap
        </button>
        <button className="w-full rounded-full bg-brand-600 py-2 text-sm font-bold text-white">Send Message</button>
      </div>
    </aside>
  );
}
