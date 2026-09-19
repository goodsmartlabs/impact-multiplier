"use client";

import { useMemo, useState } from "react";
import { DiscoveryCard } from "@/components/discovery/discovery-card";
import { FilterPills } from "@/components/discovery/filter-pills";
import { SearchBar } from "@/components/discovery/search-bar";
import { DISCOVERY_FILTERS } from "@/lib/data/constants";
import { DISCOVERY_ITEMS } from "@/lib/data/discovery-items";
import type { DiscoveryFilterKey } from "@/lib/types";
import { useProfileStore } from "@/lib/store/profile-store";

function useGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const [active, setActive] = useState<DiscoveryFilterKey>("for_you");
  const greeting = useGreeting();
  const name = useProfileStore((s) => s.name);

  const items = useMemo(
    () => DISCOVERY_ITEMS.filter((item) => item.filterKeys.includes(active)),
    [active]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-pink/15 bg-paper px-5 py-7 shadow-[0_18px_55px_rgba(20,20,30,0.07)] md:px-8 md:py-9">
        <div className="absolute -right-10 -top-14 h-48 w-48 rounded-full bg-pink/10 blur-2xl" />
        <div className="absolute -bottom-16 right-24 h-48 w-48 rounded-full bg-blue/10 blur-2xl" />
        <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-pink">Your growth, curated</p>
        <p className="relative mt-3 font-display text-2xl italic text-muted md:text-3xl">
          {greeting}, {name}.
        </p>
        <h1 className="relative mt-1 max-w-2xl font-display text-3xl font-medium tracking-tight text-ink md:text-5xl">
          What&apos;s worth your attention today?
        </h1>
        <p className="relative mt-3 max-w-xl text-sm leading-relaxed text-muted md:text-base">
          Discover practical skills, useful tools, courses and opportunities that can increase your capacity, wealth and impact.
        </p>
      </section>

      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="mb-6">
        <FilterPills options={DISCOVERY_FILTERS} active={active} onChange={setActive} />
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line p-10 text-center text-sm text-muted">
          Nothing here yet — try another filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <DiscoveryCard key={item.id} item={item} className="animate-fade-up" />
          ))}
        </div>
      )}
    </div>
  );
}
