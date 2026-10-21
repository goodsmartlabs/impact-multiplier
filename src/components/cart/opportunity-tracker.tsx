"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarClock, FlaskConical, GraduationCap, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { getCourseBySlug } from "@/lib/data/courses";
import { getCategory, isPulseCategory } from "@/lib/pulse/categories";
import { formatDate, lifecycle } from "@/lib/pulse/feed";
import { StartImpactMoveButton } from "@/components/discovery/start-impact-move-button";
import type { ImpactCartEntry, OpportunityTrackStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const TRACK_STATUSES: Array<{ id: OpportunityTrackStatus; label: string; stage: string }> = [
  { id: "saved", label: "Saved", stage: "Save" },
  { id: "exploring", label: "Exploring", stage: "Explore" },
  { id: "preparing", label: "Preparing", stage: "Plan" },
  { id: "applied", label: "Applied", stage: "Act" },
  { id: "interviewing", label: "Interviewing", stage: "Act" },
  { id: "completed", label: "Completed", stage: "Track" },
  { id: "closed", label: "Closed", stage: "Track" },
];

const STAGES = ["Save", "Explore", "Plan", "Act", "Track"] as const;

/** SAVE → EXPLORE → PLAN → ACT → TRACK for opportunities saved from Impact Pulse. */
export function OpportunityTracker({ entries }: { entries: ImpactCartEntry[] }) {
  const [filter, setFilter] = useState<OpportunityTrackStatus | "all">("all");
  const counts = Object.fromEntries(TRACK_STATUSES.map((status) => [status.id, entries.filter((entry) => (entry.status ?? "saved") === status.id).length]));
  const visible = filter === "all" ? entries : entries.filter((entry) => (entry.status ?? "saved") === filter);

  return (
    <section aria-labelledby="tracker-heading" className="mb-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">From Impact Pulse</p>
          <h2 id="tracker-heading" className="mt-1 font-display text-3xl font-semibold">Opportunity tracker</h2>
          <p className="mt-1 text-sm text-muted">Save → Explore → Plan → Act → Track. Move each opportunity forward as you work on it.</p>
        </div>
      </div>
      <div className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="toolbar" aria-label="Filter by status">
        <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")} className={cn("im-press shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold", filter === "all" ? "border-ink bg-ink text-white" : "border-ink/25 hover:border-ink")}>All {entries.length}</button>
        {TRACK_STATUSES.map((status) => (
          <button key={status.id} type="button" aria-pressed={filter === status.id} onClick={() => setFilter(status.id)} className={cn("im-press shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold", filter === status.id ? "border-ink bg-ink text-white" : "border-ink/25 hover:border-ink")}>{status.label} {counts[status.id]}</button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="mt-5 rounded-3xl border border-dashed border-ink p-6 text-center text-sm text-muted">Nothing with this status.</p>
      ) : (
        <ul className="mt-5 grid gap-4 lg:grid-cols-2">{visible.map((entry) => <li key={entry.itemId}><TrackerCard entry={entry} /></li>)}</ul>
      )}
    </section>
  );
}

function TrackerCard({ entry }: { entry: ImpactCartEntry }) {
  const snapshot = entry.pulse!;
  const setStatus = useCartStore((state) => state.setStatus);
  const updateNote = useCartStore((state) => state.updateNote);
  const remove = useCartStore((state) => state.remove);
  const [note, setNote] = useState(entry.note ?? "");
  const status = entry.status ?? "saved";
  const stage = TRACK_STATUSES.find((item) => item.id === status)!.stage;
  const stageIndex = STAGES.indexOf(stage as (typeof STAGES)[number]);
  const state = snapshot.deadline ? lifecycle({ deadline: snapshot.deadline }) : "no_deadline";
  const courses = snapshot.relatedCourseSlugs.map(getCourseBySlug).filter(Boolean);
  const categoryLabel = isPulseCategory(snapshot.category) ? getCategory(snapshot.category).label : snapshot.category;
  const statusId = `status-${entry.itemId}`;
  const noteId = `note-${entry.itemId}`;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-ink bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{categoryLabel}{snapshot.verification === "demo" && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-ink/5 px-1.5"><FlaskConical className="h-3 w-3" />Demo</span>}</p>
          <h3 className="mt-1 font-display text-xl font-semibold leading-tight"><Link href={`/pulse/${snapshot.slug}`} className="hover:underline">{snapshot.title}</Link></h3>
        </div>
        <button type="button" onClick={() => remove(entry.itemId)} aria-label={`Remove ${snapshot.title}`} className="shrink-0 rounded-full p-2 text-muted hover:bg-ink/5 hover:text-ink"><Trash2 className="h-4 w-4" /></button>
      </div>

      <ol aria-label="Progress" className="mt-4 grid grid-cols-5 gap-1">
        {STAGES.map((label, index) => (
          <li key={label} className="text-center">
            <span className={cn("block h-1.5 rounded-full", index <= stageIndex ? (status === "closed" ? "bg-ink/40" : "bg-pink") : "bg-ink/10")} />
            <span className={cn("mt-1 block text-[9px] font-bold uppercase tracking-[0.1em]", index === stageIndex ? "text-ink" : "text-muted")}>{label}</span>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-sm text-ink/80">{snapshot.summary}</p>
      <p className="mt-2 text-sm"><strong className="text-pink">Next: </strong>{snapshot.next}</p>

      <dl className="mt-4 grid gap-2 text-xs">
        {snapshot.deadline && (
          <div className="flex items-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5" />
            <dt className="sr-only">Deadline</dt>
            <dd className={cn("font-semibold", state === "closed" && "text-pink")}>{state === "closed" ? `Closed ${formatDate(snapshot.deadline)}` : `Deadline ${formatDate(snapshot.deadline)}${snapshot.verification !== "verified" ? " (confirm with source)" : ""}`}</dd>
          </div>
        )}
        {snapshot.skills.length > 0 && <div><dt className="sr-only">Relevant skills</dt><dd className="flex flex-wrap gap-1">{snapshot.skills.map((skill) => <span key={skill} className="rounded-full border border-line px-2 py-0.5 font-semibold">{skill}</span>)}</dd></div>}
        <div>
          <dt className="sr-only">Source</dt>
          <dd>{snapshot.sourceUrl ? <a href={snapshot.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold underline underline-offset-2">Source / apply: {snapshot.sourceName}<ArrowUpRight className="h-3 w-3" /></a> : <span className="text-muted">Source: {snapshot.sourceName}</span>}</dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label htmlFor={statusId} className="block text-xs font-semibold">
          Status
          <select id={statusId} value={status} onChange={(event) => setStatus(entry.itemId, event.target.value as OpportunityTrackStatus)} className="mt-1 w-full rounded-full border border-ink bg-white px-3 py-2 text-sm font-semibold">
            {TRACK_STATUSES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <div className="text-xs text-muted sm:pt-6">{entry.statusUpdatedAt ? `Updated ${formatDate(entry.statusUpdatedAt)}` : `Saved ${formatDate(entry.savedAt)}`}</div>
      </div>

      <label htmlFor={noteId} className="mt-3 block text-xs font-semibold">Notes</label>
      <textarea id={noteId} value={note} onChange={(event) => setNote(event.target.value)} onBlur={() => updateNote(entry.itemId, note.trim())} rows={2} placeholder="Requirements, contacts, what to prepare…" className="mt-1 w-full resize-y rounded-2xl border border-line p-3 text-sm outline-none focus:border-ink" />

      {courses.length > 0 && (
        <div className="mt-3">
          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue"><GraduationCap className="h-3.5 w-3.5" />Related learning</p>
          <ul className="mt-1 flex flex-wrap gap-1.5">{courses.map((course) => course && <li key={course.slug}><Link href={`/academy/${course.slug}`} className="inline-block rounded-full bg-blue-dim px-2.5 py-1 text-xs font-semibold hover:underline">{course.title}</Link></li>)}</ul>
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <Link href={snapshot.cta.href} className="im-press rounded-full bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-blue">{snapshot.cta.label}</Link>
        <StartImpactMoveButton title={snapshot.title} label="Plan as Impact Move" className="border border-ink bg-transparent px-3.5 py-2 text-xs text-ink" />
      </div>
    </article>
  );
}
