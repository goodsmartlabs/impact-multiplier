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
      <div className="mb-8 max-w-2xl">
        <p className="font-display text-3xl italic text-muted md:text-4xl">
          {greeting}, {name}.
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
          What&apos;s worth your attention today?
        </h1>
      </div>

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <DiscoveryCard key={item.id} item={item} className="animate-fade-up" />
          ))}
        </div>
      )}
    </div>
  );
}
