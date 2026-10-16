"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getSkillChallenge } from "@/lib/skill-challenge";
import { checkDayRequirements, completedDayCount, EMPTY_DAY } from "@/lib/skill-challenge/engine";
import type {
  ChallengeProgress,
  DayNumber,
  DayProgress,
  ImpactCheck,
  ServiceOffer,
  SkillId,
} from "@/lib/skill-challenge/types";

type ProgressMap = Partial<Record<SkillId, ChallengeProgress>>;

interface SkillChallengeState {
  progress: ProgressMap;
  activeSkill?: SkillId;
  start: (skillId: SkillId) => void;
  setActive: (skillId: SkillId) => void;
  toggleCheck: (skillId: SkillId, day: DayNumber, itemId: string) => void;
  updateDay: (skillId: SkillId, day: DayNumber, patch: Partial<Pick<DayProgress, "response" | "evidenceUrl">>) => void;
  /** Marks a day complete only if its requirements are met; returns what is missing otherwise. */
  completeDay: (skillId: SkillId, day: DayNumber) => { ok: boolean; missing: string[] };
  setNotes: (skillId: SkillId, notes: string) => void;
  toggleSavedResource: (skillId: SkillId, resourceId: string) => void;
  saveImpactCheck: (skillId: SkillId, check: Omit<ImpactCheck, "recordedAt">) => boolean;
  saveServiceOffer: (skillId: SkillId, offer: Omit<ServiceOffer, "updatedAt">) => void;
  reset: (skillId: SkillId) => void;
}

const stamp = () => new Date().toISOString();

function updateProgress(state: SkillChallengeState, skillId: SkillId, change: (current: ChallengeProgress) => ChallengeProgress): Pick<SkillChallengeState, "progress"> {
  const current = state.progress[skillId];
  if (!current) return { progress: state.progress };
  return { progress: { ...state.progress, [skillId]: { ...change(current), updatedAt: stamp() } } };
}

/** Editing a completed day re-checks it, so a day can't stay "complete" after its proof is removed. */
function withDay(skillId: SkillId, progress: ChallengeProgress, day: DayNumber, change: (current: DayProgress) => DayProgress): ChallengeProgress {
  const next: ChallengeProgress = { ...progress, days: { ...progress.days, [day]: change(progress.days[day] ?? EMPTY_DAY) } };
  const dayDef = getSkillChallenge(skillId)?.days.find((entry) => entry.day === day);
  const updated = next.days[day]!;
  if (updated.completedAt && dayDef && !checkDayRequirements(dayDef, next).ready) {
    next.days = { ...next.days, [day]: { ...updated, completedAt: undefined } };
  }
  return next;
}

export const useSkillChallengeStore = create<SkillChallengeState>()(
  persist(
    (set, get) => ({
      progress: {},
      start: (skillId) =>
        set((state) => ({
          activeSkill: skillId,
          progress: state.progress[skillId]
            ? state.progress
            : { ...state.progress, [skillId]: { skillId, startedAt: stamp(), updatedAt: stamp(), days: {}, notes: "", savedResources: [] } },
        })),
      setActive: (skillId) => set({ activeSkill: skillId }),
      toggleCheck: (skillId, day, itemId) =>
        set((state) =>
          updateProgress(state, skillId, (progress) =>
            withDay(skillId, progress, day, (current) => ({
              ...current,
              checked: current.checked.includes(itemId) ? current.checked.filter((id) => id !== itemId) : [...current.checked, itemId],
            }))
          )
        ),
      updateDay: (skillId, day, patch) =>
        set((state) => updateProgress(state, skillId, (progress) => withDay(skillId, progress, day, (current) => ({ ...current, ...patch })))),
      completeDay: (skillId, day) => {
        const progress = get().progress[skillId];
        const dayDef = getSkillChallenge(skillId)?.days.find((entry) => entry.day === day);
        if (!progress || !dayDef) return { ok: false, missing: ["This challenge could not be found."] };
        const check = checkDayRequirements(dayDef, progress);
        if (!check.ready) return { ok: false, missing: check.missing };
        set((state) => updateProgress(state, skillId, (current) => ({
          ...current,
          days: { ...current.days, [day]: { ...(current.days[day] ?? EMPTY_DAY), completedAt: stamp() } },
        })));
        return { ok: true, missing: [] };
      },
      setNotes: (skillId, notes) => set((state) => updateProgress(state, skillId, (progress) => ({ ...progress, notes }))),
      toggleSavedResource: (skillId, resourceId) =>
        set((state) =>
          updateProgress(state, skillId, (progress) => ({
            ...progress,
            savedResources: progress.savedResources.includes(resourceId)
              ? progress.savedResources.filter((id) => id !== resourceId)
              : [...progress.savedResources, resourceId],
          }))
        ),
      saveImpactCheck: (skillId, check) => {
        const progress = get().progress[skillId];
        // The Impact Check is only meaningful once all seven days are genuinely complete.
        if (!progress || completedDayCount(progress) < 7) return false;
        set((state) => updateProgress(state, skillId, (current) => ({ ...current, impactCheck: { ...check, recordedAt: stamp() } })));
        return true;
      },
      saveServiceOffer: (skillId, offer) =>
        set((state) => updateProgress(state, skillId, (progress) => ({ ...progress, serviceOffer: { ...offer, updatedAt: stamp() } }))),
      reset: (skillId) =>
        set((state) => {
          const progress = { ...state.progress };
          delete progress[skillId];
          return { progress, activeSkill: state.activeSkill === skillId ? undefined : state.activeSkill };
        }),
    }),
    { name: "impactfools-skill-challenge", version: 1 }
  )
);
