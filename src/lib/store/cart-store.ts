"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ImpactCartEntry, OpportunityTrackStatus, PulseCartSnapshot } from "@/lib/types";

interface CartState {
  entries: ImpactCartEntry[];
  add: (itemId: string, itemKind: ImpactCartEntry["itemKind"], note?: string, pulse?: PulseCartSnapshot) => void;
  remove: (itemId: string) => void;
  updateNote: (itemId: string, note: string) => void;
  setStatus: (itemId: string, status: OpportunityTrackStatus) => void;
  has: (itemId: string) => boolean;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      entries: [],
      add: (itemId, itemKind, note, pulse) => {
        if (get().entries.some((e) => e.itemId === itemId)) return;
        set((state) => ({
          entries: [
            ...state.entries,
            {
              itemId,
              itemKind,
              note,
              savedAt: new Date().toISOString(),
              ...(itemKind === "pulse" ? { status: "saved" as const, statusUpdatedAt: new Date().toISOString(), pulse } : {}),
            },
          ],
        }));
      },
      remove: (itemId) =>
        set((state) => ({ entries: state.entries.filter((e) => e.itemId !== itemId) })),
      updateNote: (itemId, note) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.itemId === itemId ? { ...e, note } : e)),
        })),
      setStatus: (itemId, status) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.itemId === itemId ? { ...e, status, statusUpdatedAt: new Date().toISOString() } : e)),
        })),
      has: (itemId) => get().entries.some((e) => e.itemId === itemId),
      clear: () => set({ entries: [] }),
    }),
    { name: "im-impact-cart" }
  )
);
