/**
 * Owner: person 5.
 * TODO: pull the real resource library (worksheets, guides) instead
 * of the mocked list below.
 */
import { ClassSideNav } from "@/components/layout/teacher/ClassSideNav";

const RESOURCES = [
  { title: "Phonics Blend Worksheet Pack", type: "Worksheet", format: "PDF" },
  { title: "Comprehension Question Bank", type: "Question Bank", format: "PDF" },
  { title: "Vocabulary Flashcards: Nature", type: "Flashcards", format: "PDF" },
  { title: "Parent Guide: Supporting Fluency at Home", type: "Guide", format: "PDF" },
  { title: "Intervention Planning Template", type: "Template", format: "DOCX" },
];

export default function ResourcesPage() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-app-bg pl-64">
      <ClassSideNav className="Class 4-B" studentCount={24} active="Resources" />

      <main className="flex w-full flex-1 flex-col items-start gap-8 p-10">
        <div className="w-full max-w-[1280px]">
          <h1 className="font-display text-[32px] font-bold text-text-primary">Resources</h1>
          <p className="text-text-secondary">Printable worksheets and guides for your classroom.</p>

          <div className="mt-6 flex flex-col divide-y divide-border-light rounded-xl border border-border-light bg-surface shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            {RESOURCES.map((r) => (
              <div key={r.title} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-bold text-text-primary">{r.title}</p>
                  <p className="text-xs text-text-secondary">
                    {r.type} • {r.format}
                  </p>
                </div>
                <button className="rounded-full border border-border-default px-4 py-1.5 text-xs font-semibold text-text-secondary">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
