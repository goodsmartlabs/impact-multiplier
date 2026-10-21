import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { BriefSignup } from "@/components/pulse/brief-signup";
import { editionDate } from "@/components/pulse/edition-view";
import { getPublicEditions } from "@/lib/server/pulse/repository";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "The Impact Brief — One week. The updates worth your attention.",
  description: "The ImpactFools weekly newsletter: what’s hot, a skill worth building, opportunities, something to learn, a money move and your power move.",
};

export default async function BriefArchivePage() {
  const editions = await getPublicEditions();
  return (
    <div className="pb-20">
      <header className="border-b border-ink bg-pink-dim px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-5xl">
          <Reveal immediate variant="fadeIn" as="p" className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">Impact Pulse · Newsletter</Reveal>
          <Reveal immediate as="h1" delay={0.05} className="mt-3 font-display text-5xl font-semibold leading-none md:text-7xl">The Impact Brief</Reveal>
          <Reveal immediate as="p" delay={0.12} className="mt-4 text-xl text-ink/75">One week. The updates worth your attention.</Reveal>
        </div>
      </header>
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10 md:px-6">
        <section aria-labelledby="archive-heading">
          <h2 id="archive-heading" className="font-display text-3xl font-semibold">Archive</h2>
          {editions.length === 0 ? (
            <p className="mt-4 rounded-3xl border border-dashed border-ink p-8 text-center text-sm text-muted">No editions have been published yet. Subscribe below to be first.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {editions.map((edition) => (
                <li key={edition.id}>
                  <Link href={`/pulse/brief/${edition.slug}`} className="im-lift group flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-ink bg-white p-5 hover:shadow-[4px_4px_0_#111]">
                    <span>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{editionDate(edition)}{edition.demo ? " · Demo edition" : ""}</span>
                      <span className="mt-1 block font-display text-2xl font-semibold leading-tight">{edition.title}</span>
                    </span>
                    <ArrowRight className="im-nudge h-5 w-5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <BriefSignup />
      </div>
    </div>
  );
}
