"use client";

import { motion } from "motion/react";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Fills from empty on mount, then glides whenever progress changes. */
export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ink/10", className)}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-pink to-blue"
        initial={{ width: "0%" }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: DURATION.slow, ease: EASE_OUT }}
      />
    </div>
  );
}
