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
      className="brand-card group flex flex-col overflow-hidden rounded-3xl border border-line bg-paper transition-all duration-300 hover:-translate-y-1"
    >
      <div className={cn("relative h-32 w-full overflow-hidden bg-gradient-to-br", course.coverGradient)}>
        <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full border-[18px] border-white/20" />
        <div className="absolute bottom-3 left-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">Course</div>
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
