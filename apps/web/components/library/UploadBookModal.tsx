"use client";

import { useState } from "react";
import { CloseIcon, UploadCloudIcon } from "@/components/icons/LibraryIcons";

export function UploadBookModal({
  onClose,
  onUpload,
}: {
  onClose: () => void;
  onUpload: (data: { title: string; level: number; file: File }) => void;
}) {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState(5);
  const [file, setFile] = useState<File | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Upload a custom book"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (!file || !title.trim()) return;
          onUpload({ title, level, file });
        }}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-surface p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-text-primary">Add a Custom Book</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-text-secondary">
            <CloseIcon width={16} height={16} />
          </button>
        </div>
        <p className="-mt-2 text-sm text-text-secondary">
          Upload a PDF and we&apos;ll add it to your library to assign, just like any other story.
        </p>

        <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
          Book Title
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Grandpa's Fishing Trip"
            className="rounded-lg border border-border-default px-3 py-2.5 text-sm font-normal text-text-primary"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
          Reading Level ({level})
          <input
            type="range"
            min={1}
            max={10}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="accent-brand-600"
          />
        </label>

        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border-default p-6 text-center">
          <UploadCloudIcon width={28} height={28} className="text-text-secondary" />
          <span className="text-sm font-semibold text-text-primary">{file ? file.name : "Choose a PDF file"}</span>
          <span className="text-xs text-text-secondary">PDF only, up to 20MB</span>
          <input
            required
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <button type="submit" className="mt-2 w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white">
          Add to Library
        </button>
      </form>
    </div>
  );
}
