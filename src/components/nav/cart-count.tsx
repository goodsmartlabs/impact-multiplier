"use client";

import { AnimatePresence, motion } from "motion/react";
import { SPRING_POP } from "@/lib/motion";

/** Cart badge that pops in, and bounces whenever the count changes. */
export function CartCount({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key="badge"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={SPRING_POP}
          className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-pink px-1 text-[10px] font-semibold text-white"
        >
          <motion.span key={count} initial={{ scale: 1.5 }} animate={{ scale: 1 }} transition={SPRING_POP}>
            {count}
          </motion.span>
        </motion.span>
      )}
    </AnimatePresence>
  );
}
