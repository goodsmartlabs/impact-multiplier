"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowRight, CornerDownRight, GitBranch, MousePointer2 } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { STAGGER } from "@/lib/motion";

const NEEDS = [
  ["I feel stuck.", "/redirection"],
  ["I want to make more money.", "/craft-paths/make-money-with-ai"],
  ["I want to build my brand.", "/craft-paths/build-your-personal-brand"],
  ["I want to learn AI.", "/academy?area=ai-technology"],
  ["I want to change careers.", "/craft-paths/build-your-ai-career"],
  ["I want to build something.", "/craft-paths/from-idea-to-build"],
  ["I want to grow my business.", "/craft-paths/build-your-business-online"],
  ["I want to build wealth.", "/craft-paths/build-your-wealth-system"],
  ["I don’t know yet.", "/redirection"],
] as const;

export function NeedDiscovery() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <section ref={sectionRef} className="border-b border-ink bg-blue-dim px-4 py-14 md:px-6 md:py-20" aria-labelledby="need-heading">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div className="relative lg:sticky lg:top-28 lg:pl-6">
          {/* Scroll rail: fills as the reader moves through the needs */}
          <div aria-hidden="true" className="absolute bottom-2 left-0 top-2 hidden w-[3px] overflow-hidden rounded-full bg-ink/10 lg:block">
            <motion.div className="h-full w-full origin-top rounded-full bg-pink" style={{ scaleY: progress }} />
          </div>
          <Reveal as="p" variant="fadeIn" className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Start with the problem</Reveal>
          <TextReveal
            as="h2"
            id="need-heading"
            text="What are you trying to change?"
            className="mt-3 max-w-xl font-display text-5xl font-semibold uppercase leading-[0.9] md:text-7xl xl:text-[5.25rem]"
          />
          <Reveal as="p" delay={0.35} className="mt-6 max-w-md text-sm leading-relaxed text-ink/70">You don’t need to know which course to choose. Tell us what needs to move.</Reveal>
          <Reveal variant="popIn" delay={0.5} className="mt-8 w-fit">
            <GitBranch className="h-12 w-12 text-pink" aria-hidden="true" />
          </Reveal>
        </div>
        <Reveal variant="scaleIn" amount={0.1} className="editorial-grid relative rounded-3xl border border-ink bg-white p-4 shadow-[6px_6px_0_#111] md:p-7">
          <MousePointer2 className="creative-float absolute -right-3 -top-4 h-9 w-9 -rotate-12 fill-pink text-ink" aria-hidden="true" />
          <Stagger stagger={STAGGER.tight} delayChildren={0.15} amount={0.1} className="grid gap-3 sm:grid-cols-2">
            {NEEDS.map(([label, href], index) => (
              <StaggerItem key={label} className={index === NEEDS.length - 1 ? "sm:col-span-2" : undefined}>
                <Link
                  href={href}
                  className={`im-lift group flex min-h-24 items-center justify-between gap-4 rounded-2xl border border-ink p-4 hover:shadow-[4px_4px_0_#111] ${index === NEEDS.length - 1 ? "bg-pink-dim hover:bg-pink-dim" : index % 3 === 1 ? "bg-blue-dim/60 hover:bg-blue-dim" : "bg-paper hover:bg-pink-dim/40"}`}
                >
                  <span>
                    <small className="block text-[9px] font-bold uppercase tracking-[0.15em] text-muted transition-colors group-hover:text-pink">0{index + 1}</small>
                    <strong className="mt-2 block font-display text-2xl font-semibold leading-none">{label}</strong>
                  </span>
                  <CornerDownRight className="im-nudge h-5 w-5 shrink-0" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <span className="text-xs font-semibold text-muted">Problem → clarity → right solution → action → proof</span>
            <Link href="/craft-paths" className="group inline-flex items-center gap-2 text-sm font-bold">
              <span className="im-underline">Explore Craft Paths</span> <ArrowRight className="im-nudge h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
