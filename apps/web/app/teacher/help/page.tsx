import { TeacherPageShell } from "@/components/layout/teacher/TeacherPageShell";

const FAQS = [
  { q: "How do I add a new student to my class?", a: "Use the \"Add New Student\" button in the sidebar to send an enrollment invite." },
  { q: "How does Taleshift decide reading levels?", a: "Our leveling engine blends fluency, comprehension, and vocabulary signals from each session." },
  { q: "Can I export progress reports?", a: "Yes — use the \"Export Report\" button on the Overview page to download a PDF summary." },
  { q: "How do interventions get recommended?", a: "The adaptive engine flags patterns across recent sessions and suggests targeted actions." },
];

export default function TeacherHelpPage() {
  return (
    <TeacherPageShell active="Help Center">
      <h1 className="font-display text-[32px] font-bold text-text-primary">Help Center</h1>
      <p className="text-text-secondary">Answers to common questions, or reach out to our team.</p>

      <div className="mt-6 max-w-2xl rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col divide-y divide-border-light">
          {FAQS.map((faq) => (
            <div key={faq.q} className="py-4 first:pt-0 last:pb-0">
              <p className="text-sm font-bold text-text-primary">{faq.q}</p>
              <p className="mt-1 text-sm text-text-secondary">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 max-w-2xl rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        <h2 className="font-display text-lg font-bold text-text-primary">Still need help?</h2>
        <p className="mt-1 text-sm text-text-secondary">Our support team typically responds within one business day.</p>
        <button className="mt-4 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold text-white">Contact Support</button>
      </div>
    </TeacherPageShell>
  );
}
