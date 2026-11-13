"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, TriangleAlert } from "lucide-react";

export function VerifyPanel() {
  const token = useSearchParams().get("token") ?? "";
  const [state, setState] = useState<{ kind: "idle" | "busy" } | { kind: "done"; manageUrl: string; goals: string[] } | { kind: "error"; message: string }>({ kind: "idle" });

  async function confirm() {
    setState({ kind: "busy" });
    try {
      const response = await fetch("/api/newsletter/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) setState({ kind: "error", message: data.error ?? "Something went wrong." });
      else setState({ kind: "done", manageUrl: data.manageUrl, goals: data.goals ?? [] });
    } catch {
      setState({ kind: "error", message: "We couldn’t reach the server. Please try again." });
    }
  }

  if (!token) return <p role="alert" className="mt-6 rounded-3xl bg-pink-dim p-5 text-sm">This confirmation link is incomplete. Open the link from your email again.</p>;
  if (state.kind === "done") {
    return (
      <div role="status" className="mt-6 rounded-3xl border border-ink bg-white p-6">
        <p className="flex items-center gap-2 font-display text-2xl font-semibold"><CheckCircle2 aria-hidden="true" className="h-6 w-6 text-blue" />You’re subscribed</p>
        <p className="mt-2 text-sm">What’s Hot arrives on Mondays and Your Weekend Top 3 on Fridays, at 7:00 AM Juba time.</p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold">
          <Link href={`/newsletter/top-3${state.goals.length ? `?goals=${state.goals.join(",")}` : ""}`} className="im-press rounded-full bg-ink px-4 py-2 text-white">FIND MY TOP 3</Link>
          <Link href={state.manageUrl} className="im-press rounded-full border border-ink px-4 py-2">Manage preferences</Link>
        </div>
        <p className="mt-3 text-xs text-muted">Every email includes your private manage and unsubscribe links.</p>
      </div>
    );
  }
  return (
    <div className="mt-6 rounded-3xl border border-ink bg-white p-6">
      <p className="text-sm">Confirm that you want to receive the ImpactFools newsletter at this address.</p>
      {state.kind === "error" && <p role="alert" className="mt-3 flex items-start gap-2 rounded-2xl bg-pink-dim p-3 text-sm"><TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-pink" />{state.message}</p>}
      <button type="button" onClick={confirm} disabled={state.kind === "busy"} className="im-lift mt-4 inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-sm font-bold text-white disabled:opacity-60">{state.kind === "busy" ? "Confirming…" : "Confirm my subscription"}</button>
    </div>
  );
}
