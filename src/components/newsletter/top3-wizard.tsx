"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { recommendTop3, describeAnswers } from "@/lib/newsletter/top3";
import {
  GOALS, LEVELS, RESOURCES_HAVE, SUCCESS, TIMES, GOAL_IDS,
  type GoalId, type HaveId, type LevelId, type SuccessId, type TimeId, type Top3Answers,
} from "@/lib/newsletter/top3-questions";
import { useWeekendPlanStore } from "@/lib/store/weekend-plan-store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";
import { RecommendationCard } from "./recommendation-card";

type Draft = { goals: GoalId[]; level?: LevelId; time?: TimeId; have: HaveId[]; success?: SuccessId };

const STEPS = [
  { key: "goals", title: "What do you want to achieve?", hint: "Choose all that apply.", multi: true, options: GOALS.map((goal) => ({ id: goal.id, label: goal.label, prefix: goal.letter })) },
  { key: "level", title: "Where are you right now?", hint: "Pick one.", multi: false, options: LEVELS.map((level) => ({ id: level.id, label: level.label })) },
  { key: "time", title: "How much time do you have this weekend?", hint: "Be honest — the plan adapts.", multi: false, options: TIMES.map((time) => ({ id: time.id, label: time.label })) },
  { key: "have", title: "What do you currently have?", hint: "Choose all that apply.", multi: true, options: RESOURCES_HAVE.map((item) => ({ id: item.id, label: item.label })) },
  { key: "success", title: "What would make this weekend successful?", hint: "Pick one.", multi: false, options: SUCCESS.map((item) => ({ id: item.id, label: item.label })) },
] as const;

export function Top3Wizard() {
  const hydrated = useHydrated();
  const params = useSearchParams();
  const { latest, answers: savedAnswers, plans, setResult, savePlan, clearResults } = useWeekendPlanStore();
  const prefillGoals = useMemo(() => (params.get("goals") ?? "").split(",").filter((goal): goal is GoalId => (GOAL_IDS as string[]).includes(goal)), [params]);
  const highlight = params.get("project");
  const [draft, setDraft] = useState<Draft>(() => ({ goals: prefillGoals, have: [] }));
  const [step, setStep] = useState(0);
  const [restarted, setRestarted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const showResults = hydrated && latest && savedAnswers && !restarted;
  const current = STEPS[step];
  const value = draft[current.key as keyof Draft];
  const complete = Array.isArray(value) ? value.length > 0 : Boolean(value);

  function choose(id: string) {
    setDraft((previous) => {
      const key = current.key as keyof Draft;
      if (current.multi) {
        const list = previous[key] as string[];
        return { ...previous, [key]: list.includes(id) ? list.filter((item) => item !== id) : [...list, id] };
      }
      return { ...previous, [key]: id };
    });
  }

  function go(next: number) {
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function finish() {
    const answers: Top3Answers = { goals: draft.goals, level: draft.level!, time: draft.time!, have: draft.have, success: draft.success! };
    const completed = plans.filter((plan) => plan.status === "completed").map((plan) => plan.projectId);
    setResult(answers, recommendTop3(answers, { exclude: completed }));
    setRestarted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    clearResults();
    setDraft({ goals: savedAnswers?.goals ?? prefillGoals, level: savedAnswers?.level, time: savedAnswers?.time, have: savedAnswers?.have ?? [], success: savedAnswers?.success });
    setStep(0);
    setRestarted(true);
  }

  if (!hydrated) return <div className="h-96 animate-pulse rounded-[2rem] bg-ink/5" aria-busy="true" />;

  if (showResults) {
    const summary = describeAnswers(savedAnswers);
    const savedIds = new Set(plans.map((plan) => plan.projectId));
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-ink bg-blue-dim p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Your Top 3</p>
            <p className="mt-1 text-sm">For <strong>{summary.goals.join(", ").toLowerCase()}</strong> · {summary.level.toLowerCase()} · {summary.time} · {summary.have.join(", ").toLowerCase()}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={restart} className="im-press inline-flex min-h-10 items-center gap-1.5 rounded-full border border-ink bg-white px-4 text-xs font-bold"><RotateCcw aria-hidden="true" className="h-4 w-4" />Change my answers</button>
            <Link href="/newsletter/my-plan" className="im-press inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-xs font-bold text-white">BUILD MY WEEKEND PLAN <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
          </div>
        </div>
        {latest.recommendations.length === 0 ? (
          <p className="rounded-3xl border border-ink bg-white p-6 text-sm">You’ve completed every project that fits these answers — impressive. Change your time or goals to see new ones, or pick a longer build in the <Link href="/build-challenge" className="font-bold underline">7-Day Build Challenge</Link>.</p>
        ) : (
          latest.recommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.projectId} recommendation={recommendation} highlight={highlight === recommendation.projectId || recommendation.rank === 1} saved={savedIds.has(recommendation.projectId)} onSave={() => savePlan(recommendation)} />
          ))
        )}
        <p className="text-xs text-muted">Your answers and plan stay in this browser. They’re never shared, emailed or used in public content.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border-2 border-ink bg-white p-5 shadow-[6px_6px_0_var(--color-ink)] md:p-8">
      <div className="flex items-center justify-between gap-3 text-xs font-bold">
        <span>Question {step + 1} of {STEPS.length}</span>
        <span className="text-muted">About a minute</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Progress">
        <motion.div className="h-full rounded-full bg-pink" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ duration: 0.3 }} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.fieldset key={current.key} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="mt-6">
          <legend className="contents">
            <h2 ref={headingRef} tabIndex={-1} className="font-display text-3xl font-semibold leading-tight outline-none md:text-4xl">{current.title}</h2>
          </legend>
          <p className="mt-1 text-sm text-muted">{current.hint}</p>
          <div className={cn("mt-5 grid gap-2", current.options.length > 5 && "sm:grid-cols-2")}>
            {current.options.map((option) => {
              const selected = Array.isArray(value) ? (value as string[]).includes(option.id) : value === option.id;
              return (
                <label key={option.id} className={cn("im-press flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-colors", selected ? "border-ink bg-ink text-white" : "border-ink/20 hover:border-ink")}>
                  <input type={current.multi ? "checkbox" : "radio"} name={current.key} value={option.id} checked={selected} onChange={() => choose(option.id)} className="sr-only" />
                  {"prefix" in option && <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold", selected ? "border-white" : "border-ink/30")}>{option.prefix}</span>}
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </motion.fieldset>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="im-press inline-flex min-h-11 items-center gap-1.5 rounded-full border border-ink px-4 text-sm font-bold disabled:invisible"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Back</button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={() => go(step + 1)} disabled={!complete} className="im-press inline-flex min-h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-bold text-white disabled:opacity-40">Next<ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
        ) : (
          <button type="button" onClick={finish} disabled={!complete} className="im-lift inline-flex min-h-12 items-center gap-1.5 rounded-full bg-pink px-6 text-sm font-bold text-white shadow-[3px_3px_0_var(--color-ink)] disabled:opacity-40"><Sparkles aria-hidden="true" className="h-4 w-4" />FIND MY TOP 3</button>
        )}
      </div>
      {!complete && <p className="mt-2 text-right text-[11px] text-muted" aria-live="polite">Choose an answer to continue.</p>}
    </div>
  );
}
