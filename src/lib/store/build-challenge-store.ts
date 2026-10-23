"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BuildArtifact, BuildBrief, BuildChallenge, BuildDayRecord, BuildStage } from "@/lib/build-challenge";

interface BuildChallengeState {
  challenges: BuildChallenge[];
  activeChallengeId?: string;
  createDraft: (brief: BuildBrief, source: BuildChallenge["source"]) => string;
  updateBrief: (id: string, brief: BuildBrief) => void;
  lockBuild: (id: string) => boolean;
  updateDay: (id: string, stage: BuildStage, patch: Partial<BuildDayRecord>) => void;
  completeDay: (id: string, stage: BuildStage, taskIds: string[], output: string) => void;
  addArtifact: (id: string, artifact: Omit<BuildArtifact, "id" | "createdAt">) => void;
  parkBuild: (id: string) => void;
  resumeBuild: (id: string) => boolean;
  removeDraft: (id: string) => void;
}

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useBuildChallengeStore = create<BuildChallengeState>()(
  persist(
    (set, get) => ({
      challenges: [],
      activeChallengeId: undefined,
      createDraft: (brief, source) => {
        const id = makeId("build");
        const challenge: BuildChallenge = {
          id,
          brief,
          source,
          status: "draft",
          currentDay: 1,
          createdAt: new Date().toISOString(),
          days: {},
          artifacts: [],
        };
        set((state) => ({ challenges: [...state.challenges, challenge] }));
        return id;
      },
      updateBrief: (id, brief) => set((state) => ({ challenges: state.challenges.map((item) => item.id === id ? { ...item, brief } : item) })),
      lockBuild: (id) => {
        const state = get();
        if (state.activeChallengeId && state.activeChallengeId !== id) return false;
        set((current) => ({
          activeChallengeId: id,
          challenges: current.challenges.map((item) => item.id === id ? { ...item, status: "active", activatedAt: item.activatedAt ?? new Date().toISOString() } : item),
        }));
        return true;
      },
      updateDay: (id, stage, patch) => set((state) => ({
        challenges: state.challenges.map((item) => item.id === id ? {
          ...item,
          days: { ...item.days, [stage]: { completedTaskIds: [], workspace: "", output: "", ...item.days[stage], ...patch } },
        } : item),
      })),
      completeDay: (id, stage, taskIds, output) => set((state) => ({
        activeChallengeId: state.challenges.find((item) => item.id === id)?.currentDay === 7 ? undefined : state.activeChallengeId,
        challenges: state.challenges.map((item) => {
          if (item.id !== id) return item;
          const completed = item.currentDay === 7;
          return {
            ...item,
            currentDay: completed ? 7 : Math.min(7, item.currentDay + 1),
            status: completed ? "completed" : item.status,
            completedAt: completed ? new Date().toISOString() : item.completedAt,
            days: { ...item.days, [stage]: { completedTaskIds: taskIds, workspace: item.days[stage]?.workspace ?? "", output, completedAt: new Date().toISOString() } },
          };
        }),
      })),
      addArtifact: (id, artifact) => set((state) => ({ challenges: state.challenges.map((item) => item.id === id ? { ...item, artifacts: [...item.artifacts, { ...artifact, id: makeId("artifact"), createdAt: new Date().toISOString() }] } : item) })),
      parkBuild: (id) => set((state) => ({
        activeChallengeId: state.activeChallengeId === id ? undefined : state.activeChallengeId,
        challenges: state.challenges.map((item) => item.id === id ? { ...item, status: "parked" } : item),
      })),
      resumeBuild: (id) => {
        const state = get();
        if (state.activeChallengeId && state.activeChallengeId !== id) return false;
        set((current) => ({ activeChallengeId: id, challenges: current.challenges.map((item) => item.id === id ? { ...item, status: "active" } : item) }));
        return true;
      },
      removeDraft: (id) => set((state) => ({ challenges: state.challenges.filter((item) => item.id !== id) })),
    }),
    { name: "impactfools-build-challenge", version: 1 }
  )
);


