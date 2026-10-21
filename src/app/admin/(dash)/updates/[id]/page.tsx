import Link from "next/link";
import { notFound } from "next/navigation";
import { UpdateForm } from "@/components/admin/update-form";
import { StatusControls, StatusPill } from "@/components/admin/status-controls";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getPulseStore } from "@/lib/server/pulse/repository";

export const dynamic = "force-dynamic";

export default async function EditUpdatePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const update = await getPulseStore().getUpdate(id, { fresh: true });
  if (!update) notFound();
  const { saved } = await searchParams;
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs"><StatusPill status={update.status} /><span className="text-muted">Submitted by {update.submittedBy}</span></div>
          <h1 className="mt-1 font-display text-3xl font-semibold leading-tight">{update.title}</h1>
          {update.status === "published" && <Link href={`/pulse/${update.slug}`} className="text-xs font-semibold underline">View live page</Link>}
        </div>
        <StatusControls update={update} />
      </div>
      <div className="mt-6"><UpdateForm update={update} saved={saved === "1"} /></div>
    </div>
  );
}
