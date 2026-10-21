import Link from "next/link";
import { ArrowRight, Mail, Radar } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { getCategory } from "@/lib/pulse/categories";
import type { PulseCategory, PulseUpdate } from "@/lib/pulse/types";
import { DemoNotice } from "./demo-notice";
import { PulseFeed } from "./pulse-feed";

/** Shared layout for /pulse and /pulse/category/[category]. */
export function PulseIndex({ updates, category }: { updates: PulseUpdate[]; category: PulseCategory | "all" }) {
  const meta = category === "all" ? null : getCategory(category);
  return (
    <div className="pb-20">
      <header className="border-b border-ink bg-pink-dim px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-7xl">
          <Reveal immediate variant="fadeIn" as="p" className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">Impact Pulse{meta ? ` · ${meta.label}` : ""}</Reveal>
          <Reveal immediate as="h1" delay={0.05} className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-[0.95] md:text-7xl">
            {meta ? <><span aria-hidden="true">{meta.emoji} </span>{meta.label}</> : "What’s happening. What’s valuable. What’s next for you."}
          </Reveal>
          <Reveal immediate as="p" delay={0.12} className="mt-4 max-w-2xl text-base leading-relaxed text-ink/75">
            {meta ? meta.blurb : "Every update answers five questions — What? Why? Who? How? Next? — so you leave knowing what you can actually do."}
          </Reveal>
          <Reveal immediate delay={0.2} className="mt-6 flex flex-wrap gap-2 text-sm font-bold">
            <Link href="/pulse/radar" className="im-press inline-flex items-center gap-1.5 rounded-full border border-ink bg-white px-4 py-2"><Radar className="h-4 w-4" />Your Impact Radar</Link>
            <Link href="/pulse/brief" className="im-press inline-flex items-center gap-1.5 rounded-full border border-ink bg-white px-4 py-2"><Mail className="h-4 w-4" />The Impact Brief</Link>
            <Link href="/cart" className="group inline-flex items-center gap-1 px-2 py-2"><span className="im-underline">Your saved opportunities</span><ArrowRight className="im-nudge h-4 w-4" /></Link>
          </Reveal>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <h2 className="sr-only">Updates</h2>
        <DemoNotice updates={updates} />
        <PulseFeed updates={updates} initialCategory={category} showSearch urlBase="/pulse" idPrefix="index" />
      </section>
    </div>
  );
}
