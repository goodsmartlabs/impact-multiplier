import Link from "next/link";
import { Search } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { MaskGroup, MaskLine } from "@/components/motion/text-reveal";
import type { PulseUpdate } from "@/lib/pulse/types";
import { PULSE_CATEGORIES } from "@/lib/pulse/categories";
import { PulseCard } from "./pulse-card";

/** Impact Pulse masthead: positioning, global search and the featured story. */
export function PulseHero({ featured, liveCount }: { featured?: PulseUpdate; liveCount: number }) {
  return (
    <section aria-labelledby="pulse-hero-heading" className="overflow-hidden border-b border-ink bg-pink-dim px-4 pb-12 pt-8 md:px-6 md:pb-16 md:pt-12">
      <div className="mx-auto max-w-7xl">
        <Reveal immediate variant="fadeIn" className="flex flex-wrap items-center justify-between gap-3 border-b border-ink pb-3 text-[10px] font-bold uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-pink opacity-60 [animation-iteration-count:3]" /><span className="relative h-2 w-2 rounded-full bg-pink" /></span>Impact Pulse</span>
          <span className="hidden sm:inline">What’s happening · What’s valuable · What’s next for you</span>
          <span>{liveCount} live {liveCount === 1 ? "update" : "updates"}</span>
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <MaskGroup as="h1" id="pulse-hero-heading" immediate delay={0.05} className="font-display text-[3.1rem] font-semibold uppercase leading-[0.9] sm:text-7xl lg:text-[5.4rem]">
              <MaskLine>Your next</MaskLine>
              <MaskLine className="text-blue">move starts</MaskLine>
              <MaskLine className="text-pink">here.</MaskLine>
            </MaskGroup>
            <Reveal immediate delay={0.35} as="p" className="mt-6 max-w-xl text-base leading-relaxed text-ink/80 md:text-lg">
              Discover what’s trending, what businesses need, what skills are gaining value, and where your next opportunity could come from.
            </Reveal>
            <Reveal immediate delay={0.45}>
              <form action="/search" method="get" role="search" className="group mt-7 flex max-w-xl items-center gap-2 rounded-full border border-ink bg-white p-1.5 pl-5 shadow-[4px_4px_0_#111] transition-shadow focus-within:shadow-[5px_5px_0_var(--color-blue)]">
                <Search className="h-5 w-5 shrink-0 text-muted transition-colors group-focus-within:text-blue" aria-hidden="true" />
                <label htmlFor="pulse-search" className="sr-only">Search ImpactFools</label>
                <input id="pulse-search" name="q" type="search" required placeholder="Search skills, jobs, courses, opportunities..." className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted md:text-base" />
                <button type="submit" className="im-press shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white hover:bg-blue">Search</button>
              </form>
            </Reveal>
            <Reveal immediate delay={0.55} className="mt-5 flex flex-wrap gap-2">
              {PULSE_CATEGORIES.slice(0, 4).map((category) => (
                <Link key={category.id} href={`/pulse/category/${category.id}`} className="im-press rounded-full border border-ink/30 bg-white/70 px-3 py-1.5 text-xs font-bold hover:border-ink hover:bg-white">
                  <span aria-hidden="true">{category.emoji}</span> {category.label}
                </Link>
              ))}
            </Reveal>
          </div>

          {featured && (
            <Reveal immediate delay={0.25} variant="scaleIn">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70">Featured story</p>
              <PulseCard update={featured} size="feature" priority />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
