"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { getCourseBySlug } from "@/lib/data/courses";
import { totalLessons } from "@/lib/data/courses";
import { useAcademyStore } from "@/lib/store/academy-store";
import { computeProgressPercent } from "@/lib/academy";
import { useHydrated } from "@/lib/use-hydrated";
import { ProgressBar } from "@/components/academy/progress-bar";
import { DetailSection } from "@/components/ui/detail-section";
import { IncreaseTags } from "@/components/ui/increase-tags";
import { SaveButton } from "@/components/ui/save-button";
import { StartImpactMoveButton } from "@/components/discovery/start-impact-move-button";
import { cn } from "@/lib/utils";

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const course = getCourseBySlug(slug);
  const mounted = useHydrated();
  const enroll = useAcademyStore((s) => s.enroll);
  const isEnrolled = useAcademyStore((s) => s.isEnrolled(slug));
  const enrollment = useAcademyStore((s) => s.getEnrollment(slug));

  if (!course) notFound();

  const total = totalLessons(course);
  const percent = mounted ? computeProgressPercent(course, enrollment) : 0;
  const firstLesson = course.modules[0]?.lessons[0];
  const isExternal = course.origin === "external";

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 md:px-6 md:pt-10">
      <Link
        href="/academy"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Academy
      </Link>

      <div className={cn("mb-6 h-36 w-full rounded-3xl bg-gradient-to-br", course.coverGradient)} />

      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
        <span>{isExternal ? "External Course" : "Impact Multiplier Academy"}</span>
        <span>•</span>
        <span className="capitalize">{course.level}</span>
      </div>
      <h1 className="font-display text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl">
        {course.title}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted">{course.shortDescription}</p>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
        <span>{course.instructor}</span>
        <span>•</span>
        <span>{course.durationLabel}</span>
        <span>•</span>
        <span>{course.price ?? (course.access === "free" ? "Free" : "Paid")}</span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {isExternal ? (
          <a
            href={course.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:opacity-90"
          >
            Visit Course <ExternalLink className="h-4 w-4" />
          </a>
        ) : isEnrolled ? (
          <Link
            href={
              firstLesson
                ? `/academy/${course.slug}/learn/${firstLesson.slug}`
                : `/academy/${course.slug}`
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:opacity-90"
          >
            {percent > 0 ? "Continue Course" : "Start Course"}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => enroll(course.slug)}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:opacity-90"
          >
            Enroll
          </button>
        )}
        <SaveButton itemId={course.id} itemKind="course" size="md" />
      </div>

      {isEnrolled && total > 0 && (
        <div className="mt-4 max-w-xs">
          <ProgressBar value={percent} />
          <p className="mt-1.5 text-xs text-muted">{percent}% complete</p>
        </div>
      )}

      {course.increaseAreas.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            What this builds
          </p>
          <IncreaseTags areas={course.increaseAreas} />
        </div>
      )}

      <div className="mt-6">
        <DetailSection title="What This Course Builds">
          <p>{course.builds}</p>
        </DetailSection>

        <DetailSection title="Who It's For">
          <p>{course.whoItsFor}</p>
        </DetailSection>

        <DetailSection title="What You'll Be Able to Do">
          <ul className="list-inside list-disc space-y-1">
            {course.whatYoullBeAbleToDo.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </DetailSection>

        {course.requirements && course.requirements.length > 0 && (
          <DetailSection title="Requirements">
            <ul className="list-inside list-disc space-y-1">
              {course.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </DetailSection>
        )}

        {isExternal && (
          <DetailSection title="Why We Recommend This">
            <p>{course.whyWeRecommend}</p>
            <p className="mt-3 text-xs text-muted">
              Provided by {course.externalProvider}. Impact Multiplier does not teach this course
              directly — it links to the official provider.
            </p>
          </DetailSection>
        )}

        {course.modules.length > 0 && (
          <DetailSection title="Modules">
            <div className="space-y-4">
              {course.modules.map((mod, mi) => (
                <div key={mod.id}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Module {mi + 1} of {course.modules.length}
                  </p>
                  <p className="font-display text-lg text-ink">{mod.title}</p>
                  <p className="text-sm text-muted">{mod.summary}</p>
                  <ul className="mt-2 space-y-1.5">
                    {mod.lessons.map((lesson) => {
                      const done =
                        mounted &&
                        !!enrollment?.lessonProgress.find((lp) => lp.lessonId === lesson.id)
                          ?.completed;
                      return (
                        <li key={lesson.id}>
                          <Link
                            href={`/academy/${course.slug}/learn/${lesson.slug}`}
                            className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-ink/5"
                          >
                            {done ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-blue" />
                            ) : (
                              <Circle className="h-4 w-4 shrink-0 text-muted" />
                            )}
                            <span className="flex-1 text-ink">{lesson.title}</span>
                            <span className="shrink-0 text-xs text-muted">
                              {lesson.durationMinutes} min
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </DetailSection>
        )}

        {course.materials.length > 0 && (
          <DetailSection title="Course Materials">
            <ul className="space-y-2">
              {course.materials.map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-xl border border-line px-3 py-2 text-sm">
                  <span>{m.label}</span>
                  <span className="text-xs uppercase text-muted">{m.kind}</span>
                </li>
              ))}
            </ul>
          </DetailSection>
        )}

        {course.proofProject && (
          <DetailSection title="Proof Project">
            <p className="font-display text-lg text-ink">{course.proofProject.title}</p>
            <p className="mt-1 text-sm">{course.proofProject.description}</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
              {course.proofProject.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <div className="mt-3">
              <StartImpactMoveButton
                title={course.proofProject.title}
                sourceCourseSlug={course.slug}
                label="Turn This Into an Impact Move"
              />
            </div>
          </DetailSection>
        )}
      </div>
    </div>
  );
}
