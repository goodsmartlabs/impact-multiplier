"use client";

import { useMemo, useState } from "react";
import { DiscoveryCard } from "@/components/discovery/discovery-card";
import { FilterPills } from "@/components/discovery/filter-pills";
import { SearchBar } from "@/components/discovery/search-bar";
import { DISCOVERY_ITEMS } from "@/lib/data/discovery-items";
import { TYPE_LABELS, INCREASE_AREA_LABELS } from "@/lib/data/constants";
import type { DiscoveryType, IncreaseArea } from "@/lib/types";

const TYPE_OPTIONS: { key: DiscoveryType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  ...(Array.from(new Set(DISCOVERY_ITEMS.map((i) => i.type))) as DiscoveryType[]).map((t) => ({
    key: t,
    label: TYPE_LABELS[t],
  })),
];

const AREA_OPTIONS: { key: IncreaseArea | "all"; label: string }[] = [
  { key: "all", label: "All areas" },
  { key: "capacity", label: INCREASE_AREA_LABELS.capacity },
  { key: "wealth", label: INCREASE_AREA_LABELS.wealth },
  { key: "leverage", label: INCREASE_AREA_LABELS.leverage },
  { key: "influence", label: INCREASE_AREA_LABELS.influence },
];

export default function ExplorePage() {
  const [type, setType] = useState<DiscoveryType | "all">("all");
  const [area, setArea] = useState<IncreaseArea | "all">("all");

  const items = useMemo(
    () =>
      DISCOVERY_ITEMS.filter((item) => {
        if (type !== "all" && item.type !== type) return false;
        if (area !== "all" && !item.increaseAreas.includes(area)) return false;
        return true;
      }),
    [type, area]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mb-6 max-w-2xl">
        <h1 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
          Explore everything
        </h1>
        <p className="mt-2 text-sm text-muted md:text-base">
          Skills, courses, tools, opportunities, ideas — browse by category or by what it could
          increase.
        </p>
      </div>

      <div className="mb-4">
        <SearchBar />
      </div>

      <div className="mb-3">
        <FilterPills options={TYPE_OPTIONS} active={type} onChange={setType} />
      </div>
      <div className="mb-6">
        <FilterPills options={AREA_OPTIONS} active={area} onChange={setArea} />
      </div>

      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted">
        {items.length} {items.length === 1 ? "result" : "results"}
      </p>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line p-10 text-center text-sm text-muted">
          Nothing matches those filters yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <DiscoveryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
