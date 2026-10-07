import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers3, Route, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Capacity Guide — ImpactFools Academia",
  description: "Discover what you can build from the skills, knowledge, experience and interests already in your hands.",
};

const journey = [
  ["Discover", "Recognize the skills, knowledge and experience already in your hands."],
  ["Build", "Choose a realistic capacity direction and focus it for 30 days."],
  ["Prove", "Create evidence that shows what you are becoming capable of."],
  ["Monetize", "Test whether that capability can create useful real-world value."],
] as const;

export default function CapacityGuidePage() {
  return (
    <div className="pb-20">
      <section className="overflow-hidden border-b border-ink bg-blue-dim px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <Reveal immediate className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"><Sparkles className="h-4 w-4 text-blue" /> ImpactFools Capacity Guide</Reveal>
            <Reveal as="h1" immediate delay={0.08} className="mt-5 max-w-3xl font-display text-6xl font-semibold leading-[0.82] tracking-[-0.04em] sm:text-8xl">Find what you can build.</Reveal>
            <Reveal as="p" immediate delay={0.16} className="mt-7 max-w-xl text-lg leading-relaxed text-ink/75">You might not need to start from zero. You might need to recognize what’s already in your hands—and build from there.</Reveal>
            <Reveal immediate delay={0.24} className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center"><Link href="/capacity-guide/start" className="im-lift group inline-flex min-h-14 items-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-bold text-white shadow-[4px_4px_0_var(--color-blue)]">Start My Capacity Guide <ArrowRight className="im-nudge h-4 w-4" /></Link><span className="text-xs font-semibold text-muted">Takes approximately 5–10 minutes.</span></Reveal>
          </div>
          <Reveal immediate delay={0.2} variant="scaleIn" className="relative rounded-[2rem] border border-ink bg-white p-6 shadow-[8px_8px_0_#111] sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Your next capacity direction</p>
            <div className="mt-8 space-y-4">{journey.map(([title], index) => <div key={title} className="flex items-center gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink bg-pink-dim font-bold">{String(index + 1).padStart(2, "0")}</span><span className="font-display text-3xl font-semibold">{title}</span>{index < journey.length - 1 && <span className="ml-auto text-xl text-blue">↓</span>}</div>)}</div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">What this guide does</p><h2 className="mt-3 font-display text-4xl font-semibold leading-none sm:text-6xl">What’s already in your hands?</h2><p className="mt-5 text-base leading-relaxed text-muted">Discover the skills, knowledge, experience and interests you could develop into stronger capacity, opportunities and income. This is decision support—not a personality quiz or a promise of guaranteed earnings.</p></div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">{journey.map(([title, copy], index) => <article key={title} className="rounded-3xl border border-ink bg-white p-5"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue">0{index + 1}</span><h3 className="mt-3 font-display text-3xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{copy}</p></article>)}</div>
      </section>

      <section className="border-y border-ink bg-pink-dim px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <Info icon={Layers3} title="Build a Capacity Stack" copy="Combine what you already know with a useful new capability." />
          <Info icon={Route} title="Map Possible Opportunities" copy="Explore employment, freelancing, consulting, products and business directions responsibly." />
          <Info icon={CheckCircle2} title="Leave With a Build" copy="Choose a 30-day direction, a first proof project and a small value test." />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24"><p className="font-display text-4xl font-semibold leading-tight sm:text-6xl">What’s already in your hands + what could you build + where could it create value?</p><Link href="/capacity-guide/start" className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-full bg-blue px-6 py-4 text-sm font-bold text-white shadow-[4px_4px_0_#111]">Find My Direction <ArrowRight className="h-4 w-4" /></Link></section>
    </div>
  );
}

function Info({ icon: Icon, title, copy }: { icon: typeof Layers3; title: string; copy: string }) {
  return <article className="flex gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-ink bg-white"><Icon className="h-5 w-5 text-blue" /></span><div><h3 className="font-display text-2xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{copy}</p></div></article>;
}
