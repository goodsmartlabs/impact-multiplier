"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Asterisk, MousePointer2, Pencil, Ruler, Sparkles } from "lucide-react";
import { DiscoveryCard } from "@/components/discovery/discovery-card";
import { FilterPills } from "@/components/discovery/filter-pills";
import { SearchBar } from "@/components/discovery/search-bar";
import { CreativeWorkbench } from "@/components/home/creative-workbench";
import { OfferWorlds } from "@/components/home/offer-worlds";
import { NeedDiscovery } from "@/components/home/need-discovery";
import { DISCOVERY_FILTERS } from "@/lib/data/constants";
import { DISCOVERY_ITEMS } from "@/lib/data/discovery-items";
import type { DiscoveryFilterKey } from "@/lib/types";

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
          <div className="relative flex min-h-[390px] flex-col justify-center py-8 md:min-h-[500px] md:py-12">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]">
              <Pencil aria-hidden="true" className="h-4 w-4 text-pink" strokeWidth={2.25} />
              <p>ImpactFools</p>
            </div>
            <h1 className="mt-5 max-w-2xl uppercase text-ink">
              <span className="block font-display text-[4.2rem] font-semibold leading-[0.76] tracking-[-0.055em] sm:text-7xl lg:text-[6.2rem]">Master your</span>
              <span className="block text-[4.35rem] leading-[0.86] sm:text-[5rem] lg:text-[6.7rem]">
                <span className="sr-only">craft.</span>
                <Image aria-hidden="true" src="/hero-craft-word.svg" alt="" width={1110} height={254} unoptimized className="h-[0.82em] w-auto max-w-full" />
              </span>
              <span className="mt-3 block font-display text-[3.55rem] font-semibold leading-[0.78] tracking-[-0.05em] sm:text-6xl lg:text-[5.25rem]">Make your</span>
              <span className="block text-[4.2rem] leading-[0.86] sm:text-[4.8rem] lg:text-[6.35rem]">
                <span className="sr-only">impact.</span>
                <Image aria-hidden="true" src="/hero-impact-word.svg" alt="" width={1242} height={254} unoptimized className="h-[0.82em] w-auto max-w-full" />
              </span>
            </h1>
            <p className="mt-7 font-display text-2xl font-semibold italic md:text-3xl">Learn it. Build it. Prove it.</p>
            <Link href="#discover" className="mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-ink bg-ink px-5 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#0964f5] transition-transform hover:-translate-y-1">Explore ImpactFools <ArrowRight className="h-4 w-4" /></Link>

            <div aria-hidden="true" className="design-sticker absolute right-4 top-8 hidden rotate-[-10deg] rounded-xl border border-ink bg-blue-dim p-3 text-blue shadow-[3px_3px_0_#111] sm:block">
              <Ruler className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <MousePointer2 aria-hidden="true" className="creative-float absolute bottom-10 right-8 hidden h-8 w-8 fill-white text-ink sm:block" />
            <Sparkles aria-hidden="true" className="creative-float absolute left-[48%] top-14 hidden h-6 w-6 text-pink sm:block" />
          </div>
          <CreativeWorkbench />
        </div>
      </section>

      <OfferWorlds />

      <NeedDiscovery />

      <section id="discover" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-14 md:px-6 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-pink"><Asterisk className="h-4 w-4" /> The Academy</p><h2 className="mt-2 font-display text-5xl font-semibold leading-none md:text-7xl">Find your next craft</h2></div><span className="hidden rounded-full border border-ink bg-blue-dim px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] sm:inline">Courses · Skills · Challenges · Opportunities</span></div>
        <div className="mx-auto max-w-3xl"><SearchBar /></div>
        <div className="mt-6 flex justify-center"><FilterPills options={DISCOVERY_FILTERS} active={active} onChange={setActive} /></div>
        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-ink p-10 text-center text-sm text-muted">Nothing here yet — try another filter.</div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8">
            {items.map((item, index) => <DiscoveryCard key={item.id} item={item} index={index} variant="featured" className="animate-fade-up" />)}
          </div>
        )}
      </section>
    </div>
  );
}
