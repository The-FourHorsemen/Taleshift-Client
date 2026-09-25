import { ClockIcon } from "@/components/icons/DashboardIcons";
import { CheckIcon, PdfFileIcon } from "@/components/icons/LibraryIcons";

export interface LibraryCardData {
  id: string;
  title: string;
  level: number;
  durationMinutes: number;
  coverEmoji: string;
  coverFrom: string;
  coverTo: string;
  caption?: string;
  isPdf?: boolean;
}

export function StoryCard({
  story,
  isAssigned,
  onPreview,
  onAssign,
}: {
  story: LibraryCardData;
  isAssigned: boolean;
  onPreview: () => void;
  onAssign: () => void;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border-light bg-surface shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        onClick={onPreview}
        className="relative flex h-40 items-center justify-center text-5xl"
        style={{ background: `linear-gradient(135deg, ${story.coverFrom}, ${story.coverTo})` }}
      >
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-text-primary">
          Level {story.level}
        </span>
        {story.isPdf && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-text-primary">
            <PdfFileIcon width={12} height={12} />
            PDF
          </span>
        )}
        {story.coverEmoji}
      </button>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-text-primary">{story.title}</h3>
          <span className="flex shrink-0 items-center gap-1 text-xs text-text-secondary">
            <ClockIcon width={12} height={12} />
            {story.durationMinutes} min
          </span>
        </div>
        {story.caption && <p className="text-xs leading-relaxed text-text-secondary">{story.caption}</p>}
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={onAssign}
            className={`flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-sm font-bold ${
              isAssigned
                ? "bg-success-200 text-[#00714d] dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-brand-600 text-white"
            }`}
          >
            {isAssigned && <CheckIcon width={12} height={12} />}
            {isAssigned ? "Assigned" : "Assign"}
          </button>
          <button type="button" onClick={onPreview} className="w-full rounded-full py-2 text-sm font-semibold text-brand-600">
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}
