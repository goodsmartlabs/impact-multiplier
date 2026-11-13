"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Mail, MailCheck, TriangleAlert } from "lucide-react";
import { EDITIONS, EDITION_KINDS } from "@/lib/newsletter/schedule";
import { GOALS } from "@/lib/newsletter/top3-questions";
import type { EditionKind } from "@/lib/newsletter/types";
import { cn } from "@/lib/utils";

type Result = { kind: "ok"; emailDelivery: boolean; emailSent: boolean } | { kind: "error"; message: string };

/** Email, editions, optional goals and explicit consent → double opt-in. */
export function SubscribeForm({ source = "site", idPrefix = "nl", initialGoals = [] }: { source?: string; idPrefix?: string; initialGoals?: string[] }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [editions, setEditions] = useState<EditionKind[]>([...EDITION_KINDS]);
  const [goals, setGoals] = useState<string[]>(initialGoals);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!consent) return setResult({ kind: "error", message: "Please tick the box to agree to receive the newsletter." });
    if (!editions.length) return setResult({ kind: "error", message: "Choose at least one edition." });
    setBusy(true);
    setResult(null);
    try {
      const response = await fetch("/api/newsletter/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name, editions, goals, consent, website, source }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) setResult({ kind: "error", message: data.error ?? "Something went wrong. Please try again." });
      else setResult({ kind: "ok", emailDelivery: Boolean(data.emailDelivery), emailSent: Boolean(data.emailSent) });
    } catch {
      setResult({ kind: "error", message: "We couldn’t reach the server. Check your connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {result?.kind === "ok" ? (
        <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status" className="text-ink">
          <p className="flex items-center gap-2 font-display text-2xl font-semibold"><MailCheck aria-hidden="true" className="h-6 w-6 text-blue" />Check your inbox</p>
          <p className="mt-3 text-sm leading-relaxed text-ink/75">
            {result.emailDelivery
              ? result.emailSent
                ? "If this address isn’t already subscribed, we’ve sent a confirmation link. Your subscription starts once you confirm it."
                : "We saved your request but couldn’t send the confirmation email just now. Please try again in a few minutes."
              : "Your request is saved as unconfirmed. Confirmation emails aren’t switched on yet, so nothing will be emailed until they are and you confirm."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold">
            <Link href="/newsletter/top-3" className="im-press rounded-full bg-ink px-4 py-2 text-white">FIND MY TOP 3</Link>
            <Link href="/newsletter#archive" className="im-press rounded-full border border-ink px-4 py-2">Read past editions</Link>
          </div>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 text-ink" noValidate>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={`${idPrefix}-email`} className="text-sm font-semibold">Email address</label>
              <input id={`${idPrefix}-email`} type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-1 w-full rounded-full border border-ink px-4 py-3 text-sm outline-none focus:shadow-[3px_3px_0_var(--color-blue)]" />
            </div>
            <div>
              <label htmlFor={`${idPrefix}-name`} className="text-sm font-semibold">First name <span className="font-normal text-muted">(optional)</span></label>
              <input id={`${idPrefix}-name`} type="text" autoComplete="given-name" value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded-full border border-ink px-4 py-3 text-sm outline-none focus:shadow-[3px_3px_0_var(--color-blue)]" />
            </div>
          </div>
          <fieldset>
            <legend className="text-sm font-semibold">Editions</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {EDITION_KINDS.map((kind) => (
                <label key={kind} className={cn("flex cursor-pointer items-start gap-2 rounded-2xl border p-3 text-sm", editions.includes(kind) ? "border-ink bg-blue-dim" : "border-ink/25")}>
                  <input type="checkbox" className="mt-1 accent-[var(--color-ink)]" checked={editions.includes(kind)} onChange={() => setEditions((current) => toggle(current, kind))} />
                  <span><strong className="block">{EDITIONS[kind].emoji} {EDITIONS[kind].label}</strong><span className="text-xs text-muted">{EDITIONS[kind].day}s, 7:00 AM Juba time</span></span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold">Your goals <span className="font-normal text-muted">(optional — personalises your Friday link)</span></legend>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {GOALS.map((goal) => {
                const on = goals.includes(goal.id);
                return <button key={goal.id} type="button" aria-pressed={on} onClick={() => setGoals((current) => toggle(current, goal.id))} className={cn("im-press rounded-full border px-3 py-1.5 text-[11px] font-bold", on ? "border-ink bg-ink text-white" : "border-ink/25 hover:border-ink")}>{goal.label}</button>;
              })}
            </div>
          </fieldset>
          <div aria-hidden="true" className="hidden"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label></div>
          <label className="flex items-start gap-2 text-xs leading-relaxed">
            <input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 accent-[var(--color-ink)]" />
            <span>I agree to receive the ImpactFools newsletter by email. I can unsubscribe at any time. ImpactFools stores my email, name, chosen editions and goals only for sending it.</span>
          </label>
          {result?.kind === "error" && <p role="alert" className="flex items-start gap-2 rounded-2xl bg-pink-dim p-3 text-sm"><TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-pink" />{result.message}</p>}
          <button type="submit" disabled={busy} className="im-lift inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white hover:bg-blue disabled:opacity-60"><Mail aria-hidden="true" className="h-4 w-4" />{busy ? "Subscribing…" : "Subscribe — free"}</button>
          <p className="text-[11px] text-muted">We’ll email you a confirmation link first. No confirmation, no emails.</p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
