import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { getCurrentEditions } from "@/lib/server/newsletter/repository";
import { EditionCard } from "./edition-card";
import { SubscribeForm } from "./subscribe-form";

/** Homepage section: both current editions, the Top 3 entry point and subscribe. */
export async function NewsletterPreview() {
  const editions = await getCurrentEditions();
  return (
    <section id="newsletter" aria-labelledby="newsletter-heading" className="scroll-mt-28">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Reveal as="p" variant="fadeIn" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-pink"><Mail aria-hidden="true" className="h-4 w-4" />The ImpactFools newsletter</Reveal>
          <TextReveal as="h2" id="newsletter-heading" text="Monday: discover. Friday: build." className="mt-2 font-display text-4xl font-semibold leading-none md:text-6xl" />
        </div>
        <Link href="/newsletter" className="group inline-flex items-center gap-1 text-sm font-bold"><span className="im-underline">All editions</span><ArrowRight aria-hidden="true" className="im-nudge h-4 w-4" /></Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {editions.map((edition) => <Reveal key={edition.kind} className="h-full"><EditionCard edition={edition} tone={edition.kind === "weekend_top3" ? "dark" : "light"} /></Reveal>)}
      </div>
      <div className="mt-6 rounded-[2rem] border border-ink bg-white p-5 md:p-7">
        <p className="mb-4 font-display text-2xl font-semibold">Get both editions by email</p>
        <SubscribeForm source="homepage" idPrefix="home-nl" />
      </div>
    </section>
  );
}
