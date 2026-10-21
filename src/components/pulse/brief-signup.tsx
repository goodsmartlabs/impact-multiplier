"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CheckCircle2, Mail, TriangleAlert } from "lucide-react";
import { PULSE_CATEGORIES } from "@/lib/pulse/categories";
import type { PulseCategory } from "@/lib/pulse/types";
import { cn } from "@/lib/utils";

const CONTENTS = [
  ["What’s Hot", "Three important developments"],
  ["Skill Worth Building", "One valuable skill"],
  ["Opportunities Worth Exploring", "Five relevant opportunities"],
  ["Learn Something", "One course or resource"],
  ["Money Move", "One practical income idea"],
  ["Your Power Move", "One weekly challenge"],
] as const;

type Result = { kind: "ok"; status: string; manageUrl?: string; emailDelivery: boolean } | { kind: "error"; message: string };

export function BriefSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<PulseCategory[]>([]);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const toggle = (id: PulseCategory) => setInterests((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const response = await fetch("/api/newsletter/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name, interests, website }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) setResult({ kind: "error", message: data.error ?? "Something went wrong. Please try again." });
      else setResult({ kind: "ok", status: data.status, manageUrl: data.manageUrl, emailDelivery: Boolean(data.emailDelivery) });
    } catch {
      setResult({ kind: "error", message: "We couldn’t reach the server. Check your connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="brief-heading" className="overflow-hidden rounded-[2rem] border border-ink bg-ink text-white shadow-[6px_6px_0_var(--color-pink)]">
      <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-pink-dim"><Mail className="h-4 w-4" />Weekly newsletter</p>
          <h2 id="brief-heading" className="mt-3 font-display text-4xl font-semibold leading-none md:text-6xl">The Impact Brief</h2>
          <p className="mt-3 text-lg text-white/80">One week. The updates worth your attention.</p>
          <ol className="mt-6 grid gap-2 sm:grid-cols-2">
            {CONTENTS.map(([title, copy], index) => (
              <li key={title} className="flex gap-3 rounded-2xl border border-white/20 p-3"><span className="font-display text-xl font-semibold text-pink">{String(index + 1).padStart(2, "0")}</span><span><strong className="block text-sm">{title}</strong><span className="text-xs text-white/65">{copy}</span></span></li>
            ))}
          </ol>
          <Link href="/pulse/brief" className="group mt-5 inline-flex items-center gap-1 text-sm font-bold text-white"><span className="im-underline">Read past editions</span><ArrowRight className="im-nudge h-4 w-4" /></Link>
        </div>

        <div className="rounded-3xl bg-white p-5 text-ink md:p-6">
          <AnimatePresence mode="wait" initial={false}>
            {result?.kind === "ok" ? (
              <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status">
                <p className="flex items-center gap-2 font-display text-2xl font-semibold"><CheckCircle2 className="h-6 w-6 text-blue" />{result.status === "already_registered" ? "This email is already registered" : "You’re on the list"}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">
                  {result.status === "already_registered"
                    ? "To change topics or unsubscribe, use the personal manage link you received when you first subscribed. For privacy, we don’t show it again here."
                    : result.emailDelivery
                      ? "The next edition will arrive in your inbox."
                      : "Your subscription is saved. Email delivery isn’t switched on yet — until it is, new editions are published in the archive and nothing is emailed."}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold">
                  <Link href="/pulse/brief" className="im-press rounded-full bg-ink px-4 py-2 text-white">Read the archive</Link>
                  {result.manageUrl && <Link href={result.manageUrl} className="im-press rounded-full border border-ink px-4 py-2">Manage preferences</Link>}
                </div>
                {result.manageUrl && <p className="mt-3 text-xs text-muted">Bookmark the manage link — it’s private to you and it’s how you change topics or unsubscribe.</p>}
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="brief-email" className="text-sm font-semibold">Email address</label>
                  <input id="brief-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-1 w-full rounded-full border border-ink px-4 py-3 text-sm outline-none focus:shadow-[3px_3px_0_var(--color-blue)]" />
                </div>
                <div>
                  <label htmlFor="brief-name" className="text-sm font-semibold">First name <span className="font-normal text-muted">(optional)</span></label>
                  <input id="brief-name" type="text" autoComplete="given-name" value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded-full border border-ink px-4 py-3 text-sm outline-none focus:shadow-[3px_3px_0_var(--color-blue)]" />
                </div>
                <fieldset>
                  <legend className="text-sm font-semibold">What do you want more of? <span className="font-normal text-muted">(optional)</span></legend>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {PULSE_CATEGORIES.map((category) => {
                      const on = interests.includes(category.id);
                      return <button key={category.id} type="button" aria-pressed={on} onClick={() => toggle(category.id)} className={cn("im-press rounded-full border px-3 py-1.5 text-[11px] font-bold", on ? "border-ink bg-ink text-white" : "border-ink/25 hover:border-ink")}><span aria-hidden="true">{category.emoji}</span> {category.label}</button>;
                    })}
                  </div>
                </fieldset>
                <div aria-hidden="true" className="hidden"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label></div>
                {result?.kind === "error" && <p role="alert" className="flex items-start gap-2 rounded-2xl bg-pink-dim p-3 text-sm"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-pink" />{result.message}</p>}
                <button type="submit" disabled={busy} className="im-lift inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white hover:bg-blue disabled:opacity-60">{busy ? "Subscribing…" : "Subscribe to The Impact Brief"}</button>
                <p className="text-[11px] leading-relaxed text-muted">Free. One email a week once delivery is live. Unsubscribe anytime from your manage link. We store your email and chosen topics only.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
