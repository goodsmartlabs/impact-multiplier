import Link from "next/link";
import { Database, LogOut, TriangleAlert } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/server/admin-auth";
import { storeStatus } from "@/lib/server/pulse/repository";
import { emailDeliveryConfigured } from "@/lib/server/pulse/email";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/updates", label: "Updates" },
  { href: "/admin/submissions", label: "Review queue" },
  { href: "/admin/newsletter", label: "Impact Brief" },
  { href: "/admin/subscribers", label: "Subscribers" },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const storage = storeStatus();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">Impact Pulse · Editorial dashboard</p>
          <nav aria-label="Admin" className="mt-2 flex flex-wrap gap-1.5">
            {NAV.map((item) => <Link key={item.href} href={item.href} className="im-press rounded-full border border-ink/30 bg-white px-3 py-1.5 text-xs font-bold hover:border-ink">{item.label}</Link>)}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 font-semibold"><Database className="h-3.5 w-3.5" />Storage: {storage.kind === "none" ? "not configured" : storage.kind}</span>
          <form action={logout}><button type="submit" className="im-press inline-flex items-center gap-1 rounded-full border border-ink px-3 py-1.5 font-bold"><LogOut className="h-3.5 w-3.5" />Sign out</button></form>
        </div>
      </div>
      {!storage.configured && (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-2xl border border-pink bg-pink-dim p-4 text-sm"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-pink" /><span>No database is connected, so nothing can be saved. Apply <code>supabase/migrations/202610210001_create_impact_pulse.sql</code> to a Supabase project and set <code>SUPABASE_URL</code> and <code>SUPABASE_SECRET_KEY</code>.</span></p>
      )}
      {storage.kind === "file" && <p className="mt-4 rounded-2xl border border-ink/30 bg-white p-3 text-xs">Local development store (<code>.data/pulse-dev.json</code>). Not used in production.</p>}
      {!emailDeliveryConfigured() && <p className="mt-2 text-xs text-muted">Email delivery isn’t configured — publishing an edition updates the web archive only.</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}
