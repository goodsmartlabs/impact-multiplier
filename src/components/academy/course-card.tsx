"use client";

import Link from "next/link";
import type { Course } from "@/lib/types";
import { useAcademyStore } from "@/lib/store/academy-store";
import { computeProgressPercent } from "@/lib/academy";
import { useHydrated } from "@/lib/use-hydrated";
import { ProgressBar } from "./progress-bar";
import { cn } from "@/lib/utils";

export function CourseCard({ course }: { course: Course }) {
  const mounted = useHydrated();
  const enrollment = useAcademyStore((s) => s.getEnrollment(course.slug));

  const percent = mounted ? computeProgressPercent(course, enrollment) : 0;
  const isEnrolled = mounted && !!enrollment;

  return (
    <Link
      href={`/academy/${course.slug}`}
      className="brand-card group flex flex-col overflow-hidden rounded-2xl border border-ink bg-paper transition-all duration-300"
    >
      <div className={cn("relative h-40 w-full overflow-hidden bg-gradient-to-br", course.coverGradient)}>
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border-[22px] border-white/35" />
        <div className="absolute -left-8 bottom-5 h-5 w-[120%] -rotate-6 rounded-full bg-white/55 transition-transform duration-500 group-hover:-rotate-3" />
        <div className="absolute bottom-4 left-5 rounded-full border border-ink bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-ink">Impact Academia Course</div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
          <span>{course.origin === "external" ? "External" : "Academy"}</span>
          <span>•</span>
          <span className="capitalize">{course.level}</span>
        </div>
        <h3 className="font-display text-lg font-medium leading-snug text-ink">{course.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{course.shortDescription}</p>

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
              <span>{course.price ?? (course.access === "free" ? "Free" : "Paid")}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
