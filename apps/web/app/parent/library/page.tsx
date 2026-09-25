import { ParentPageShell } from "@/components/layout/parent/ParentPageShell";
import { LibraryBrowser } from "@/components/library/LibraryBrowser";

export default function ParentLibraryPage() {
  return (
    <ParentPageShell active="Reading Library">
      <h1 className="font-display text-[32px] font-bold text-text-primary">Reading Library</h1>
      <p className="text-text-secondary">Discover stories, or upload your own, to assign to your child.</p>

      <div className="mt-6 w-full">
        <LibraryBrowser showUpload recipientLabel="Alex" />
      </div>
    </ParentPageShell>
  );
}
