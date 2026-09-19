"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Zap } from "lucide-react";
import { useImpactMovesStore, STAGE_ORDER } from "@/lib/store/impact-moves-store";
import { useHydrated } from "@/lib/use-hydrated";
import { ProgressBar } from "@/components/academy/progress-bar";

const STAGE_LABELS: Record<string, string> = {
  build: "Build",
  capacity: "Capacity",
  value: "Value",
  proof: "Proof",
  money: "Money",
  action: "Action",
  impact: "Impact",
  multiply: "Multiply",
};

export default function ImpactMovesPage() {
  const mounted = useHydrated();
  const moves = useImpactMovesStore((s) => s.moves);
  const createMove = useImpactMovesStore((s) => s.createMove);
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");

  if (!mounted) return null;

  const inProgress = moves.filter((m) => m.status === "in_progress");
  const completed = moves.filter((m) => m.status === "completed");

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 md:px-6 md:pt-10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
            Impact Moves
          </h1>
          <p className="mt-2 text-sm text-muted md:text-base">
            Build. Prove it. Create value. Multiply.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      {creating && (
        <div className="mb-6 rounded-2xl border border-line bg-paper p-5">
          <p className="mb-2 text-sm font-semibold text-ink">What are you building?</p>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. An automated weekly report"
            className="w-full rounded-lg border border-line p-2.5 text-sm outline-none focus:border-ink"
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setTitle("");
              }}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!title.trim()}
              onClick={() => {
                const id = createMove({ title: title.trim() });
                router.push(`/impact-moves/${id}`);
              }}
              className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-paper disabled:opacity-30"
            >
              Start
            </button>
          </div>
        </div>
      )}

      {moves.length === 0 && !creating ? (
        <div className="rounded-3xl border border-dashed border-line p-10 text-center">
          <Zap className="mx-auto mb-3 h-8 w-8 text-muted" />
          <p className="text-sm text-muted">
            No Impact Moves yet. Start one from anything you save, or begin from scratch.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {inProgress.length > 0 && (
            <section>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
                In Progress
              </p>
              <div className="space-y-3">
                {inProgress.map((m) => {
                  const percent = Math.round((m.completedStages.length / STAGE_ORDER.length) * 100);
                  return (
                    <Link
                      key={m.id}
                      href={`/impact-moves/${m.id}`}
                      className="block rounded-2xl border border-line bg-paper p-4 hover:border-ink"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-display text-lg text-ink">{m.title}</p>
                        <span className="shrink-0 text-xs font-semibold uppercase text-muted">
                          {STAGE_LABELS[m.currentStage]}
                        </span>
                      </div>
                      <div className="mt-2">
                        <ProgressBar value={percent} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
                Completed
              </p>
              <div className="space-y-3">
                {completed.map((m) => (
                  <Link
                    key={m.id}
                    href={`/impact-moves/${m.id}`}
                    className="flex items-center justify-between rounded-2xl border border-line bg-paper p-4 hover:border-ink"
                  >
                    <p className="font-display text-lg text-ink">{m.title}</p>
                    <span className="text-xs font-semibold uppercase text-blue">Multiplied</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
