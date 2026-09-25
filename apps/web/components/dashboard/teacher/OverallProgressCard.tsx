import Image from "next/image";

export function OverallProgressCard({
  percent,
  deltaLabel,
}: {
  percent: number;
  deltaLabel: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border-light bg-surface p-[25px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold tracking-[0.7px] text-text-secondary uppercase">
          Overall Progress
        </h3>
        <div className="flex items-center gap-1">
          <p className="font-display text-[40px] font-bold leading-[48px] tracking-[-0.8px] text-brand-600">
            {percent}%
          </p>
          <span className="flex items-center gap-1 self-start pt-[26px] text-xs font-medium tracking-[0.24px] text-success-500">
            <Image src="/icons/teacher-dashboard/trend-up.svg" alt="" width={12} height={7} />
            {deltaLabel}
          </span>
        </div>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-border-light">
        <div className="h-full rounded-full bg-brand-600" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
