import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LearningPath } from "@/lib/data/learning-paths";
import { coursesForPath } from "@/lib/data/learning-paths";
import { COURSE_ACCESS_LABELS } from "@/lib/data/constants";
import { cn } from "@/lib/utils";

export function LearningPathCard({ path, currentSlug }: { path: LearningPath; currentSlug?: string }) {
  const courses = coursesForPath(path);
  return (
    <article className="rounded-3xl border border-ink bg-white p-5 shadow-[5px_5px_0_#111318]">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-pink">Learning path</p>
      <h3 className="mt-1 font-display text-2xl font-semibold text-ink">{path.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{path.description}</p>
      <ol className="mt-5 space-y-2">
        {courses.map((course, index) => {
          const current = course.slug === currentSlug;
          return (
            <li key={course.slug}>
              <Link href={`/academy/${course.slug}`} className={cn("flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-colors hover:border-blue", current ? "border-pink bg-pink-dim" : "border-line bg-paper")}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{index + 1}</span>
                <span className="min-w-0 flex-1">
                  {current && <span className="block text-[9px] font-bold uppercase tracking-wider text-pink">You are here</span>}
                  <span className="block text-sm font-semibold text-ink">{course.title}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">{COURSE_ACCESS_LABELS[course.access]}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
              </Link>
            </li>
          );
        })}
      </ol>
      {path.specializationSlugs && <p className="mt-4 text-xs text-muted">Then choose a specialization in Finance, Marketing, Business, or Design &amp; Content Creation.</p>}
    </article>
  );
}
