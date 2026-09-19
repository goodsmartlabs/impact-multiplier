"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { COURSES } from "@/lib/data/courses";
import { CourseCard } from "@/components/academy/course-card";
import { FilterPills } from "@/components/discovery/filter-pills";
import { useAcademyStore } from "@/lib/store/academy-store";
import { useHydrated } from "@/lib/use-hydrated";
import { COURSE_TRACK_LABELS } from "@/lib/data/constants";
import type { CourseTrack } from "@/lib/types";

type Tab = "featured" | "all" | "my_learning" | "continue" | "completed";

const TABS: { key: Tab; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "all", label: "All Courses" },
  { key: "my_learning", label: "My Learning" },
  { key: "continue", label: "Continue Learning" },
  { key: "completed", label: "Completed" },
];

const TRACK_OPTIONS: { key: CourseTrack | "all"; label: string }[] = [
  { key: "all", label: "All tracks" },
  ...(Object.keys(COURSE_TRACK_LABELS) as CourseTrack[]).map((t) => ({
    key: t,
    label: COURSE_TRACK_LABELS[t],
  })),
];

export default function AcademyPage() {
  const mounted = useHydrated();
  const [tab, setTab] = useState<Tab>("featured");
  const [track, setTrack] = useState<CourseTrack | "all">("all");
  const enrollments = useAcademyStore((s) => s.enrollments);

  const enrolledSlugs = useMemo(() => new Set(enrollments.map((e) => e.courseSlug)), [enrollments]);
  const inProgressSlugs = useMemo(
    () => new Set(enrollments.filter((e) => !e.completed && e.lessonProgress.length > 0).map((e) => e.courseSlug)),
    [enrollments]
  );
  const completedSlugs = useMemo(
    () => new Set(enrollments.filter((e) => e.completed).map((e) => e.courseSlug)),
    [enrollments]
  );

  const courses = useMemo(() => {
    let list = COURSES;
    if (tab === "featured") list = list.filter((c) => c.featured);
    if (tab === "all" && track !== "all") list = list.filter((c) => c.tracks.includes(track));
    if (tab === "my_learning") list = mounted ? list.filter((c) => enrolledSlugs.has(c.slug)) : [];
    if (tab === "continue") list = mounted ? list.filter((c) => inProgressSlugs.has(c.slug)) : [];
    if (tab === "completed") list = mounted ? list.filter((c) => completedSlugs.has(c.slug)) : [];
    return list;
  }, [tab, track, mounted, enrolledSlugs, inProgressSlugs, completedSlugs]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mb-6 max-w-2xl">
        <h1 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
          Impact Academia
        </h1>
        <p className="mt-2 text-sm text-muted md:text-base">
          Don&apos;t tell us what you learned. Show us what you can do.
        </p>
      </div>

      <div className="mb-4">
        <FilterPills options={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === "all" && (
        <div className="mb-6">
          <FilterPills options={TRACK_OPTIONS} active={track} onChange={setTrack} />
        </div>
      )}

      {courses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line p-10 text-center text-sm text-muted">
          {tab === "my_learning" && "You haven't enrolled in anything yet."}
          {tab === "continue" && "Nothing in progress right now."}
          {tab === "completed" && "Nothing completed yet — keep going."}
          {(tab === "featured" || tab === "all") && "No courses match yet."}
          <div className="mt-3">
            <Link href="/academy" onClick={() => setTab("all")} className="text-ink underline">
              Browse all courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
