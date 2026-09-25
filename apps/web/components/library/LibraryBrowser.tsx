"use client";

import { useMemo, useState } from "react";
import { STORIES, type Story } from "@/lib/stories";
import { StoryCard, type LibraryCardData } from "@/components/library/StoryCard";
import { StoryPreviewModal } from "@/components/library/StoryPreviewModal";
import { UploadBookModal } from "@/components/library/UploadBookModal";
import { ChevronDownIcon } from "@/components/icons/DashboardIcons";
import { UploadCloudIcon } from "@/components/icons/LibraryIcons";

interface UploadedBook {
  id: string;
  title: string;
  level: number;
  fileName: string;
}

const LEVEL_BANDS = [
  { label: "Level: Any", min: 1, max: 10 },
  { label: "Level 1-3 (Beginner)", min: 1, max: 3 },
  { label: "Level 4-6 (Intermediate)", min: 4, max: 6 },
  { label: "Level 7-10 (Advanced)", min: 7, max: 10 },
];

const DURATION_BANDS: { label: string; max: number; min?: number }[] = [
  { label: "Duration: Any", max: Infinity },
  { label: "Under 6 min", max: 6 },
  { label: "6-10 min", max: 10 },
  { label: "Over 10 min", max: Infinity, min: 11 },
];

const GENRES = ["All", "Adventure", "Fantasy", "Science", "Mystery", "Animals", "Friendship"] as const;

function toCardData(story: Story): LibraryCardData {
  return {
    id: story.id,
    title: story.title,
    level: story.level,
    durationMinutes: story.durationMinutes,
    coverEmoji: story.coverEmoji,
    coverFrom: story.coverFrom,
    coverTo: story.coverTo,
    caption: story.summary,
  };
}

export function LibraryBrowser({
  showUpload = false,
  recipientLabel,
}: {
  showUpload?: boolean;
  recipientLabel?: string;
}) {
  const [levelBandIndex, setLevelBandIndex] = useState(0);
  const [genre, setGenre] = useState<(typeof GENRES)[number]>("All");
  const [durationBandIndex, setDurationBandIndex] = useState(0);
  const [previewStory, setPreviewStory] = useState<Story | null>(null);
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [uploadedBooks, setUploadedBooks] = useState<UploadedBook[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const levelBand = LEVEL_BANDS[levelBandIndex]!;
  const durationBand = DURATION_BANDS[durationBandIndex]!;

  const filteredStories = useMemo(() => {
    return STORIES.filter((s) => {
      if (s.level < levelBand.min || s.level > levelBand.max) return false;
      if (genre !== "All" && s.genre !== genre) return false;
      if (durationBand.min !== undefined && s.durationMinutes < durationBand.min) return false;
      if (durationBand.max !== Infinity && s.durationMinutes > durationBand.max) return false;
      return true;
    });
  }, [levelBand, genre, durationBand]);

  const filteredUploads = useMemo(
    () => uploadedBooks.filter((b) => b.level >= levelBand.min && b.level <= levelBand.max),
    [uploadedBooks, levelBand],
  );

  function toggleAssign(id: string) {
    setAssignedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
        <span className="font-semibold">Filters:</span>

        <select
          value={levelBandIndex}
          onChange={(e) => setLevelBandIndex(Number(e.target.value))}
          className="rounded-full border border-border-default bg-surface px-3 py-1.5"
        >
          {LEVEL_BANDS.map((band, i) => (
            <option key={band.label} value={i}>
              {band.label}
            </option>
          ))}
        </select>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value as (typeof GENRES)[number])}
          className="rounded-full border border-border-default bg-surface px-3 py-1.5"
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g === "All" ? "Genre: All" : g}
            </option>
          ))}
        </select>

        <select
          value={durationBandIndex}
          onChange={(e) => setDurationBandIndex(Number(e.target.value))}
          className="rounded-full border border-border-default bg-surface px-3 py-1.5"
        >
          {DURATION_BANDS.map((band, i) => (
            <option key={band.label} value={i}>
              {band.label}
            </option>
          ))}
        </select>

        {(levelBandIndex !== 0 || genre !== "All" || durationBandIndex !== 0) && (
          <button
            type="button"
            onClick={() => {
              setLevelBandIndex(0);
              setGenre("All");
              setDurationBandIndex(0);
            }}
            className="font-semibold text-brand-600"
          >
            Clear filters
          </button>
        )}

        {showUpload && (
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="ml-auto flex items-center gap-2 rounded-full bg-brand-600 px-4 py-1.5 font-semibold text-white"
          >
            <UploadCloudIcon width={14} height={14} />
            Add Custom Book (PDF)
          </button>
        )}
      </div>

      {recipientLabel && (
        <p className="mt-4 flex items-center gap-1 text-sm text-text-secondary">
          Assigning to <span className="font-semibold text-text-primary">{recipientLabel}</span>
          <ChevronDownIcon width={9} height={6} />
        </p>
      )}

      <section className="mt-6">
        <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
          {filteredStories.length + filteredUploads.length} {filteredStories.length + filteredUploads.length === 1 ? "Story" : "Stories"}
        </h2>
        {filteredStories.length + filteredUploads.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border-default p-8 text-center text-sm text-text-secondary">
            No stories match these filters. Try widening your search.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filteredUploads.map((book) => (
              <StoryCard
                key={book.id}
                story={{
                  id: book.id,
                  title: book.title,
                  level: book.level,
                  durationMinutes: 0,
                  coverEmoji: "📄",
                  coverFrom: "#c2c6d6",
                  coverTo: "#424754",
                  caption: `Uploaded by you • ${book.fileName}`,
                  isPdf: true,
                }}
                isAssigned={assignedIds.has(book.id)}
                onPreview={() => {}}
                onAssign={() => toggleAssign(book.id)}
              />
            ))}
            {filteredStories.map((story) => (
              <StoryCard
                key={story.id}
                story={toCardData(story)}
                isAssigned={assignedIds.has(story.id)}
                onPreview={() => setPreviewStory(story)}
                onAssign={() => toggleAssign(story.id)}
              />
            ))}
          </div>
        )}
      </section>

      {previewStory && (
        <StoryPreviewModal
          story={previewStory}
          isAssigned={assignedIds.has(previewStory.id)}
          onAssign={() => toggleAssign(previewStory.id)}
          onClose={() => setPreviewStory(null)}
        />
      )}

      {showUploadModal && (
        <UploadBookModal
          onClose={() => setShowUploadModal(false)}
          onUpload={({ title, level, file }) => {
            setUploadedBooks((prev) => [
              ...prev,
              { id: `upload-${Date.now()}`, title, level, fileName: file.name },
            ]);
            setShowUploadModal(false);
          }}
        />
      )}
    </div>
  );
}
