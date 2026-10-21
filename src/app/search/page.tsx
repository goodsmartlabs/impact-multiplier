"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DiscoveryCard } from "@/components/discovery/discovery-card";
import { PulseCard } from "@/components/pulse/pulse-card";
import { searchUpdates } from "@/lib/pulse/feed";
import type { PulseUpdate } from "@/lib/pulse/types";
import { CourseCard } from "@/components/academy/course-card";
import { SearchBar } from "@/components/discovery/search-bar";
import { searchCourses, searchDiscoveryItems } from "@/lib/search";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const EXAMPLE_QUERIES = [
  "skills I can learn with my phone",
  "ways to make myself more valuable at work",
  "AI skills for beginners",
  "how can I become better at sales",
  "free finance courses",
  "how to increase productivity",
  "business opportunities",
];

function usePulseUpdates() {
  const [state, setState] = useState<{ status: "loading" | "ready" | "error"; updates: PulseUpdate[] }>({ status: "loading", updates: [] });
  useEffect(() => {
    let cancelled = false;
    fetch("/api/pulse/updates")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: { updates: PulseUpdate[] }) => { if (!cancelled) setState({ status: "ready", updates: data.updates }); })
      .catch(() => { if (!cancelled) setState({ status: "error", updates: [] }); });
    return () => { cancelled = true; };
  }, []);
  return state;
}

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const results = useMemo(() => searchDiscoveryItems(q), [q]);
  const courseResults = useMemo(() => searchCourses(q), [q]);
  const pulse = usePulseUpdates();
  const pulseResults = useMemo(() => (q ? searchUpdates(pulse.updates, q) : []), [pulse.updates, q]);
  const totalResults = results.length + courseResults.length + pulseResults.length;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mb-6 max-w-2xl">
        <Reveal as="h1" immediate className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
          Search
        </Reveal>
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
                className="im-press rounded-full border border-line px-3.5 py-2 text-sm text-muted hover:border-ink hover:bg-blue-dim hover:text-ink"
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
          {pulse.status === "loading" && <p className="mb-4 text-xs text-muted" aria-live="polite">Searching Impact Pulse…</p>}
          {pulse.status === "error" && <p className="mb-4 text-xs text-muted">Impact Pulse results couldn’t load — showing courses and library items only.</p>}
          {totalResults === 0 && pulse.status !== "loading" ? (
            <div className="rounded-3xl border border-dashed border-line p-10 text-center text-sm text-muted">
              Nothing matched that search yet. Try a broader phrase, or browse{" "}
              <a href="/explore" className="underline">
                Explore
              </a>
              .
            </div>
          ) : (
            <div className="space-y-10">
              {pulseResults.length > 0 && (
                <section>
                  <h2 className="mb-4 font-display text-2xl font-semibold text-ink">Impact Pulse</h2>
                  <Stagger key={q} amount={0.02} stagger={0.05} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pulseResults.slice(0, 9).map((update) => (
                      <StaggerItem key={update.id}><PulseCard update={update} size="compact" /></StaggerItem>
                    ))}
                  </Stagger>
                </section>
              )}
              {courseResults.length > 0 && (
                <section>
                  <h2 className="mb-4 font-display text-2xl font-semibold text-ink">Courses</h2>
                  <Stagger key={q} amount={0.02} stagger={0.05} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {courseResults.map((course) => (
                      <StaggerItem key={course.id}><CourseCard course={course} /></StaggerItem>
                    ))}
                  </Stagger>
                </section>
              )}
              {results.length > 0 && (
                <section>
                  <h2 className="mb-4 font-display text-2xl font-semibold text-ink">Explore</h2>
                  <Stagger key={q} amount={0.02} stagger={0.05} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((item, index) => (
                      <StaggerItem key={item.id}><DiscoveryCard item={item} index={index} className="h-full" /></StaggerItem>
                    ))}
                  </Stagger>
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
