"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Asterisk, MousePointer2, Pencil, Ruler, Sparkles } from "lucide-react";
import { DiscoveryCard } from "@/components/discovery/discovery-card";
import { FilterPills } from "@/components/discovery/filter-pills";
import { SearchBar } from "@/components/discovery/search-bar";
import { CreativeWorkbench } from "@/components/home/creative-workbench";
import { OfferWorlds } from "@/components/home/offer-worlds";
import { NeedDiscovery } from "@/components/home/need-discovery";
import { Reveal } from "@/components/motion/reveal";
import { MaskGroup, MaskLine, TextReveal } from "@/components/motion/text-reveal";
import { DURATION, EASE_OUT } from "@/lib/motion";
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
      <section className="overflow-hidden border-b border-ink bg-pink-dim px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
          <div className="relative flex min-h-[390px] flex-col justify-center py-8 md:min-h-[500px] md:py-12">
            <Reveal immediate variant="fadeIn" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]">
              <Pencil aria-hidden="true" className="h-4 w-4 text-pink" strokeWidth={2.25} />
              <p>ImpactFools</p>
            </Reveal>
            <MaskGroup as="h1" immediate delay={0.1} className="mt-5 max-w-2xl uppercase text-ink">
              <MaskLine className="font-display text-[2.85rem] font-semibold leading-[0.86] tracking-[-0.03em] sm:text-7xl lg:text-[5.6rem]">Master your</MaskLine>
              <MaskLine className="text-[4.35rem] leading-[0.9] sm:text-[5rem] lg:text-[6.7rem]">
                <span className="sr-only">craft.</span>
                <Image aria-hidden="true" src="/hero-craft-word.svg" alt="" width={1110} height={254} unoptimized priority className="h-[0.82em] w-auto max-w-full" />
              </MaskLine>
              <MaskLine className="mt-3 font-display text-[2.85rem] font-semibold leading-[0.86] tracking-[-0.03em] sm:text-6xl lg:text-[4.8rem]">Make your</MaskLine>
              <MaskLine className="text-[4.2rem] leading-[0.9] sm:text-[4.8rem] lg:text-[6.35rem]">
                <span className="sr-only">impact.</span>
                <Image aria-hidden="true" src="/hero-impact-word.svg" alt="" width={1242} height={254} unoptimized priority className="h-[0.82em] w-auto max-w-full" />
              </MaskLine>
            </MaskGroup>
            <TextReveal as="p" immediate delay={0.75} text="Learn it. Build it. Prove it." className="mt-7 font-display text-2xl font-medium md:text-3xl" />
            <Reveal immediate delay={1.05} className="mt-7">
              <Link href="#discover" className="im-lift group inline-flex w-fit items-center gap-2 rounded-full border border-ink bg-ink px-5 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#0964f5] hover:shadow-[6px_7px_0_#0964f5] active:shadow-[1px_1px_0_#0964f5]">
                Explore ImpactFools <ArrowRight className="im-nudge h-4 w-4" />
              </Link>
            </Reveal>

            <Reveal immediate variant="popIn" delay={1.2} className="absolute right-4 top-8 hidden sm:block">
              <div aria-hidden="true" className="design-sticker rotate-[-10deg] rounded-xl border border-ink bg-blue-dim p-3 text-blue shadow-[3px_3px_0_#111]">
                <Ruler className="h-7 w-7" strokeWidth={1.8} />
              </div>
            </Reveal>
            <Reveal immediate variant="popIn" delay={1.35} className="absolute bottom-10 right-8 hidden sm:block">
              <MousePointer2 aria-hidden="true" className="creative-float h-8 w-8 fill-white text-ink" />
            </Reveal>
            <Reveal immediate variant="popIn" delay={1.3} className="absolute left-[48%] top-14 hidden sm:block">
              <Sparkles aria-hidden="true" className="creative-float h-6 w-6 text-pink" />
            </Reveal>
          </div>
          <CreativeWorkbench />
        </div>
      </section>

      <OfferWorlds />

      <NeedDiscovery />

      <section className="border-y border-ink bg-blue-dim px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <Reveal as="p" className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Don’t know what to learn—or what your niche is?</Reveal>
            <TextReveal as="h2" text="Find what you can build." className="mt-2 font-display text-5xl font-semibold leading-none md:text-7xl" />
            <Reveal as="p" delay={0.12} className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">Use what you already know, what you could become good at and where it could create value to choose your next capacity direction.</Reveal>
          </div>
          <Reveal delay={0.18} className="shrink-0"><Link href="/capacity-guide" className="im-lift group inline-flex min-h-14 items-center gap-2 rounded-full border border-ink bg-ink px-6 py-4 text-sm font-bold text-white shadow-[4px_4px_0_var(--color-pink)]">Start the Capacity Guide <ArrowRight className="im-nudge h-4 w-4" /></Link></Reveal>
        </div>
      </section>

      <section id="discover" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-14 md:px-6 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <Reveal variant="fadeIn" as="p" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-pink"><Asterisk className="h-4 w-4" /> The Academy</Reveal>
            <TextReveal as="h2" text="Find your next craft" className="mt-2 font-display text-5xl font-semibold leading-none md:text-7xl" />
          </div>
          <Reveal variant="slideReveal" delay={0.2} as="span" className="hidden rounded-full border border-ink bg-blue-dim px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] sm:inline">Courses · Skills · Challenges · Opportunities</Reveal>
        </div>
        <Reveal className="mx-auto max-w-3xl"><SearchBar /></Reveal>
        <Reveal variant="fadeIn" delay={0.1} className="mt-6 flex justify-center"><FilterPills options={DISCOVERY_FILTERS} active={active} onChange={setActive} /></Reveal>
        <AnimatePresence mode="wait" initial={false}>
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 rounded-2xl border border-dashed border-ink p-10 text-center text-sm text-muted"
            >
              Nothing here yet — try another filter.
            </motion.div>
          ) : (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              className="mt-8 grid grid-cols-1 gap-8"
            >
              {items.map((item, index) => (
                <Reveal key={item.id} amount={0.15}>
                  <DiscoveryCard item={item} index={index} variant="featured" />
                </Reveal>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
