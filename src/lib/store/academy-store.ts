"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CourseEnrollment } from "@/lib/types";

interface AcademyState {
  enrollments: CourseEnrollment[];
  enroll: (courseSlug: string) => void;
  isEnrolled: (courseSlug: string) => boolean;
  toggleLessonComplete: (courseSlug: string, lessonId: string, totalLessons: number) => void;
  isLessonComplete: (courseSlug: string, lessonId: string) => boolean;
  getEnrollment: (courseSlug: string) => CourseEnrollment | undefined;
  recordQuizScore: (courseSlug: string, quizId: string, score: number) => void;
}

export const useAcademyStore = create<AcademyState>()(
  persist(
    (set, get) => ({
      enrollments: [],
      enroll: (courseSlug) => {
        if (get().enrollments.some((e) => e.courseSlug === courseSlug)) return;
        set((state) => ({
          enrollments: [
            ...state.enrollments,
            {
              courseSlug,
              enrolledAt: new Date().toISOString(),
              lessonProgress: [],
              completed: false,
            },
          ],
        }));
      },
      isEnrolled: (courseSlug) => get().enrollments.some((e) => e.courseSlug === courseSlug),
      getEnrollment: (courseSlug) => get().enrollments.find((e) => e.courseSlug === courseSlug),
      toggleLessonComplete: (courseSlug, lessonId, totalLessons) => {
        const state = get();
        let enrollment = state.enrollments.find((e) => e.courseSlug === courseSlug);
        if (!enrollment) {
          get().enroll(courseSlug);
        }
        set((s) => ({
          enrollments: s.enrollments.map((e) => {
            if (e.courseSlug !== courseSlug) return e;
            const existing = e.lessonProgress.find((lp) => lp.lessonId === lessonId);
            let lessonProgress;
            if (existing) {
              lessonProgress = e.lessonProgress.map((lp) =>
                lp.lessonId === lessonId
                  ? {
                      ...lp,
                      completed: !lp.completed,
                      completedAt: !lp.completed ? new Date().toISOString() : undefined,
                    }
                  : lp
              );
            } else {
              lessonProgress = [
                ...e.lessonProgress,
                { lessonId, completed: true, completedAt: new Date().toISOString() },
              ];
            }
            const completedCount = lessonProgress.filter((lp) => lp.completed).length;
            const completed = completedCount >= totalLessons;
            return {
              ...e,
              lessonProgress,
              completed,
              completedAt: completed ? e.completedAt ?? new Date().toISOString() : undefined,
            };
          }),
        }));
        enrollment = get().enrollments.find((e) => e.courseSlug === courseSlug);
      },
      isLessonComplete: (courseSlug, lessonId) => {
        const enrollment = get().enrollments.find((e) => e.courseSlug === courseSlug);
        return !!enrollment?.lessonProgress.find((lp) => lp.lessonId === lessonId)?.completed;
      },
      recordQuizScore: (courseSlug, quizId, score) => {
        set((s) => ({
          enrollments: s.enrollments.map((e) =>
            e.courseSlug === courseSlug
              ? { ...e, quizScores: { ...(e.quizScores ?? {}), [quizId]: score } }
              : e
          ),
        }));
      },
    }),
    { name: "im-academy-progress" }
  )
);
