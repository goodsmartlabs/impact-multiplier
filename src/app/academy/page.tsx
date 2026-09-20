"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { COURSES } from "@/lib/data/courses";
import { LEARNING_AREAS, coursesInLearningArea, getLearningArea } from "@/lib/data/learning-areas";
import { LEARNING_PATHS } from "@/lib/data/learning-paths";
import { CourseCard } from "@/components/academy/course-card";
import { FilterPills } from "@/components/discovery/filter-pills";
import { useAcademyStore } from "@/lib/store/academy-store";
import { useHydrated } from "@/lib/use-hydrated";
import type { CourseAccess, CourseLevel } from "@/lib/types";

type LearningTab = "all" | "my_learning" | "continue" | "completed";

const ACCESS_OPTIONS: { key: CourseAccess | "all"; label: string }[] = [
  { key: "all", label: "All access" }, { key: "free", label: "Free" },
  { key: "student", label: "Student" }, { key: "coming_soon", label: "Coming Soon" },
];
const LEVEL_OPTIONS: { key: CourseLevel | "all"; label: string }[] = [
  { key: "all", label: "All levels" }, { key: "beginner", label: "Beginner" },
  { key: "intermediate", label: "Intermediate" }, { key: "advanced", label: "Advanced" },
];
const LEARNING_TABS: { key: LearningTab; label: string }[] = [
  { key: "all", label: "All Courses" }, { key: "my_learning", label: "My Learning" },
  { key: "continue", label: "Continue" }, { key: "completed", label: "Completed" },
];

function sortCoursesForDisplay(courses: typeof COURSES) {
  return [...courses].sort((a, b) => {
    if (a.origin !== b.origin) return a.origin === "academy" ? -1 : 1;
    if (a.featuredOrder || b.featuredOrder) return (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999);
    return a.title.localeCompare(b.title);
  });
}

export default function AcademyPage() {
  return <Suspense fallback={<AcademyPageShell />}><AcademyContent /></Suspense>;
}

function AcademyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useHydrated();
  const enrollments = useAcademyStore((state) => state.enrollments);
  const selectedArea = getLearningArea(searchParams.get("area"));
  const requestedAccess = searchParams.get("access");
  const access: CourseAccess | "all" = requestedAccess === "free" || requestedAccess === "student" || requestedAccess === "coming_soon" ? requestedAccess : "all";
  const requestedLevel = searchParams.get("level");
  const level: CourseLevel | "all" = requestedLevel === "beginner" || requestedLevel === "intermediate" || requestedLevel === "advanced" ? requestedLevel : "all";
  const requestedTab = searchParams.get("tab");
  const tab: LearningTab = requestedTab === "my_learning" || requestedTab === "continue" || requestedTab === "completed" ? requestedTab : "all";
  const isCatalogue = searchParams.get("view") === "all" || Boolean(selectedArea) || access !== "all" || level !== "all" || tab !== "all";

  const enrolledSlugs = useMemo(() => new Set(enrollments.map((entry) => entry.courseSlug)), [enrollments]);
  const inProgressSlugs = useMemo(() => new Set(enrollments.filter((entry) => !entry.completed && entry.lessonProgress.length > 0).map((entry) => entry.courseSlug)), [enrollments]);
  const completedSlugs = useMemo(() => new Set(enrollments.filter((entry) => entry.completed).map((entry) => entry.courseSlug)), [enrollments]);

  const filteredCourses = useMemo(() => {
    let result = selectedArea ? coursesInLearningArea(COURSES, selectedArea.id) : COURSES;
    if (access !== "all") result = result.filter((course) => course.access === access);
    if (level !== "all") result = result.filter((course) => course.level === level);
    if (tab === "my_learning") result = mounted ? result.filter((course) => enrolledSlugs.has(course.slug)) : [];
    if (tab === "continue") result = mounted ? result.filter((course) => inProgressSlugs.has(course.slug)) : [];
    if (tab === "completed") result = mounted ? result.filter((course) => completedSlugs.has(course.slug)) : [];
    return sortCoursesForDisplay(result);
  }, [selectedArea, access, level, tab, mounted, enrolledSlugs, inProgressSlugs, completedSlugs]);

  function updateQuery(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => value && value !== "all" ? next.set(key, value) : next.delete(key));
    if (!next.has("area")) next.set("view", "all");
    router.replace(`/academy?${next.toString()}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-7 md:px-6 md:pt-12">
      <header className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink">Impact Academia</p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-none tracking-tight text-ink md:text-6xl">Don&apos;t tell us what you learned.</h1>
          <p className="mt-3 font-display text-3xl font-semibold leading-none text-blue md:text-4xl">Show us what you can do.</p>
        </div>
        <Link href="/search" className="inline-flex w-fit items-center gap-2 rounded-full border border-ink bg-white px-4 py-2.5 text-sm font-semibold text-ink"><Search className="h-4 w-4" /> Search courses</Link>
      </header>

      {!isCatalogue ? <CoursesLanding /> : (
        <section aria-labelledby="catalogue-heading">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-pink">Course catalogue</p><h2 id="catalogue-heading" className="font-display text-3xl font-semibold uppercase text-ink md:text-4xl">{selectedArea?.name ?? "All Courses"}</h2><p className="mt-1 text-sm text-muted">{filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"}</p></div>
            <Link href="/academy" className="text-sm font-semibold text-ink underline underline-offset-4">Back to learning areas</Link>
          </div>
          <nav aria-label="Learning areas" className="-mx-4 mb-5 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0"><div className="flex w-max gap-2">
            <Link href="/academy?view=all" className={`rounded-full border px-4 py-2 text-sm font-semibold ${!selectedArea ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"}`}>All</Link>
            {LEARNING_AREAS.map((area) => <Link key={area.id} href={`/academy?area=${area.id}`} className={`rounded-full border px-4 py-2 text-sm font-semibold ${selectedArea?.id === area.id ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"}`}>{area.shortName}</Link>)}
          </div></nav>
          <div className="mb-4"><FilterPills options={ACCESS_OPTIONS} active={access} onChange={(value) => updateQuery({ access: value })} /></div>
          <div className="mb-4"><FilterPills options={LEVEL_OPTIONS} active={level} onChange={(value) => updateQuery({ level: value })} /></div>
          <div className="mb-7"><FilterPills options={LEARNING_TABS} active={tab} onChange={(value) => updateQuery({ tab: value })} /></div>
          {filteredCourses.length ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)}</div> : <div className="rounded-3xl border border-dashed border-line p-10 text-center text-sm text-muted">No courses match these filters. <button type="button" onClick={() => router.replace(selectedArea ? `/academy?area=${selectedArea.id}` : "/academy?view=all")} className="ml-1 font-semibold text-ink underline">Clear filters</button></div>}
        </section>
      )}
    </div>
  );
}

