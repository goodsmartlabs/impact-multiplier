"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { PULSE_CATEGORIES } from "@/lib/pulse/categories";
import type { PulseCategory } from "@/lib/pulse/types";
import { cn } from "@/lib/utils";

type State =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; email: string; status: "active" | "unsubscribed"; interests: PulseCategory[]; notice?: string };

export function ManageSubscription() {
  const token = useSearchParams().get("token") ?? "";
  const [state, setState] = useState<State>({ kind: "loading" });

  const call = useCallback(async (payload: Record<string, unknown>) => {
    const response = await fetch("/api/newsletter/manage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, ...payload }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error ?? "Something went wrong.");
    return data;
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    call({ action: "read" })
      .then((data) => { if (!cancelled) setState({ kind: "ready", email: data.email, status: data.status, interests: data.interests ?? [] }); })
      .catch((error: Error) => { if (!cancelled) setState({ kind: "error", message: error.message }); });
    return () => { cancelled = true; };
  }, [token, call]);

  if (!token) return <p role="alert" className="mt-6 rounded-3xl border border-pink bg-pink-dim p-5 text-sm">This page needs the personal link you received when you subscribed.</p>;
  if (state.kind === "loading") return <div className="mt-6 h-40 animate-pulse rounded-3xl bg-ink/5" aria-busy="true" />;
  if (state.kind === "error") return <p role="alert" className="mt-6 flex items-start gap-2 rounded-3xl border border-pink bg-pink-dim p-5 text-sm"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-pink" />{state.message}</p>;

  const update = async (payload: Record<string, unknown>, notice: string) => {
    try {
      const data = await call(payload);
      setState({ ...state, status: data.status ?? state.status, interests: data.interests ?? state.interests, notice });
    } catch (error) {
      setState({ kind: "error", message: (error as Error).message });
    }
  };

  const toggle = (id: PulseCategory) => setState({ ...state, notice: undefined, interests: state.interests.includes(id) ? state.interests.filter((item) => item !== id) : [...state.interests, id] });

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-3xl border border-ink bg-white p-5">
        <p className="text-sm">Subscription for <strong>{state.email}</strong></p>
        <p className={cn("mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]", state.status === "active" ? "bg-blue-dim" : "bg-pink-dim")}>{state.status === "active" ? "Subscribed" : "Unsubscribed"}</p>
      </div>

      {state.status === "active" && (
        <fieldset className="rounded-3xl border border-ink bg-white p-5">
          <legend className="px-1 text-sm font-semibold">Topics you want more of</legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PULSE_CATEGORIES.map((category) => {
              const on = state.interests.includes(category.id);
              return <button key={category.id} type="button" aria-pressed={on} onClick={() => toggle(category.id)} className={cn("im-press rounded-full border px-3 py-1.5 text-xs font-bold", on ? "border-ink bg-ink text-white" : "border-ink/25 hover:border-ink")}><span aria-hidden="true">{category.emoji}</span> {category.label}</button>;
            })}
          </div>
          <button type="button" onClick={() => update({ action: "preferences", interests: state.interests }, "Preferences saved.")} className="im-press mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white">Save preferences</button>
        </fieldset>
      )}

      {state.notice && <p role="status" className="flex items-center gap-2 text-sm font-semibold text-blue"><CheckCircle2 className="h-4 w-4" />{state.notice}</p>}

      <div className="flex flex-wrap gap-3">
        {state.status === "active"
          ? <button type="button" onClick={() => update({ action: "unsubscribe" }, "You’ve been unsubscribed. You won’t receive The Impact Brief.")} className="im-press rounded-full border border-ink px-5 py-2.5 text-sm font-bold">Unsubscribe</button>
          : <button type="button" onClick={() => update({ action: "resubscribe" }, "Welcome back — you’re subscribed again.")} className="im-press rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white">Resubscribe</button>}
        <Link href="/pulse/brief" className="im-press rounded-full border border-ink/30 px-5 py-2.5 text-sm font-bold">Read the archive</Link>
      </div>
    </div>
  );
}
