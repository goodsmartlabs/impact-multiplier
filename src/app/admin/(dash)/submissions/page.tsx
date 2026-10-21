import Link from "next/link";
import { ArrowUpRight, Bot } from "lucide-react";
import { setUpdateStatus } from "@/app/admin/actions";
import { SignalList } from "@/components/pulse/impact-signal";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getPulseStore } from "@/lib/server/pulse/repository";
import { getAgent, PULSE_AGENTS } from "@/lib/pulse/agents";
import { getCategory } from "@/lib/pulse/categories";
import { formatDate } from "@/lib/pulse/feed";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage() {
  await requireAdmin();
  const pending = (await getPulseStore().listUpdates({ statuses: ["pending_review"] }, { fresh: true })).sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
  const ingestReady = Boolean(process.env.PULSE_INGEST_TOKEN);

  return (
    <div>
      <h1 className="font-display text-4xl font-semibold">Review queue</h1>
      <p className="mt-1 text-sm text-muted">Agent submissions and drafts sent for review. Nothing here is visible to readers until you approve it.</p>
      <div className="mt-4 rounded-2xl border border-ink/30 bg-white p-4 text-xs leading-relaxed">
        <p className="flex items-center gap-1.5 font-bold"><Bot className="h-4 w-4 text-blue" />Agent ingestion: {ingestReady ? "endpoint enabled" : "disabled (PULSE_INGEST_TOKEN not set)"}</p>
        <p className="mt-1 text-muted">Agents POST to <code>/api/pulse/ingest</code> with <code>Authorization: Bearer &lt;PULSE_INGEST_TOKEN&gt;</code>. Registered agents: {PULSE_AGENTS.map((agent) => agent.name).join(", ")}. None are running automatically yet.</p>
      </div>

      {pending.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-dashed border-ink p-8 text-center text-sm text-muted">The queue is empty.</p>
      ) : (
        <ul className="mt-6 space-y-5">
          {pending.map((update) => {
            const agent = getAgent(update.submittedBy);
            return (
              <li key={update.id} className="rounded-3xl border border-ink bg-white p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-pink-dim px-2.5 py-0.5 font-bold">{agent ? agent.name : "Editor"}</span>
                  <span className="font-semibold">{getCategory(update.category).label}</span>
                  <span className="text-muted">· submitted {formatDate(update.createdAt)} · {update.verification}</span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-semibold leading-tight">{update.title}</h2>
                <p className="mt-1 text-sm text-ink/80">{update.summary}</p>
                <div className="mt-4 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                  <div className="rounded-2xl bg-cream p-4"><SignalList signal={update.signal} /></div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Source:</strong> {update.sourceName}</p>
                    {update.sourceUrl ? <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold underline">Inspect original source<ArrowUpRight className="h-3.5 w-3.5" /></a> : <p className="text-pink">No source URL — cannot be verified.</p>}
                    {update.deadline && <p><strong>Deadline:</strong> {formatDate(update.deadline)}</p>}
                    {update.eligibility && <p><strong>Eligibility:</strong> {update.eligibility}</p>}
                    <p><strong>CTA:</strong> {update.cta.label} → <code className="break-all text-xs">{update.cta.href}</code></p>
                    <Link href={`/admin/updates/${update.id}`} className="inline-block font-semibold underline">Edit before approving</Link>
                  </div>
                </div>
                <form action={setUpdateStatus} className="mt-4 flex flex-wrap items-end gap-2 border-t border-line pt-4">
                  <input type="hidden" name="id" value={update.id} />
                  <label className="min-w-[14rem] flex-1 text-xs font-semibold">Review note (optional)
                    <input name="reviewNote" defaultValue={update.reviewNote} className="mt-1 w-full rounded-full border border-ink/40 px-3 py-2 text-sm" />
                  </label>
                  <button type="submit" name="status" value="published" className="im-press rounded-full bg-ink px-4 py-2 text-xs font-bold text-white">Approve & publish</button>
                  <button type="submit" name="status" value="draft" className="im-press rounded-full border border-ink px-4 py-2 text-xs font-bold">Move to drafts</button>
                  <button type="submit" name="status" value="rejected" className="im-press rounded-full border border-pink px-4 py-2 text-xs font-bold text-pink">Reject</button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
