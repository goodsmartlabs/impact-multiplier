"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarClock, FlaskConical, MapPin, ShieldQuestion } from "lucide-react";
import { getCategory } from "@/lib/pulse/categories";
import { deadlineLabel, formatDate, lifecycle } from "@/lib/pulse/feed";
import { trackPulse } from "@/lib/pulse/track";
import type { PulseUpdate } from "@/lib/pulse/types";
import { cn } from "@/lib/utils";
import { ImpactSignalToggle } from "./impact-signal";
import { PulseSaveButton } from "./pulse-save-button";

const TONE = {
  pink: { chip: "bg-pink-dim text-ink", bar: "bg-pink", shadow: "hover:shadow-[6px_6px_0_var(--color-pink)]" },
  blue: { chip: "bg-blue-dim text-ink", bar: "bg-blue", shadow: "hover:shadow-[6px_6px_0_var(--color-blue)]" },
  ink: { chip: "bg-ink text-white", bar: "bg-ink", shadow: "hover:shadow-[6px_6px_0_var(--color-ink)]" },
} as const;

export function CategoryChip({ update, dark = false }: { update: Pick<PulseUpdate, "category">; dark?: boolean }) {
  const category = getCategory(update.category);
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]", dark ? "border-white/40 text-white" : cn("border-ink", TONE[category.tone].chip))}>
      <span aria-hidden="true">{category.emoji}</span>{category.label}
    </span>
  );
}

export function VerificationBadge({ update, dark = false }: { update: Pick<PulseUpdate, "verification" | "lastVerifiedAt">; dark?: boolean }) {
  if (update.verification === "verified") {
    return <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em]", dark ? "text-blue-dim" : "text-blue")}><BadgeCheck className="h-3.5 w-3.5" />Verified{update.lastVerifiedAt ? ` ${formatDate(update.lastVerifiedAt)}` : ""}</span>;
  }
  if (update.verification === "demo") {
    return <span title="Demonstration content shipped with ImpactFools — not news and not a live opportunity." className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]", dark ? "bg-white/15 text-white" : "bg-ink/5 text-muted")}><FlaskConical className="h-3 w-3" />Demo</span>;
  }
  return <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em]", dark ? "text-white/70" : "text-muted")}><ShieldQuestion className="h-3.5 w-3.5" />Not yet verified</span>;
}

export function SourceLink({ update, dark = false }: { update: PulseUpdate; dark?: boolean }) {
  const base = cn("inline-flex items-center gap-1 text-xs font-semibold underline-offset-4 hover:underline", dark ? "text-white/80" : "text-muted hover:text-ink");
  if (update.sourceUrl) {
    return (
      <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackPulse(update.id, "source_click")} className={base}>
        Source: {update.sourceName}<ArrowUpRight className="h-3 w-3" />
      </a>
    );
  }
  return <Link href="/pulse/standards" className={base}>Source: {update.sourceName}</Link>;
}

function DateLine({ update, dark }: { update: PulseUpdate; dark?: boolean }) {
  const deadline = deadlineLabel(update);
  const state = lifecycle(update);
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold", dark ? "text-white/70" : "text-muted")}>
      <time dateTime={update.publishedAt}>Published {formatDate(update.publishedAt)}</time>
      {deadline && <span className={cn("inline-flex items-center gap-1", state === "closing_soon" && update.verification === "verified" && "text-pink")}><CalendarClock className="h-3.5 w-3.5" />{deadline}</span>}
      {(update.job?.location || update.location) && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{update.job?.location ?? update.location}{update.job?.remote ? ` · ${update.job.remote}` : ""}</span>}
    </p>
  );
}

export function PulseCta({ update, className, dark = false }: { update: PulseUpdate; className?: string; dark?: boolean }) {
  const external = update.cta.href.startsWith("http");
  const classes = cn("im-lift group inline-flex min-h-9 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold", dark ? "bg-white text-ink" : "bg-ink text-white hover:bg-blue", className);
  const content = <>{update.cta.label}{external ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowRight className="im-nudge h-3.5 w-3.5" />}</>;
  return external
    ? <a href={update.cta.href} target="_blank" rel="noopener noreferrer" onClick={() => trackPulse(update.id, "cta_click")} className={classes}>{content}</a>
    : <Link href={update.cta.href} onClick={() => trackPulse(update.id, "cta_click")} className={classes}>{content}</Link>;
}

function Facts({ update, dark }: { update: PulseUpdate; dark?: boolean }) {
  const label = cn("text-[10px] font-bold uppercase tracking-[0.14em]", dark ? "text-blue-dim" : "text-blue");
  const body = cn("mt-0.5 text-sm leading-snug", dark ? "text-white/85" : "text-ink/80");
  return (
    <dl className="grid gap-3">
      <div><dt className={label}>Why it matters</dt><dd className={body}>{update.signal.why}</dd></div>
      <div><dt className={label}>Who benefits</dt><dd className={body}>{update.signal.who}</dd></div>
      <div><dt className={cn(label, dark ? "text-pink-dim" : "text-pink")}>Recommended action</dt><dd className={cn(body, "font-semibold")}>{update.signal.next}</dd></div>
    </dl>
  );
}

