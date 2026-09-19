"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle, FileText, PlayCircle, PenLine, HelpCircle } from "lucide-react";
import { getCourseBySlug, totalLessons } from "@/lib/data/courses";
import { allLessonsFlat } from "@/lib/academy";
import { useAcademyStore } from "@/lib/store/academy-store";
import { useHydrated } from "@/lib/use-hydrated";
import { QuizBlock } from "@/components/academy/quiz-block";
import { cn } from "@/lib/utils";

const KIND_ICON = {
  video: PlayCircle,
  text: FileText,
  activity: PenLine,
  quiz: HelpCircle,
  assignment: PenLine,
};

export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = use(params);
  const course = getCourseBySlug(slug);
  const router = useRouter();
  const mounted = useHydrated();
  const enroll = useAcademyStore((s) => s.enroll);
  const isEnrolled = useAcademyStore((s) => s.isEnrolled(slug));
  const enrollment = useAcademyStore((s) => s.getEnrollment(slug));
  const toggleLessonComplete = useAcademyStore((s) => s.toggleLessonComplete);
  const recordQuizScore = useAcademyStore((s) => s.recordQuizScore);

  useEffect(() => {
    if (mounted && course && !isEnrolled) enroll(course.slug);
  }, [mounted, course, isEnrolled, enroll]);

  if (!course) notFound();

  const flat = allLessonsFlat(course);
  const lessonIndex = flat.findIndex((l) => l.slug === lessonSlug);
  if (lessonIndex === -1) notFound();
  const lesson = flat[lessonIndex];
  const moduleIndex = course.modules.findIndex((m) => m.slug === lesson.moduleSlug);
  const lessonInModuleIndex = course.modules[moduleIndex].lessons.findIndex((l) => l.id === lesson.id);

  const prev = flat[lessonIndex - 1];
  const next = flat[lessonIndex + 1];
  const total = totalLessons(course);
  const done =
    mounted && !!enrollment?.lessonProgress.find((lp) => lp.lessonId === lesson.id)?.completed;

  const Icon = KIND_ICON[lesson.kind];

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-6 md:px-6 md:pt-10">
      <Link
        href={`/academy/${course.slug}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> {course.title}
      </Link>

      <div className="mb-4 flex items-center gap-3 text-xs font-medium text-muted">
        <span>
          Module {moduleIndex + 1} of {course.modules.length}
        </span>
        <span>•</span>
        <span>
          Lesson {lessonInModuleIndex + 1} of {course.modules[moduleIndex].lessons.length}
        </span>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue" />
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink md:text-3xl">
          {lesson.title}
        </h1>
      </div>

      {lesson.kind === "video" && (
        <div className="mb-6 flex aspect-video items-center justify-center rounded-2xl bg-ink text-paper">
          <div className="text-center">
            <PlayCircle className="mx-auto mb-2 h-10 w-10 opacity-70" />
            <p className="text-sm opacity-80">{lesson.videoLabel ?? lesson.title}</p>
          </div>
        </div>
      )}

      {lesson.body && (
        <div className="whitespace-pre-line text-[15px] leading-relaxed text-ink">
          {lesson.body}
        </div>
      )}

      {lesson.kind === "quiz" && lesson.quiz && (
        <div className="mt-5">
          <QuizBlock
            quiz={lesson.quiz}
            onComplete={(score) => {
              recordQuizScore(course.slug, lesson.quiz!.id, score);
              if (!done) toggleLessonComplete(course.slug, lesson.id, total);
            }}
          />
        </div>
      )}

      {lesson.kind === "assignment" && lesson.assignment && (
        <div className="mt-5 rounded-2xl border border-line bg-cream p-5">
          <p className="font-display text-lg text-ink">{lesson.assignment.title}</p>
          <p className="mt-2 text-sm text-ink">{lesson.assignment.instructions}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Deliverable
          </p>
          <p className="text-sm text-ink">{lesson.assignment.deliverable}</p>
        </div>
      )}

      {lesson.resources && lesson.resources.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Materials for this lesson
          </p>
          <ul className="space-y-2">
            {lesson.resources.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-xl border border-line px-3 py-2 text-sm"
              >
                <span>{r.label}</span>
                <span className="text-xs uppercase text-muted">{r.kind}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:bottom-0">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2">
          <button
            type="button"
            disabled={!prev}
            onClick={() => prev && router.push(`/academy/${course.slug}/learn/${prev.slug}`)}
            className="rounded-full border border-line px-3.5 py-2 text-sm font-medium text-ink disabled:opacity-30"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={() => toggleLessonComplete(course.slug, lesson.id, total)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold",
              done ? "bg-blue-dim text-blue" : "bg-ink text-paper"
            )}
          >
            {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            {done ? "Completed" : "Mark Complete"}
          </button>

          <button
            type="button"
            disabled={!next}
            onClick={() => next && router.push(`/academy/${course.slug}/learn/${next.slug}`)}
            className="rounded-full border border-line px-3.5 py-2 text-sm font-medium text-ink disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
