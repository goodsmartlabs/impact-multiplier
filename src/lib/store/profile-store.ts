"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProfileAnswers } from "@/lib/types";

interface ProfileState {
  name: string;
  answers: ProfileAnswers;
  hasStartedPersonalizing: boolean;
  updateAnswers: (patch: Partial<ProfileAnswers>) => void;
  setName: (name: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: "Olivia",
      answers: {},
      hasStartedPersonalizing: false,
      updateAnswers: (patch) =>
        set((state) => ({
          answers: { ...state.answers, ...patch },
          hasStartedPersonalizing: true,
        })),
      setName: (name) => set({ name }),
    }),
    { name: "im-profile" }
  )
);
