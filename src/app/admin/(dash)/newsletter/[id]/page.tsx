import Link from "next/link";
import { notFound } from "next/navigation";
import { EditionForm } from "@/components/admin/edition-form";
import { EditionView } from "@/components/pulse/edition-view";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getPulseStore } from "@/lib/server/pulse/repository";
import { sectionToLines } from "@/lib/pulse/newsletter";

export const dynamic = "force-dynamic";

export default async function EditionAdminPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const edition = await getPulseStore().getEdition((await params).id, { fresh: true });
  if (!edition) notFound();
  const lines = Object.fromEntries(Object.entries(edition.sections).map(([key, items]) => [key, sectionToLines(items)]));
  return (
    <div>
      <Link href="/admin/newsletter" className="text-xs font-bold underline">← All editions</Link>
      <h1 className="mt-2 font-display text-3xl font-semibold">{edition.title}</h1>
      {edition.status === "published" && <Link href={`/pulse/brief/${edition.slug}`} className="text-xs font-semibold underline">View in archive</Link>}
      <div className="mt-6 grid gap-8 xl:grid-cols-2">
        <EditionForm edition={edition} lines={lines} />
        <section aria-label="Preview">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Saved preview</p>
          <EditionView edition={edition} />
        </section>
      </div>
    </div>
  );
}
