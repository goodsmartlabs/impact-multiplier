"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { PULSE_CATEGORIES } from "@/lib/pulse/categories";
import { filterByCategory, paginate, searchUpdates } from "@/lib/pulse/feed";
import type { PulseCategory, PulseUpdate } from "@/lib/pulse/types";
import { DURATION, EASE_OUT, SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PulseCard } from "./pulse-card";

type Filter = PulseCategory | "all";

export function CategoryFilters({ active, onChange, counts, idPrefix }: { active: Filter; onChange: (value: Filter) => void; counts: Record<string, number>; idPrefix: string }) {
  const options: Array<{ id: Filter; label: string; emoji: string }> = [{ id: "all", label: "All updates", emoji: "✦" }, ...PULSE_CATEGORIES];
  return (
    <div role="toolbar" aria-label="Filter Impact Pulse by category" className="scrollbar-none -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
      {options.map((option) => {
        const selected = active === option.id;
        const count = counts[option.id] ?? 0;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={cn("im-press relative shrink-0 snap-start rounded-full border px-4 py-2 text-xs font-bold transition-colors duration-300", selected ? "border-ink text-white" : "border-ink/25 bg-white text-ink hover:border-ink")}
          >
            {selected && <motion.span layoutId={`${idPrefix}-filter`} transition={SPRING_SOFT} aria-hidden="true" className="absolute inset-0 rounded-full bg-ink" />}
            <span className="relative"><span aria-hidden="true">{option.emoji}</span> {option.label}<span className={cn("ml-1.5 text-[10px]", selected ? "text-white/70" : "text-muted")}>{count}</span></span>
          </button>
        );
      })}
    </div>
  );
}

export function PulseFeed({
  updates,
  initialCategory = "all",
  pageSize = 9,
  showSearch = false,
  urlBase,
  idPrefix = "feed",
}: {
  updates: PulseUpdate[];
  initialCategory?: Filter;
  pageSize?: number;
  showSearch?: boolean;
  /** When set, filter changes update the address bar (/pulse or /pulse/category/…). */
  urlBase?: string;
  idPrefix?: string;
}) {
  const [category, setCategory] = useState<Filter>(initialCategory);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: updates.length };
    for (const update of updates) result[update.category] = (result[update.category] ?? 0) + 1;
    return result;
  }, [updates]);

  const filtered = useMemo(() => searchUpdates(filterByCategory(updates, category), query), [updates, category, query]);
  const { visible, hasMore, total } = paginate(filtered, page, pageSize);

  const changeCategory = (value: Filter) => {
    setCategory(value);
    setPage(1);
    if (urlBase) window.history.replaceState(null, "", value === "all" ? urlBase : `${urlBase}/category/${value}`);
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        {showSearch && (
          <label className="relative block max-w-xl">
            <span className="sr-only">Search Impact Pulse</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1); }}
              placeholder="Search skills, jobs, courses, opportunities…"
              className="w-full rounded-full border border-ink bg-white py-3 pl-11 pr-10 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_var(--color-blue)]"
            />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-blue-dim"><X className="h-4 w-4" /></button>}
          </label>
        )}
        <CategoryFilters active={category} onChange={changeCategory} counts={counts} idPrefix={idPrefix} />
        <p aria-live="polite" className="text-xs font-semibold text-muted">{total} {total === 1 ? "update" : "updates"}{query ? ` matching “${query}”` : ""}</p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${category}-${query}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast, ease: EASE_OUT }}
          className="mt-6"
        >
          {visible.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ink p-10 text-center">
              <p className="font-display text-2xl font-semibold">Nothing here yet</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                {query ? "No updates match that search. Try a broader word or another category." : "No verified updates have been published in this category yet. We only publish opportunities we can source."}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm font-bold">
                {query && <button type="button" onClick={() => setQuery("")} className="im-press rounded-full border border-ink px-4 py-2">Clear search</button>}
                <button type="button" onClick={() => changeCategory("all")} className="im-press rounded-full border border-ink px-4 py-2">Show all updates</button>
                <Link href="/academy/challenge" className="im-press rounded-full bg-ink px-4 py-2 text-white">Build a skill meanwhile</Link>
              </div>
            </div>
          ) : (
            <ul className="grid grid-flow-dense gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((update) => (
                <li key={update.id} className={cn(update.size === "feature" && "md:col-span-2")}>
                  <PulseCard update={update} />
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>

      {hasMore && (
        <div className="mt-8 text-center">
          <button type="button" onClick={() => setPage((value) => value + 1)} className="im-lift inline-flex items-center gap-2 rounded-full border border-ink bg-white px-6 py-3 text-sm font-bold hover:shadow-[4px_4px_0_#111]">
            Load more updates <span className="text-muted">({total - visible.length} more)</span>
          </button>
        </div>
      )}
    </div>
  );
}
