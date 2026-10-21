"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, Save } from "lucide-react";
import { useRadarStore } from "@/lib/store/radar-store";
import { useHydrated } from "@/lib/use-hydrated";
import { PULSE_CATEGORIES } from "@/lib/pulse/categories";
import { parseList, type RadarPreferences } from "@/lib/pulse/radar";
import type { PulseCategory } from "@/lib/pulse/types";
import { cn } from "@/lib/utils";

const INDUSTRIES = ["Finance", "Technology", "Marketing", "Education", "Healthcare", "Creative & Design", "Retail", "Logistics", "Nonprofit", "Entrepreneurship"];
const GOALS = ["Get a job", "Change careers", "Freelance", "Start a business", "Earn extra income", "Get promoted", "Build a portfolio", "Learn AI"];
const INCOME = ["Freelancing", "Services", "Digital products", "Side income", "Consulting", "Remote work"];

type ListKey = Exclude<keyof RadarPreferences, "remote" | "categories">;

const TEXT_FIELDS: Array<{ key: ListKey; label: string; hint: string; placeholder: string }> = [
  { key: "existingSkills", label: "Skills you already have", hint: "Comma-separated.", placeholder: "Excel, bookkeeping, writing" },
  { key: "skillsToLearn", label: "Skills you want to learn", hint: "These get the strongest boost.", placeholder: "Power BI, AI automation" },
  { key: "interests", label: "Professional interests", hint: "Topics you care about.", placeholder: "automation, small business, data" },
  { key: "locations", label: "Preferred job locations", hint: "Cities, countries or “remote”.", placeholder: "Nairobi, Kenya, Remote" },
  { key: "learningInterests", label: "Learning interests", hint: "What you’d like courses on.", placeholder: "dashboards, prompting" },
];

function Chips({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {options.map((option) => {
        const on = selected.includes(option);
        return <button key={option} type="button" aria-pressed={on} onClick={() => onToggle(option)} className={cn("im-press rounded-full border px-3 py-1.5 text-xs font-bold", on ? "border-ink bg-ink text-white" : "border-ink/25 bg-white hover:border-ink")}>{option}</button>;
      })}
    </div>
  );
}

export function RadarEditor() {
  const mounted = useHydrated();
  const stored = useRadarStore((state) => state.prefs);
  const save = useRadarStore((state) => state.save);
  const reset = useRadarStore((state) => state.reset);
  if (!mounted) return <div className="h-96 animate-pulse rounded-3xl bg-ink/5" aria-busy="true" />;
  return <Form key={JSON.stringify(stored)} initial={stored} onSave={save} onReset={reset} />;
}

function Form({ initial, onSave, onReset }: { initial: RadarPreferences; onSave: (prefs: RadarPreferences) => void; onReset: () => void }) {
  const [prefs, setPrefs] = useState<RadarPreferences>(initial);
  const [texts, setTexts] = useState<Record<ListKey, string>>(() => Object.fromEntries(TEXT_FIELDS.map((field) => [field.key, initial[field.key].join(", ")])) as Record<ListKey, string>);
  const [saved, setSaved] = useState(false);

  const toggle = (key: "industries" | "careerGoals" | "incomeInterests", value: string) => {
    setSaved(false);
    setPrefs((current) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value] }));
  };
  const toggleCategory = (value: PulseCategory) => {
    setSaved(false);
    setPrefs((current) => ({ ...current, categories: current.categories.includes(value) ? current.categories.filter((item) => item !== value) : [...current.categories, value] }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: RadarPreferences = { ...prefs };
    for (const field of TEXT_FIELDS) next[field.key] = parseList(texts[field.key]);
    onSave(next);
    setSaved(true);
  };

  return (
    <form onSubmit={submit} className="space-y-6 rounded-[2rem] border border-ink bg-white p-5 shadow-[6px_6px_0_#111] md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        {TEXT_FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="block text-sm font-semibold">{field.label}</span>
            <span className="block text-xs text-muted">{field.hint}</span>
            <input value={texts[field.key]} onChange={(event) => { setSaved(false); setTexts({ ...texts, [field.key]: event.target.value }); }} placeholder={field.placeholder} className="mt-2 w-full rounded-full border border-ink px-4 py-2.5 text-sm outline-none focus:shadow-[3px_3px_0_var(--color-blue)]" />
          </label>
        ))}
        <fieldset>
          <legend className="text-sm font-semibold">Remote-work preference</legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {([["remote_only", "Remote only"], ["open", "Open to anything"], ["onsite_ok", "On-site is fine"]] as const).map(([value, label]) => (
              <label key={value} className={cn("im-press cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold", prefs.remote === value ? "border-ink bg-ink text-white" : "border-ink/25 hover:border-ink")}>
                <input type="radio" name="remote" value={value} checked={prefs.remote === value} onChange={() => { setSaved(false); setPrefs({ ...prefs, remote: value }); }} className="sr-only" />{label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <fieldset><legend className="text-sm font-semibold">Industries</legend><Chips options={INDUSTRIES} selected={prefs.industries} onToggle={(value) => toggle("industries", value)} /></fieldset>
      <fieldset><legend className="text-sm font-semibold">Career goals</legend><Chips options={GOALS} selected={prefs.careerGoals} onToggle={(value) => toggle("careerGoals", value)} /></fieldset>
      <fieldset><legend className="text-sm font-semibold">Income-building interests</legend><Chips options={INCOME} selected={prefs.incomeInterests} onToggle={(value) => toggle("incomeInterests", value)} /></fieldset>
      <fieldset>
        <legend className="text-sm font-semibold">Categories to follow</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PULSE_CATEGORIES.map((category) => {
            const on = prefs.categories.includes(category.id);
            return <button key={category.id} type="button" aria-pressed={on} onClick={() => toggleCategory(category.id)} className={cn("im-press rounded-full border px-3 py-1.5 text-xs font-bold", on ? "border-ink bg-ink text-white" : "border-ink/25 bg-white hover:border-ink")}><span aria-hidden="true">{category.emoji}</span> {category.label}</button>;
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
        <button type="submit" className="im-lift inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-blue"><Save className="h-4 w-4" />Save my radar</button>
        <button type="button" onClick={() => { onReset(); }} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink"><RotateCcw className="h-3.5 w-3.5" />Clear all</button>
        <span aria-live="polite" className="text-sm font-semibold text-blue">{saved && <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4" />Saved — recommendations updated below.</span>}</span>
      </div>
      <p className="text-xs text-muted">Saved in this browser. Matching is rule-based and transparent: each recommendation lists the reasons it appears.</p>
    </form>
  );
}
