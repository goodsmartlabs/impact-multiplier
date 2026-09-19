import type { Course, CourseEnrollment } from "@/lib/types";
import { totalLessons } from "@/lib/data/courses";

export function computeProgressPercent(course: Course, enrollment?: CourseEnrollment) {
  const total = totalLessons(course);
  if (total === 0 || !enrollment) return 0;
  const done = enrollment.lessonProgress.filter((lp) => lp.completed).length;
  return Math.round((done / total) * 100);
}

export function allLessonsFlat(course: Course) {
  return course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleSlug: m.slug, moduleTitle: m.title })));
}
