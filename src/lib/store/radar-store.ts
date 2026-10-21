"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EMPTY_PREFERENCES, type RadarPreferences } from "@/lib/pulse/radar";

interface RadarState {
  prefs: RadarPreferences;
  updatedAt?: string;
  save: (prefs: RadarPreferences) => void;
  reset: () => void;
}

/**
 * Impact Radar preferences. ImpactFools has no accounts yet, so these live in
 * this browser like the rest of the personalisation (profile, Academy progress).
 */
export const useRadarStore = create<RadarState>()(
  persist(
    (set) => ({
      prefs: EMPTY_PREFERENCES,
      save: (prefs) => set({ prefs, updatedAt: new Date().toISOString() }),
      reset: () => set({ prefs: EMPTY_PREFERENCES, updatedAt: undefined }),
    }),
    { name: "impactfools-radar", version: 1 }
  )
);
