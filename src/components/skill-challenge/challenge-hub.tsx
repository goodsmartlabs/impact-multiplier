"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Database, ExternalLink, Hammer, Lock, NotebookPen, Play, RotateCcw, Sparkles, Target, TriangleAlert } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ProgressBar } from "@/components/academy/progress-bar";
import { useSkillChallengeStore } from "@/lib/store/skill-challenge-store";
import { useHydrated } from "@/lib/use-hydrated";
import { CHALLENGE_BASE_PATH, challengePath, getSkillChallenge } from "@/lib/skill-challenge";
import { challengeStatus, completedDayCount, currentDay, evidenceLinks, isDayComplete, isDayUnlocked, progressPercent } from "@/lib/skill-challenge/engine";
import type { ChallengeProgress, SkillChallenge, SkillId } from "@/lib/skill-challenge/types";
import { cn } from "@/lib/utils";
import { AcademyCourseLinks, ChallengeSkeleton, dayLabel, Eyebrow, PROGRESS_STORAGE_NOTE, ResourceList, StatusBadge, StorageNotice } from "./parts";

export function ChallengeHub({ skillId }: { skillId: SkillId }) {
  const mounted = useHydrated();
  const challenge = getSkillChallenge(skillId)!;
  const progress = useSkillChallengeStore((state) => state.progress[skillId]);

  if (!mounted) return <ChallengeSkeleton />;
  return progress ? <Workspace challenge={challenge} progress={progress} /> : <Preview challenge={challenge} />;
}

function BackLink() {
  return <Link href={CHALLENGE_BASE_PATH} className="group inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em]"><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> All skills</Link>;
}

