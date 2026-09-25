import type { ComponentType, ReactNode, SVGProps } from "react";

interface StatCardProps {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconClassName?: string;
  value: ReactNode;
  caption?: ReactNode;
  trend?: string;
}

export function StatCard({ label, icon: Icon, iconClassName = "text-brand-600", value, caption, trend }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-light bg-surface p-[21px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-secondary">{label}</p>
        <Icon width={20} height={20} className={iconClassName} />
      </div>
      <div className="flex items-end gap-2">
        <p className="font-display text-4xl font-bold leading-none text-text-primary">{value}</p>
        {trend && (
          <span className="flex items-center gap-0.5 pb-1 text-xs font-medium text-success-500">{trend}</span>
        )}
      </div>
      {caption && <p className="text-xs text-text-secondary">{caption}</p>}
    </div>
  );
}
