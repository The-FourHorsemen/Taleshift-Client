import { TeacherSideNav } from "@/components/layout/teacher/TeacherSideNav";
import { LibraryBrowser } from "@/components/library/LibraryBrowser";

export default function ReadingLibraryPage() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-app-bg pl-64">
      <TeacherSideNav active="Reading Library" />

      <main className="flex w-full flex-1 flex-col items-start gap-8 p-10">
        <div className="w-full max-w-[1280px]">
          <div>
            <h1 className="font-display text-[32px] font-bold text-text-primary">Reading Library</h1>
            <p className="text-text-secondary">Discover and assign new stories for your learners.</p>
          </div>

          <div className="mt-6">
            <LibraryBrowser />
          </div>
        </div>
      </main>
    </div>
  );
}
