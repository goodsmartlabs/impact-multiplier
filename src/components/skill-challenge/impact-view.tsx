"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ClipboardCopy, FileCheck2, HelpCircle, Lock, Save, Sparkles, Target, Wand2 } from "lucide-react";
import { useSkillChallengeStore } from "@/lib/store/skill-challenge-store";
import { useHydrated } from "@/lib/use-hydrated";
import { challengePath, getSkillChallenge } from "@/lib/skill-challenge";
import { completedDayCount, DAY_NUMBERS, draftServiceOffer, evidenceLinks, isDayComplete, isValidUrl, type ServiceOfferInput } from "@/lib/skill-challenge/engine";
import type { ChallengeProgress, ImpactCheck, SkillChallenge, SkillId } from "@/lib/skill-challenge/types";
import { cn } from "@/lib/utils";
import { AcademyCourseLinks, ChallengeSkeleton, dayLabel, Eyebrow, StorageNotice } from "./parts";

export function ImpactView({ skillId }: { skillId: SkillId }) {
  const mounted = useHydrated();
  const challenge = getSkillChallenge(skillId)!;
  const progress = useSkillChallengeStore((state) => state.progress[skillId]);
  if (!mounted) return <ChallengeSkeleton />;

  const ready = progress && completedDayCount(progress) === 7;
  return (
    <div className="pb-24">
      <header className="border-b border-ink bg-ink px-4 py-10 text-white md:px-6 md:py-16">
        <div className="mx-auto max-w-5xl">
          <Link href={challengePath(skillId)} className="group inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-white/80 hover:text-white"><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> {challenge.name} workspace</Link>
          <p className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-pink-dim"><Target className="h-4 w-4" />The Impact Check</p>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-3 max-w-4xl font-display text-4xl font-semibold uppercase leading-[0.95] md:text-6xl">What can you do now that you couldn’t do before?</motion.h1>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 pt-8 md:px-6">
        <StorageNotice />
        {ready ? <Unlocked challenge={challenge} progress={progress} /> : <Locked challenge={challenge} progress={progress} />}
      </div>
    </div>
  );
}

function Locked({ challenge, progress }: { challenge: SkillChallenge; progress?: ChallengeProgress }) {
  const remaining = DAY_NUMBERS.filter((day) => !isDayComplete(progress, day));
  return (
    <div className="rounded-3xl border border-ink bg-white p-6 md:p-8">
      <p className="flex items-center gap-2 font-display text-2xl font-semibold"><Lock className="h-5 w-5 text-pink" />Complete all seven days first</p>
      <p className="mt-2 text-sm text-muted">The Impact Check records real work, so it opens once every day’s checklist, deliverable and project links are done.</p>
      {progress ? (
        <ul className="mt-5 flex flex-wrap gap-2">{remaining.map((day) => <li key={day}><Link href={challengePath(challenge.id, day)} className="im-press inline-flex rounded-full border border-ink px-3 py-1.5 text-xs font-bold hover:bg-blue-dim">{dayLabel(day)} · {challenge.days[day - 1].title}</Link></li>)}</ul>
      ) : (
        <Link href={challengePath(challenge.id)} className="im-lift mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white">Explore the challenge <ArrowRight className="h-4 w-4" /></Link>
      )}
    </div>
  );
}

const CHECK_FIELDS: Array<{ key: keyof Omit<ImpactCheck, "recordedAt" | "evidenceUrl">; label: string; hint: string; rows: number }> = [
  { key: "canDoNow", label: "What can you do now that you couldn’t do before?", hint: "Be specific: “I can build a form-to-email automation with AI classification”, not “I learned automation”.", rows: 3 },
  { key: "skillLearned", label: "Skill learned", hint: "The skill and the specific techniques you practised.", rows: 2 },
  { key: "projectCompleted", label: "Project completed", hint: "What you built, in one or two sentences.", rows: 2 },
  { key: "problemAddressed", label: "Problem addressed", hint: "The business problem your project solves and for whom.", rows: 2 },
  { key: "potentialService", label: "Potential service you could offer", hint: "An idea to test — not a claim that anyone has bought it yet.", rows: 2 },
  { key: "nextAction", label: "Next action", hint: "One concrete step in the next 7 days, with a date.", rows: 2 },
];

