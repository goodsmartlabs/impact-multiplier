"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, ListChecks, Lock, PartyPopper, Play } from "lucide-react";
import { useSkillChallengeStore } from "@/lib/store/skill-challenge-store";
import { useHydrated } from "@/lib/use-hydrated";
import { challengePath, getSkillChallenge } from "@/lib/skill-challenge";
import { checkDayRequirements, currentDay, dayProgress, isDayComplete, isDayUnlocked } from "@/lib/skill-challenge/engine";
import type { DayNumber, SkillId } from "@/lib/skill-challenge/types";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AcademyCourseLinks, ChallengeSkeleton, ChecklistPanel, dayLabel, DeliverableForm, ExerciseCard, Eyebrow, LessonContent, ResourceList, StepList, StorageNotice } from "./parts";

export function DayView({ skillId, dayNumber }: { skillId: SkillId; dayNumber: DayNumber }) {
  const mounted = useHydrated();
  const challenge = getSkillChallenge(skillId)!;
  const day = challenge.days[dayNumber - 1];
  const progress = useSkillChallengeStore((state) => state.progress[skillId]);
  const { start, toggleCheck, updateDay, completeDay, toggleSavedResource } = useSkillChallengeStore.getState();
  const [attempted, setAttempted] = useState(false);

  if (!mounted) return <ChallengeSkeleton />;

  const started = Boolean(progress);
  const current = dayProgress(progress, dayNumber);
  const complete = isDayComplete(progress, dayNumber);
  const unlocked = isDayUnlocked(progress, dayNumber);
  const requirements = checkDayRequirements(day, progress);
  const previous = dayNumber > 1 ? ((dayNumber - 1) as DayNumber) : null;
  const next = dayNumber < 7 ? ((dayNumber + 1) as DayNumber) : null;
  const academyHere = day.key === "learn" || day.key === "multiply";

  const handleComplete = () => {
    setAttempted(true);
    const result = completeDay(skillId, dayNumber);
    if (result.ok) setAttempted(false);
  };

  return (
    <div className="pb-24">
      <header className={cn("border-b border-ink px-4 py-8 md:px-6 md:py-12", challenge.accent === "pink" ? "bg-pink-dim" : "bg-blue-dim")}>
        <div className="mx-auto max-w-6xl">
          <Link href={challengePath(skillId)} className="group inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em]"><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> {challenge.name} {started ? "workspace" : "overview"}</Link>
          <nav aria-label="Challenge days" className="scrollbar-none -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
            {challenge.days.map((entry) => {
              const done = isDayComplete(progress, entry.day);
              const active = entry.day === dayNumber;
              return (
                <Link key={entry.day} href={challengePath(skillId, entry.day)} aria-current={active ? "page" : undefined} className={cn("im-press flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em]", active ? "border-ink bg-ink text-white" : done ? "border-ink bg-white text-blue" : "border-ink/30 bg-white/60 text-ink/70 hover:border-ink")}>
                  {done && <CheckCircle2 className="h-3.5 w-3.5" />}{String(entry.day).padStart(2, "0")} <span className="hidden sm:inline">{entry.title}</span>
                </Link>
              );
            })}
          </nav>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-pink">{dayLabel(dayNumber)} · {day.title}</p>
          <motion.h1 key={dayNumber} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.base, ease: EASE_OUT }} className="mt-2 max-w-4xl font-display text-4xl font-semibold leading-[0.98] md:text-6xl">{day.focus}</motion.h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-8 md:px-6">
        <StorageNotice />
        {!started && (
          <div className="mb-8 flex flex-col gap-3 rounded-3xl border border-ink bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm"><Eye className="mt-0.5 h-4 w-4 shrink-0 text-blue" />You’re previewing this day. Start the challenge to save your checklist, answers and project links.</p>
            <button type="button" onClick={() => start(skillId)} className="im-lift inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white hover:bg-blue"><Play className="h-3.5 w-3.5 fill-current" /> Start challenge</button>
          </div>
        )}
        {started && !unlocked && !complete && (
          <div className="mb-8 flex flex-col gap-3 rounded-3xl border border-ink bg-cream p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm"><Lock className="mt-0.5 h-4 w-4 shrink-0 text-pink" />You can read and draft this day, but it can only be completed after {dayLabel(currentDay(progress))}.</p>
            <Link href={challengePath(skillId, currentDay(progress))} className="group inline-flex shrink-0 items-center gap-1 text-sm font-bold"><span className="im-underline">Go to {dayLabel(currentDay(progress))}</span> <ArrowRight className="im-nudge h-4 w-4" /></Link>
          </div>
        )}
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:px-6 lg:grid-cols-[1.25fr_1fr]">
        <article className="space-y-10">
          <section aria-labelledby="lesson-heading">
            <Eyebrow>Lesson</Eyebrow>
            <h2 id="lesson-heading" className="sr-only">Lesson</h2>
            <div className="mt-4"><LessonContent lesson={day.lesson} /></div>
          </section>
          <section aria-labelledby="steps-heading">
            <Eyebrow tone="blue">Practical instructions</Eyebrow>
            <h2 id="steps-heading" className="mt-2 font-display text-2xl font-semibold">Do this today</h2>
            <div className="mt-4"><StepList steps={day.steps} /></div>
          </section>
          <ExerciseCard title={day.exercise.title} brief={day.exercise.brief} />
          <section aria-labelledby="resources-heading">
            <Eyebrow tone="blue">Resources</Eyebrow>
            <h2 id="resources-heading" className="mt-2 font-display text-2xl font-semibold">Use these</h2>
            <div className="mt-4"><ResourceList ids={day.resourceIds} saved={progress?.savedResources} onToggleSave={started ? (id) => toggleSavedResource(skillId, id) : undefined} /></div>
          </section>
          {academyHere && (
            <section aria-labelledby="academy-heading">
              <Eyebrow tone="blue">ImpactFools Academy</Eyebrow>
              <h2 id="academy-heading" className="mt-2 font-display text-2xl font-semibold">{day.key === "learn" ? "Want more depth on today’s concepts?" : "Keep building after the challenge"}</h2>
              <div className="mt-4"><AcademyCourseLinks slugs={challenge.academyCourses} compact /></div>
            </section>
          )}
        </article>

        <aside aria-labelledby="assignment-heading" className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[2rem] border border-ink bg-white p-5 shadow-[6px_6px_0_#111] md:p-6">
            <div className="flex items-center justify-between gap-3">
              <Eyebrow><span className="inline-flex items-center gap-1.5"><ListChecks className="h-3.5 w-3.5" />Today’s assignment</span></Eyebrow>
              {complete && <span className="inline-flex items-center gap-1 rounded-full bg-blue-dim px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-blue"><CheckCircle2 className="h-3.5 w-3.5" />Complete</span>}
            </div>
            <h2 id="assignment-heading" className="mt-2 font-display text-2xl font-semibold">Checklist</h2>
            <div className="mt-3"><ChecklistPanel items={day.checklist} checked={current.checked} disabled={!started} onToggle={(id) => toggleCheck(skillId, dayNumber, id)} /></div>

            <h3 className="mt-6 font-display text-2xl font-semibold">Deliverable</h3>
            <div className="mt-3">
              <DeliverableForm idPrefix={`day-${dayNumber}`} deliverable={day.deliverable} response={current.response} evidenceUrl={current.evidenceUrl} disabled={!started} onChange={(patch) => updateDay(skillId, dayNumber, patch)} />
            </div>

            <AnimatePresence initial={false} mode="wait">
              {complete ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mt-6 rounded-2xl border border-ink bg-blue-dim p-4">
                  <p className="flex items-center gap-2 font-semibold"><PartyPopper className="h-4 w-4 text-pink" />{dayLabel(dayNumber)} complete</p>
                  <p className="mt-1 text-xs text-muted">Completed {new Date(current.completedAt!).toLocaleDateString()}. Edits are saved; removing required work will reopen the day.</p>
                  {next ? (
                    <Link href={challengePath(skillId, next)} className="im-lift group mt-3 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white">Go to {dayLabel(next)} · {challenge.days[next - 1].title} <ArrowRight className="im-nudge h-4 w-4" /></Link>
                  ) : (
                    <Link href={`${challengePath(skillId)}/impact`} className="im-lift group mt-3 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white">Take the Impact Check <ArrowRight className="im-nudge h-4 w-4" /></Link>
                  )}
                </motion.div>
              ) : (
                <motion.div key="todo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6">
                  {started && (
                    <ul aria-live="polite" className={cn("mb-4 space-y-1 text-xs", attempted ? "text-pink" : "text-muted")}>
                      {requirements.missing.map((item) => <li key={item} className="flex gap-1.5"><span aria-hidden="true">•</span>{item}</li>)}
                    </ul>
                  )}
                  <button type="button" onClick={handleComplete} disabled={!started} className={cn("im-press group inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40", requirements.ready ? "bg-ink hover:bg-blue" : "bg-ink/70")}>
                    <CheckCircle2 className="h-4 w-4" /> Complete {dayLabel(dayNumber)}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </div>

      <nav aria-label="Previous and next day" className="mx-auto mt-12 flex max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        {previous ? <Link href={challengePath(skillId, previous)} className="group inline-flex items-center gap-1 text-sm font-bold"><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />{dayLabel(previous)}</Link> : <span />}
        {next ? <Link href={challengePath(skillId, next)} className="group inline-flex items-center gap-1 text-sm font-bold">{dayLabel(next)}<ArrowRight className="im-nudge h-4 w-4" /></Link> : <Link href={`${challengePath(skillId)}/impact`} className="group inline-flex items-center gap-1 text-sm font-bold">Impact Check<ArrowRight className="im-nudge h-4 w-4" /></Link>}
      </nav>
    </div>
  );
}
