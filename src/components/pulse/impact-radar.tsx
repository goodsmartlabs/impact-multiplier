"use client";

import Link from "next/link";
import { ArrowRight, Radar, SlidersHorizontal, Sparkles } from "lucide-react";
import { useRadarStore } from "@/lib/store/radar-store";
import { useHydrated } from "@/lib/use-hydrated";
import { hasPreferences, ruleBasedRecommender } from "@/lib/pulse/radar";
import type { PulseUpdate } from "@/lib/pulse/types";
import { CategoryChip, PulseCta, VerificationBadge } from "./pulse-card";
import { PulseSaveButton } from "./pulse-save-button";

/** "YOUR IMPACT RADAR" — recommendations with the reasons they appear. */
export function ImpactRadar({ updates, limit = 4, compactHeader = false }: { updates: PulseUpdate[]; limit?: number; compactHeader?: boolean }) {
  const mounted = useHydrated();
  const prefs = useRadarStore((state) => state.prefs);
  const configured = mounted && hasPreferences(prefs);
  const recommendations = configured ? ruleBasedRecommender.recommend(updates, prefs, limit) : [];

  return (
    <section aria-labelledby="radar-heading" className="rounded-[2rem] border border-ink bg-blue-dim p-5 shadow-[6px_6px_0_#111] md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue"><Radar className="h-4 w-4" />Personalised for you</p>
          <h2 id="radar-heading" className={compactHeader ? "mt-2 font-display text-3xl font-semibold" : "mt-2 font-display text-4xl font-semibold leading-none md:text-6xl"}>Your Impact Radar</h2>
          <p className="mt-2 max-w-xl text-sm text-ink/75">Opportunities selected around your skills, interests and ambitions.</p>
        </div>
        {configured && <Link href="/pulse/radar" className="im-press inline-flex items-center gap-1.5 rounded-full border border-ink bg-white px-4 py-2 text-xs font-bold"><SlidersHorizontal className="h-3.5 w-3.5" />Update interests</Link>}
      </div>

      {!mounted ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2" aria-busy="true">{[0, 1].map((key) => <div key={key} className="h-36 animate-pulse rounded-3xl bg-white/60" />)}</div>
      ) : !configured ? (
        <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-ink bg-white p-5 md:flex-row md:items-center md:justify-between">
          <p className="flex items-start gap-3 text-sm"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-pink" />Tell us your skills, the skills you want, your industries and goals. We’ll prioritise relevant updates and explain why each one appears.</p>
          <Link href="/pulse/radar" className="im-lift group inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-blue">Set up my radar <ArrowRight className="im-nudge h-4 w-4" /></Link>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-ink bg-white/70 p-6 text-sm">
          Nothing matches your radar right now. Try adding broader interests or more skills — or check back as new updates are published.
          <Link href="/pulse/radar" className="ml-1 font-bold underline underline-offset-4">Adjust my radar</Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {recommendations.map(({ update, reasons }) => (
            <li key={update.id} className="flex flex-col rounded-3xl border border-ink bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2"><CategoryChip update={update} /><VerificationBadge update={update} /></div>
              <h3 className="mt-3 font-display text-xl font-semibold leading-tight"><Link href={`/pulse/${update.slug}`} className="hover:underline">{update.title}</Link></h3>
              <div className="mt-3 rounded-2xl bg-pink-dim/60 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-pink">Why you’re seeing this</p>
                <ul className="mt-1 space-y-0.5 text-xs font-semibold">{reasons.map((reason) => <li key={reason}>• {reason}</li>)}</ul>
              </div>
              <p className="mt-3 text-sm"><span className="font-bold text-blue">Next: </span>{update.signal.next}</p>
              <div className="mt-auto flex flex-wrap items-center gap-2 pt-4"><PulseSaveButton update={update} /><PulseCta update={update} /></div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
