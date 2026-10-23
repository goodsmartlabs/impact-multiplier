import Link from "next/link";
import { ArrowRight, Hammer } from "lucide-react";
import { CraftHero } from "@/components/home/craft-hero";
import { NeedDiscovery } from "@/components/home/need-discovery";
import { OfferWorlds } from "@/components/home/offer-worlds";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { BriefSignup } from "@/components/pulse/brief-signup";
import { DemoNotice } from "@/components/pulse/demo-notice";
import { ImpactRadar } from "@/components/pulse/impact-radar";
import { JourneyBand } from "@/components/pulse/journey-band";
import { PulseFeed } from "@/components/pulse/pulse-feed";
import { PulseHero } from "@/components/pulse/pulse-hero";
import { pickFeatured } from "@/lib/pulse/feed";
import { getPublicUpdates } from "@/lib/server/pulse/repository";

// Refresh the feed every five minutes; admin publishes also revalidate it immediately.
export const revalidate = 300;

export default async function Home() {
  const updates = await getPublicUpdates();
  const featured = pickFeatured(updates);
  const feed = updates.filter((update) => update.id !== featured?.id);

  return (
    <div className="pb-20">
      <PulseHero featured={featured} liveCount={updates.length} />

      <section id="pulse-feed" aria-labelledby="feed-heading" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-12 md:px-6 md:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal as="p" variant="fadeIn" className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">The Impact Pulse feed</Reveal>
            <TextReveal as="h2" id="feed-heading" text="What’s happening. What’s valuable." className="mt-2 font-display text-4xl font-semibold leading-none md:text-6xl" />
          </div>
          <Link href="/pulse" className="group inline-flex items-center gap-1 text-sm font-bold"><span className="im-underline">Open the full Pulse</span><ArrowRight className="im-nudge h-4 w-4" /></Link>
        </div>
        <DemoNotice updates={updates} />
        <PulseFeed updates={feed} pageSize={6} idPrefix="home" />
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 pb-16 md:px-6">
        <ImpactRadar updates={updates} />
        <BriefSignup />
      </div>

      <JourneyBand />

      <CraftHero />

      <OfferWorlds />

      <section className="border-b border-ink bg-blue-dim px-4 py-10 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-3xl border-2 border-ink bg-paper p-6 shadow-[7px_7px_0_var(--im-pink)] md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue"><Hammer className="h-4 w-4" /> The 7-Day Build Challenge</p>
            <h2 className="mt-2 font-display text-4xl font-semibold uppercase md:text-6xl">7 days. One build.</h2>
            <p className="mt-3 text-sm font-semibold md:text-base">Stop opening ideas. Start finishing them.</p>
          </div>
          <Link href="/build-challenge" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white">Start building <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

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
    </div>
  );
}

