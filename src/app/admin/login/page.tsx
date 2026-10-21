import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { adminConfigured, isAdmin } from "@/lib/server/admin-auth";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  const configured = adminConfigured();
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-[2rem] border border-ink bg-white p-6 shadow-[6px_6px_0_#111] md:p-8">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-pink"><LockKeyhole className="h-4 w-4" />Editorial access</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Impact Pulse admin</h1>
        {configured ? (
          <LoginForm />
        ) : (
          <p role="alert" className="mt-4 rounded-2xl bg-pink-dim p-4 text-sm">Admin access is switched off. Set <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code> (at least 32 characters) in the deployment environment, then redeploy.</p>
        )}
      </div>
    </div>
  );
}
