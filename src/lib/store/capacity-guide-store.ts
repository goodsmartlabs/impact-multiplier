"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildCapacityProfile } from "@/lib/capacity-guide/engine";
import type {
  CapacityGuideAnswers,
  CapacityProfile,
  CapacityScores,
  CurrentCapacityAnswers,
  PotentialAnswers,
} from "@/lib/capacity-guide/types";

const emptyAnswers: CapacityGuideAnswers = {
  current: {
    knowHow: "",
    askedForHelp: "",
    feelsEasy: "",
    repeatedExperience: "",
    jobLearning: "",
    tools: "",
    created: "",
  },
  potential: {
    curiousAbout: "",
    postponedSkill: "",
    energizingWork: "",
    couldLearn: "",
    futureStatement: "",
    selectedSkills: [],
  },
  scores: {},
  selectedStack: [],
  selectedOpportunity: "",
  build: { skill: "", why: "", beneficiary: "", problem: "", learning: "", deliverable: "" },
  proof: "",
  valueTest: { people: "", offer: "", problem: "", result: "", firstTest: "" },
};

interface CapacityGuideState {
  answers: CapacityGuideAnswers;
  currentStep: number;
  startedAt?: string;
  updatedAt?: string;
  completedAt?: string;
  profile?: CapacityProfile;
  start: () => void;
  setStep: (step: number) => void;
  updateCurrent: (patch: Partial<CurrentCapacityAnswers>) => void;
  updatePotential: (patch: Partial<PotentialAnswers>) => void;
  setScore: (skillId: string, patch: Partial<CapacityScores>) => void;
  setStack: (stack: string[]) => void;
  setOpportunity: (title: string) => void;
  updateBuild: (patch: Partial<CapacityGuideAnswers["build"]>) => void;
  setProof: (proof: string) => void;
  updateValueTest: (patch: Partial<CapacityGuideAnswers["valueTest"]>) => void;
  complete: () => CapacityProfile;
  reset: () => void;
}

const stamp = () => new Date().toISOString();

export const useCapacityGuideStore = create<CapacityGuideState>()(
  persist(
    (set, get) => ({
      answers: emptyAnswers,
      currentStep: 0,
      start: () => set((state) => ({ startedAt: state.startedAt ?? stamp(), updatedAt: stamp() })),
      setStep: (currentStep) => set({ currentStep, updatedAt: stamp() }),
      updateCurrent: (patch) =>
        set((state) => ({ answers: { ...state.answers, current: { ...state.answers.current, ...patch } }, updatedAt: stamp() })),
      updatePotential: (patch) =>
        set((state) => ({ answers: { ...state.answers, potential: { ...state.answers.potential, ...patch } }, updatedAt: stamp() })),
      setScore: (skillId, patch) =>
        set((state) => ({
          answers: {
            ...state.answers,
            scores: {
              ...state.answers.scores,
              [skillId]: {
                ...(state.answers.scores[skillId] ?? {
                  interest: 3,
                  existingAbility: 3,
                  demand: 3,
                  incomePotential: 3,
                  buildability: 3,
                }),
                ...patch,
              },
            },
          },
          updatedAt: stamp(),
        })),
      setStack: (selectedStack) => set((state) => ({ answers: { ...state.answers, selectedStack }, updatedAt: stamp() })),
      setOpportunity: (selectedOpportunity) => set((state) => ({ answers: { ...state.answers, selectedOpportunity }, updatedAt: stamp() })),
      updateBuild: (patch) => set((state) => ({ answers: { ...state.answers, build: { ...state.answers.build, ...patch } }, updatedAt: stamp() })),
      setProof: (proof) => set((state) => ({ answers: { ...state.answers, proof }, updatedAt: stamp() })),
      updateValueTest: (patch) => set((state) => ({ answers: { ...state.answers, valueTest: { ...state.answers.valueTest, ...patch } }, updatedAt: stamp() })),
      complete: () => {
        const profile = buildCapacityProfile(get().answers);
        set({ profile, completedAt: stamp(), updatedAt: stamp() });
        return profile;
      },
      reset: () => set({ answers: emptyAnswers, currentStep: 0, startedAt: undefined, updatedAt: undefined, completedAt: undefined, profile: undefined }),
    }),
    { name: "impactfools-capacity-guide", version: 1 }
  )
);
