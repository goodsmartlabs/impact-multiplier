import { setUpdateStatus, toggleFeatured } from "@/app/admin/actions";
import type { PulseStatus, PulseUpdate } from "@/lib/pulse/types";

const LABELS: Record<PulseStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  published: "Published",
  expired: "Expired",
  archived: "Archived",
  rejected: "Rejected",
};

export function StatusPill({ status }: { status: PulseStatus }) {
  const tone = status === "published" ? "bg-blue-dim" : status === "pending_review" ? "bg-pink-dim" : "bg-ink/5";
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${tone}`}>{LABELS[status]}</span>;
}

function StatusButton({ id, status, label, tone = "light" }: { id: string; status: PulseStatus; label: string; tone?: "light" | "dark" }) {
  return (
    <form action={setUpdateStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={tone === "dark" ? "im-press rounded-full bg-ink px-3 py-1 text-[11px] font-bold text-white" : "im-press rounded-full border border-ink/30 px-3 py-1 text-[11px] font-bold hover:border-ink"}>{label}</button>
    </form>
  );
}

/** Inline publishing controls — every button posts to a server action that re-checks the admin session. */
export function StatusControls({ update }: { update: PulseUpdate }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {update.status !== "published" && update.status !== "rejected" && <StatusButton id={update.id} status="published" label={update.status === "pending_review" ? "Approve & publish" : "Publish"} tone="dark" />}
      {update.status === "pending_review" && <StatusButton id={update.id} status="rejected" label="Reject" />}
      {update.status === "published" && <StatusButton id={update.id} status="expired" label="Mark expired" />}
      {update.status !== "archived" && <StatusButton id={update.id} status="archived" label="Archive" />}
      {(update.status === "archived" || update.status === "rejected" || update.status === "expired") && <StatusButton id={update.id} status="draft" label="Back to draft" />}
      <form action={toggleFeatured}>
        <input type="hidden" name="id" value={update.id} />
        <button type="submit" aria-pressed={update.featured} className="im-press rounded-full border border-ink/30 px-3 py-1 text-[11px] font-bold hover:border-ink">{update.featured ? "★ Featured" : "☆ Feature"}</button>
      </form>
    </div>
  );
}
