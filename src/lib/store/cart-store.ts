"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ImpactCartEntry } from "@/lib/types";

interface CartState {
  entries: ImpactCartEntry[];
  add: (itemId: string, itemKind: "discovery" | "course", note?: string) => void;
  remove: (itemId: string) => void;
  updateNote: (itemId: string, note: string) => void;
  has: (itemId: string) => boolean;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      entries: [],
      add: (itemId, itemKind, note) => {
        if (get().entries.some((e) => e.itemId === itemId)) return;
        set((state) => ({
          entries: [
            ...state.entries,
            { itemId, itemKind, note, savedAt: new Date().toISOString() },
          ],
        }));
      },
      remove: (itemId) =>
        set((state) => ({ entries: state.entries.filter((e) => e.itemId !== itemId) })),
      updateNote: (itemId, note) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.itemId === itemId ? { ...e, note } : e)),
        })),
      has: (itemId) => get().entries.some((e) => e.itemId === itemId),
      clear: () => set({ entries: [] }),
    }),
    { name: "im-impact-cart" }
  )
);
