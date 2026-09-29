"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useIsCompact, usePrefersReducedMotion } from "@/lib/use-motion-profile";

/**
 * Scroll-linked drift. Switched off for reduced motion; gentler on phones
 * so touch scrolling stays calm.
 */
export function Parallax({ children, className, offset = 40 }: { children: React.ReactNode; className?: string; offset?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const compact = useIsCompact();
  const distance = compact ? offset * 0.4 : offset;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} className={className} style={{ y: reduce ? 0 : y }}>
      {children}
    </motion.div>
  );
}