/** Card sizes create the editorial rhythm: one feature, standard stories, compact updates. */
export function PulseCard({ update, size = update.size, priority = false }: { update: PulseUpdate; size?: PulseUpdate["size"]; priority?: boolean }) {
  const category = getCategory(update.category);
  const tone = TONE[category.tone];
  const href = `/pulse/${update.slug}`;
  const HeadingTag = priority ? "h2" : "h3";

  if (size === "feature") {
    return (
      <article className={cn("im-float group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-ink bg-ink p-6 text-white md:p-8", "hover:shadow-[8px_8px_0_var(--color-pink)]")}>
        <div aria-hidden="true" className="editorial-grid pointer-events-none absolute inset-0 opacity-[0.12] invert" />
        <div className="relative flex flex-wrap items-center gap-3"><CategoryChip update={update} dark /><VerificationBadge update={update} dark /></div>
        <HeadingTag className="relative mt-5 font-display text-3xl font-semibold leading-[1.02] md:text-5xl">
          <Link href={href} className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline">{update.title}</Link>
        </HeadingTag>
        <p className="relative mt-4 max-w-2xl text-base leading-relaxed text-white/80">{update.summary}</p>
        <div className="relative mt-6 grid gap-5 md:grid-cols-[1.2fr_1fr]">
          <Facts update={update} dark />
          <div className="relative z-10 self-start"><ImpactSignalToggle signal={update.signal} dark /></div>
        </div>
        <div className="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <div className="space-y-1"><DateLine update={update} dark /><SourceLink update={update} dark /></div>
          <div className="flex flex-wrap items-center gap-2"><PulseSaveButton update={update} tone="dark" /><PulseCta update={update} dark /></div>
        </div>
      </article>
    );
  }

  if (size === "compact") {
    return (
      <article className={cn("im-float group relative flex h-full flex-col rounded-3xl border border-ink bg-white p-5", tone.shadow)}>
        <span aria-hidden="true" className={cn("absolute left-5 top-0 h-1.5 w-12 rounded-b-full", tone.bar)} />
        <div className="flex flex-wrap items-center justify-between gap-2"><CategoryChip update={update} /><VerificationBadge update={update} /></div>
        <HeadingTag className="mt-3 font-display text-xl font-semibold leading-tight">
          <Link href={href} className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline">{update.title}</Link>
        </HeadingTag>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">{update.summary}</p>
        <p className="mt-3 text-sm"><span className="font-bold text-pink">Why it matters: </span><span className="text-ink/80">{update.signal.why}</span></p>
        <p className="mt-1 text-sm"><span className="font-bold text-blue">Who benefits: </span><span className="text-ink/80">{update.signal.who}</span></p>
        <p className="mt-1 text-sm font-semibold"><span className="font-bold text-pink">Do next: </span>{update.signal.next}</p>
        <div className="relative z-10 mt-4"><ImpactSignalToggle signal={update.signal} /></div>
        <div className="relative z-10 mt-auto space-y-3 pt-4">
          <div className="space-y-1"><DateLine update={update} /><SourceLink update={update} /></div>
          <div className="flex flex-wrap items-center gap-2"><PulseSaveButton update={update} /><PulseCta update={update} /></div>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("im-float group relative flex h-full flex-col rounded-3xl border border-ink bg-white p-5 md:p-6", tone.shadow)}>
      <div className={cn("-mx-5 -mt-5 mb-5 rounded-t-3xl border-b border-ink px-5 py-3 md:-mx-6 md:-mt-6 md:px-6", category.tone === "ink" ? "bg-ink" : category.tone === "pink" ? "bg-pink-dim" : "bg-blue-dim")}>
        <div className="flex flex-wrap items-center justify-between gap-2"><CategoryChip update={update} dark={category.tone === "ink"} /><VerificationBadge update={update} dark={category.tone === "ink"} /></div>
      </div>
      {update.job?.company && <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{update.job.company}{update.job.employmentType ? ` · ${update.job.employmentType}` : ""}</p>}
      <HeadingTag className="mt-1 font-display text-2xl font-semibold leading-[1.08]">
        <Link href={href} className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline">{update.title}</Link>
      </HeadingTag>
      <p className="mt-3 text-sm leading-relaxed text-ink/75">{update.summary}</p>
      <div className="mt-4"><Facts update={update} /></div>
      {update.skills.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Relevant skills">
          {update.skills.slice(0, 4).map((skill) => <li key={skill} className="rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold">{skill}</li>)}
        </ul>
      )}
      <div className="relative z-10 mt-4"><ImpactSignalToggle signal={update.signal} /></div>
      <div className="relative z-10 mt-auto space-y-3 pt-5">
        <div className="space-y-1"><DateLine update={update} /><SourceLink update={update} /></div>
        <div className="flex flex-wrap items-center gap-2"><PulseSaveButton update={update} /><PulseCta update={update} /></div>
      </div>
    </article>
  );
}
