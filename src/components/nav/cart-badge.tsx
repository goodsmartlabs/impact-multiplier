"use client";

import { useCartStore } from "@/lib/store/cart-store";
import { useHydrated } from "@/lib/use-hydrated";

export function useCartCount() {
  const hydrated = useHydrated();
  const count = useCartStore((s) => s.entries.length);
  return hydrated ? count : 0;
}
