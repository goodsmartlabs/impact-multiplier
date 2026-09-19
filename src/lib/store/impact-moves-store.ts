"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ImpactMove, ImpactMoveStage } from "@/lib/types";

const STAGE_ORDER: ImpactMoveStage[] = [
  "build",
  "capacity",
  "value",
  "proof",
  "money",
  "action",
  "impact",
  "multiply",
];

interface ImpactMovesState {
  moves: ImpactMove[];
  createMove: (input: {
    title: string;
    sourceItemSlug?: string;
    sourceCourseSlug?: string;
  }) => string;
  updateMove: (id: string, patch: Partial<ImpactMove>) => void;
  completeStage: (id: string, stage: ImpactMoveStage) => void;
  getMove: (id: string) => ImpactMove | undefined;
}

export const useImpactMovesStore = create<ImpactMovesState>()(
  persist(
    (set, get) => ({
      moves: [],
      createMove: ({ title, sourceItemSlug, sourceCourseSlug }) => {
        const id = `move-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const move: ImpactMove = {
          id,
          title,
          sourceItemSlug,
          sourceCourseSlug,
          createdAt: new Date().toISOString(),
          currentStage: "build",
          completedStages: [],
          status: "in_progress",
        };
        set((state) => ({ moves: [...state.moves, move] }));
        return id;
      },
      updateMove: (id, patch) =>
        set((state) => ({
          moves: state.moves.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      completeStage: (id, stage) =>
        set((state) => ({
          moves: state.moves.map((m) => {
            if (m.id !== id) return m;
            const completedStages = m.completedStages.includes(stage)
              ? m.completedStages
              : [...m.completedStages, stage];
            const idx = STAGE_ORDER.indexOf(stage);
            const nextStage = STAGE_ORDER[idx + 1] ?? stage;
            const status = stage === "multiply" ? "completed" : m.status;
            return { ...m, completedStages, currentStage: nextStage, status };
          }),
        })),
      getMove: (id) => get().moves.find((m) => m.id === id),
    }),
    { name: "im-impact-moves" }
  )
);

export { STAGE_ORDER };
