import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { IssueDateLine, IssueView } from "@/components/newsletter/issue-view";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { EDITIONS, isCurrentIssue } from "@/lib/newsletter/schedule";
import { getPublicIssue } from "@/lib/server/newsletter/repository";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const issue = await getPublicIssue((await params).slug);
  if (!issue) return { title: "Edition not found" };
  return { title: `${issue.title} — ImpactFools`, description: issue.summary, alternates: { canonical: `/newsletter/${issue.slug}` } };
}

export default async function IssuePage({ params }: { params: Params }) {
  const issue = await getPublicIssue((await params).slug);
  if (!issue) notFound();
  const meta = EDITIONS[issue.kind];
  const current = issue.status === "published" && isCurrentIssue(issue.kind, issue.issueDate, new Date());
  return (
    <div className="pb-20">
      <header className={issue.kind === "whats_hot" ? "border-b border-ink bg-pink-dim px-4 py-10 md:px-6 md:py-14" : "border-b border-ink bg-blue-dim px-4 py-10 md:px-6 md:py-14"}>
        <div className="mx-auto max-w-5xl">
          <Link href="/newsletter" className="group inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em]"><ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-x-1" />All editions</Link>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-pink">{meta.label}</p>
          <h1 className="mt-2 font-display text-5xl font-semibold uppercase leading-none md:text-7xl">{meta.short} <span aria-hidden="true">{meta.emoji}</span></h1>
          <div className="mt-4"><IssueDateLine issue={issue} isCurrent={current} /></div>
          {issue.status === "archived" && <p className="mt-2 text-xs font-semibold">Archived edition. Opportunities and deadlines may have changed since it was published.</p>}
        </div>
      </header>
      <div className="mx-auto max-w-5xl space-y-14 px-4 py-10 md:px-6">
        <IssueView issue={issue} />
        <section aria-labelledby="issue-subscribe" className="rounded-[2rem] border border-ink bg-white p-6 md:p-8">
          <h2 id="issue-subscribe" className="mb-4 font-display text-2xl font-semibold md:text-3xl">Get the next edition by email</h2>
          <SubscribeForm source={`issue-${issue.kind}`} idPrefix="issue-nl" />
        </section>
      </div>
    </div>
  );
}
