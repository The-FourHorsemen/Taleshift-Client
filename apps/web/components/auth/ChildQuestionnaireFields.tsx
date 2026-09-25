export interface ChildDraft {
  name: string;
  age: string;
  grade: string;
  inviteCode: string;
  pin: string;
  gender: string;
  genderSelfDescribe: string;
  race: string;
  raceSelfDescribe: string;
  supportNeeds: string[];
  supportNotes: string;
}

export const EMPTY_CHILD: ChildDraft = {
  name: "",
  age: "",
  grade: "",
  inviteCode: "",
  pin: "",
  gender: "",
  genderSelfDescribe: "",
  race: "",
  raceSelfDescribe: "",
  supportNeeds: [],
  supportNotes: "",
};

export const GENDER_OPTIONS = ["Girl", "Boy", "Non-binary", "Prefer to self-describe", "Prefer not to say"];

export const RACE_OPTIONS = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Native Hawaiian or Other Pacific Islander",
  "White",
  "Two or more races",
  "Prefer to self-describe",
  "Prefer not to say",
];

export const SUPPORT_NEED_OPTIONS = [
  "ADHD",
  "Autism Spectrum",
  "Dyslexia / Reading Difficulty",
  "Speech or Language Delay",
  "Anxiety or Emotional Regulation",
  "Sensory Processing Differences",
  "Other",
];

const selectClass =
  "rounded-lg border border-border-default bg-surface px-3 py-2.5 text-sm font-normal text-text-primary";
const inputClass = "rounded-lg border border-border-default px-3 py-2.5 text-sm font-normal text-text-primary";

export function ChildQuestionnaireFields({
  child,
  onChange,
  onToggleSupportNeed,
}: {
  child: ChildDraft;
  onChange: (patch: Partial<ChildDraft>) => void;
  onToggleSupportNeed: (need: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-surface p-5">
      <p className="font-display text-lg font-bold text-text-primary">{child.name || "Your child"}</p>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
          Gender
          <select value={child.gender} onChange={(e) => onChange({ gender: e.target.value })} className={selectClass}>
            <option value="">Select...</option>
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
          Race / Ethnicity
          <select value={child.race} onChange={(e) => onChange({ race: e.target.value })} className={selectClass}>
            <option value="">Select...</option>
            {RACE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>

      {child.gender === "Prefer to self-describe" && (
        <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
          Gender (self-described)
          <input
            value={child.genderSelfDescribe}
            onChange={(e) => onChange({ genderSelfDescribe: e.target.value })}
            className={inputClass}
          />
        </label>
      )}
      {child.race === "Prefer to self-describe" && (
        <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
          Race / Ethnicity (self-described)
          <input
            value={child.raceSelfDescribe}
            onChange={(e) => onChange({ raceSelfDescribe: e.target.value })}
            className={inputClass}
          />
        </label>
      )}

      <div>
        <p className="mb-2 text-sm font-semibold text-text-secondary">
          Does your child have any diagnosed or suspected support needs? <span className="font-normal">(optional, select any that apply)</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {SUPPORT_NEED_OPTIONS.map((need) => (
            <label key={need} className="flex items-center gap-2 rounded-lg border border-border-light px-3 py-2 text-sm text-text-primary">
              <input
                type="checkbox"
                checked={child.supportNeeds.includes(need)}
                onChange={() => onToggleSupportNeed(need)}
                className="accent-brand-600"
              />
              {need}
            </label>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
        Anything else that would help us support your child? <span className="font-normal">(optional)</span>
        <textarea
          value={child.supportNotes}
          onChange={(e) => onChange({ supportNotes: e.target.value })}
          rows={2}
          placeholder="e.g. gets overwhelmed by long passages, prefers audio cues, IEP accommodations..."
          className="resize-none rounded-lg border border-border-default px-3 py-2.5 text-sm font-normal text-text-primary"
        />
      </label>
    </div>
  );
}
