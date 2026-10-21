import Link from "next/link";
import { expirePastDeadline } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getPulseStore } from "@/lib/server/pulse/repository";
import { DEMO_UPDATES } from "@/lib/pulse/seed";
import { isExpired, lifecycle } from "@/lib/pulse/feed";

export const dynamic = "force-dynamic";

function Stat({ label, value, href }: { label: string; value: number | string; href?: string }) {
  const body = <><p className="font-display text-4xl font-semibold">{value}</p><p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{label}</p></>;
  return href ? <Link href={href} className="im-lift rounded-3xl border border-ink bg-white p-5 hover:shadow-[4px_4px_0_#111]">{body}</Link> : <div className="rounded-3xl border border-ink bg-white p-5">{body}</div>;
}

export default async function AdminOverview() {
  await requireAdmin();
  const store = getPulseStore();
  const [updates, subscribers, events] = await Promise.all([store.listUpdates(undefined, { fresh: true }), store.listSubscribers(), store.eventSummaries()]);
  const count = (status: string) => updates.filter((update) => update.status === status).length;
  const needsExpiry = updates.filter((update) => update.status === "published" && isExpired(update));
  const closingSoon = updates.filter((update) => update.status === "published" && lifecycle(update) === "closing_soon");
  const titles = new Map([...updates, ...DEMO_UPDATES].map((update) => [update.id, update.title]));
  const top = [...events].sort((a, b) => b.views + b.saves * 3 + b.ctaClicks * 2 - (a.views + a.saves * 3 + a.ctaClicks * 2)).slice(0, 10);

  return (
    <div className="space-y-10">
      <section className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Published" value={count("published")} href="/admin/updates?status=published" />
        <Stat label="Pending review" value={count("pending_review")} href="/admin/submissions" />
        <Stat label="Drafts" value={count("draft")} href="/admin/updates?status=draft" />
        <Stat label="Expired" value={count("expired")} href="/admin/updates?status=expired" />
        <Stat label="Active subscribers" value={subscribers.filter((s) => s.status === "active").length} href="/admin/subscribers" />
        <Stat label="Demo items live" value={process.env.PULSE_HIDE_DEMO === "true" ? 0 : DEMO_UPDATES.length} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-ink bg-white p-5">
          <h2 className="font-display text-2xl font-semibold">Expiry check</h2>
          <p className="mt-1 text-sm text-muted">Expired items are already hidden from readers automatically. Marking them expired keeps the dashboard tidy.</p>
          <p className="mt-3 text-sm"><strong>{needsExpiry.length}</strong> published {needsExpiry.length === 1 ? "item is" : "items are"} past deadline · <strong>{closingSoon.length}</strong> closing within 14 days</p>
          <form action={expirePastDeadline} className="mt-3"><button type="submit" disabled={!needsExpiry.length} className="im-press rounded-full bg-ink px-4 py-2 text-xs font-bold text-white disabled:opacity-40">Mark past-deadline items expired</button></form>
        </div>
        <div className="rounded-3xl border border-ink bg-white p-5">
          <h2 className="font-display text-2xl font-semibold">Quick actions</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
            <Link href="/admin/updates/new" className="im-press rounded-full bg-ink px-4 py-2 text-white">New update</Link>
            <Link href="/admin/submissions" className="im-press rounded-full border border-ink px-4 py-2">Review queue</Link>
            <Link href="/admin/newsletter" className="im-press rounded-full border border-ink px-4 py-2">Compose Impact Brief</Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-ink bg-white p-5">
        <h2 className="font-display text-2xl font-semibold">Engagement</h2>
        <p className="mt-1 text-sm text-muted">Anonymous counts of views, saves, CTA clicks and source clicks. No personal data is collected.</p>
        {top.length === 0 ? <p className="mt-4 text-sm text-muted">No engagement recorded yet.</p> : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-[0.1em] text-muted"><tr><th className="py-2">Update</th><th>Views</th><th>Saves</th><th>CTA clicks</th><th>Source clicks</th></tr></thead>
              <tbody>{top.map((row) => <tr key={row.updateId} className="border-t border-line"><td className="py-2 pr-4 font-semibold">{titles.get(row.updateId) ?? row.updateId}</td><td>{row.views}</td><td>{row.saves}</td><td>{row.ctaClicks}</td><td>{row.sourceClicks}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
