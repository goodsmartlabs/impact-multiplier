import { UpdateForm } from "@/components/admin/update-form";
import { requireAdmin } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

export default async function NewUpdatePage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="font-display text-4xl font-semibold">New update</h1>
      <p className="mt-1 text-sm text-muted">Only publish what you can source. Mark it verified once you’ve checked the original source.</p>
      <div className="mt-6"><UpdateForm /></div>
    </div>
  );
}
