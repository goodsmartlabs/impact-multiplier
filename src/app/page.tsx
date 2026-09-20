"use client";

import { useMemo, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { DiscoveryCard } from "@/components/discovery/discovery-card";
import { FilterPills } from "@/components/discovery/filter-pills";
import { SearchBar } from "@/components/discovery/search-bar";
import { DISCOVERY_FILTERS } from "@/lib/data/constants";
import { DISCOVERY_ITEMS } from "@/lib/data/discovery-items";
import type { DiscoveryFilterKey } from "@/lib/types";

const STEPS = [
  ["01", "discover what matters"],
  ["02", "learn with direction"],
  ["03", "build visible proof"],
  ["04", "turn it into impact"],
] as const;

export default function Home() {
  const [active, setActive] = useState<DiscoveryFilterKey>("for_you");
  const items = useMemo(
    () => DISCOVERY_ITEMS.filter((item) => item.filterKeys.includes(active)),
    [active]
  );

  return (
    <div className="pb-20">
      <section className="border-b border-ink bg-pink-dim px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
          <div className="flex flex-col justify-center py-3 md:py-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em]">Impact Academia</p>
            <h1 className="mt-5 max-w-2xl font-display text-6xl font-semibold leading-[0.82] tracking-[-0.055em] text-ink md:text-8xl lg:text-[7rem]">
              not another<br />learning platform.
            </h1>
            <p className="mt-7 max-w-xl text-base font-semibold leading-snug md:text-lg">
              Find the skills, courses, tools and opportunities worth your attention—then turn what you learn into proof, value and real impact.
            </p>
          </div>
          <div className="editorial-grid flex min-h-[330px] flex-col items-center justify-center rounded-2xl border border-ink bg-paper p-8 text-center md:min-h-[420px]">
            <BrandLogo className="w-full max-w-[390px]" />
            <p className="mt-8 font-display text-3xl font-semibold italic md:text-4xl">learn it. build it. prove it.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-ink px-4 py-14 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-5xl font-semibold tracking-tight md:text-6xl">what grows here?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">A focused place to find useful knowledge, build practical capability and move from curiosity to meaningful action.</p>
            <h3 className="mt-6 text-lg font-bold">How It Works</h3>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([number, label]) => (
              <div key={number} className="rounded-xl border border-ink bg-paper px-5 py-7 text-center">
                <span className="text-[10px] font-bold tracking-[0.2em] text-pink">{number}</span>
                <p className="mt-2 font-semibold lowercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="mx-auto max-w-3xl"><SearchBar /></div>
        <div className="mt-6 flex justify-center"><FilterPills options={DISCOVERY_FILTERS} active={active} onChange={setActive} /></div>
        <h2 className="mt-14 text-center font-display text-5xl font-semibold tracking-tight md:text-6xl">worth your attention</h2>
        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-ink p-10 text-center text-sm text-muted">Nothing here yet — try another filter.</div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8">
            {items.map((item) => <DiscoveryCard key={item.id} item={item} className="animate-fade-up" />)}
          </div>
        )}
      </section>
    </div>
  );
}
