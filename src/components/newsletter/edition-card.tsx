import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EDITIONS, formatIssueDate, upcomingIssueDate, jubaClock } from "@/lib/newsletter/schedule";
import type { CurrentEdition } from "@/lib/server/newsletter/repository";
import { cn } from "@/lib/utils";

const CTA = { whats_hot: "DISCOVER WHAT’S HOT", weekend_top3: "FIND MY TOP 3" } as const;

/** The current (or latest) edition of one kind, always shown with its real date. */
export function EditionCard({ edition, tone = "light" }: { edition: CurrentEdition; tone?: "light" | "dark" }) {
  const meta = EDITIONS[edition.kind];
  const { issue } = edition;
  const nextDate = upcomingIssueDate(edition.kind, jubaClock(new Date()).date);
  const primaryHref = edition.kind === "weekend_top3" ? "/newsletter/top-3" : issue ? `/newsletter/${issue.slug}` : "/newsletter";
  return (
    <article className={cn("flex h-full flex-col rounded-[2rem] border-2 border-ink p-6", tone === "dark" ? "bg-ink text-white" : "bg-white", edition.kind === "whats_hot" ? "shadow-[6px_6px_0_var(--color-pink)]" : "shadow-[6px_6px_0_var(--color-blue)]")}>
      <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", tone === "dark" ? "text-pink-dim" : "text-pink")}>{meta.day} · 7:00 AM Juba</p>
      <h3 className="mt-2 font-display text-3xl font-semibold uppercase leading-none md:text-4xl">{meta.short} <span aria-hidden="true">{meta.emoji}</span></h3>
      <p className={cn("mt-2 text-sm", tone === "dark" ? "text-white/75" : "text-muted")}>{meta.tagline}</p>
      <div className={cn("mt-5 rounded-2xl p-4", tone === "dark" ? "bg-white/10" : "bg-blue-dim")}>
        {issue ? (
          <>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em]">{edition.isCurrent ? "This week’s edition" : "Latest edition"} · <time dateTime={issue.issueDate}>{formatIssueDate(issue.issueDate)}</time></p>
            <p className="mt-1 text-sm font-semibold">{issue.summary}</p>
            {!edition.isCurrent && <p className="mt-1 text-xs opacity-80">The next edition is due {formatIssueDate(nextDate)}.</p>}
          </>
        ) : (
          <p className="text-sm">No edition published yet. The first one is due {formatIssueDate(nextDate)}, once it passes editorial checks.</p>
        )}
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Link href={primaryHref} className={cn("im-lift inline-flex min-h-11 items-center gap-1.5 rounded-full px-5 text-sm font-bold", tone === "dark" ? "bg-white text-ink" : "bg-ink text-white")}>{CTA[edition.kind]} <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
        {issue && edition.kind === "weekend_top3" && <Link href={`/newsletter/${issue.slug}`} className={cn("im-press inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-bold", tone === "dark" ? "border-white" : "border-ink")}>Read the edition</Link>}
      </div>
    </article>
  );
}