function Unlocked({ challenge, progress }: { challenge: SkillChallenge; progress: ChallengeProgress }) {
  const saveImpactCheck = useSkillChallengeStore((state) => state.saveImpactCheck);
  const links = evidenceLinks(challenge, progress);
  const existing = progress.impactCheck;
  const [draft, setDraft] = useState<Omit<ImpactCheck, "recordedAt">>(() => ({
    canDoNow: existing?.canDoNow ?? "",
    skillLearned: existing?.skillLearned ?? challenge.name,
    projectCompleted: existing?.projectCompleted ?? challenge.project.title,
    problemAddressed: existing?.problemAddressed ?? "",
    evidenceUrl: existing?.evidenceUrl ?? links.at(-1)?.url ?? "",
    potentialService: existing?.potentialService ?? challenge.exampleServices[0],
    nextAction: existing?.nextAction ?? "",
  }));
  const [status, setStatus] = useState<"idle" | "saved" | "invalid">("idle");

  const missing = [
    ...CHECK_FIELDS.filter((field) => draft[field.key].trim().length < 10).map((field) => field.label),
    ...(isValidUrl(draft.evidenceUrl) ? [] : ["Evidence or project link"]),
  ];

  const save = () => {
    if (missing.length) return setStatus("invalid");
    setStatus(saveImpactCheck(challenge.id, draft) ? "saved" : "invalid");
  };

  return (
    <div className="space-y-12">
      <section aria-labelledby="ledger-heading" className="grid gap-4 md:grid-cols-3">
        <h2 id="ledger-heading" className="sr-only">What is evidenced and what isn’t</h2>
        <Ledger icon={FileCheck2} tone="blue" title="Completed work" copy={`${links.length} linked ${links.length === 1 ? "piece" : "pieces"} of evidence across 7 completed days.`}>
          <ul className="mt-3 space-y-1 text-xs">{links.map((link) => <li key={link.day}><a href={link.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{dayLabel(link.day)} · {link.title}</a></li>)}</ul>
        </Ledger>
        <Ledger icon={HelpCircle} tone="pink" title="Unverified claims" copy="Anything you write below without a link is your own account. That’s fine — just don’t present it as proven." />
        <Ledger icon={Sparkles} tone="ink" title="Projections" copy="Service ideas, pricing and income are untested assumptions until a real customer pays. ImpactFools never promises income." />
      </section>

      <section aria-labelledby="check-heading">
        <Eyebrow>Record your Impact Check</Eyebrow>
        <h2 id="check-heading" className="mt-2 font-display text-3xl font-semibold">Your proof, in your words</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {CHECK_FIELDS.map((field) => (
            <label key={field.key} className={cn("block", field.key === "canDoNow" && "md:col-span-2")}>
              <span className="block text-sm font-semibold">{field.label}</span>
              <span className="block text-xs text-muted">{field.hint}</span>
              <textarea value={draft[field.key]} rows={field.rows} maxLength={1500} onChange={(event) => { setDraft({ ...draft, [field.key]: event.target.value }); setStatus("idle"); }} className="mt-2 w-full resize-y rounded-2xl border border-ink bg-white p-3 text-sm outline-none focus:shadow-[3px_3px_0_#0964f5]" />
            </label>
          ))}
          <label className="block md:col-span-2">
            <span className="block text-sm font-semibold">Evidence or project link <span className="text-pink">(required)</span></span>
            <span className="block text-xs text-muted">Your best single link — usually the Day 7 case study.</span>
            <input type="url" inputMode="url" value={draft.evidenceUrl} placeholder="https://" onChange={(event) => { setDraft({ ...draft, evidenceUrl: event.target.value }); setStatus("idle"); }} aria-invalid={draft.evidenceUrl.length > 0 && !isValidUrl(draft.evidenceUrl)} className="mt-2 w-full rounded-full border border-ink bg-white px-4 py-3 text-sm outline-none focus:shadow-[3px_3px_0_#0964f5]" />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button type="button" onClick={save} className="im-lift inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0_var(--color-pink)] hover:bg-blue"><Save className="h-4 w-4" />{existing ? "Update Impact Check" : "Save Impact Check"}</button>
          <AnimatePresence mode="wait">
            {status === "saved" && <motion.span key="saved" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue"><CheckCircle2 className="h-4 w-4" />Saved to your workspace and My Impact.</motion.span>}
            {status === "invalid" && <motion.span key="invalid" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-semibold text-pink">Still needed: {missing.join(", ")}.</motion.span>}
          </AnimatePresence>
        </div>
      </section>

      {progress.impactCheck ? <ServiceBuilder challenge={challenge} progress={progress} /> : (
        <section className="rounded-3xl border border-dashed border-ink p-6 text-sm text-muted">
          <p className="font-display text-2xl font-semibold text-ink">Turn your skill into a service</p>
          <p className="mt-2">Save your Impact Check to unlock the service builder — your offer is drafted from the project you actually built.</p>
        </section>
      )}

      <NextSteps challenge={challenge} />
    </div>
  );
}

function Ledger({ icon: Icon, tone, title, copy, children }: { icon: typeof FileCheck2; tone: "blue" | "pink" | "ink"; title: string; copy: string; children?: React.ReactNode }) {
  return (
    <div className={cn("rounded-3xl border border-ink p-5", tone === "blue" ? "bg-blue-dim" : tone === "pink" ? "bg-pink-dim" : "bg-white")}>
      <p className="flex items-center gap-2 font-display text-xl font-semibold"><Icon className="h-5 w-5" />{title}</p>
      <p className="mt-2 text-xs leading-relaxed text-ink/75">{copy}</p>
      {children}
    </div>
  );
}

const SERVICE_QUESTIONS: Array<{ key: keyof ServiceOfferInput; label: string; hint: string }> = [
  { key: "problem", label: "1. What problem can you solve?", hint: "The pain your project removes, in the customer’s words." },
  { key: "who", label: "2. Who experiences that problem?", hint: "A specific type of business or person, e.g. “independent florists handling 20+ enquiries a week”." },
  { key: "service", label: "3. What service could you offer?", hint: "Name it plainly, with a clear scope." },
  { key: "deliverable", label: "4. What deliverable would the customer receive?", hint: "Exactly what they get at the end." },
  { key: "demonstrate", label: "5. How could you demonstrate your ability?", hint: "Your case study, a demo, a free sample for a first client…" },
  { key: "firstStep", label: "6. What is your first step toward finding a customer?", hint: "Small and real: “Message three local florists by Friday offering a free setup.”" },
];

function ServiceBuilder({ challenge, progress }: { challenge: SkillChallenge; progress: ChallengeProgress }) {
  const saveServiceOffer = useSkillChallengeStore((state) => state.saveServiceOffer);
  const existing = progress.serviceOffer;
  const check = progress.impactCheck!;
  const [answers, setAnswers] = useState<ServiceOfferInput>(() => ({
    problem: existing?.problem ?? check.problemAddressed,
    who: existing?.who ?? "",
    service: existing?.service ?? check.potentialService,
    deliverable: existing?.deliverable ?? "",
    demonstrate: existing?.demonstrate ?? `See my case study: ${check.evidenceUrl}`,
    firstStep: existing?.firstStep ?? check.nextAction,
  }));
  const [offerText, setOfferText] = useState(existing?.offerText ?? "");
  const [status, setStatus] = useState<"idle" | "saved" | "copied" | "copy-failed">("idle");

  const generate = () => {
    setOfferText(draftServiceOffer(challenge, answers, check.evidenceUrl));
    setStatus("idle");
  };
  const save = () => {
    saveServiceOffer(challenge.id, { ...answers, offerText });
    setStatus("saved");
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(offerText);
      setStatus("copied");
    } catch {
      setStatus("copy-failed");
    }
  };

  return (
    <section aria-labelledby="service-heading" className="rounded-[2rem] border border-ink bg-blue-dim p-5 shadow-[6px_6px_0_#111] md:p-8">
      <Eyebrow tone="blue">Turn your skill into a service</Eyebrow>
      <h2 id="service-heading" className="mt-2 font-display text-3xl font-semibold md:text-4xl">From project to offer</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink/75">Answer six questions. We’ll draft a simple offer from your real project that you can edit, save and copy. It makes no income promises — pricing and demand are for you to test.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {SERVICE_QUESTIONS.map((question) => (
          <label key={question.key} className="block">
            <span className="block text-sm font-semibold">{question.label}</span>
            <span className="block text-xs text-muted">{question.hint}</span>
            <textarea value={answers[question.key]} rows={2} maxLength={800} onChange={(event) => setAnswers({ ...answers, [question.key]: event.target.value })} className="mt-2 w-full resize-y rounded-2xl border border-ink bg-white p-3 text-sm outline-none focus:shadow-[3px_3px_0_#0964f5]" />
          </label>
        ))}
      </div>
      <button type="button" onClick={generate} className="im-lift mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-blue"><Wand2 className="h-4 w-4" />{offerText ? "Regenerate from answers" : "Generate my service offer"}</button>

      <AnimatePresence>
        {offerText && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <label htmlFor="offer-text" className="text-sm font-semibold">Your service offer <span className="font-normal text-muted">(edit freely)</span></label>
            <textarea id="offer-text" value={offerText} onChange={(event) => { setOfferText(event.target.value); setStatus("idle"); }} rows={14} maxLength={6000} className="mt-2 w-full resize-y rounded-2xl border border-ink bg-white p-4 font-mono text-[13px] leading-relaxed outline-none focus:shadow-[3px_3px_0_#0964f5]" />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" onClick={save} className="im-press inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white"><Save className="h-4 w-4" />Save offer</button>
              <button type="button" onClick={copy} className="im-press inline-flex items-center gap-2 rounded-full border border-ink bg-white px-5 py-2.5 text-sm font-bold"><ClipboardCopy className="h-4 w-4" />Copy</button>
              <span aria-live="polite" className="text-sm font-semibold">
                {status === "saved" && <span className="inline-flex items-center gap-1 text-blue"><Check className="h-4 w-4" />Saved</span>}
                {status === "copied" && <span className="inline-flex items-center gap-1 text-blue"><Check className="h-4 w-4" />Copied to clipboard</span>}
                {status === "copy-failed" && <span className="text-pink">Copy isn’t available here — select the text and copy it manually.</span>}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function NextSteps({ challenge }: { challenge: SkillChallenge }) {
  return (
    <section aria-labelledby="next-heading">
      <Eyebrow>What’s next</Eyebrow>
      <h2 id="next-heading" className="mt-2 font-display text-3xl font-semibold">Keep building capacity</h2>
      <div className="mt-5"><AcademyCourseLinks slugs={challenge.academyCourses} /></div>
      <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
        <Link href="/my-impact" className="im-press rounded-full border border-ink bg-white px-4 py-2 hover:bg-pink-dim">See it on My Impact</Link>
        <Link href="/capacity-guide" className="im-press rounded-full border border-ink bg-white px-4 py-2 hover:bg-pink-dim">Plan 30 days with the Capacity Guide</Link>
        <Link href="/academy/challenge" className="im-press rounded-full border border-ink bg-white px-4 py-2 hover:bg-pink-dim">Try another skill</Link>
      </div>
    </section>
  );
}
