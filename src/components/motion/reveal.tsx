"use client";

import { motion } from "motion/react";
import { STAGGER, VARIANTS, VIEWPORT, staggerContainer, withDelay, type RevealVariant } from "@/lib/motion";
import { useIsCompact } from "@/lib/use-motion-profile";

const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  h1: motion.h1,
  h2: motion.h2,
  ul: motion.ul,
  li: motion.li,
  p: motion.p,
  span: motion.span,
} as const;

type Tag = keyof typeof TAGS;

type BaseProps = {
  children?: React.ReactNode;
  className?: string;
  as?: Tag;
  id?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

type RevealProps = BaseProps & {
  variant?: RevealVariant;
  delay?: number;
  /** Reveal on mount (above the fold) instead of when scrolled into view. */
  immediate?: boolean;
  amount?: number;
};

function trigger(immediate: boolean, amount: number) {
  return immediate
    ? { animate: "visible" }
    : { whileInView: "visible", viewport: { ...VIEWPORT, amount } };
}

/** Scroll-triggered entrance using one of the shared variants. */
export function Reveal({ as = "div", variant = "fadeUp", delay = 0, immediate = false, amount, children, ...rest }: RevealProps) {
  const Component = TAGS[as];
  return (
    <Component {...rest} variants={withDelay(VARIANTS[variant], delay)} initial="hidden" {...trigger(immediate, amount ?? VIEWPORT.amount)}>
      {children}
    </Component>
  );
}

type StaggerProps = Omit<RevealProps, "variant" | "delay"> & {
  stagger?: number;
  delayChildren?: number;
};

/** Parent that cascades its StaggerItem children into view; tighter rhythm on phones. */
export function Stagger({ as = "div", stagger = STAGGER.base, delayChildren = 0, immediate = false, amount, children, ...rest }: StaggerProps) {
  const compact = useIsCompact();
  const Component = TAGS[as];
  const scale = compact ? 0.6 : 1;
  return (
    <Component {...rest} variants={staggerContainer(stagger * scale, delayChildren * scale)} initial="hidden" {...trigger(immediate, amount ?? 0.15)}>
      {children}
    </Component>
  );
}

export function StaggerItem({ as = "div", variant = "staggerItem", children, ...rest }: BaseProps & { variant?: RevealVariant }) {
  const Component = TAGS[as];
  return (
    <Component {...rest} variants={VARIANTS[variant]}>
      {children}
    </Component>
  );
}
