import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { ImpactRadar } from "@/components/pulse/impact-radar";
import { RadarEditor } from "@/components/pulse/radar-editor";
import { getPublicUpdates } from "@/lib/server/pulse/repository";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Your Impact Radar — Impact Pulse",
  description: "Opportunities selected around your skills, interests and ambitions — with the reasons each one appears.",
};

export default async function RadarPage() {
  const updates = await getPublicUpdates();
  return (
    <div className="pb-20">
      <header className="border-b border-ink bg-blue-dim px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-5xl">
          <Reveal immediate variant="fadeIn" as="p" className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Impact Pulse · Personalisation</Reveal>
          <Reveal immediate as="h1" delay={0.05} className="mt-3 font-display text-5xl font-semibold leading-none md:text-7xl">Your Impact Radar</Reveal>
          <Reveal immediate as="p" delay={0.12} className="mt-4 max-w-2xl text-base text-ink/75">Opportunities selected around your skills, interests and ambitions. Tell us where you are and where you’re going — update it any time.</Reveal>
        </div>
      </header>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 md:px-6">
        <RadarEditor />
        <ImpactRadar updates={updates} limit={8} compactHeader />
      </div>
    </div>
  );
}
