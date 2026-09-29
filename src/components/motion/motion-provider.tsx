"use client";

import { MotionConfig, MotionGlobalConfig } from "motion/react";
import { EASE_OUT, DURATION } from "@/lib/motion";

/*
 * Visitors who ask for reduced motion get a static page: every Motion
 * animation (reveals, staggers, delays included) jumps straight to its
 * final state. Set at module load so it applies before the first reveal,
 * and kept in sync if the OS setting changes mid-visit.
 */
if (typeof window !== "undefined") {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  MotionGlobalConfig.skipAnimations = media.matches;
  media.addEventListener("change", (event) => {
    MotionGlobalConfig.skipAnimations = event.matches;
  });
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: DURATION.base, ease: EASE_OUT }}>
      {children}
    </MotionConfig>
  );
}
