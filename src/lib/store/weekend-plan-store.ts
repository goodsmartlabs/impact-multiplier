"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Top3Recommendation } from "@/lib/newsletter/top3";
import type { Top3Answers } from "@/lib/newsletter/top3-questions";

/**
 * FIND MY TOP 3 results and weekend plans. There are no accounts yet, so this
 * lives in the visitor's browser — private by construction, never sent to the
 * server or exported to social.
 */
export type PlanStatus = "started" | "in_progress" | "completed";

export interface WeekendPlan {
  projectId: string;
  recommendation: Top3Recommendation;
  status: PlanStatus;
  doneSteps: string[];
  savedAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface WeekendPlanState {
  answers?: Top3Answers;
  latest?: { generatedAt: string; recommendations: Top3Recommendation[] };
  plans: WeekendPlan[];
  setResult: (answers: Top3Answers, recommendations: Top3Recommendation[]) => void;
  savePlan: (recommendation: Top3Recommendation) => void;
  toggleStep: (projectId: string, stepKey: string) => void;
  setStatus: (projectId: string, status: PlanStatus) => void;
  removePlan: (projectId: string) => void;
  clearResults: () => void;
}

export const stepKey = (day: string, index: number) => `${day}-${index}`;
export const totalSteps = (recommendation: Top3Recommendation) => recommendation.plan.reduce((sum, day) => sum + day.steps.length, 0);

export const useWeekendPlanStore = create<WeekendPlanState>()(
  persist(
    (set) => ({
      plans: [],
      setResult: (answers, recommendations) => set({ answers, latest: { generatedAt: new Date().toISOString(), recommendations } }),
      savePlan: (recommendation) =>
        set((state) => {
          if (state.plans.some((plan) => plan.projectId === recommendation.projectId)) return state;
          const now = new Date().toISOString();
          return { plans: [{ projectId: recommendation.projectId, recommendation, status: "started", doneSteps: [], savedAt: now, updatedAt: now }, ...state.plans] };
        }),
      toggleStep: (projectId, key) =>
        set((state) => ({
          plans: state.plans.map((plan) => {
            if (plan.projectId !== projectId) return plan;
            const doneSteps = plan.doneSteps.includes(key) ? plan.doneSteps.filter((item) => item !== key) : [...plan.doneSteps, key];
            const all = doneSteps.length >= totalSteps(plan.recommendation);
            const now = new Date().toISOString();
            const status: PlanStatus = all ? "completed" : doneSteps.length ? "in_progress" : "started";
            return { ...plan, doneSteps, status, updatedAt: now, completedAt: all ? plan.completedAt ?? now : undefined };
          }),
        })),
      setStatus: (projectId, status) =>
        set((state) => ({
          plans: state.plans.map((plan) => (plan.projectId === projectId ? { ...plan, status, updatedAt: new Date().toISOString(), completedAt: status === "completed" ? plan.completedAt ?? new Date().toISOString() : undefined } : plan)),
        })),
      removePlan: (projectId) => set((state) => ({ plans: state.plans.filter((plan) => plan.projectId !== projectId) })),
      clearResults: () => set({ latest: undefined }),
    }),
    { name: "impactfools-weekend-plan", version: 1 },
  ),
);
