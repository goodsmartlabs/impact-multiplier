import Link from "next/link";
import { ArrowRight, CalendarDays, ExternalLink, ShieldCheck } from "lucide-react";
import { EDITIONS, formatIssueDate } from "@/lib/newsletter/schedule";
import type { Discovery, NewsletterIssue, WeekendTop3Content, WhatsHotContent } from "@/lib/newsletter/types";
import { ResourceList } from "./resource-list";

export function IssueDateLine({ issue, isCurrent = true }: { issue: Pick<NewsletterIssue, "issueDate" | "kind" | "publishedAt">; isCurrent?: boolean }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold">
      <CalendarDays aria-hidden="true" className="h-4 w-4" />
      <time dateTime={issue.issueDate}>{formatIssueDate(issue.issueDate)}</time>
      {!isCurrent && <span className="rounded-full bg-pink-dim px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink">Previous edition — this week’s isn’t out yet</span>}
    </p>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm leading-relaxed">{children}</dd>
    </div>
  );
}

export function DiscoveryCard({ discovery, index }: { discovery: Discovery; index: number }) {
  return (
    <article id={`discovery-${index + 1}`} className="scroll-mt-28 rounded-3xl border border-ink bg-white p-5 shadow-[4px_4px_0_var(--color-ink)] md:p-6">
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em]">
        <span className="font-display text-2xl leading-none text-pink">{String(index + 1).padStart(2, "0")}</span>
        <span className="rounded-full bg-blue-dim px-2 py-0.5">{discovery.category}</span>
        <span className={discovery.freshness === "new" ? "rounded-full bg-pink px-2 py-0.5 text-white" : "rounded-full bg-ink/10 px-2 py-0.5"}>{discovery.freshness === "new" ? "New this week" : "Ongoing"}</span>
        <span className="rounded-full border border-ink/25 px-2 py-0.5">Difficulty: {discovery.difficulty}</span>
        {discovery.deadline && <span className="rounded-full border border-pink px-2 py-0.5">Deadline {discovery.deadline}</span>}
      </div>
      <h3 className="mt-3 font-display text-2xl font-semibold leading-tight md:text-3xl">{discovery.name}</h3>
      <dl className="mt-4 grid gap-3 md:grid-cols-2">
        <Field label="What’s happening">{discovery.whatsHappening}</Field>
        <Field label="Why it matters">{discovery.whyItMatters}</Field>
        <Field label="Who should pay attention">{discovery.whoShouldPayAttention}</Field>
        <Field label="Potential value">{discovery.potentialValue}</Field>
      </dl>
      <div className="mt-4 rounded-2xl bg-blue-dim p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue">Recommended first action</p>
        <p className="mt-1 text-sm font-semibold">{discovery.firstAction}</p>
      </div>
      {discovery.resources.length > 0 && <div className="mt-4"><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Resources</p><ResourceList resources={discovery.resources} /></div>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/15 pt-4">
        <p className="flex items-center gap-1.5 text-xs text-muted"><ShieldCheck aria-hidden="true" className="h-4 w-4 text-blue" />Source: <a href={discovery.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-semibold text-ink underline">{discovery.sourceName}<ExternalLink aria-hidden="true" className="h-3 w-3" /></a> · checked {discovery.lastVerifiedAt}</p>
        <Link href={discovery.link} className="im-press inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-xs font-bold text-white">EXPLORE THIS OPPORTUNITY <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
      </div>
    </article>
  );
}

function SectionHeading({ number, title, children }: { number: number; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">Section {number}</p>
      <h2 className="mt-1 font-display text-3xl font-semibold leading-none md:text-5xl">{title}</h2>
      {children && <p className="mt-2 max-w-2xl text-sm text-muted">{children}</p>}
    </div>
  );
}

function WhatsHotView({ content }: { content: WhatsHotContent }) {
  const byId = new Map(content.discoveries.map((discovery, index) => [discovery.id, { discovery, index }]));
  return (
    <div className="space-y-14">
      <section aria-labelledby="big-picture">
        <SectionHeading number={1} title="The Big Picture" />
        <div id="big-picture" className="rounded-3xl border-2 border-ink bg-pink-dim p-5 md:p-7">
          <p className="font-display text-2xl font-semibold leading-tight md:text-3xl">{content.bigPicture.headline}</p>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed">{content.bigPicture.points.map((point) => <li key={point} className="flex gap-2"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pink" />{point}</li>)}</ul>
        </div>
      </section>
      <section aria-labelledby="whats-hot-list">
        <SectionHeading number={2} title="What’s Hot This Week">Every discovery links to the source we checked and the date we checked it.</SectionHeading>
        <div id="whats-hot-list" className="space-y-5">{content.discoveries.map((discovery, index) => <DiscoveryCard key={discovery.id} discovery={discovery} index={index} />)}</div>
      </section>
      {content.opportunityMatch.length > 0 && (
        <section aria-labelledby="opportunity-match">
          <SectionHeading number={3} title="Opportunity Match">Find your goal, then start with the discovery we matched to it.</SectionHeading>
          <ul id="opportunity-match" className="grid gap-3 md:grid-cols-2">
            {content.opportunityMatch.map((match) => (
              <li key={match.goal} className="rounded-3xl border border-ink bg-white p-4">
                <p className="text-sm font-bold">{match.goalLabel}</p>
                <p className="mt-1 text-xs text-muted">{match.note}</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {match.discoveryIds.map((id) => byId.get(id)).filter(Boolean).map((entry) => <li key={entry!.discovery.id}><a href={`#discovery-${entry!.index + 1}`} className="font-semibold underline">{entry!.discovery.name}</a></li>)}
                </ul>
                {match.resource && <div className="mt-3"><ResourceList resources={[match.resource]} compact /></div>}
              </li>
            ))}
          </ul>
        </section>
      )}
      <section aria-labelledby="action" className="rounded-[2rem] border border-ink bg-ink p-6 text-white shadow-[6px_6px_0_var(--color-pink)] md:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-dim">Section 4</p>
        <h2 id="action" className="mt-1 font-display text-3xl font-semibold leading-none md:text-5xl">{content.action.headline}</h2>
        <p className="mt-3 max-w-2xl text-sm text-white/80">{content.action.body}</p>
        <div className="mt-5 text-ink"><ResourceList resources={content.action.resources} /></div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/academy" className="im-press inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-5 text-sm font-bold text-ink">START LEARNING <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
          <Link href="/newsletter/top-3" className="im-press inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white px-5 text-sm font-bold">FIND MY TOP 3</Link>
        </div>
      </section>
    </div>
  );
}

