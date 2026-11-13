import Link from "next/link";
import { notFound } from "next/navigation";
import { approveIssueAction, archiveIssue, regenerateIssue, sendIssueAction, unscheduleIssue } from "@/app/admin/actions";
import { IssueContentForm } from "@/components/admin/issue-content-form";
import { IssueView } from "@/components/newsletter/issue-view";
import { requireAdmin } from "@/lib/server/admin-auth";
import { validateIssueContent } from "@/lib/newsletter/compose";
import { EDITIONS, formatIssueDate, isDue } from "@/lib/newsletter/schedule";
import { ISSUE_STATUS_LABEL } from "@/lib/newsletter/status";
import { emailSendingEnabled } from "@/lib/server/newsletter/config";
import { getNewsletterStore } from "@/lib/server/newsletter/store";

export const dynamic = "force-dynamic";

function ActionButton({ action, id, label, extra, tone = "light", disabled = false }: { action: (formData: FormData) => Promise<void>; id: string; label: string; extra?: Record<string, string>; tone?: "light" | "dark"; disabled?: boolean }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {Object.entries(extra ?? {}).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
      <button type="submit" disabled={disabled} className={tone === "dark" ? "im-press rounded-full bg-ink px-4 py-2 text-xs font-bold text-white disabled:opacity-40" : "im-press rounded-full border border-ink px-4 py-2 text-xs font-bold disabled:opacity-40"}>{label}</button>
    </form>
  );
}

export default async function IssueAdminPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ message?: string }> }) {
  await requireAdmin();
  const [{ id }, { message }] = await Promise.all([params, searchParams]);
  const store = getNewsletterStore();
  const issue = await store.getIssue(id, { fresh: true });
  if (!issue) notFound();
  const errors = validateIssueContent(issue.content, issue.kind);
  const counts = issue.status === "published" || issue.status === "archived" ? await store.sendCounts(issue.id) : null;
  const editable = !["published", "archived"].includes(issue.status);
  const due = isDue(issue.issueDate, new Date());
  const accepted = issue.research.entries.filter((entry) => entry.verdict === "accepted").length;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/newsletter" className="text-xs font-bold underline">← Newsletter engine</Link>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-pink">{EDITIONS[issue.kind].label} · {formatIssueDate(issue.issueDate)}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">{issue.title}</h1>
        <p className="mt-2 inline-flex rounded-full bg-ink/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]">{ISSUE_STATUS_LABEL[issue.status]}</p>
        {issue.approvedAt && <p className="mt-1 text-xs text-muted">Approved by {issue.approvedBy} at {issue.approvedAt.replace("T", " ").slice(0, 16)} UTC</p>}
        {issue.publishedAt && <p className="text-xs text-muted">Published {issue.publishedAt.replace("T", " ").slice(0, 16)} UTC{issue.status === "published" && <> · <Link href={`/newsletter/${issue.slug}`} className="underline">view live</Link></>}</p>}
        {counts && <p className="text-xs text-muted">Emails: {counts.sent} sent, {counts.failed} failed{counts.claimed ? `, ${counts.claimed} in progress` : ""}{issue.sentAt ? " · batch complete" : ""}</p>}
        {message && <p role="status" className="mt-4 rounded-2xl border border-ink bg-blue-dim p-3 text-sm">{message}</p>}
      </div>

      {(errors.length > 0 || issue.failureReason) && (
        <section role="alert" className="rounded-3xl border border-pink bg-pink-dim p-4 text-sm">
          <p className="font-bold">This issue can’t be published yet</p>
          <ul className="mt-2 list-disc pl-5">{(errors.length ? errors : [issue.failureReason!]).map((error) => <li key={error}>{error}</li>)}</ul>
          <p className="mt-2 text-xs">The previous edition stays live with its own date until this is fixed. Verify more Impact Pulse records, then “Re-run research”, or edit the content below.</p>
        </section>
      )}

      <section aria-label="Editorial actions" className="flex flex-wrap gap-2">
        {editable && <ActionButton action={approveIssueAction} id={issue.id} label={due ? "Approve & publish now" : "Approve (publishes 07:00 Juba)"} tone="dark" disabled={errors.length > 0 || issue.status === "scheduled"} />}
        {editable && !due && <ActionButton action={approveIssueAction} id={issue.id} label="Publish early, now" extra={{ now: "1" }} disabled={errors.length > 0} />}
        {issue.status === "scheduled" && <ActionButton action={unscheduleIssue} id={issue.id} label="Withdraw approval" />}
        {editable && <ActionButton action={regenerateIssue} id={issue.id} label="Re-run research & regenerate" />}
        {issue.status === "published" && <ActionButton action={archiveIssue} id={issue.id} label="Unpublish (archive)" />}
        {issue.status === "published" && <ActionButton action={sendIssueAction} id={issue.id} label={issue.sentAt ? "Resend to anyone missed" : "Send emails"} disabled={!emailSendingEnabled()} />}
      </section>

      <section aria-labelledby="research" className="rounded-3xl border border-ink bg-white p-5">
        <h2 id="research" className="font-display text-2xl font-semibold">Research log</h2>
        <p className="mt-1 text-xs text-muted">Generated {issue.research.generatedAt.replace("T", " ").slice(0, 16)} UTC · {accepted} accepted of {issue.research.entries.length} candidates. {issue.research.method}</p>
        {issue.research.warnings.length > 0 && <ul className="mt-3 list-disc rounded-2xl bg-pink-dim p-3 pl-7 text-xs">{issue.research.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-bold">Candidates and verdicts</summary>
          <ul className="mt-2 max-h-96 divide-y divide-ink/10 overflow-y-auto text-xs">
            {issue.research.entries.map((entry) => (
              <li key={entry.ref} className="py-2"><span className={entry.verdict === "accepted" ? "font-bold text-blue" : "font-bold text-pink"}>{entry.verdict}</span> · {entry.title}{entry.sourceUrl && <> · <a href={entry.sourceUrl} className="underline" target="_blank" rel="noopener noreferrer">source</a></>}<br /><span className="text-muted">{entry.reasons.join(" ")}</span></li>
            ))}
          </ul>
        </details>
        {issue.research.linkChecks.length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm font-bold">Link checks ({issue.research.linkChecks.filter((check) => !check.ok).length} need review)</summary>
            <ul className="mt-2 space-y-1 text-xs">{issue.research.linkChecks.map((check) => <li key={check.href}><span className={check.ok ? "text-blue" : "font-bold text-pink"}>{check.ok ? "OK" : "Check"}</span> {check.status ?? check.note} · {check.href}</li>)}</ul>
          </details>
        )}
      </section>

      <section aria-labelledby="preview">
        <h2 id="preview" className="mb-4 font-display text-2xl font-semibold">Preview</h2>
        <div className="rounded-[2rem] border border-dashed border-ink p-4 md:p-6"><IssueView issue={issue} /></div>
      </section>

      <section aria-labelledby="edit" className="rounded-3xl border border-ink bg-white p-5">
        <h2 id="edit" className="font-display text-2xl font-semibold">Edit</h2>
        <p className="mb-3 mt-1 text-xs text-muted">Editing sends the issue back to “Awaiting approval”. Discoveries must keep an https source link and verification date.</p>
        <IssueContentForm id={issue.id} title={issue.title} content={JSON.stringify(issue.content, null, 2)} disabled={!editable} />
      </section>
    </div>
  );
}
