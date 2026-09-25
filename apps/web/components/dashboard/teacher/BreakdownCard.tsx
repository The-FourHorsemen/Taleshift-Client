import Image from "next/image";

type Tone = "neutral" | "danger";

interface BreakdownCardProps {
  value: number | string;
  label: string;
  icon: string;
  iconWidth: number;
  iconHeight: number;
  iconBg: string;
  tone?: Tone;
}

export function BreakdownCard({ value, label, icon, iconWidth, iconHeight, iconBg, tone = "neutral" }: BreakdownCardProps) {
  const isDanger = tone === "danger";

  return (
    <div
      className={`relative flex flex-1 items-center gap-4 overflow-hidden rounded-xl border px-[25px] py-[30px] ${
        isDanger
          ? "border-danger-100 bg-surface shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
          : "border-border-light bg-surface shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
      }`}
    >
      {isDanger && <div className="absolute inset-0 bg-danger-100-overlay" />}
      <div
        className="relative flex size-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <Image src={icon} alt="" width={iconWidth} height={iconHeight} />
      </div>
      <div className="relative">
        <p
          className={`font-display text-2xl font-semibold leading-[31.2px] ${
            isDanger ? "text-danger-600" : "text-text-primary"
          }`}
        >
          {value}
        </p>
        <p
          className={`text-xs font-medium uppercase tracking-[0.6px] ${
            isDanger ? "text-danger-800" : "text-text-secondary"
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