function WeekendView({ content }: { content: WeekendTop3Content }) {
  return (
    <div className="space-y-12">
      <section className="rounded-[2rem] border-2 border-ink bg-pink-dim p-6 md:p-8">
        <h2 className="font-display text-4xl font-semibold leading-none md:text-6xl">{content.intro.headline}</h2>
        <p className="mt-3 max-w-2xl text-base">{content.intro.body}</p>
        <Link href="/newsletter/top-3" className="im-lift mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white shadow-[4px_4px_0_var(--color-blue)]">FIND MY TOP 3 <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
      </section>
      <section aria-labelledby="examples">
        <h2 id="examples" className="font-display text-3xl font-semibold md:text-4xl">How it adapts to you</h2>
        <p className="mt-1 text-sm text-muted">Illustrative profiles — your Top 3 depends on your own answers.</p>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {content.examples.map((example) => (
            <li key={example.profile} className="flex flex-col rounded-3xl border border-ink bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-pink">{example.profile}</p>
              <p className="mt-2 font-display text-xl font-semibold leading-tight">{example.recommendation.title}</p>
              <p className="mt-2 text-xs text-muted">{example.recommendation.why}</p>
              <p className="mt-3 text-sm"><strong>Success looks like:</strong> {example.recommendation.success}</p>
              <Link href={example.recommendation.href} className="group mt-auto pt-4 text-sm font-bold"><span className="im-underline">BUILD MY WEEKEND PLAN</span></Link>
            </li>
          ))}
        </ul>
      </section>
      {content.featured.length > 0 && (
        <section aria-labelledby="featured">
          <h2 id="featured" className="mb-5 font-display text-3xl font-semibold md:text-4xl">Featured this weekend</h2>
          <div className="space-y-5">{content.featured.map((discovery, index) => <DiscoveryCard key={discovery.id} discovery={discovery} index={index} />)}</div>
        </section>
      )}
      <section aria-labelledby="actions" className="rounded-3xl border border-ink bg-white p-6">
        <h2 id="actions" className="font-display text-2xl font-semibold">This weekend</h2>
        <ol className="mt-3 space-y-2 text-sm">{content.practicalActions.map((action, index) => <li key={action} className="flex gap-3"><span className="font-display text-lg font-semibold text-pink">{index + 1}</span>{action}</li>)}</ol>
        <div className="mt-5"><ResourceList resources={content.evergreen} /></div>
      </section>
    </div>
  );
}

export function IssueView({ issue }: { issue: NewsletterIssue }) {
  return issue.content.kind === "whats_hot" ? <WhatsHotView content={issue.content} /> : <WeekendView content={issue.content} />;
}

export function editionMeta(kind: NewsletterIssue["kind"]) {
  return EDITIONS[kind];
}
