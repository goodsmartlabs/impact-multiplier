import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, ShieldCheck } from "lucide-react";
import { EditionCard } from "@/components/newsletter/edition-card";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { EDITIONS, formatIssueDate } from "@/lib/newsletter/schedule";
import { getArchive, getCurrentEditions } from "@/lib/server/newsletter/repository";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "The ImpactFools Newsletter — What’s Hot on Monday, Your Weekend Top 3 on Friday",
  description: "Every Monday: the verified skills, tools and opportunities worth your attention. Every Friday: three weekend projects matched to your goals, time and resources.",
  alternates: { canonical: "/newsletter" },
};

export default async function NewsletterHub() {
  const [editions, archive] = await Promise.all([getCurrentEditions(), getArchive()]);
  return (
    <div className="pb-20">
      <section className="border-b border-ink bg-pink-dim px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">The ImpactFools newsletter</p>
          <h1 className="mt-2 max-w-4xl font-display text-5xl font-semibold leading-none md:text-7xl">Discover on Monday. Build on Friday.</h1>
          <p className="mt-4 max-w-2xl text-base">Two short editions a week, published at 7:00 AM Juba time. Monday shows what’s worth your attention. Friday turns it into one thing you can finish by Sunday.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/newsletter/top-3" className="im-lift inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white shadow-[4px_4px_0_var(--color-blue)]">FIND MY TOP 3 <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
            <a href="#subscribe" className="im-press inline-flex min-h-12 items-center rounded-full border border-ink bg-white px-6 text-sm font-bold">Subscribe free</a>
            <Link href="/newsletter/my-plan" className="im-press inline-flex min-h-12 items-center rounded-full border border-ink bg-white px-6 text-sm font-bold">My weekend plan</Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 md:px-6">
        <section aria-label="Current editions" className="grid gap-5 md:grid-cols-2">
          {editions.map((edition) => <EditionCard key={edition.kind} edition={edition} tone={edition.kind === "weekend_top3" ? "dark" : "light"} />)}
        </section>

        <section aria-labelledby="standards" className="grid gap-4 rounded-3xl border border-ink bg-white p-6 md:grid-cols-3">
          <h2 id="standards" className="sr-only">Editorial standards</h2>
          <p className="flex gap-3 text-sm"><ShieldCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-blue" /><span><strong>Sourced, not invented.</strong> Every discovery links to the source an editor checked, with the date it was checked. Demo or unverified items are never included.</span></p>
          <p className="flex gap-3 text-sm"><CalendarClock aria-hidden="true" className="h-5 w-5 shrink-0 text-pink" /><span><strong>Dated honestly.</strong> If an edition isn’t ready, the previous one stays up with its real date — it’s never relabelled as new.</span></p>
          <p className="flex gap-3 text-sm"><span aria-hidden="true" className="text-lg leading-none">🏷️</span><span><strong>Free and paid, clearly labelled.</strong> Recommendations are chosen for relevance; paid options are marked as paid. <Link href="/pulse/standards" className="font-semibold underline">Our standards</Link></span></p>
        </section>

        <section id="subscribe" aria-labelledby="subscribe-heading" className="scroll-mt-28 rounded-[2rem] border-2 border-ink bg-white p-6 shadow-[6px_6px_0_var(--color-pink)] md:p-8">
          <h2 id="subscribe-heading" className="font-display text-3xl font-semibold md:text-4xl">Get both editions by email</h2>
          <p className="mb-5 mt-1 text-sm text-muted">Free. Confirm your email once; unsubscribe from any email in one click. You can use FIND MY TOP 3 without subscribing.</p>
          <SubscribeForm source="newsletter-hub" idPrefix="hub-nl" />
        </section>

        <section id="archive" aria-labelledby="archive-heading" className="scroll-mt-28">
          <h2 id="archive-heading" className="font-display text-3xl font-semibold md:text-4xl">Archive</h2>
          {archive.length ? (
            <ul className="mt-5 divide-y divide-ink/10 rounded-3xl border border-ink bg-white">
              {archive.map((issue) => (
                <li key={issue.id}>
                  <Link href={`/newsletter/${issue.slug}`} className="group flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-blue-dim">
                    <span className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-pink">{EDITIONS[issue.kind].emoji} {EDITIONS[issue.kind].label}</span>
                      <span className="block text-sm font-semibold">{issue.summary}</span>
                    </span>
                    <time dateTime={issue.issueDate} className="text-xs font-bold">{formatIssueDate(issue.issueDate)}</time>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-3xl border border-dashed border-ink/40 bg-white p-6 text-sm">No editions have been published yet. Published editions will be listed here with their dates.</p>
          )}
        </section>
      </div>
    </div>
  );
}
