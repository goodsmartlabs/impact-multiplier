import type { Transition, Variants } from "motion/react";

/**
 * ImpactFools motion system.
 *
 * One easing family, three durations and a single stagger rhythm so every
 * reveal on the site feels like it belongs to the same hand. Movement
 * distances come from CSS custom properties (see globals.css) so they
 * shrink automatically on small screens without re-rendering anything.
 */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
export const SPRING_POP = { type: "spring", stiffness: 420, damping: 26, mass: 0.8 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 160, damping: 22, mass: 0.9 } as const;

export const DURATION = {
  micro: 0.18,
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
} as const;

export const STAGGER = {
  tight: 0.05,
  base: 0.08,
  loose: 0.12,
} as const;

/** Distances resolve from CSS so mobile gets shorter travel. */
export const SHIFT = "var(--motion-shift)";
export const SHIFT_LG = "var(--motion-shift-lg)";

const base = (duration: number = DURATION.base, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE_OUT,
});

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: SHIFT },
  visible: { opacity: 1, y: 0, transition: base() },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: base(DURATION.slow) },
};

export const slideReveal: Variants = {
  hidden: { opacity: 0, x: SHIFT_LG },
  visible: { opacity: 1, x: 0, transition: base(DURATION.slow) },
};

export const slideRevealLeft: Variants = {
  hidden: { opacity: 0, x: "var(--motion-shift-lg-neg)" },
  visible: { opacity: 1, x: 0, transition: base(DURATION.slow) },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: base(DURATION.base) },
};

/** Sticker-style pop for small decorative tiles. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -8 },
  visible: { opacity: 1, scale: 1, rotate: 0, transition: SPRING_POP },
};

/** Masked editorial reveal: the element rises out from behind its own line. */
export const textReveal: Variants = {
  hidden: { y: "108%" },
  visible: { y: "0%", transition: base(DURATION.slow) },
};

/** Clip-path unmask for canvases, artboards and imagery. */
export const imageReveal: Variants = {
  hidden: { clipPath: "inset(10% 8% 10% 8% round 1.5rem)", opacity: 0.4 },
  visible: {
    clipPath: "inset(0% 0% 0% 0% round 1.5rem)",
    opacity: 1,
    transition: base(DURATION.slow),
  },
};

export function staggerContainer(stagger: number = STAGGER.base, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: SHIFT },
  visible: { opacity: 1, y: 0, transition: base(DURATION.base) },
};

/** Same variant, with its "visible" transition pushed back by `delay` seconds. */
export function withDelay(variants: Variants, delay: number): Variants {
  if (!delay) return variants;
  const visible = variants.visible as Record<string, unknown> & { transition?: Transition };
  return { ...variants, visible: { ...visible, transition: { ...visible.transition, delay } } };
}

export const VARIANTS = {
  fadeUp,
  fadeIn,
  slideReveal,
  slideRevealLeft,
  scaleIn,
  popIn,
  imageReveal,
  staggerItem,
} as const;

export type RevealVariant = keyof typeof VARIANTS;

/** Viewport defaults: reveal once, a little before the element is fully in view. */
export const VIEWPORT = { once: true, amount: 0.25, margin: "0px 0px -8% 0px" } as const;
