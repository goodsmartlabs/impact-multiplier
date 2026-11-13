"use client";

import Link from "next/link";
import { BookmarkCheck, BookmarkPlus, Check, Target } from "lucide-react";
import type { Top3Recommendation } from "@/lib/newsletter/top3";
import { cn } from "@/lib/utils";
import { ResourceList } from "./resource-list";

export function RecommendationCard({
  recommendation,
  saved,
  onSave,
  highlight = false,
  doneSteps,
  onToggleStep,
}: {
  recommendation: Top3Recommendation;
  saved?: boolean;
  onSave?: () => void;
  highlight?: boolean;
  doneSteps?: string[];
  onToggleStep?: (key: string) => void;
}) {
  const tracking = Boolean(onToggleStep);
  return (
    <article aria-labelledby={`rec-${recommendation.projectId}`} className={cn("rounded-[2rem] border-2 border-ink bg-white p-5 md:p-7", highlight ? "shadow-[7px_7px_0_var(--color-pink)]" : "shadow-[5px_5px_0_var(--color-ink)]")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">Your #{recommendation.rank} · What to work on</p>
          <h3 id={`rec-${recommendation.projectId}`} className="mt-1 font-display text-2xl font-semibold leading-tight md:text-3xl">{recommendation.title}</h3>
          <p className="mt-2 text-sm text-muted">{recommendation.summary}</p>
        </div>
        {onSave && (
          <button type="button" onClick={onSave} disabled={saved} aria-pressed={saved} className={cn("im-press inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-xs font-bold", saved ? "bg-blue-dim text-ink" : "bg-ink text-white")}>
            {saved ? <><BookmarkCheck aria-hidden="true" className="h-4 w-4" />Saved to my plan</> : <><BookmarkPlus aria-hidden="true" className="h-4 w-4" />SAVE TO MY PLAN</>}
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Why this fits you</h4>
          <ul className="mt-2 space-y-1.5 text-sm">{recommendation.why.map((reason) => <li key={reason} className="flex gap-2"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue" />{reason}</li>)}</ul>
        </section>
        <section>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">What you could gain</h4>
          <p className="mt-2 text-sm">{recommendation.gain}</p>
          <p className="mt-1 text-[11px] text-muted">Possible outcomes, not promises. Results depend on your effort and circumstances.</p>
        </section>
      </div>

      <section className="mt-6">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Weekend action plan</h4>
        <ol className="mt-2 grid gap-3 md:grid-cols-3">
          {recommendation.plan.map((day) => (
            <li key={day.day} className="rounded-2xl bg-blue-dim p-4">
              <p className="flex items-baseline justify-between gap-2"><span className="font-display text-lg font-semibold">{day.day}</span><span className="text-[11px] font-bold text-muted">{day.timebox}</span></p>
              <ul className="mt-2 space-y-2 text-sm">
                {day.steps.map((step, index) => {
                  const key = `${day.day}-${index}`;
                  const done = doneSteps?.includes(key);
                  return tracking ? (
                    <li key={key}>
                      <label className="flex cursor-pointer gap-2">
                        <input type="checkbox" checked={done} onChange={() => onToggleStep?.(key)} className="mt-1 accent-[var(--color-ink)]" />
                        <span className={cn(done && "text-muted line-through")}>{step}</span>
                      </label>
                    </li>
                  ) : <li key={key} className="flex gap-2"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />{step}</li>;
                })}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Start here</h4>
        <div className="mt-2"><ResourceList resources={recommendation.startHere} /></div>
      </section>

      <section className="mt-6 flex gap-3 rounded-2xl border border-ink bg-pink-dim p-4">
        <Target aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-pink" />
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.16em]">What success looks like</h4>
          <p className="mt-1 text-sm font-semibold">{recommendation.success}</p>
        </div>
      </section>
      {saved && onSave && <p className="mt-4 text-sm"><Link href="/newsletter/my-plan" className="font-bold underline">Open my weekend plan</Link> to tick off each step.</p>}
    </article>
  );
}
