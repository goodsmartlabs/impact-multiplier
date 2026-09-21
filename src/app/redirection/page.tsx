"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CornerDownRight, RotateCcw, Route, Sparkles } from "lucide-react";
import { getCraftPath, PROBLEM_TYPES } from "@/lib/data/craft-paths";
import { buildRedirectionResult } from "@/lib/redirection";
import type { ProblemTypeId, RedirectionAnswers } from "@/lib/types";

const EMPTY: RedirectionAnswers = { current: "", change: [], strengths: [], leaks: [], desiredOutcome: [] };

const STRENGTHS = [
  ["accounting", "Accounting / finance"], ["creative", "Creative work"], ["technology", "Digital tools"],
  ["business", "Business / operations"], ["people", "People / relationships"], ["knowledge", "Knowledge I can use"],
] as const;

const LEAKS = [
  ["learning-without-building", "Learning without building"], ["unclear-priorities", "Too many priorities"],
  ["attention-scatter", "Scattered attention"], ["money-without-plan", "Money without a plan"],
  ["ideas-without-execution", "Ideas without execution"],
] as const;

export default function RedirectionPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<RedirectionAnswers>(EMPTY);
  const result = useMemo(() => step === 5 ? buildRedirectionResult(answers) : null, [step, answers]);

  function toggle(field: "change" | "desiredOutcome", value: ProblemTypeId) {
    setAnswers((current) => ({ ...current, [field]: current[field].includes(value) ? current[field].filter((item) => item !== value) : [...current[field], value] }));
  }

  function toggleString(field: "strengths" | "leaks", value: string) {
    setAnswers((current) => ({ ...current, [field]: current[field].includes(value) ? current[field].filter((item) => item !== value) : [...current[field], value] }));
  }

  const canContinue = step === 0 || (step === 1 ? answers.current.trim().length > 4 : step === 2 ? answers.change.length > 0 : step === 3 ? answers.strengths.length > 0 : step === 4 ? answers.leaks.length > 0 && answers.desiredOutcome.length > 0 : true);

  return (
    <div className="min-h-[calc(100vh-8rem)] border-b border-ink bg-pink-dim px-4 py-8 md:px-6 md:py-14">
      <main className="mx-auto max-w-5xl">
        {step < 5 ? <>
          <header className="mb-6 flex items-center justify-between gap-4"><Link href="/craft-paths" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide"><ArrowLeft className="h-4 w-4" /> Craft Paths</Link><span className="text-[10px] font-bold uppercase tracking-[0.16em]">Redirection Check</span></header>
          <div className="mb-7 h-2 overflow-hidden rounded-full border border-ink bg-white"><div className="h-full bg-blue transition-all" style={{ width: `${Math.max(8, (step / 5) * 100)}%` }} /></div>
          <section className="editorial-grid relative min-h-[520px] overflow-hidden rounded-[2rem] border border-ink bg-paper p-6 shadow-[7px_7px_0_#111] md:p-10">
            <Route className="absolute right-7 top-7 h-9 w-9 text-blue" aria-hidden="true" />
            {step === 0 && <Intro />}
            {step === 1 && <TextStep value={answers.current} onChange={(current) => setAnswers((answers) => ({ ...answers, current }))} />}
            {step === 2 && <ChoiceStep eyebrow="02 · Direction" title="What are you trying to change?" help="Choose up to three signals that feel most true right now." options={PROBLEM_TYPES.map((item) => [item.id, item.statement] as const)} selected={answers.change} onToggle={(value) => toggle("change", value as ProblemTypeId)} />}
            {step === 3 && <ChoiceStep eyebrow="03 · Source" title="What do you already have?" help="Start with your source—not your lack." options={STRENGTHS} selected={answers.strengths} onToggle={(value) => toggleString("strengths", value)} />}
            {step === 4 && <div><ChoiceStep eyebrow="04 · Current + Leaks" title="What is consuming progress?" help="Select the patterns taking resources without creating enough value." options={LEAKS} selected={answers.leaks} onToggle={(value) => toggleString("leaks", value)} compact /><div className="mt-8 border-t border-line pt-7"><ChoiceStep eyebrow="05 · Delta" title="What should change next?" help="Choose the outcome you want your resources to create." options={PROBLEM_TYPES.filter((item) => ["capability", "proof", "income", "visibility", "building", "career", "business", "money-wealth", "growth"].includes(item.id)).map((item) => [item.id, item.label] as const)} selected={answers.desiredOutcome} onToggle={(value) => toggle("desiredOutcome", value as ProblemTypeId)} compact /></div></div>}
            <div className="absolute inset-x-6 bottom-6 flex items-center justify-between md:inset-x-10 md:bottom-9">
              <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} className="inline-flex items-center gap-1 text-sm font-semibold disabled:opacity-0"><ArrowLeft className="h-4 w-4" /> Back</button>
              <button type="button" onClick={() => setStep((current) => Math.min(5, current + 1))} disabled={!canContinue} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-35">{step === 4 ? "Build my map" : step === 0 ? "Start the check" : "Continue"} <ArrowRight className="h-4 w-4" /></button>
            </div>
          </section>
        </> : result && <RedirectionMap result={result} onReset={() => { setAnswers(EMPTY); setStep(0); }} />}
      </main>
    </div>
  );
}

