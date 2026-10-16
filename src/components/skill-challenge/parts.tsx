"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ArrowUpRight, Bookmark, BookmarkCheck, Check, Database, FileText, GraduationCap, Link2, Wrench } from "lucide-react";
import { getCourseBySlug } from "@/lib/data/courses";
import { COURSE_ACCESS_LABELS } from "@/lib/data/constants";
import { getResource } from "@/lib/skill-challenge/resources";
import { isValidUrl, STATUS_LABELS } from "@/lib/skill-challenge/engine";
import type { ChallengeResource, ChallengeStatus, ChecklistItem, Deliverable, LessonBlock } from "@/lib/skill-challenge/types";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, tone = "pink", className }: { children: React.ReactNode; tone?: "pink" | "blue" | "muted"; className?: string }) {
  return <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", tone === "pink" ? "text-pink" : tone === "blue" ? "text-blue" : "text-muted", className)}>{children}</p>;
}

export function dayLabel(day: number) {
  return `Day ${String(day).padStart(2, "0")}`;
}

const STATUS_STYLES: Record<ChallengeStatus, string> = {
  not_started: "border-line bg-paper text-muted",
  in_progress: "border-ink bg-blue-dim text-ink",
  days_complete: "border-ink bg-pink-dim text-ink",
  proof_recorded: "border-ink bg-ink text-white",
};

export function StatusBadge({ status, className }: { status: ChallengeStatus; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]", STATUS_STYLES[status], className)}>{status === "proof_recorded" && <Check className="h-3 w-3" />}{STATUS_LABELS[status]}</span>;
}

export function LessonContent({ lesson }: { lesson: LessonBlock[] }) {
  return (
    <div className="space-y-6">
      {lesson.map((block) => (
        <section key={block.heading}>
          <h3 className="font-display text-2xl font-semibold leading-tight text-ink">{block.heading}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{block.body}</p>
        </section>
      ))}
    </div>
  );
}

export function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={step} className="flex gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink bg-blue-dim text-xs font-bold">{index + 1}</span>
          <span className="text-sm leading-relaxed text-ink/85">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function ExerciseCard({ title, brief }: { title: string; brief: string }) {
  return (
    <div className="editorial-grid rounded-3xl border border-ink bg-pink-dim p-5 md:p-6">
      <Eyebrow>Exercise</Eyebrow>
      <h3 className="mt-2 font-display text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">{brief}</p>
    </div>
  );
}

const KIND_ICON = { docs: FileText, course: GraduationCap, tool: Wrench, guide: FileText, dataset: Database } as const;

