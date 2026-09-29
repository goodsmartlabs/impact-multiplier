"use client";

import { useSyncExternalStore } from "react";

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    // Server and hydration render always assume "no match" so markup is identical.
    () => false
  );
}

/** True on phone-sized screens. */
export function useIsCompact() {
  return useMediaQuery("(max-width: 767px)");
}

/** Hydration-safe prefers-reduced-motion check (Motion's hook reads it during the first render). */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
