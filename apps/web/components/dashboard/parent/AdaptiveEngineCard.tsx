import type { ComponentType, SVGProps } from "react";
import { SparkleIcon } from "@/components/icons/DashboardIcons";

interface TimelineItem {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconClassName: string;
  title: string;
  description: string;
}

export function AdaptiveEngineCard({
  description,
  items,
  actionLabel,
}: {
  description: string;
  items: TimelineItem[];
  actionLabel: string;
}) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border-light bg-surface p-[25px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <div className="flex items-start gap-3">
        <SparkleIcon width={22} height={22} className="mt-1 shrink-0 text-brand-600" />
        <h3 className="font-display text-2xl font-bold text-text-primary">Adaptive Engine Active</h3>
      </div>
      <p className="text-sm leading-relaxed text-text-secondary">{description}</p>

      <div className="relative flex flex-col gap-6 pl-4">
        <div className="absolute bottom-4 left-[15px] top-4 w-px bg-border-light" />
        {items.map(({ icon: Icon, iconClassName, title, description: itemDescription }) => (
          <div key={title} className="relative flex gap-4">
            <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${iconClassName}`}>
              <Icon width={14} height={14} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">{itemDescription}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-2 w-full rounded-full bg-sidebar-bg py-2.5 text-sm font-semibold text-brand-600"
      >
        {actionLabel}
      </button>
    </div>
  );
}
