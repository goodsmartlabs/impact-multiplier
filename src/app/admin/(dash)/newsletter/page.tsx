import Link from "next/link";
import { composeEdition } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getPulseStore } from "@/lib/server/pulse/repository";
import { formatDate } from "@/lib/pulse/feed";

export const dynamic = "force-dynamic";

export default async function NewsletterAdminPage() {
  await requireAdmin();
  const store = getPulseStore();
  const editions = (await store.listEditions(undefined, { fresh: true })).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-semibold">The Impact Brief</h1>
          <p className="mt-1 text-sm text-muted">Compose editions from published updates, edit them, then publish to the web archive.</p>
        </div>
        <form action={composeEdition}><button type="submit" disabled={store.kind === "none"} className="im-press rounded-full bg-ink px-4 py-2 text-sm font-bold text-white disabled:opacity-40">Draft a new edition</button></form>
      </div>
      {editions.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-dashed border-ink p-8 text-center text-sm text-muted">No editions yet. “Draft a new edition” fills the six sections from live, non-demo updates for you to edit.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {editions.map((edition) => (
            <li key={edition.id}>
              <Link href={`/admin/newsletter/${edition.id}`} className="im-lift flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-ink bg-white p-4 hover:shadow-[3px_3px_0_#111]">
                <span><span className="block font-display text-xl font-semibold">{edition.title}</span><span className="text-xs text-muted">/{edition.slug} · updated {formatDate(edition.updatedAt)}</span></span>
                <span className="rounded-full bg-ink/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]">{edition.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
