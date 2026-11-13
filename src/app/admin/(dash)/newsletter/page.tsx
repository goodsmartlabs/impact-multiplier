import Link from "next/link";
import { prepareNextIssue, runSchedulerNow } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/server/admin-auth";
import { EDITION_KINDS, EDITIONS, formatIssueDate, jubaClock, upcomingIssueDate } from "@/lib/newsletter/schedule";
import { ISSUE_STATUS_LABEL } from "@/lib/newsletter/status";
import { newsletterConfigSummary } from "@/lib/server/newsletter/config";
import { getNewsletterStore } from "@/lib/server/newsletter/store";
import { getPulseStore } from "@/lib/server/pulse/repository";

export const dynamic = "force-dynamic";


function Flag({ on, label, detail }: { on: boolean; label: string; detail: string }) {
  return (
    <li className="rounded-2xl border border-ink/20 bg-white p-3">
      <p className="flex items-center gap-2 text-sm font-bold"><span aria-hidden="true" className={on ? "h-2.5 w-2.5 rounded-full bg-blue" : "h-2.5 w-2.5 rounded-full bg-pink"} />{label}: {on ? "on" : "off"}</p>
      <p className="mt-1 text-xs text-muted">{detail}</p>
    </li>
  );
}

export default async function NewsletterAdminPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  await requireAdmin();
  const { message } = await searchParams;
  const store = getNewsletterStore();
  const config = newsletterConfigSummary();
  const [issues, runs, subscribers] = await Promise.all([store.listIssues({ limit: 60 }, { fresh: true }), store.listRuns(40), getPulseStore().listSubscribers()]);
  const today = jubaClock(new Date()).date;
  const verified = subscribers.filter((subscriber) => subscriber.status === "active" && subscriber.verifiedAt).length;
  const pending = subscribers.filter((subscriber) => subscriber.status === "pending").length;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl font-semibold">Newsletter engine</h1>
        <p className="mt-1 text-sm text-muted">Monday “What’s Hot” and Friday “Your Weekend Top 3”, 07:00 Africa/Juba. Drafts are prepared the day before from verified Impact Pulse records.</p>
        {message && <p role="status" className="mt-4 rounded-2xl border border-ink bg-blue-dim p-3 text-sm">{message}</p>}
      </div>

      <section aria-labelledby="config">
        <h2 id="config" className="font-display text-2xl font-semibold">Configuration</h2>
        <ul className="mt-3 grid gap-2 md:grid-cols-3">
          <Flag on={store.kind !== "none"} label="Database" detail={store.kind === "none" ? "Apply supabase/migrations/202611130001_newsletter_engine.sql and set SUPABASE_URL / SUPABASE_SECRET_KEY." : `Using ${store.kind}.`} />
          <Flag on={config.cron} label="Scheduler" detail={config.cron ? "CRON_SECRET set; Vercel Cron calls /api/cron/newsletter daily at 05:00 UTC." : "Set CRON_SECRET (16+ chars) in Vercel so the daily cron is authorised."} />
          <Flag on={config.autoPublish} label="Auto-publish" detail={config.autoPublish ? "Valid drafts are approved automatically and publish at 07:00." : "Approval mode: every draft waits for you. Set NEWSLETTER_AUTO_PUBLISH=true to auto-publish."} />
          <Flag on={config.email} label="Email delivery" detail={config.email ? `Resend configured. Sending on publish: ${config.emailSending ? "yes" : "no (NEWSLETTER_SEND_EMAIL=false)"}.` : "Set RESEND_API_KEY and NEWSLETTER_FROM_EMAIL (a verified sender domain)."} />
          <Flag on={config.socialExport} label="Rulo Social export" detail={config.socialExport ? "GET /api/social/newsletter?edition=monday|friday with the bearer token." : "Set RULO_SOCIAL_TOKEN (24+ chars) and share it with Rulo Social."} />
          <li className="rounded-2xl border border-ink/20 bg-white p-3"><p className="text-sm font-bold">Subscribers</p><p className="mt-1 text-xs text-muted">{verified} confirmed · {pending} awaiting confirmation · <Link href="/admin/subscribers" className="underline">manage</Link></p></li>
        </ul>
      </section>

      <section aria-labelledby="next">
        <h2 id="next" className="font-display text-2xl font-semibold">Next issues</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {EDITION_KINDS.map((kind) => {
            const date = upcomingIssueDate(kind, today);
            const issue = issues.find((item) => item.kind === kind && item.issueDate === date);
            return (
              <div key={kind} className="rounded-3xl border border-ink bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-pink">{EDITIONS[kind].emoji} {EDITIONS[kind].label}</p>
                <p className="mt-1 font-display text-xl font-semibold">{formatIssueDate(date)}</p>
                <p className="mt-1 text-xs text-muted">{issue ? <>Status: <Link href={`/admin/newsletter/${issue.id}`} className="font-bold underline">{ISSUE_STATUS_LABEL[issue.status]}</Link></> : "Not prepared yet — the scheduler prepares it the day before."}</p>
                <form action={prepareNextIssue} className="mt-3 flex flex-wrap gap-2">
                  <input type="hidden" name="kind" value={kind} />
                  {issue && issue.status !== "published" && issue.status !== "archived" && <input type="hidden" name="regenerate" value="1" />}
                  <button type="submit" disabled={store.kind === "none" || issue?.status === "published"} className="im-press rounded-full bg-ink px-4 py-2 text-xs font-bold text-white disabled:opacity-40">{issue ? "Re-run research & regenerate" : "Prepare now"}</button>
                </form>
              </div>
            );
          })}
        </div>
        <form action={runSchedulerNow} className="mt-3"><button type="submit" disabled={store.kind === "none"} className="im-press rounded-full border border-ink px-4 py-2 text-xs font-bold disabled:opacity-40">Run the scheduler now (same as the 07:00 cron)</button></form>
      </section>

      <section aria-labelledby="issues">
        <h2 id="issues" className="font-display text-2xl font-semibold">Issues</h2>
        {issues.length ? (
          <ul className="mt-3 divide-y divide-ink/10 rounded-3xl border border-ink bg-white">
            {issues.map((issue) => (
              <li key={issue.id}><Link href={`/admin/newsletter/${issue.id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-blue-dim"><span><span className="block text-sm font-bold">{issue.title}</span><span className="text-xs text-muted">{issue.summary}</span></span><span className="rounded-full bg-ink/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]">{ISSUE_STATUS_LABEL[issue.status]}</span></Link></li>
            ))}
          </ul>
        ) : <p className="mt-3 rounded-3xl border border-dashed border-ink p-6 text-sm text-muted">No issues yet.</p>}
      </section>

      <section aria-labelledby="runs">
        <h2 id="runs" className="font-display text-2xl font-semibold">Run log</h2>
        {runs.length ? (
          <div className="mt-3 overflow-x-auto rounded-3xl border border-ink bg-white">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-ink"><tr><th className="p-3">When (UTC)</th><th className="p-3">Action</th><th className="p-3">Edition</th><th className="p-3">Trigger</th><th className="p-3">Outcome</th><th className="p-3">Message</th></tr></thead>
              <tbody>
                {runs.map((run) => (
                  <tr key={run.id} className="border-b border-ink/10 align-top">
                    <td className="whitespace-nowrap p-3">{run.createdAt.replace("T", " ").slice(0, 16)}</td>
                    <td className="p-3">{run.action}</td>
                    <td className="whitespace-nowrap p-3">{run.kind ? `${EDITIONS[run.kind].short} ${run.issueDate ?? ""}` : "—"}</td>
                    <td className="p-3">{run.trigger}</td>
                    <td className={run.outcome === "failed" ? "p-3 font-bold text-pink" : "p-3"}>{run.outcome}</td>
                    <td className="p-3">{run.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="mt-3 text-sm text-muted">No runs recorded yet.</p>}
      </section>
    </div>
  );
}
