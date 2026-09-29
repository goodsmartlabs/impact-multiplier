"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A vertical rule that draws itself as the reader scrolls past it.
 * Position it like any absolutely placed line; the track stays faint.
 */
export function ScrollLine({ className, color = "bg-ink" }: { className?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <div ref={ref} aria-hidden="true" className={cn("w-px bg-ink/15", className)}>
      <motion.div className={cn("h-full w-full origin-top", color)} style={{ scaleY }} />
    </div>
  );
}