export function ResourceList({ ids, saved = [], onToggleSave }: { ids: string[]; saved?: string[]; onToggleSave?: (id: string) => void }) {
  const resources = ids.map(getResource).filter((resource): resource is ChallengeResource => Boolean(resource));
  if (!resources.length) return <p className="text-sm text-muted">No extra resources for this day — everything you need is above.</p>;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {resources.map((resource) => {
        const Icon = KIND_ICON[resource.kind];
        const isSaved = saved.includes(resource.id);
        const external = resource.url.startsWith("http");
        return (
          <li key={resource.id} className="group relative flex flex-col rounded-2xl border border-ink bg-white p-4 transition-shadow hover:shadow-[4px_4px_0_#111]">
            <div className="flex items-start justify-between gap-3">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-blue"><Icon className="h-3.5 w-3.5" />{resource.kind === "dataset" ? "Sample data" : resource.kind}</span>
              {onToggleSave && (
                <button type="button" onClick={() => onToggleSave(resource.id)} aria-pressed={isSaved} aria-label={isSaved ? `Remove ${resource.title} from saved resources` : `Save ${resource.title}`} className="im-press -m-1 rounded-full p-1.5 text-ink hover:bg-blue-dim">
                  {isSaved ? <BookmarkCheck className="h-4 w-4 text-pink" /> : <Bookmark className="h-4 w-4" />}
                </button>
              )}
            </div>
            <a href={resource.url} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} download={resource.kind === "dataset" ? "" : undefined} className="mt-2 inline-flex items-center gap-1 font-semibold text-ink underline-offset-4 hover:underline">
              {resource.title}{external ? <ArrowUpRight className="h-3.5 w-3.5" /> : null}
            </a>
            <p className="text-[11px] font-semibold text-muted">{resource.provider}</p>
            <p className="mt-2 text-xs leading-relaxed text-ink/70">{resource.note}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function AcademyCourseLinks({ slugs, compact = false }: { slugs: string[]; compact?: boolean }) {
  const courses = slugs.map(getCourseBySlug).filter((course) => Boolean(course));
  if (!courses.length) return null;
  return (
    <ul className={cn("grid gap-3", !compact && "sm:grid-cols-2 lg:grid-cols-3")}>
      {courses.map((course) => course && (
        <li key={course.slug}>
          <Link href={`/academy/${course.slug}`} className="im-lift group flex h-full items-center gap-3 rounded-2xl border border-ink bg-white p-4 hover:shadow-[4px_4px_0_#0964f5]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink bg-blue-dim"><GraduationCap className="h-4 w-4" /></span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-semibold leading-tight">{course.title}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{COURSE_ACCESS_LABELS[course.access]} · ImpactFools Academy</span>
            </span>
            <ArrowRight className="im-nudge h-4 w-4 shrink-0" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ChecklistPanel({ items, checked, onToggle, disabled }: { items: ChecklistItem[]; checked: string[]; onToggle: (id: string) => void; disabled?: boolean }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const done = checked.includes(item.id);
        return (
          <li key={item.id}>
            <label className={cn("flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors", done ? "border-ink bg-blue-dim" : "border-line bg-white hover:border-ink", disabled && "cursor-not-allowed opacity-60")}>
              <input type="checkbox" className="peer sr-only" checked={done} disabled={disabled} onChange={() => onToggle(item.id)} />
              <span aria-hidden="true" className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-ink transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue", done ? "bg-ink text-white" : "bg-white")}>{done && <Check className="h-3.5 w-3.5" />}</span>
              {item.label}
            </label>
          </li>
        );
      })}
    </ul>
  );
}

export function DeliverableForm({ deliverable, response, evidenceUrl, onChange, disabled, idPrefix }: {
  deliverable: Deliverable;
  response: string;
  evidenceUrl: string;
  onChange: (patch: { response?: string; evidenceUrl?: string }) => void;
  disabled?: boolean;
  idPrefix: string;
}) {
  const length = response.trim().length;
  const linkInvalid = evidenceUrl.trim().length > 0 && !isValidUrl(evidenceUrl);
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${idPrefix}-response`} className="block text-sm font-semibold text-ink">{deliverable.prompt}</label>
        <textarea
          id={`${idPrefix}-response`}
          value={response}
          disabled={disabled}
          onChange={(event) => onChange({ response: event.target.value })}
          rows={7}
          maxLength={5000}
          placeholder={deliverable.placeholder}
          className="mt-2 w-full resize-y rounded-2xl border border-ink bg-white p-4 text-sm leading-relaxed outline-none transition-shadow focus:shadow-[4px_4px_0_#0964f5] disabled:opacity-60"
        />
        <p className={cn("mt-1 text-xs", length >= deliverable.minLength ? "text-blue" : "text-muted")}>{length}/{deliverable.minLength} characters minimum{length >= deliverable.minLength ? " ✓" : ""}</p>
      </div>
      {deliverable.evidence !== "none" && (
        <div>
          <label htmlFor={`${idPrefix}-evidence`} className="flex items-center gap-2 text-sm font-semibold text-ink"><Link2 className="h-4 w-4" />Project link {deliverable.evidence === "required" ? <span className="text-pink">(required)</span> : <span className="text-muted">(optional)</span>}</label>
          {deliverable.evidenceHint && <p id={`${idPrefix}-evidence-hint`} className="mt-1 text-xs text-muted">{deliverable.evidenceHint}</p>}
          <input
            id={`${idPrefix}-evidence`}
            type="url"
            inputMode="url"
            value={evidenceUrl}
            disabled={disabled}
            onChange={(event) => onChange({ evidenceUrl: event.target.value })}
            placeholder="https://"
            aria-invalid={linkInvalid}
            aria-describedby={deliverable.evidenceHint ? `${idPrefix}-evidence-hint` : undefined}
            className={cn("mt-2 w-full rounded-full border bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_#0964f5] disabled:opacity-60", linkInvalid ? "border-pink" : "border-ink")}
          />
          {linkInvalid && <p className="mt-1 text-xs font-semibold text-pink">Links must start with https:// (or http://).</p>}
          <p className="mt-1 text-[11px] text-muted">Share links with view access (Google Drive, Loom, Canva, your live site). Files themselves stay with you — ImpactFools stores the link.</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Loading / storage states ---------- */

export function ChallengeSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-10 md:px-6" aria-busy="true" aria-label="Loading your challenge">
      <div className="h-3 w-40 rounded-full bg-ink/10" />
      <div className="mt-4 h-12 w-3/4 rounded-2xl bg-ink/10" />
      <div className="mt-8 grid gap-4 md:grid-cols-3"><div className="h-40 rounded-3xl bg-ink/10" /><div className="h-40 rounded-3xl bg-ink/10" /><div className="h-40 rounded-3xl bg-ink/10" /></div>
    </div>
  );
}

function storageAvailable() {
  try {
    const key = "__impactfools_storage_test__";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

const noopSubscribe = () => () => {};

/** Warns when the browser blocks local storage (e.g. some private modes), since progress could not be kept. */
export function StorageNotice() {
  const available = useSyncExternalStore(noopSubscribe, storageAvailable, () => true);
  if (available) return null;
  return (
    <div role="alert" className="mb-6 flex items-start gap-3 rounded-2xl border border-pink bg-pink-dim p-4 text-sm">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-pink" />
      <p><strong>Your progress can’t be saved in this browser.</strong> Storage is blocked (often in private browsing). You can still read every lesson, but your answers will be lost when you leave.</p>
    </div>
  );
}

export const PROGRESS_STORAGE_NOTE = "Progress is saved in this browser on this device. ImpactFools accounts aren’t available yet, so progress doesn’t sync between devices.";
