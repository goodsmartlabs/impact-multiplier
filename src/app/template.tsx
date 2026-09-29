"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { DURATION, EASE_OUT } from "@/lib/motion";

// The first render is server HTML and must be visible immediately;
// only later client-side navigations get the quick cross-fade.
let hasMounted = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const [animateIn] = useState(() => hasMounted);

  useEffect(() => {
    hasMounted = true;
  }, []);

  return (
    <motion.div
      initial={animateIn ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION.fast, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