function ProjectCard({ challenge }: { challenge: SkillChallenge }) {
  return (
    <div className="rounded-3xl border border-ink bg-white p-5 shadow-[5px_5px_0_#111] md:p-6">
      <Eyebrow tone="blue"><span className="inline-flex items-center gap-1.5"><Hammer className="h-3.5 w-3.5" />Your project</span></Eyebrow>
      <h2 className="mt-2 font-display text-3xl font-semibold leading-tight">{challenge.project.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">{challenge.project.summary}</p>
      <p className="mt-4 rounded-2xl bg-blue-dim p-3 text-sm"><strong>Final proof:</strong> {challenge.project.finalProof}</p>
      {challenge.dataset && (
        <a href={challenge.dataset.href} download className="mt-4 flex items-start gap-3 rounded-2xl border border-ink p-3 text-sm hover:bg-pink-dim">
          <Database className="mt-0.5 h-4 w-4 shrink-0 text-pink" />
          <span><strong className="block">{challenge.dataset.label}</strong><span className="text-xs text-muted">{challenge.dataset.note}</span></span>
        </a>
      )}
      {challenge.caution && <p className="mt-4 flex gap-2 text-xs leading-relaxed text-ink/75"><TriangleAlert className="h-4 w-4 shrink-0 text-pink" />{challenge.caution}</p>}
    </div>
  );
}

/* ---------- Before starting: explore everything, no commitment ---------- */

function Preview({ challenge }: { challenge: SkillChallenge }) {
  const router = useRouter();
  const start = useSkillChallengeStore((state) => state.start);
  const begin = () => {
    start(challenge.id);
    router.push(challengePath(challenge.id, 1));
  };

  return (
    <div className="pb-20">
      <header className={cn("border-b border-ink px-4 py-10 md:px-6 md:py-16", challenge.accent === "pink" ? "bg-pink-dim" : "bg-blue-dim")}>
        <div className="mx-auto max-w-6xl">
          <BackLink />
          <Reveal immediate variant="fadeIn" as="p" className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-pink">7-Day Skill Challenge · {challenge.difficulty} · {challenge.timePerDay} a day</Reveal>
          <Reveal immediate as="h1" delay={0.05} className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-[0.92] md:text-7xl">{challenge.name}</Reveal>
          <Reveal immediate as="p" delay={0.15} className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">{challenge.tagline} {challenge.businessValue}</Reveal>
          <Reveal immediate delay={0.25} className="mt-7 flex flex-wrap items-center gap-3">
            <button type="button" onClick={begin} className="im-lift group inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[4px_4px_0_var(--color-pink)] hover:bg-blue"><Play className="h-4 w-4 fill-current" /> Start challenge</button>
            <span className="text-xs font-semibold text-muted">Reading the days below doesn’t start anything.</span>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="roadmap-heading">
          <Eyebrow>The seven days</Eyebrow>
          <h2 id="roadmap-heading" className="mt-2 font-display text-4xl font-semibold">What you’ll do</h2>
          <Stagger as="ol" stagger={0.05} className="mt-6 space-y-3">
            {challenge.days.map((day) => (
              <StaggerItem as="li" key={day.day}>
                <Link href={challengePath(challenge.id, day.day)} className="im-lift group block rounded-3xl border border-ink bg-white p-5 hover:shadow-[4px_4px_0_#111]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue">{dayLabel(day.day)} · {day.title}</span>
                    <ArrowRight className="im-nudge h-4 w-4" />
                  </div>
                  <p className="mt-2 font-display text-xl font-semibold leading-tight">{day.focus}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted"><strong className="text-ink">Deliverable:</strong> {day.deliverable.prompt}{day.deliverable.evidence === "required" ? " (with a project link)" : ""}</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
        <aside className="space-y-6">
          <ProjectCard challenge={challenge} />
          <div className="rounded-3xl border border-ink bg-white p-5">
            <Eyebrow tone="blue">Tools</Eyebrow>
            <ul className="mt-3 space-y-1.5 text-sm">{challenge.tools.map((tool) => <li key={tool} className="flex gap-2"><span className="text-pink">+</span>{tool}</li>)}</ul>
            <Eyebrow tone="blue" className="mt-5">Services you could eventually offer</Eyebrow>
            <ul className="mt-3 space-y-1.5 text-sm">{challenge.exampleServices.map((service) => <li key={service} className="flex gap-2"><span className="text-pink">+</span>{service}</li>)}</ul>
          </div>
          <div>
            <Eyebrow tone="blue">Go deeper in the Academy</Eyebrow>
            <div className="mt-3"><AcademyCourseLinks slugs={challenge.academyCourses} compact /></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- After starting: the personal workspace ---------- */

function Workspace({ challenge, progress }: { challenge: SkillChallenge; progress: ChallengeProgress }) {
  const status = challengeStatus(progress);
  const done = completedDayCount(progress);
  const next = currentDay(progress);
  const allDone = done === 7;
  const links = evidenceLinks(challenge, progress);
  const completedTasks = challenge.days.reduce((sum, day) => sum + (progress.days[day.day]?.checked.length ?? 0), 0);
  const totalTasks = challenge.days.reduce((sum, day) => sum + day.checklist.length, 0);

  return (
    <div className="pb-20">
      <header className={cn("border-b border-ink px-4 py-10 md:px-6 md:py-14", challenge.accent === "pink" ? "bg-pink-dim" : "bg-blue-dim")}>
        <div className="mx-auto max-w-6xl">
          <BackLink />
          <div className="mt-6 flex flex-wrap items-center gap-3"><Eyebrow>Your challenge workspace</Eyebrow><StatusBadge status={status} /></div>
          <Reveal immediate as="h1" className="mt-3 font-display text-4xl font-semibold leading-[0.95] md:text-6xl">{challenge.name}</Reveal>
          <p className="mt-2 text-sm font-semibold text-ink/70">Project: {challenge.project.title}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-xl">
              <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em]"><span>{done}/7 days complete</span><span>{progressPercent(progress)}%</span></div>
              <ProgressBar value={progressPercent(progress)} className="h-3 border border-ink bg-white" />
              <p className="mt-2 text-xs text-muted">{completedTasks}/{totalTasks} checklist tasks done · {links.length} project {links.length === 1 ? "link" : "links"} submitted</p>
            </div>
            {allDone ? (
              <Link href={`${challengePath(challenge.id)}/impact`} className="im-lift group inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0_var(--color-pink)]"><Target className="h-4 w-4" />{progress.impactCheck ? "Update your Impact Check" : "Take the Impact Check"} <ArrowRight className="im-nudge h-4 w-4" /></Link>
            ) : (
              <Link href={challengePath(challenge.id, next)} className="im-lift group inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#0964f5]">{done === 0 && !progress.days[1] ? "Begin" : "Continue"} {dayLabel(next)} · {challenge.days[next - 1].title} <ArrowRight className="im-nudge h-4 w-4" /></Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-8">
          <StorageNotice />
          {progress.impactCheck && <Showcase challenge={challenge} progress={progress} />}

          <section aria-labelledby="roadmap-heading">
            <Eyebrow>Day-by-day roadmap</Eyebrow>
            <h2 id="roadmap-heading" className="mt-2 font-display text-3xl font-semibold">Your seven days</h2>
            <ol className="relative mt-6 space-y-3">
              {challenge.days.map((day) => {
                const complete = isDayComplete(progress, day.day);
                const unlocked = isDayUnlocked(progress, day.day);
                const isCurrent = !complete && unlocked;
                const Icon = complete ? CheckCircle2 : unlocked ? Circle : Lock;
                return (
                  <li key={day.day}>
                    <Link
                      href={challengePath(challenge.id, day.day)}
                      aria-current={isCurrent ? "step" : undefined}
                      className={cn(
                        "im-lift group flex items-center gap-4 rounded-3xl border p-4 md:p-5",
                        complete ? "border-ink bg-blue-dim" : isCurrent ? "border-ink bg-white shadow-[4px_4px_0_var(--color-pink)]" : "border-line bg-white/70"
                      )}
                    >
                      <Icon className={cn("h-6 w-6 shrink-0", complete ? "text-blue" : isCurrent ? "text-pink" : "text-muted")} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{dayLabel(day.day)} · {complete ? "Complete" : isCurrent ? "Current" : "Locked until previous day"}</span>
                        <span className="block font-display text-xl font-semibold leading-tight">{day.title}</span>
                        <span className="block truncate text-xs text-muted">{day.focus}</span>
                      </span>
                      <ArrowRight className="im-nudge h-4 w-4 shrink-0" />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>

          <section aria-labelledby="evidence-heading" className="rounded-3xl border border-ink bg-white p-5 md:p-6">
            <Eyebrow tone="blue">Project uploads & links</Eyebrow>
            <h2 id="evidence-heading" className="mt-2 font-display text-2xl font-semibold">Evidence so far</h2>
            {links.length ? (
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.day}><a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3 text-sm hover:border-ink"><span><strong>{dayLabel(link.day)} · {link.title}</strong><span className="block truncate text-xs text-muted">{link.url}</span></span><ExternalLink className="h-4 w-4 shrink-0" /></a></li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">No project links yet. You’ll add them on the Build, Prove and Multiply days.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <NotesPanel skillId={challenge.id} notes={progress.notes} />
          <section className="rounded-3xl border border-ink bg-white p-5" aria-labelledby="saved-heading">
            <Eyebrow tone="blue">Saved learning resources</Eyebrow>
            <h2 id="saved-heading" className="sr-only">Saved learning resources</h2>
            <div className="mt-3">{progress.savedResources.length ? <SavedResources skillId={challenge.id} saved={progress.savedResources} /> : <p className="text-sm text-muted">Bookmark resources from any day and they’ll collect here.</p>}</div>
          </section>
          <ProjectCard challenge={challenge} />
          <div>
            <Eyebrow tone="blue">Go deeper in the Academy</Eyebrow>
            <div className="mt-3"><AcademyCourseLinks slugs={challenge.academyCourses} compact /></div>
          </div>
          <p className="text-xs leading-relaxed text-muted">{PROGRESS_STORAGE_NOTE}</p>
          <ResetChallenge skillId={challenge.id} />
        </aside>
      </div>
    </div>
  );
}

function SavedResources({ skillId, saved }: { skillId: SkillId; saved: string[] }) {
  const toggle = useSkillChallengeStore((state) => state.toggleSavedResource);
  return <ResourceList ids={saved} saved={saved} onToggleSave={(id) => toggle(skillId, id)} />;
}

function NotesPanel({ skillId, notes }: { skillId: SkillId; notes: string }) {
  const setNotes = useSkillChallengeStore((state) => state.setNotes);
  return (
    <section className="rounded-3xl border border-ink bg-white p-5" aria-labelledby="notes-heading">
      <Eyebrow tone="blue"><span className="inline-flex items-center gap-1.5"><NotebookPen className="h-3.5 w-3.5" />Notes</span></Eyebrow>
      <label htmlFor="challenge-notes" id="notes-heading" className="sr-only">Challenge notes</label>
      <textarea id="challenge-notes" value={notes} onChange={(event) => setNotes(skillId, event.target.value)} rows={6} maxLength={10000} placeholder="Ideas, questions, links, things to try…" className="mt-3 w-full resize-y rounded-2xl border border-line bg-cream p-3 text-sm leading-relaxed outline-none focus:border-ink" />
      <p className="mt-1 text-[11px] text-muted">Saved automatically as you type.</p>
    </section>
  );
}

function ResetChallenge({ skillId }: { skillId: SkillId }) {
  const [confirming, setConfirming] = useState(false);
  const reset = useSkillChallengeStore((state) => state.reset);
  const router = useRouter();
  if (!confirming) {
    return <button type="button" onClick={() => setConfirming(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"><RotateCcw className="h-3.5 w-3.5" />Restart this challenge</button>;
  }
  return (
    <div role="alertdialog" aria-labelledby="reset-title" className="rounded-2xl border border-pink bg-pink-dim p-4 text-sm">
      <p id="reset-title" className="font-semibold">Delete all progress, notes and evidence for this challenge?</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => { reset(skillId); router.push(CHALLENGE_BASE_PATH); }} className="im-press rounded-full bg-ink px-4 py-2 text-xs font-bold text-white">Yes, restart</button>
        <button type="button" onClick={() => setConfirming(false)} className="rounded-full px-4 py-2 text-xs font-semibold">Cancel</button>
      </div>
    </div>
  );
}

function Showcase({ challenge, progress }: { challenge: SkillChallenge; progress: ChallengeProgress }) {
  const check = progress.impactCheck!;
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} aria-labelledby="showcase-heading" className="rounded-[2rem] border border-ink bg-ink p-6 text-white shadow-[6px_6px_0_var(--color-pink)] md:p-8">
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-pink-dim"><Sparkles className="h-4 w-4" />Final project showcase</p>
      <h2 id="showcase-heading" className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">{check.projectCompleted || challenge.project.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-white/80"><strong className="text-white">What I can do now:</strong> {check.canDoNow}</p>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-2xl bg-white/10 p-3"><dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-dim">Problem addressed</dt><dd className="mt-1">{check.problemAddressed}</dd></div>
        <div className="rounded-2xl bg-white/10 p-3"><dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-dim">Potential service (untested)</dt><dd className="mt-1">{check.potentialService}</dd></div>
      </dl>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a href={check.evidenceUrl} target="_blank" rel="noopener noreferrer" className="im-lift inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink">View the project <ExternalLink className="h-4 w-4" /></a>
        <Link href={`${challengePath(challenge.id)}/impact`} className="text-sm font-semibold underline underline-offset-4">Edit Impact Check & service offer</Link>
      </div>
      <p className="mt-4 text-[11px] text-white/60">Self-reported by you and not reviewed by ImpactFools.</p>
    </motion.section>
  );
}
