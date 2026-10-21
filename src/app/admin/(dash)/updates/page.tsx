import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StatusControls, StatusPill } from "@/components/admin/status-controls";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getPulseStore } from "@/lib/server/pulse/repository";
import { getCategory } from "@/lib/pulse/categories";
import { formatDate, isExpired } from "@/lib/pulse/feed";
import type { PulseStatus } from "@/lib/pulse/types";

export const dynamic = "force-dynamic";

const FILTERS: Array<PulseStatus | "all"> = ["all", "draft", "pending_review", "published", "expired", "archived", "rejected"];

export default async function AdminUpdatesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status } = await searchParams;
  const filter = FILTERS.includes(status as PulseStatus) ? (status as PulseStatus | "all") : "all";
  const updates = (await getPulseStore().listUpdates(filter === "all" ? undefined : { statuses: [filter] }, { fresh: true }))
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-semibold">Updates</h1>
        <Link href="/admin/updates/new" className="im-press rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">New update</Link>
      </div>
      <nav aria-label="Filter by status" className="mt-4 flex flex-wrap gap-1.5">
        {FILTERS.map((item) => <Link key={item} href={item === "all" ? "/admin/updates" : `/admin/updates?status=${item}`} aria-current={filter === item ? "page" : undefined} className={filter === item ? "rounded-full bg-ink px-3 py-1 text-xs font-bold text-white" : "rounded-full border border-ink/30 px-3 py-1 text-xs font-bold hover:border-ink"}>{item.replace("_", " ")}</Link>)}
      </nav>
      {updates.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-dashed border-ink p-8 text-center text-sm text-muted">No updates with this status.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {updates.map((update) => (
            <li key={update.id} className="rounded-3xl border border-ink bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs"><StatusPill status={update.status} /><span className="font-semibold">{getCategory(update.category).label}</span><span className="text-muted">· {update.verification}</span><span className="text-muted">· by {update.submittedBy}</span>{update.status === "published" && isExpired(update) && <span className="font-bold text-pink">· past deadline</span>}</div>
                  <Link href={`/admin/updates/${update.id}`} className="mt-1 block font-display text-xl font-semibold leading-tight hover:underline">{update.title}</Link>
                  <p className="mt-1 text-xs text-muted">Published {formatDate(update.publishedAt)}{update.deadline ? ` · deadline ${formatDate(update.deadline)}` : ""} · updated {formatDate(update.updatedAt)}</p>
                  {update.sourceUrl && <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold underline">Inspect source ({update.sourceName})<ArrowUpRight className="h-3 w-3" /></a>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusControls update={update} />
                  {update.status === "published" && <Link href={`/pulse/${update.slug}`} className="text-xs font-semibold underline">View live</Link>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
