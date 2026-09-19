"use client";

import { use, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useImpactMovesStore } from "@/lib/store/impact-moves-store";
import { useHydrated } from "@/lib/use-hydrated";
import type { ImpactMoveStage } from "@/lib/types";
import { StageStepper } from "@/components/impact-moves/stage-stepper";
import { GROWTH_AREA_OPTIONS } from "@/lib/data/constants";
import { cn } from "@/lib/utils";

const MONEY_PATHS: { key: "earn" | "save" | "increase" | "create" | "unlock"; label: string; copy: string }[] = [
  { key: "earn", label: "Earn", copy: "Sell the capability." },
  { key: "save", label: "Save", copy: "Reduce a cost." },
  { key: "increase", label: "Increase", copy: "Increase career/business value." },
  { key: "create", label: "Create", copy: "Build an asset or product." },
  { key: "unlock", label: "Unlock", copy: "Qualify for another opportunity." },
];

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-line p-3 text-sm outline-none focus:border-ink resize-none";

export default function ImpactMoveStagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const mounted = useHydrated();
  const move = useImpactMovesStore((s) => s.moves.find((m) => m.id === id));
  const updateMove = useImpactMovesStore((s) => s.updateMove);
  const completeStage = useImpactMovesStore((s) => s.completeStage);

  const [viewStage, setViewStage] = useState<ImpactMoveStage>("build");

  // local form state
  const [buildWhat, setBuildWhat] = useState("");
  const [buildWhy, setBuildWhy] = useState("");
  const [capBefore, setCapBefore] = useState("");
  const [capAfter, setCapAfter] = useState("");
  const [valueProblem, setValueProblem] = useState("");
  const [valuePerson, setValuePerson] = useState("");
  const [valueOutcome, setValueOutcome] = useState("");
  const [proofPlan, setProofPlan] = useState("");
  const [proofCompleted, setProofCompleted] = useState(false);
  const [moneyPaths, setMoneyPaths] = useState<string[]>([]);
  const [firstExperiment, setFirstExperiment] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [capacityChange, setCapacityChange] = useState("");
  const [output, setOutput] = useState("");
  const [valueDelivered, setValueDelivered] = useState("");
  const [economicResult, setEconomicResult] = useState("");
  const [selfChange, setSelfChange] = useState<string[]>([]);
  const [evidence, setEvidence] = useState("");
  const [whatsNext, setWhatsNext] = useState("");
  const [chainInput, setChainInput] = useState("");
  const [chain, setChain] = useState<string[]>([]);

  // Load the move's saved answers into local editable drafts whenever it
  // (re)hydrates from the persisted store.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!move) return;
    setViewStage(move.currentStage);
    setBuildWhat(move.build?.what ?? move.title);
    setBuildWhy(move.build?.why ?? "");
    setCapBefore(move.capacity?.before ?? "");
    setCapAfter(move.capacity?.after ?? "");
    setValueProblem(move.value?.problem ?? "");
    setValuePerson(move.value?.person ?? "");
    setValueOutcome(move.value?.outcome ?? "");
    setProofPlan(move.proof?.plan ?? "");
    setProofCompleted(!!move.proof?.completed);
    setMoneyPaths(move.money?.paths ?? []);
    setFirstExperiment(move.money?.firstExperiment ?? "");
    setNextAction(move.action?.nextAction ?? "");
    setCapacityChange(move.impact?.capacityChange ?? "");
    setOutput(move.impact?.output ?? "");
    setValueDelivered(move.impact?.valueDelivered ?? "");
    setEconomicResult(move.impact?.economicResult ?? "");
    setEvidence(move.impact?.evidence ?? "");
    setWhatsNext(move.multiply?.whatsNext ?? "");
    setChain(
      move.multiply?.chain ?? [move.build?.what ?? move.title, move.proof?.plan, move.value?.outcome].filter(Boolean) as string[]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [move?.id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (mounted && !move) notFound();
  if (!move) return null;

  const advance = (stage: ImpactMoveStage) => {
    completeStage(id, stage);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-6 md:px-6 md:pt-10">
      <Link
        href="/impact-moves"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Impact Moves
      </Link>

      <h1 className="mb-1 font-display text-2xl font-medium tracking-tight text-ink md:text-3xl">
        {move.title}
      </h1>

      {viewStage !== "action" && (
        <StageStepper
          completedStages={move.completedStages}
          viewStage={viewStage}
          onSelect={setViewStage}
        />
      )}

      {viewStage === "build" && (
        <div className="animate-fade-up">
          <p className="mb-4 text-sm text-muted">What are you learning, building or developing?</p>
          <Field label="What are you building?">
            <textarea
              value={buildWhat}
              onChange={(e) => setBuildWhat(e.target.value)}
              className={cn(inputClass, "h-20")}
              placeholder="I'm building / learning..."
            />
          </Field>
          <Field label="Why this? What do you want this to change?">
            <textarea
              value={buildWhy}
              onChange={(e) => setBuildWhy(e.target.value)}
              className={cn(inputClass, "h-20")}
            />
          </Field>
          <button
            type="button"
            disabled={!buildWhat.trim()}
            onClick={() => {
              updateMove(id, { build: { what: buildWhat, why: buildWhy } });
              advance("build");
              setViewStage("capacity");
            }}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper disabled:opacity-30"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {viewStage === "capacity" && (
        <div className="animate-fade-up">
          <p className="mb-4 text-sm text-muted">What will you be able to do?</p>
          <Field label="Before — right now, I can't...">
            <textarea value={capBefore} onChange={(e) => setCapBefore(e.target.value)} className={cn(inputClass, "h-16")} />
          </Field>
          <Field label="After — after this, I will be able to...">
            <textarea value={capAfter} onChange={(e) => setCapAfter(e.target.value)} className={cn(inputClass, "h-16")} />
          </Field>
          {(capBefore || capAfter) && (
            <div className="mb-4 rounded-2xl border border-line bg-cream p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Your Capacity Delta</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="flex-1 rounded-lg bg-ink/5 p-3 text-sm text-muted">
                  {capBefore || "…"}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
                <span className="flex-1 rounded-lg bg-blue-dim p-3 text-sm text-blue">
                  {capAfter || "…"}
                </span>
              </div>
            </div>
          )}
          <button
            type="button"
            disabled={!capAfter.trim()}
            onClick={() => {
              updateMove(id, { capacity: { before: capBefore, after: capAfter } });
              advance("capacity");
              setViewStage("value");
            }}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper disabled:opacity-30"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {viewStage === "value" && (
        <div className="animate-fade-up">
          <p className="mb-4 text-sm text-muted">Who does this help?</p>
          <Field label="What problem can you solve?">
            <textarea value={valueProblem} onChange={(e) => setValueProblem(e.target.value)} className={cn(inputClass, "h-16")} />
          </Field>
          <Field label="For whom?">
            <input value={valuePerson} onChange={(e) => setValuePerson(e.target.value)} className={cn(inputClass, "h-auto")} />
          </Field>
          <Field label="What becomes better?">
            <textarea value={valueOutcome} onChange={(e) => setValueOutcome(e.target.value)} className={cn(inputClass, "h-16")} />
          </Field>
          <div className="mb-4 rounded-2xl border border-line bg-cream p-4 text-center text-sm text-ink">
            Capability + Problem + Person = <span className="font-semibold text-blue">Value</span>
          </div>
          <button
            type="button"
            disabled={!valueProblem.trim() || !valuePerson.trim()}
            onClick={() => {
              updateMove(id, { value: { problem: valueProblem, person: valuePerson, outcome: valueOutcome } });
              advance("value");
              setViewStage("proof");
            }}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper disabled:opacity-30"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {viewStage === "proof" && (
        <div className="animate-fade-up">
          <h2 className="mb-1 font-display text-xl text-ink">Prove It.</h2>
          <p className="mb-4 text-sm text-muted">
            A certificate can document completion. It does not automatically demonstrate capability.
          </p>
          <Field label="What will you create or do to prove this?">
            <textarea
              value={proofPlan}
              onChange={(e) => setProofPlan(e.target.value)}
              className={cn(inputClass, "h-20")}
              placeholder="e.g. 3 finished videos, a working automation, a completed sales page..."
            />
          </Field>
          <label className="mb-4 flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={proofCompleted}
              onChange={(e) => setProofCompleted(e.target.checked)}
              className="h-4 w-4 accent-[color:var(--im-ink)]"
            />
            I&apos;ve completed this proof
          </label>
          <button
            type="button"
            disabled={!proofPlan.trim()}
            onClick={() => {
              updateMove(id, { proof: { plan: proofPlan, completed: proofCompleted } });
              advance("proof");
              setViewStage("money");
            }}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper disabled:opacity-30"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {viewStage === "money" && (
        <div className="animate-fade-up">
          <h2 className="mb-4 font-display text-xl text-ink">Where could the economic value be?</h2>
          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {MONEY_PATHS.map((p) => {
              const selected = moneyPaths.includes(p.key);
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() =>
                    setMoneyPaths((prev) =>
                      selected ? prev.filter((k) => k !== p.key) : [...prev, p.key]
                    )
                  }
                  className={cn(
                    "rounded-xl border px-3.5 py-3 text-left text-sm transition-colors",
                    selected ? "border-ink bg-ink text-paper" : "border-line text-ink hover:border-ink/50"
                  )}
                >
                  <p className="font-semibold">{p.label}</p>
                  <p className={cn("text-xs", selected ? "text-paper/70" : "text-muted")}>{p.copy}</p>
                </button>
              );
            })}
          </div>
          <Field label="What is your first economic experiment?">
            <textarea
              value={firstExperiment}
              onChange={(e) => setFirstExperiment(e.target.value)}
              className={cn(inputClass, "h-20")}
            />
          </Field>
          <p className="mb-4 text-xs text-muted">
            We don&apos;t promise income — this is about testing economic possibilities.
          </p>
          <button
            type="button"
            disabled={moneyPaths.length === 0 || !firstExperiment.trim()}
            onClick={() => {
              updateMove(id, {
                money: { paths: moneyPaths as ("earn" | "save" | "increase" | "create" | "unlock")[], firstExperiment },
              });
              advance("money");
              setViewStage("action");
            }}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper disabled:opacity-30"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {viewStage === "action" && (
        <div className="animate-fade-up rounded-3xl border border-ink bg-ink p-6 text-paper">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-paper/60">
            Action Mode
          </p>
          <h2 className="mb-6 font-display text-2xl">Now go do it.</h2>

          <div className="mb-4">
            <p className="text-xs uppercase tracking-wide text-paper/60">What you&apos;re building</p>
            <p className="text-lg">{move.build?.what}</p>
          </div>
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wide text-paper/60">Your proof</p>
            <p className="text-lg">{move.proof?.plan}</p>
          </div>
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wide text-paper/60">Your economic experiment</p>
            <p className="text-lg">{move.money?.firstExperiment}</p>
          </div>

          <Field label="Next action">
            <textarea
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              className="h-20 w-full resize-none rounded-xl border border-paper/30 bg-transparent p-3 text-sm text-paper outline-none placeholder:text-paper/40"
              placeholder="The one concrete next step"
            />
          </Field>
          <button
            type="button"
            disabled={!nextAction.trim()}
            onClick={() => {
              updateMove(id, { action: { nextAction } });
              advance("action");
              setViewStage("impact");
            }}
            className="flex items-center gap-1.5 rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink disabled:opacity-30"
          >
            I did it — measure what changed <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {viewStage === "impact" && (
        <div className="animate-fade-up">
          <h2 className="mb-1 font-display text-xl text-ink">What actually changed?</h2>
          <p className="mb-4 text-sm text-muted">
            Only count what actually happened — not what you intend to happen.
          </p>
          <Field label="Capacity — what can you do now?">
            <textarea value={capacityChange} onChange={(e) => setCapacityChange(e.target.value)} className={cn(inputClass, "h-16")} />
          </Field>
          <Field label="Output — what did you create?">
            <textarea value={output} onChange={(e) => setOutput(e.target.value)} className={cn(inputClass, "h-16")} />
          </Field>
          <Field label="Value — who benefited?">
            <textarea value={valueDelivered} onChange={(e) => setValueDelivered(e.target.value)} className={cn(inputClass, "h-16")} />
          </Field>
          <Field label="Economic — what did you earn, save, create, increase or unlock?">
            <textarea value={economicResult} onChange={(e) => setEconomicResult(e.target.value)} className={cn(inputClass, "h-16")} />
          </Field>
          <Field label="Self — how did you increase?">
            <div className="flex flex-wrap gap-2">
              {GROWTH_AREA_OPTIONS.map((g) => {
                const selected = selfChange.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() =>
                      setSelfChange((prev) => (selected ? prev.filter((x) => x !== g) : [...prev, g]))
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium",
                      selected ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink"
                    )}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Where is the evidence?">
            <textarea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className={cn(inputClass, "h-16")}
              placeholder="Link, file, screenshot description, or where it lives"
            />
          </Field>
          <button
            type="button"
            disabled={!output.trim() && !capacityChange.trim()}
            onClick={() => {
              updateMove(id, {
                impact: {
                  capacityChange,
                  output,
                  valueDelivered,
                  economicResult,
                  selfChange: selfChange.join(", "),
                  evidence,
                },
              });
              advance("impact");
              setViewStage("multiply");
            }}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper disabled:opacity-30"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {viewStage === "multiply" && (
        <div className="animate-fade-up">
          <h2 className="mb-1 font-display text-xl text-ink">What does this make possible next?</h2>
          <p className="mb-4 text-sm text-muted">Build your Impact Chain.</p>

          <Field label="What's next?">
            <textarea value={whatsNext} onChange={(e) => setWhatsNext(e.target.value)} className={cn(inputClass, "h-16")} />
          </Field>

          <div className="mb-4 flex gap-2">
            <input
              value={chainInput}
              onChange={(e) => setChainInput(e.target.value)}
              placeholder="Add a step to your impact chain"
              className="flex-1 rounded-xl border border-line p-3 text-sm outline-none focus:border-ink"
              onKeyDown={(e) => {
                if (e.key === "Enter" && chainInput.trim()) {
                  e.preventDefault();
                  setChain((c) => [...c, chainInput.trim()]);
                  setChainInput("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (chainInput.trim()) {
                  setChain((c) => [...c, chainInput.trim()]);
                  setChainInput("");
                }
              }}
              className="rounded-xl border border-line px-4 text-sm font-semibold text-ink hover:border-ink"
            >
              Add
            </button>
          </div>

          {chain.length > 0 && (
            <div className="mb-6 rounded-2xl border border-line bg-cream p-5">
              <div className="flex flex-col items-center gap-1">
                {chain.map((step, i) => (
                  <div key={`${step}-${i}`} className="flex w-full flex-col items-center">
                    <div className="w-full max-w-xs rounded-xl bg-paper px-4 py-2.5 text-center text-sm font-semibold text-ink shadow-sm">
                      {step}
                    </div>
                    {i < chain.length - 1 && (
                      <div className="my-1 h-5 w-px bg-gradient-to-b from-pink to-blue" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={!whatsNext.trim()}
            onClick={() => {
              updateMove(id, { multiply: { whatsNext, chain } });
              advance("multiply");
            }}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper disabled:opacity-30"
          >
            Complete This Impact Move <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {move.status === "completed" && viewStage === "multiply" && (
        <div className="mt-6 rounded-2xl border border-blue bg-blue-dim p-5 text-blue">
          <p className="font-display text-lg">Multiplied.</p>
          <p className="mt-1 text-sm">
            This Impact Move is complete.{" "}
            <Link href="/my-impact" className="underline">
              See it in My Impact →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
