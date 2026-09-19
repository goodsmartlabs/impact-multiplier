"use client";

import { Check } from "lucide-react";
import { STAGE_ORDER } from "@/lib/store/impact-moves-store";
import type { ImpactMoveStage } from "@/lib/types";
import { cn } from "@/lib/utils";

const LABELS: Record<ImpactMoveStage, string> = {
  build: "Build",
  capacity: "Capacity",
  value: "Value",
  proof: "Proof",
  money: "Money",
  action: "Action",
  impact: "Impact",
  multiply: "Multiply",
};

export function StageStepper({
  completedStages,
  viewStage,
  onSelect,
}: {
  completedStages: ImpactMoveStage[];
  viewStage: ImpactMoveStage;
  onSelect: (stage: ImpactMoveStage) => void;
}) {
  return (
    <div className="scrollbar-none -mx-4 mb-8 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0">
      {STAGE_ORDER.map((stage, i) => {
        const done = completedStages.includes(stage);
        const active = stage === viewStage;
        const unlocked = done || active || i === completedStages.length;
        return (
          <button
            key={stage}
            type="button"
            disabled={!unlocked}
            onClick={() => onSelect(stage)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              active && "border-ink bg-ink text-paper",
              !active && done && "border-blue bg-blue-dim text-blue",
              !active && !done && unlocked && "border-line text-muted hover:border-ink",
              !unlocked && "border-line text-line opacity-40"
            )}
          >
            {done && !active ? <Check className="h-3 w-3" /> : <span>{i + 1}</span>}
            {LABELS[stage]}
          </button>
        );
      })}
    </div>
  );
}
