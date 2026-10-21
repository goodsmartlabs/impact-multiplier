import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Building2, CalendarClock, FlaskConical, GraduationCap, MapPin, ShieldCheck, Users } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { StartImpactMoveButton } from "@/components/discovery/start-impact-move-button";
import { SignalList } from "@/components/pulse/impact-signal";
import { CategoryChip, PulseCard, PulseCta, SourceLink, VerificationBadge } from "@/components/pulse/pulse-card";
import { PulseSaveButton } from "@/components/pulse/pulse-save-button";
import { ViewTracker } from "@/components/pulse/view-tracker";
import { getCourseBySlug } from "@/lib/data/courses";
import { COURSE_ACCESS_LABELS } from "@/lib/data/constants";
import { getCategory } from "@/lib/pulse/categories";
import { deadlineLabel, formatDate, isExpired } from "@/lib/pulse/feed";
import { DEMO_UPDATES } from "@/lib/pulse/seed";
import { getPublicUpdate, getPublicUpdates } from "@/lib/server/pulse/repository";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return DEMO_UPDATES.map((update) => ({ slug: update.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const update = await getPublicUpdate((await params).slug);
  if (!update) return {};
  return {
    title: `${update.title} — Impact Pulse`,
    description: update.summary,
    alternates: { canonical: `/pulse/${update.slug}` },
    openGraph: { type: "article", title: update.title, description: update.summary, publishedTime: update.publishedAt },
    // Demonstration content should not be indexed as if it were news.
    robots: update.verification === "demo" ? { index: false, follow: true } : undefined,
  };
}

export default async function PulseUpdatePage({ params }: { params: Params }) {
  const update = await getPublicUpdate((await params).slug);
  if (!update) notFound();

  const expired = update.status === "expired" || isExpired(update);
  const category = getCategory(update.category);
  const courses = update.relatedCourseSlugs.map(getCourseBySlug).filter((course) => Boolean(course));
  const related = (await getPublicUpdates()).filter((item) => item.id !== update.id && item.category === update.category).slice(0, 3);
  const deadline = deadlineLabel(update);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: update.title,
    description: update.summary,
    datePublished: update.publishedAt,
    dateModified: update.lastVerifiedAt ?? update.updatedAt.slice(0, 10),
    articleSection: category.label,
    keywords: [...update.tags, ...update.skills].join(", "),
    author: { "@type": "Organization", name: "ImpactFools" },
    publisher: { "@type": "Organization", name: "ImpactFools" },
    ...(update.sourceUrl ? { isBasedOn: update.sourceUrl } : {}),
  };

  return (
    <article className="pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ViewTracker updateId={update.id} />

      <header className={category.tone === "ink" ? "border-b border-ink bg-ink px-4 py-10 text-white md:px-6 md:py-14" : `border-b border-ink px-4 py-10 md:px-6 md:py-14 ${category.tone === "pink" ? "bg-pink-dim" : "bg-blue-dim"}`}>
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="text-xs font-bold uppercase tracking-[0.14em]">
            <Link href="/pulse" className="group inline-flex items-center gap-1"><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />Impact Pulse</Link>
            <span aria-hidden="true" className="mx-2 opacity-50">/</span>
            <Link href={`/pulse/category/${update.category}`} className="hover:underline">{category.label}</Link>
          </nav>
          <div className="mt-6 flex flex-wrap items-center gap-3"><CategoryChip update={update} dark={category.tone === "ink"} /><VerificationBadge update={update} dark={category.tone === "ink"} /></div>
          <Reveal immediate as="h1" className="mt-4 font-display text-4xl font-semibold leading-[1.02] md:text-6xl">{update.title}</Reveal>
          <Reveal immediate as="p" delay={0.08} className="mt-4 max-w-3xl text-lg leading-relaxed opacity-85">{update.summary}</Reveal>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold opacity-85">
            <li><time dateTime={update.publishedAt}>Published {formatDate(update.publishedAt)}</time></li>
            <li>{update.lastVerifiedAt ? `Source checked ${formatDate(update.lastVerifiedAt)}` : "Not independently verified"}</li>
            {deadline && <li className="inline-flex items-center gap-1"><CalendarClock className="h-4 w-4" />{deadline}</li>}
            {update.job?.company && <li className="inline-flex items-center gap-1"><Building2 className="h-4 w-4" />{update.job.company}</li>}
            {(update.job?.location || update.location) && <li className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{update.job?.location ?? update.location}{update.job?.remote ? ` · ${update.job.remote}` : ""}</li>}
          </ul>
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-5xl space-y-4 px-4 md:px-6">
        {update.verification === "demo" && (
          <p className="flex items-start gap-2 rounded-2xl border border-ink bg-white p-4 text-sm"><FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-blue" /><span><strong>Demonstration content.</strong> This is an evergreen explainer or format preview that ships with ImpactFools — not live news and not an open vacancy. <Link href="/pulse/standards" className="font-semibold underline">How Impact Pulse verifies updates</Link></span></p>
        )}
        {expired && (
          <p role="status" className="flex items-start gap-2 rounded-2xl border border-pink bg-pink-dim p-4 text-sm"><CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-pink" /><span><strong>This opportunity has closed.</strong> It’s kept here for reference. Don’t apply based on this page — look for the next round at the original source.</span></p>
        )}
        {update.verification === "unverified" && !expired && (
          <p className="flex items-start gap-2 rounded-2xl border border-ink/30 bg-white p-4 text-sm"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted" />Our editors haven’t confirmed every detail yet. Check dates and eligibility with the original source before acting.</p>
        )}
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-10 px-4 md:px-6 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="signal-heading">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">The Impact Signal</p>
          <h2 id="signal-heading" className="mt-2 font-display text-3xl font-semibold">What this means for you</h2>
          <div className="mt-6 rounded-3xl border border-ink bg-white p-5 shadow-[5px_5px_0_#111] md:p-7"><SignalList signal={update.signal} /></div>

          {update.eligibility && (
            <div className="mt-6 rounded-3xl border border-ink bg-cream p-5">
              <h3 className="flex items-center gap-2 font-display text-xl font-semibold"><Users className="h-5 w-5 text-blue" />Eligibility</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{update.eligibility}</p>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-ink bg-white p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Take action</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {!expired && <PulseCta update={update} />}
              <PulseSaveButton update={update} />
            </div>
            <StartImpactMoveButton title={update.title} label="Turn into an Impact Move" className="mt-3 border border-ink bg-transparent px-4 py-2 text-xs font-bold text-ink hover:bg-blue-dim" />
            <div className="mt-4 border-t border-line pt-4">
              {update.sourceUrl ? (
                <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold underline underline-offset-4">Inspect the original source<ArrowUpRight className="h-4 w-4" /></a>
              ) : <SourceLink update={update} />}
              <p className="mt-1 text-xs text-muted">{update.sourceName}</p>
            </div>
          </div>

          {update.skills.length > 0 && (
            <div className="rounded-3xl border border-ink bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Skills involved</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">{update.skills.map((skill) => <li key={skill}><Link href={`/search?q=${encodeURIComponent(skill)}`} className="inline-block rounded-full border border-ink/30 px-2.5 py-1 text-xs font-semibold hover:border-ink hover:bg-blue-dim">{skill}</Link></li>)}</ul>
            </div>
          )}

          {courses.length > 0 && (
            <div className="rounded-3xl border border-ink bg-blue-dim p-5">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue"><GraduationCap className="h-4 w-4" />Build the skill in the Academy</p>
              <ul className="mt-3 space-y-2">
                {courses.map((course) => course && (
                  <li key={course.slug}><Link href={`/academy/${course.slug}`} className="im-lift block rounded-2xl border border-ink bg-white p-3 hover:shadow-[3px_3px_0_#111]"><span className="block font-display text-lg font-semibold leading-tight">{course.title}</span><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{COURSE_ACCESS_LABELS[course.access]}</span></Link></li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mx-auto mt-16 max-w-7xl px-4 md:px-6">
          <h2 id="related-heading" className="font-display text-3xl font-semibold">More in {category.label}</h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{related.map((item) => <li key={item.id}><PulseCard update={item} size="compact" /></li>)}</ul>
        </section>
      )}
    </article>
  );
}
