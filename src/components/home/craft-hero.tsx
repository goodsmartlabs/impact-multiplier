"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MousePointer2, Pencil, Ruler, Sparkles } from "lucide-react";
import { CreativeWorkbench } from "@/components/home/creative-workbench";
import { Reveal } from "@/components/motion/reveal";
import { MaskGroup, MaskLine, TextReveal } from "@/components/motion/text-reveal";

/** The ImpactFools brand statement (formerly the homepage hero), now introducing services and the Academy. */
export function CraftHero() {
  return (
    <section aria-labelledby="craft-heading" className="overflow-hidden border-y border-ink bg-pink-dim px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
        <div className="relative flex min-h-[390px] flex-col justify-center py-8 md:min-h-[500px] md:py-12">
          <Reveal variant="fadeIn" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]">
            <Pencil aria-hidden="true" className="h-4 w-4 text-pink" strokeWidth={2.25} />
            <p>ImpactFools</p>
          </Reveal>
          <MaskGroup as="h2" id="craft-heading" delay={0.1} className="mt-5 max-w-2xl uppercase text-ink">
            <MaskLine className="font-display text-[2.85rem] font-semibold leading-[0.86] tracking-[-0.03em] sm:text-7xl lg:text-[5.6rem]">Master your</MaskLine>
            <MaskLine className="text-[4.35rem] leading-[0.9] sm:text-[5rem] lg:text-[6.7rem]">
              <span className="sr-only">craft.</span>
              <Image aria-hidden="true" src="/hero-craft-word.svg" alt="" width={1110} height={254} unoptimized className="h-[0.82em] w-auto max-w-full" />
            </MaskLine>
            <MaskLine className="mt-3 font-display text-[2.85rem] font-semibold leading-[0.86] tracking-[-0.03em] sm:text-6xl lg:text-[4.8rem]">Make your</MaskLine>
            <MaskLine className="text-[4.2rem] leading-[0.9] sm:text-[4.8rem] lg:text-[6.35rem]">
              <span className="sr-only">impact.</span>
              <Image aria-hidden="true" src="/hero-impact-word.svg" alt="" width={1242} height={254} unoptimized className="h-[0.82em] w-auto max-w-full" />
            </MaskLine>
          </MaskGroup>
          <TextReveal as="p" delay={0.5} text="Learn it. Build it. Prove it." className="mt-7 font-display text-2xl font-medium md:text-3xl" />
          <Reveal delay={0.7} className="mt-7">
            <Link href="#what-we-offer" className="im-lift group inline-flex w-fit items-center gap-2 rounded-full border border-ink bg-ink px-5 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#0964f5] hover:shadow-[6px_7px_0_#0964f5]">
              Explore ImpactFools <ArrowRight className="im-nudge h-4 w-4" />
            </Link>
          </Reveal>

          <Reveal variant="popIn" delay={0.8} className="absolute right-4 top-8 hidden sm:block">
            <div aria-hidden="true" className="design-sticker rotate-[-10deg] rounded-xl border border-ink bg-blue-dim p-3 text-blue shadow-[3px_3px_0_#111]">
              <Ruler className="h-7 w-7" strokeWidth={1.8} />
            </div>
          </Reveal>
          <Reveal variant="popIn" delay={0.9} className="absolute bottom-10 right-8 hidden sm:block">
            <MousePointer2 aria-hidden="true" className="creative-float h-8 w-8 fill-white text-ink" />
          </Reveal>
          <Reveal variant="popIn" delay={0.85} className="absolute left-[48%] top-14 hidden sm:block">
            <Sparkles aria-hidden="true" className="creative-float h-6 w-6 text-pink" />
          </Reveal>
        </div>
        <CreativeWorkbench />
      </div>
    </section>
  );
}
