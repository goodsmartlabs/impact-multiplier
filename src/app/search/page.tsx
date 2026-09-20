"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DiscoveryCard } from "@/components/discovery/discovery-card";
import { CourseCard } from "@/components/academy/course-card";
import { SearchBar } from "@/components/discovery/search-bar";
import { searchCourses, searchDiscoveryItems } from "@/lib/search";

const EXAMPLE_QUERIES = [
  "skills I can learn with my phone",
  "ways to make myself more valuable at work",
  "AI skills for beginners",
  "how can I become better at sales",
  "free finance courses",
  "how to increase productivity",
  "business opportunities",
];

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const results = useMemo(() => searchDiscoveryItems(q), [q]);
  const courseResults = useMemo(() => searchCourses(q), [q]);
  const totalResults = results.length + courseResults.length;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mb-6 max-w-2xl">
        <h1 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
          Search
        </h1>
        <p className="mt-2 text-sm text-muted md:text-base">
          What do you want to increase?
        </p>
      </div>

      <div className="mb-6">
        <SearchBar autoFocus initialValue={q} />
      </div>

      {!q && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Try</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((eq) => (
              <a
                key={eq}
                href={`/search?q=${encodeURIComponent(eq)}`}
                className="rounded-full border border-line px-3.5 py-2 text-sm text-muted hover:border-ink hover:text-ink"
              >
                {eq}
              </a>
            ))}
          </div>
        </div>
      )}

      {q && (
        <>
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted">
            {totalResults} {totalResults === 1 ? "result" : "results"} for &ldquo;{q}&rdquo;
          </p>
          {totalResults === 0 ? (
            <div className="rounded-3xl border border-dashed border-line p-10 text-center text-sm text-muted">
              Nothing matched that search yet. Try a broader phrase, or browse{" "}
              <a href="/explore" className="underline">
                Explore
              </a>
              .
            </div>
          ) : (
            <div className="space-y-10">
              {courseResults.length > 0 && (
                <section>
                  <h2 className="mb-4 font-display text-2xl font-semibold text-ink">Courses</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {courseResults.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </section>
              )}
              {results.length > 0 && (
                <section>
                  <h2 className="mb-4 font-display text-2xl font-semibold text-ink">Explore</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((item, index) => (
                      <DiscoveryCard key={item.id} item={item} index={index} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}
