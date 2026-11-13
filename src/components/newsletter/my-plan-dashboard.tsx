"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, CheckCircle2, CircleDot, PlayCircle, Trash2 } from "lucide-react";
import { recommendTop3 } from "@/lib/newsletter/top3";
import { useCartStore } from "@/lib/store/cart-store";
import { totalSteps, useWeekendPlanStore, type PlanStatus, type WeekendPlan } from "@/lib/store/weekend-plan-store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";
import { RecommendationCard } from "./recommendation-card";

const STATUS_LABEL: Record<PlanStatus, string> = { started: "Started", in_progress: "In progress", completed: "Completed" };
const STATUS_ICON = { started: PlayCircle, in_progress: CircleDot, completed: CheckCircle2 } as const;

function Section({ id, title, children, action }: { id: string; title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-28">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 id={id} className="font-display text-3xl font-semibold uppercase leading-none md:text-4xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Progress({ plan }: { plan: WeekendPlan }) {
  const total = totalSteps(plan.recommendation);
  const done = Math.min(plan.doneSteps.length, total);
  const percent = total ? Math.round((done / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs font-bold"><span>{done} of {total} steps</span><span>{percent}%</span></div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={`${plan.recommendation.title} progress`}>
        <div className="h-full rounded-full bg-blue transition-[width]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function MyPlanDashboard() {
  const hydrated = useHydrated();
  const { latest, answers, plans, savePlan, toggleStep, setStatus, removePlan } = useWeekendPlanStore();
  const entries = useCartStore((state) => state.entries);
  const pulseEntries = entries.filter((entry) => entry.itemKind === "pulse" && entry.pulse);
  const [openId, setOpenId] = useState<string | null>(null);

  const next = useMemo(() => {
    if (!answers) return [];
    const exclude = [...plans.map((plan) => plan.projectId), ...(latest?.recommendations.map((rec) => rec.projectId) ?? [])];
    return recommendTop3(answers, { exclude });
  }, [answers, plans, latest]);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-[2rem] bg-ink/5" aria-busy="true" />;

  const active = plans.filter((plan) => plan.status !== "completed");
  const counts = { started: 0, in_progress: 0, completed: 0 } as Record<PlanStatus, number>;
  plans.forEach((plan) => counts[plan.status]++);
  const focus = openId ? active.find((plan) => plan.projectId === openId) : active[0];

  return (
    <div className="space-y-14">
      <Section id="my-top-3" title="My Top 3" action={<Link href="/newsletter/top-3" className="group inline-flex items-center gap-1 text-sm font-bold"><span className="im-underline">{latest ? "Retake FIND MY TOP 3" : "FIND MY TOP 3"}</span><ArrowRight aria-hidden="true" className="im-nudge h-4 w-4" /></Link>}>
        {latest?.recommendations.length ? (
          <ul className="grid gap-3 md:grid-cols-3">
            {latest.recommendations.map((rec) => {
              const saved = plans.some((plan) => plan.projectId === rec.projectId);
              return (
                <li key={rec.projectId} className="flex flex-col rounded-3xl border border-ink bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-pink">#{rec.rank}</p>
                  <p className="mt-1 font-display text-xl font-semibold leading-tight">{rec.title}</p>
                  <p className="mt-2 text-xs text-muted">{rec.success}</p>
                  <button type="button" disabled={saved} onClick={() => savePlan(rec)} className={cn("im-press mt-auto inline-flex min-h-10 items-center justify-center gap-1.5 self-start rounded-full px-4 text-xs font-bold", saved ? "mt-4 bg-blue-dim" : "mt-4 bg-ink text-white")}>{saved ? "In my plan" : "SAVE TO MY PLAN"}</button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-3xl border border-dashed border-ink/40 bg-white p-6 text-sm">No Top 3 yet. Answer five questions to get three weekend projects matched to you. <Link href="/newsletter/top-3" className="font-bold underline">FIND MY TOP 3</Link></p>
        )}
      </Section>

      <Section id="my-weekend-plan" title="My Weekend Plan">
        {focus ? (
          <div className="space-y-4">
            {active.length > 1 && (
              <div role="tablist" aria-label="Active plans" className="flex flex-wrap gap-2">
                {active.map((plan) => <button key={plan.projectId} role="tab" type="button" aria-selected={plan.projectId === focus.projectId} onClick={() => setOpenId(plan.projectId)} className={cn("im-press rounded-full border px-3 py-1.5 text-xs font-bold", plan.projectId === focus.projectId ? "border-ink bg-ink text-white" : "border-ink/30 bg-white")}>{plan.recommendation.title}</button>)}
              </div>
            )}
            <div className="rounded-3xl border border-ink bg-white p-4"><Progress plan={focus} /></div>
            <RecommendationCard recommendation={focus.recommendation} doneSteps={focus.doneSteps} onToggleStep={(key) => toggleStep(focus.projectId, key)} highlight />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setStatus(focus.projectId, "completed")} className="im-press inline-flex min-h-11 items-center gap-1.5 rounded-full bg-blue px-5 text-sm font-bold text-white"><CheckCircle2 aria-hidden="true" className="h-4 w-4" />Mark as completed</button>
              <button type="button" onClick={() => removePlan(focus.projectId)} className="im-press inline-flex min-h-11 items-center gap-1.5 rounded-full border border-ink px-4 text-sm font-bold"><Trash2 aria-hidden="true" className="h-4 w-4" />Remove</button>
            </div>
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-ink/40 bg-white p-6 text-sm">Nothing in progress. Save one of your Top 3 to turn it into a Friday-to-Sunday checklist.</p>
        )}
      </Section>

      <Section id="saved-opportunities" title="Saved Opportunities" action={<Link href="/cart" className="group inline-flex items-center gap-1 text-sm font-bold"><span className="im-underline">Open the tracker</span><ArrowRight aria-hidden="true" className="im-nudge h-4 w-4" /></Link>}>
        {pulseEntries.length ? (
          <ul className="grid gap-3 md:grid-cols-2">
            {pulseEntries.slice(0, 6).map((entry) => (
              <li key={entry.itemId}>
                <Link href={`/pulse/${entry.pulse!.slug}`} className="im-press flex items-start gap-3 rounded-3xl border border-ink bg-white p-4 hover:shadow-[3px_3px_0_var(--color-ink)]">
                  <Bookmark aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-pink" />
                  <span><span className="block text-sm font-bold">{entry.pulse!.title}</span><span className="text-xs capitalize text-muted">{entry.status ?? "saved"} · {entry.pulse!.category}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-3xl border border-dashed border-ink/40 bg-white p-6 text-sm">Save opportunities from <Link href="/pulse" className="font-bold underline">Impact Pulse</Link> or a What’s Hot edition and they’ll appear here.</p>
        )}
      </Section>

      <Section id="my-progress" title="My Progress">
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(STATUS_LABEL) as PlanStatus[]).map((status) => {
            const Icon = STATUS_ICON[status];
            return <div key={status} className="rounded-3xl border border-ink bg-white p-4 text-center"><Icon aria-hidden="true" className="mx-auto h-5 w-5 text-pink" /><p className="mt-1 font-display text-3xl font-semibold">{counts[status]}</p><p className="text-xs font-bold">{STATUS_LABEL[status]}</p></div>;
          })}
        </div>
        {plans.length > 0 && (
          <ul className="mt-4 divide-y divide-ink/10 rounded-3xl border border-ink bg-white">
            {plans.map((plan) => (
              <li key={plan.projectId} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <span className="min-w-0 text-sm font-semibold">{plan.recommendation.title}</span>
                <label className="flex items-center gap-2 text-xs font-bold">
                  <span className="sr-only">Status for {plan.recommendation.title}</span>
                  <select value={plan.status} onChange={(event) => setStatus(plan.projectId, event.target.value as PlanStatus)} className="rounded-full border border-ink bg-white px-3 py-1.5">
                    {(Object.keys(STATUS_LABEL) as PlanStatus[]).map((status) => <option key={status} value={status}>{STATUS_LABEL[status]}</option>)}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="next-recommendations" title="Next Recommendations">
        {next.length ? (
          <ul className="grid gap-3 md:grid-cols-3">
            {next.map((rec) => (
              <li key={rec.projectId} className="flex flex-col rounded-3xl border border-ink bg-blue-dim p-5">
                <p className="font-display text-xl font-semibold leading-tight">{rec.title}</p>
                <p className="mt-2 text-xs">{rec.why[0]}</p>
                <button type="button" onClick={() => savePlan(rec)} className="im-press mt-4 inline-flex min-h-10 items-center justify-center self-start rounded-full bg-ink px-4 text-xs font-bold text-white">SAVE TO MY PLAN</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">{answers ? "You’ve seen every project that fits your answers. Change your answers in FIND MY TOP 3 for new directions." : "Take FIND MY TOP 3 first — next recommendations build on your answers and skip what you’ve already done."}</p>
        )}
      </Section>
      <p className="text-xs text-muted">Your plan is stored in this browser only. Clearing site data removes it.</p>
    </div>
  );
}
