import type { Story } from "@/lib/stories";
import { CloseIcon, CheckIcon } from "@/components/icons/LibraryIcons";
import { ClockIcon } from "@/components/icons/DashboardIcons";

export function StoryPreviewModal({
  story,
  isAssigned,
  onAssign,
  onClose,
}: {
  story: Story;
  isAssigned: boolean;
  onAssign: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview of ${story.title}`}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative flex h-40 shrink-0 items-center justify-center text-6xl"
          style={{ background: `linear-gradient(135deg, ${story.coverFrom}, ${story.coverTo})` }}
        >
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-text-primary">
            Level {story.level}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/90 text-text-primary"
          >
            <CloseIcon width={14} height={14} />
          </button>
          {story.coverEmoji}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-bold text-text-primary">{story.title}</h2>
            <span className="flex shrink-0 items-center gap-1 text-xs text-text-secondary">
              <ClockIcon width={13} height={13} />
              {story.durationMinutes} min
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-slate-800 dark:text-brand-300">
              {story.genre}
            </span>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-slate-800 dark:text-brand-300">
              {story.vocabFocus}
            </span>
          </div>
          <p className="mt-4 text-sm italic text-text-secondary">{story.summary}</p>

          <div className="mt-4 flex flex-col gap-3 border-t border-border-light pt-4 font-display text-base leading-relaxed text-text-primary">
            {story.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-border-light p-4">
          <button
            type="button"
            onClick={onAssign}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold ${
              isAssigned ? "bg-success-200 text-[#00714d] dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-brand-600 text-white"
            }`}
          >
            {isAssigned && <CheckIcon width={14} height={14} />}
            {isAssigned ? "Assigned" : "Assign This Story"}
          </button>
        </div>
      </div>
    </div>
  );
}