function Intro() { return <div className="max-w-3xl pt-12 md:pt-16"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">Discover → Diagnose → Redirect → Build → Prove</p><h1 className="mt-5 font-display text-6xl font-semibold uppercase leading-[0.8] tracking-[-0.05em] md:text-8xl">Something needs to change.</h1><p className="mt-6 font-display text-3xl font-semibold italic text-blue">Let’s figure out what.</p><p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">Five short steps. No fake AI. Your answers are matched transparently to the Craft Path that best fits the problem.</p></div>; }

function TextStep({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <div className="max-w-3xl pt-8"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">01 · Current</p><h1 className="mt-4 font-display text-5xl font-semibold leading-[0.9] md:text-7xl">Where are you now?</h1><p className="mt-4 text-sm text-muted">One or two honest sentences. What are you doing, and what feels stuck?</p><label className="mt-8 block"><span className="sr-only">Describe where you are now</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} maxLength={420} placeholder="I’m currently… but I keep…" className="w-full resize-none rounded-2xl border border-ink bg-white p-5 text-base leading-relaxed outline-none transition-shadow focus:shadow-[4px_4px_0_#0964f5]" /></label></div>; }

function ChoiceStep({ eyebrow, title, help, options, selected, onToggle, compact = false }: { eyebrow: string; title: string; help: string; options: ReadonlyArray<readonly [string, string]>; selected: string[]; onToggle: (value: string) => void; compact?: boolean }) { return <div className={compact ? "" : "pt-4"}><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">{eyebrow}</p><h1 className={`mt-3 font-display font-semibold leading-[0.92] ${compact ? "text-3xl md:text-4xl" : "text-5xl md:text-6xl"}`}>{title}</h1><p className="mt-3 text-sm text-muted">{help}</p><div className={`mt-6 grid gap-2 ${compact ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>{options.map(([value, label]) => { const active = selected.includes(value); return <button key={value} type="button" aria-pressed={active} onClick={() => onToggle(value)} className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all ${active ? "border-ink bg-blue-dim shadow-[3px_3px_0_#111]" : "border-line bg-white hover:border-ink"}`}>{label}{active && <Check className="h-4 w-4 shrink-0 text-blue" />}</button>; })}</div></div>; }

function RedirectionMap({ result, onReset }: { result: ReturnType<typeof buildRedirectionResult>; onReset: () => void }) {
  const path = getCraftPath(result.recommendation.pathSlug)!;
  const blocks = [["Where you are", result.whereYouAre], ["What you already have", result.whatYouHave.join(" · ") || "Experience, time and attention you can redirect"], ["What is not working", result.whatIsNotWorking.join(" · ")], ["What may need redirecting", result.whatToRedirect], ["What to build next", result.whatToBuildNext], ["Your next move", result.nextMove]];
  return <section className="rounded-[2rem] border border-ink bg-paper p-5 shadow-[7px_7px_0_#111] md:p-9"><header className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">Source → Current → Leaks → Reservoir → Delta</p><h1 className="mt-3 font-display text-5xl font-semibold uppercase leading-none md:text-7xl">Your Redirection Map</h1></div><Sparkles className="h-9 w-9 text-blue" /></header><div className="mt-8 grid gap-3 md:grid-cols-2">{blocks.map(([label, value], index) => <article key={label} className={`rounded-2xl border border-ink p-5 ${index === 5 ? "bg-pink-dim" : "bg-white"}`}><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue">0{index + 1} · {label}</p><p className="mt-3 text-sm font-semibold leading-relaxed">{value}</p></article>)}</div><div className="mt-6 rounded-3xl border border-ink bg-blue p-6 text-white md:flex md:items-center md:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">Your recommended Craft Path</p><h2 className="mt-2 font-display text-4xl font-semibold leading-none md:text-5xl">{path.title}</h2><p className="mt-3 max-w-xl text-sm text-white/75">{path.shortOutcome}</p></div><Link href={`/craft-paths/${path.slug}`} className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink md:mt-0">Open your path <ArrowRight className="h-4 w-4" /></Link></div><div className="mt-6 flex flex-wrap justify-between gap-3"><button type="button" onClick={onReset} className="inline-flex items-center gap-2 text-sm font-semibold"><RotateCcw className="h-4 w-4" /> Start again</button><Link href="/craft-paths" className="inline-flex items-center gap-2 text-sm font-semibold">See every Craft Path <CornerDownRight className="h-4 w-4" /></Link></div></section>;
}