function CoursesLanding() {
  const freePriority = ["financial-flow", "ai-for-financial-clarity", "claude-for-beginners", "ai-tools-for-productivity", "ai-side-hustle", "seo-fundamentals"];
  const freeCourses = COURSES.filter((course) => course.access === "free" && freePriority.includes(course.slug)).sort((a, b) => freePriority.indexOf(a.slug) - freePriority.indexOf(b.slug)).slice(0, 3);
  const featuredCourses = COURSES.filter((course) => course.featuredOrder).sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999));
  const financeSlugs = ["financial-flow", "ai-for-financial-clarity", "ai-for-accountants", "ai-accounting-judgment-assurance", "the-wealth-lab", "ai-tools-for-finance"];
  const financeFlagships = featuredCourses.filter((course) => financeSlugs.includes(course.slug));
  const otherFlagships = featuredCourses.filter((course) => !financeSlugs.includes(course.slug));
  return <>
    <section aria-labelledby="finance-flagships-heading">
      <div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-pink">Featured by Impact Academia</p><h2 id="finance-flagships-heading" className="font-display text-3xl font-semibold text-ink">Flagship Finance Programs</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">Build financial clarity first, then apply AI with stronger accounting judgment and practical finance tools.</p></div>
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-ink bg-white p-4 text-xs font-bold uppercase tracking-wide text-ink">
        {["Financial FLOW", "AI for Financial Clarity", "AI for Accountants", "AI, Accounting Judgment & Assurance"].map((title, index) => <span key={title} className="inline-flex items-center gap-2"><span className="rounded-full bg-blue-dim px-3 py-2">{title}</span>{index < 3 && <ArrowRight className="h-3.5 w-3.5 text-pink" />}</span>)}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{financeFlagships.map((course) => <CourseCard key={course.id} course={course} />)}</div>
    </section>
    <CourseShelf title="More Flagship Programs" eyebrow="Original Impact Academia courses" courses={otherFlagships} href="/academy?view=all" columns="four" />
    <section className="mt-14" aria-labelledby="areas-heading"><div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-pink">What do you want to learn?</p><h2 id="areas-heading" className="font-display text-3xl font-semibold text-ink">Learning Areas</h2></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{LEARNING_AREAS.map((area, index) => { const count = coursesInLearningArea(COURSES, area.id).length; return <Link key={area.id} href={`/academy?area=${area.id}`} className="group flex min-h-56 flex-col rounded-3xl border border-ink bg-white p-5 transition-transform hover:-translate-y-1"><span className="text-xs font-bold text-muted">0{index + 1}</span><h3 className="mt-7 font-display text-2xl font-semibold uppercase leading-none text-ink">{area.name}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{area.shortDescription}</p><div className="mt-auto flex items-end justify-between pt-5"><span className="text-xs font-bold uppercase tracking-wide text-pink">{count} {count === 1 ? "Course" : "Courses"}</span><span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></div></Link>; })}</div>
    </section>
    <CourseShelf title="Start Free" eyebrow="Start somewhere useful" courses={freeCourses} href="/academy?access=free" />
    <section className="mt-14 border-t border-line pt-10" aria-labelledby="paths-heading"><div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-pink">Not sure where to start?</p><h2 id="paths-heading" className="font-display text-3xl font-semibold text-ink">Follow a Learning Path</h2></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{LEARNING_PATHS.map((path) => <Link key={path.id} href={`/academy/${path.courseSlugs[0]}`} className="rounded-2xl border border-line bg-white p-4 hover:border-ink"><h3 className="font-display text-xl font-semibold text-ink">{path.title}</h3><p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">{path.description}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-pink">View path <ArrowRight className="h-3.5 w-3.5" /></span></Link>)}</div>
    </section>
    <div className="mt-12 text-center"><Link href="/academy?view=all" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white">View All Courses <ArrowRight className="h-4 w-4" /></Link></div>
  </>;
}

function CourseShelf({ title, eyebrow, courses, href, columns = "three" }: { title: string; eyebrow: string; courses: typeof COURSES; href: string; columns?: "three" | "four" }) {
  return <section className="mt-14 first:mt-0"><div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-pink">{eyebrow}</p><h2 className="font-display text-3xl font-semibold text-ink">{title}</h2></div><Link href={href} className="shrink-0 text-sm font-semibold text-ink underline underline-offset-4">View all</Link></div><div className={`grid gap-5 sm:grid-cols-2 ${columns === "four" ? "xl:grid-cols-4" : "lg:grid-cols-3"}`}>{courses.map((course) => <CourseCard key={course.id} course={course} />)}</div></section>;
}

function AcademyPageShell() { return <div className="mx-auto min-h-[60vh] max-w-6xl px-4 py-10 md:px-6" />; }
