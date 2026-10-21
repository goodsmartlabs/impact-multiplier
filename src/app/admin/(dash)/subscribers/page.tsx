import { requireAdmin } from "@/lib/server/admin-auth";
import { getPulseStore } from "@/lib/server/pulse/repository";
import { getCategory, PULSE_CATEGORIES } from "@/lib/pulse/categories";
import { formatDate } from "@/lib/pulse/feed";

export const dynamic = "force-dynamic";

function mask(email: string) {
  const [user, domain] = email.split("@");
  return `${user.slice(0, 2)}${"•".repeat(Math.max(1, Math.min(6, user.length - 2)))}@${domain}`;
}

export default async function SubscribersPage() {
  await requireAdmin();
  const subscribers = (await getPulseStore().listSubscribers()).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const active = subscribers.filter((subscriber) => subscriber.status === "active");
  const interestCounts = PULSE_CATEGORIES.map((category) => ({ category, count: active.filter((subscriber) => subscriber.interests.includes(category.id)).length }));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-semibold">Subscribers</h1>
          <p className="mt-1 text-sm text-muted">{active.length} active · {subscribers.length - active.length} unsubscribed. Emails are masked on screen.</p>
        </div>
        {subscribers.length > 0 && <a href="/admin/subscribers/export" className="im-press rounded-full border border-ink px-4 py-2 text-sm font-bold">Export active (CSV)</a>}
      </div>
      <ul className="mt-5 flex flex-wrap gap-2">{interestCounts.map(({ category, count }) => <li key={category.id} className="rounded-full border border-ink/30 bg-white px-3 py-1 text-xs font-semibold">{category.emoji} {category.label}: {count}</li>)}</ul>
      {subscribers.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-dashed border-ink p-8 text-center text-sm text-muted">No subscribers yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-ink bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-ink/5 text-[11px] uppercase tracking-[0.1em] text-muted"><tr><th className="px-4 py-3">Email</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Interests</th><th className="px-4 py-3">Joined</th></tr></thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-t border-line">
                  <td className="px-4 py-3 font-semibold">{mask(subscriber.email)}</td>
                  <td className="px-4 py-3">{subscriber.status}</td>
                  <td className="px-4 py-3 text-xs">{subscriber.interests.map((id) => getCategory(id).label).join(", ") || "—"}</td>
                  <td className="px-4 py-3 text-xs">{formatDate(subscriber.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
