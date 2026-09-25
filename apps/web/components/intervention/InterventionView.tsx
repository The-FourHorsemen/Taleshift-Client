"use client";

import { useState } from "react";
import { ClassSideNav } from "@/components/layout/teacher/ClassSideNav";
import { FlagIcon, BarChartIcon } from "@/components/icons/ClassNavIcons";
import { TrendUpIcon } from "@/components/icons/DashboardIcons";

interface Student {
  id: string;
  name: string;
  severity: "Critical" | "Moderate";
  focusArea: string;
  primaryChallenge: string;
  detectedPattern: string;
  recommendedActions: { label: string; description: string; checked: boolean }[];
}

const STUDENTS: Student[] = [
  {
    id: "sam",
    name: "Sam",
    severity: "Critical",
    focusArea: "Reading Comprehension",
    primaryChallenge: "Reading Comprehension - Difficulty understanding longer passages.",
    detectedPattern: "Consistent struggle with clause-based sentences based on questions across sessions.",
    recommendedActions: [
      { label: "Assign Shorter Passages", description: "Break down complex texts into manageable chunks.", checked: true },
      { label: "Add Context Vocabulary Exercises", description: "Pre-teach key terms before reading assignments.", checked: false },
      { label: "Schedule 1-on-1 Reading", description: "15 minutes focused intervention on Friday.", checked: false },
    ],
  },
  {
    id: "jordan",
    name: "Jordan",
    severity: "Moderate",
    focusArea: "Phonemic Awareness",
    primaryChallenge: "Phonemic Awareness - Difficulty blending consonant sounds.",
    detectedPattern: "Frequent substitution of similar-sounding consonants during read-alouds.",
    recommendedActions: [
      { label: "Daily Phoneme Drills", description: "5 minutes of targeted blending practice each morning.", checked: true },
      { label: "Pair with Reading Buddy", description: "Peer support during independent reading blocks.", checked: false },
    ],
  },
  {
    id: "casey",
    name: "Casey",
    severity: "Critical",
    focusArea: "Vocabulary",
    primaryChallenge: "Vocabulary - Limited grade-level word bank.",
    detectedPattern: "Struggles to infer word meaning from context across multiple genres.",
    recommendedActions: [
      { label: "Weekly Word Bank", description: "Introduce 5 new high-frequency words per week.", checked: true },
      { label: "Context Clue Practice", description: "Guided exercises inferring meaning from surrounding text.", checked: false },
    ],
  },
  {
    id: "taylor",
    name: "Taylor",
    severity: "Moderate",
    focusArea: "Reading Comprehension",
    primaryChallenge: "Reading Comprehension - Difficulty recalling sequence of events.",
    detectedPattern: "Retelling accuracy drops on passages longer than 300 words.",
    recommendedActions: [
      { label: "Story Sequencing Cards", description: "Visual aids to reinforce event order after reading.", checked: true },
      { label: "Shorter Chapter Check-ins", description: "Pause every few pages to summarize aloud.", checked: false },
    ],
  },
];

export function InterventionView() {
  const [selectedId, setSelectedId] = useState(STUDENTS[0]!.id);
  const student = STUDENTS.find((s) => s.id === selectedId)!;

  return (
    <div className="flex min-h-screen items-start justify-center bg-app-bg pl-64">
      <ClassSideNav className="Class 4-B" studentCount={24} active="Interventions" />

      <main className="flex w-full flex-1 flex-col items-start gap-8 p-10">
        <div className="w-full max-w-[1280px]">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-[32px] font-bold text-brand-600">Taleshift Intervention</h1>
            <input
              type="search"
              placeholder="Search students..."
              className="w-64 rounded-full border border-border-default bg-surface px-4 py-2 text-sm"
            />
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-border-light bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">Total</p>
              <p className="font-display text-3xl font-bold text-text-primary">24</p>
              <p className="text-xs text-text-secondary">Students</p>
            </div>
            <div className="rounded-xl border border-border-light bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">On Track</p>
              <p className="flex items-center gap-1 font-display text-3xl font-bold text-success-500">
                12 <TrendUpIcon width={16} height={16} />
              </p>
            </div>
            <div className="rounded-xl border border-border-light bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">Progressing</p>
              <p className="flex items-center gap-1 font-display text-3xl font-bold text-amber-500">
                8 <TrendUpIcon width={16} height={16} />
              </p>
            </div>
            <div className="rounded-xl border border-danger-100 bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">Requires Attention</p>
              <p className="font-display text-3xl font-bold text-danger-600">4</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-[280px_1fr] gap-6">
            <div className="rounded-xl border border-border-light bg-surface p-4">
              <h2 className="mb-3 px-2 font-display text-lg font-bold text-text-primary">Needs Attention</h2>
              <div className="flex flex-col gap-1">
                {STUDENTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={`flex flex-col gap-1 rounded-lg border-l-4 px-3 py-2.5 text-left ${
                      s.id === selectedId ? "border-brand-600 bg-brand-100" : "border-transparent hover:bg-app-bg"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-text-primary">{s.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          s.severity === "Critical"
                            ? "bg-danger-100 text-danger-600"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                        }`}
                      >
                        {s.severity}
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary">{s.focusArea}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border-light bg-surface p-6">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-2xl font-bold text-text-primary">
                  Intervention Plan: {student.name}
                </h2>
                {student.severity === "Critical" && (
                  <span className="rounded-full bg-danger-100 px-2 py-0.5 text-xs font-semibold text-danger-600">
                    ⚠ Critical Focus
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border-light p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">
                    <FlagIcon width={14} height={14} />
                    Primary Challenge
                  </p>
                  <p className="text-sm font-semibold text-text-primary">{student.primaryChallenge}</p>
                </div>
                <div className="rounded-lg border border-border-light p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">
                    <BarChartIcon width={14} height={14} />
                    Detected Pattern
                  </p>
                  <p className="text-sm text-text-secondary">{student.detectedPattern}</p>
                </div>
              </div>

              <h3 className="mt-6 font-display text-lg font-bold text-text-primary">Recommended Actions</h3>
              <div className="mt-3 flex flex-col gap-2">
                {student.recommendedActions.map((action) => (
                  <label
                    key={action.label}
                    className={`flex items-start gap-3 rounded-lg border p-3 ${
                      action.checked ? "border-brand-500 bg-brand-100/40" : "border-border-light"
                    }`}
                  >
                    <input type="checkbox" defaultChecked={action.checked} className="mt-1 accent-brand-600" />
                    <div>
                      <p className="text-sm font-bold text-text-primary">{action.label}</p>
                      <p className="text-xs text-text-secondary">{action.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              <button className="mt-6 w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white">
                Apply Intervention to Roadmap
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
