"use client";

import Link from "next/link";
import type { Course } from "@/lib/types";
import { useAcademyStore } from "@/lib/store/academy-store";
import { computeProgressPercent } from "@/lib/academy";
import { useHydrated } from "@/lib/use-hydrated";
import { ProgressBar } from "./progress-bar";
import { COURSE_ACCESS_LABELS } from "@/lib/data/constants";
import { Calculator, ChartNoAxesCombined, DatabaseZap, Landmark, ScanLine, ShieldCheck, type LucideIcon } from "lucide-react";

const FINANCE_COVER_ART: Record<string, { icon: LucideIcon; label: string; accent: string }> = {
  "financial-flow": { icon: ChartNoAxesCombined, label: "Source → Current → Delta", accent: "bg-pink" },
  "ai-for-financial-clarity": { icon: ScanLine, label: "Patterns → Questions → Decisions", accent: "bg-blue" },
  "ai-for-accountants": { icon: Calculator, label: "Accounting work, strengthened", accent: "bg-pink" },
  "ai-accounting-judgment-assurance": { icon: ShieldCheck, label: "Evidence → Judgment → Assurance", accent: "bg-blue" },
  "the-wealth-lab": { icon: Landmark, label: "Inspect → Design → Protect", accent: "bg-pink" },
  "ai-tools-for-finance": { icon: DatabaseZap, label: "Tools for practical finance work", accent: "bg-blue" },
};

export function CourseCard({ course }: { course: Course }) {
  const mounted = useHydrated();
  const enrollment = useAcademyStore((s) => s.getEnrollment(course.slug));

  const percent = mounted ? computeProgressPercent(course, enrollment) : 0;
  const isEnrolled = mounted && !!enrollment;
  const editorialArt = FINANCE_COVER_ART[course.slug];
  const CoverIcon = editorialArt?.icon;
  const hasLongTitle = course.title.length > 28;

  return (
    <Link
      href={`/academy/${course.slug}`}
      className="brand-card group flex h-full flex-col overflow-hidden rounded-2xl border border-ink bg-paper transition-all duration-300"
    >
      <div
        className="relative h-64 w-full overflow-hidden bg-ink bg-cover bg-center"
        style={course.coverImage
          ? { backgroundImage: `linear-gradient(0deg, rgba(7, 8, 14, 0.9), rgba(7, 8, 14, 0.12)), url(${course.coverImage})` }
          : { backgroundImage: "linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      >
        {!course.coverImage && !editorialArt && <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[20px] border-pink/80" />}
        {!course.coverImage && !editorialArt && <div className="absolute bottom-0 left-0 h-2 w-3/5 bg-blue" />}
        {!course.coverImage && editorialArt && <>
          <div className="absolute inset-x-0 top-[4.5rem] h-px bg-white/15" />
          <div className="absolute right-5 top-[4.75rem] grid h-24 w-24 place-items-center rounded-full border border-white/20 bg-white/5 sm:h-28 sm:w-28"><CoverIcon className="h-12 w-12 text-white/75 sm:h-14 sm:w-14" strokeWidth={1.25} /></div>
          <div className={`absolute bottom-0 left-0 h-2 w-3/5 ${editorialArt.accent}`} />
          <p className="absolute left-5 top-[5.25rem] max-w-[45%] text-[9px] font-bold uppercase leading-relaxed tracking-[0.17em] text-white/55">{editorialArt.label}</p>
        </>}
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <span className="rounded-full border border-white/70 bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-ink">{course.category}</span>
          <span className="rounded-full border border-white/70 bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-ink">{COURSE_ACCESS_LABELS[course.access]}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink via-ink/90 to-transparent px-5 pb-5 pt-12">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/75">{course.origin === "external" ? "External" : "ImpactFools Academia"}</p>
          <h3 className={`font-display font-semibold tracking-[-0.035em] text-white ${hasLongTitle ? "text-[2rem] leading-[0.86] sm:text-[2.15rem]" : "text-[2.25rem] leading-[0.84] sm:text-[2.45rem]"}`}>{course.title}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
          <span>{course.origin === "external" ? "External recommendation" : "Academy original"}</span>
          <span>•</span>
          <span className="capitalize">{course.level}</span>
        </div>
        <p className="line-clamp-3 min-h-[3.75rem] text-sm leading-relaxed text-muted">{course.shortDescription}</p>

        <div className="mt-auto pt-4">
          {isEnrolled && enrollment?.completed ? (
            <span className="text-xs font-semibold text-blue">Completed</span>
          ) : isEnrolled ? (
            <div>
              <ProgressBar value={percent} />
              <p className="mt-1.5 text-xs text-muted">{percent}% complete</p>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs font-medium text-muted">
              <span>{course.durationLabel}</span>
              <span>{course.price ?? COURSE_ACCESS_LABELS[course.access]}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
