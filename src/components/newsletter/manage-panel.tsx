"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { EDITIONS, EDITION_KINDS } from "@/lib/newsletter/schedule";
import { GOALS } from "@/lib/newsletter/top3-questions";
import { cn } from "@/lib/utils";

type Ready = { kind: "ready"; email: string; status: "pending" | "active" | "unsubscribed"; verified: boolean; goals: string[]; editions: string[]; notice?: string };
type State = { kind: "loading" } | { kind: "error"; message: string } | Ready;

export function ManagePanel() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const askUnsubscribe = params.get("unsubscribe") === "1";
  const [state, setState] = useState<State>(token ? { kind: "loading" } : { kind: "error", message: "This link is incomplete. Use the manage link from any newsletter email." });
  const [busy, setBusy] = useState(false);

  async function call(body: Record<string, unknown>) {
    const response = await fetch("/api/newsletter/manage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, ...body }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error ?? "Something went wrong.");
    return data;
  }

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    call({ action: "read" })
      .then((data) => !cancelled && setState({ kind: "ready", email: data.email, status: data.status, verified: data.verified, goals: data.goals, editions: data.editions }))
      .catch((error: Error) => !cancelled && setState({ kind: "error", message: error.message }));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (state.kind === "loading") return <div className="mt-6 h-40 animate-pulse rounded-3xl bg-ink/5" aria-busy="true" />;
  if (state.kind === "error") return <p role="alert" className="mt-6 flex items-start gap-2 rounded-3xl bg-pink-dim p-5 text-sm"><TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-pink" />{state.message}</p>;

  async function act(body: Record<string, unknown>, notice: string) {
    if (state.kind !== "ready") return;
    setBusy(true);
    try {
      const data = await call(body);
      setState({ ...state, status: data.status ?? state.status, goals: data.goals ?? state.goals, editions: data.editions ?? state.editions, notice });
    } catch (error) {
      setState({ ...state, notice: (error as Error).message });
    } finally {
      setBusy(false);
    }
  }
  const toggle = (list: string[], value: string) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

  return (
    <div className="mt-6 space-y-5 rounded-3xl border border-ink bg-white p-6">
      <div>
        <p className="text-sm text-muted">Subscription for <strong className="text-ink">{state.email}</strong></p>
        <p className={cn("mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]", state.status === "active" ? "bg-blue-dim" : "bg-pink-dim")}>{state.status === "active" ? "Subscribed" : state.status === "pending" ? "Waiting for email confirmation" : "Unsubscribed"}</p>
      </div>
      {askUnsubscribe && state.status !== "unsubscribed" && (
        <div className="rounded-2xl border border-pink bg-pink-dim p-4 text-sm">
          <p className="font-semibold">Unsubscribe from all ImpactFools newsletter emails?</p>
          <button type="button" disabled={busy} onClick={() => act({ action: "unsubscribe" }, "You’re unsubscribed. No more newsletter emails will be sent.")} className="im-press mt-3 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white">Yes, unsubscribe me</button>
        </div>
      )}
      {state.status !== "unsubscribed" && (
        <>
          <fieldset>
            <legend className="text-sm font-semibold">Editions</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {EDITION_KINDS.map((kind) => (
                <label key={kind} className="flex items-center gap-2 rounded-2xl border border-ink/25 p-3 text-sm"><input type="checkbox" checked={state.editions.includes(kind)} onChange={() => setState({ ...state, editions: toggle(state.editions, kind) })} />{EDITIONS[kind].emoji} {EDITIONS[kind].label}</label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold">Goals</legend>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {GOALS.map((goal) => {
                const on = state.goals.includes(goal.id);
                return <button key={goal.id} type="button" aria-pressed={on} onClick={() => setState({ ...state, goals: toggle(state.goals, goal.id) })} className={cn("im-press rounded-full border px-3 py-1.5 text-[11px] font-bold", on ? "border-ink bg-ink text-white" : "border-ink/25")}>{goal.label}</button>;
              })}
            </div>
          </fieldset>
          <button type="button" disabled={busy} onClick={() => act({ action: "preferences", goals: state.goals, editions: state.editions }, "Preferences saved.")} className="im-press rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white">Save preferences</button>
        </>
      )}
      <div className="flex flex-wrap gap-2 border-t border-ink/15 pt-4 text-sm font-bold">
        {state.status === "unsubscribed"
          ? <button type="button" disabled={busy} onClick={() => act({ action: "resubscribe" }, state.verified ? "Welcome back — you’re subscribed again." : "Saved. Confirm your email from the original message to start receiving editions.")} className="im-press rounded-full border border-ink px-4 py-2">Resubscribe</button>
          : !askUnsubscribe && <button type="button" disabled={busy} onClick={() => act({ action: "unsubscribe" }, "You’re unsubscribed. No more newsletter emails will be sent.")} className="im-press rounded-full border border-ink px-4 py-2">Unsubscribe</button>}
        <Link href={`/newsletter/top-3${state.goals.length ? `?goals=${state.goals.join(",")}` : ""}`} className="im-press rounded-full border border-ink px-4 py-2">FIND MY TOP 3</Link>
      </div>
      {state.notice && <p role="status" className="text-sm font-semibold">{state.notice}</p>}
    </div>
  );
}
