"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { STAGGER, VIEWPORT, staggerContainer, textReveal } from "@/lib/motion";
import { useIsCompact } from "@/lib/use-motion-profile";
import { cn } from "@/lib/utils";

const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  div: motion.div,
} as const;

type Line = string | { text: string; className?: string };

type MaskGroupProps = {
  as?: keyof typeof TAGS;
  className?: string;
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  /** Play on mount (hero) rather than on scroll. */
  immediate?: boolean;
  id?: string;
};

/** Container that staggers the masked lines/words inside it. */
export function MaskGroup({ as = "div", className, children, stagger = STAGGER.loose, delay = 0, immediate = false, id }: MaskGroupProps) {
  const compact = useIsCompact();
  const Component = TAGS[as];
  const trigger = immediate
    ? { animate: "visible" }
    : { whileInView: "visible", viewport: { ...VIEWPORT, amount: 0.4 } };

  return (
    <Component
      id={id}
      className={className}
      variants={staggerContainer(compact ? stagger * 0.7 : stagger, delay)}
      initial="hidden"
      {...trigger}
    >
      {children}
    </Component>
  );
}

/** A single masked unit: its content rises from behind its own baseline. */
export function MaskLine({ children, className, innerClassName, inline = false }: { children: React.ReactNode; className?: string; innerClassName?: string; inline?: boolean }) {
  return (
    <span className={cn("im-mask", inline ? "inline-block" : "block", className)}>
      <motion.span className={cn(inline ? "inline-block" : "block", innerClassName)} variants={textReveal}>
        {children}
      </motion.span>
    </span>
  );
}

type TextRevealProps = Omit<MaskGroupProps, "children"> & {
  text?: string;
  lines?: Line[];
  /** "word" staggers every word; "line" reveals each line as one unit. */
  by?: "word" | "line";
};

/** Editorial heading reveal, word by word or line by line. */
export function TextReveal({ text, lines, by = "word", stagger, ...group }: TextRevealProps) {
  const source: Line[] = lines ?? (text ? [text] : []);
  const multiline = source.length > 1;

  return (
    <MaskGroup stagger={stagger ?? (by === "word" ? STAGGER.tight + 0.01 : STAGGER.loose)} {...group}>
      {source.map((line, lineIndex) => {
        const value = typeof line === "string" ? line : line.text;
        const lineClass = typeof line === "string" ? undefined : line.className;

        if (by === "line") {
          return <MaskLine key={lineIndex} className={lineClass}>{value}</MaskLine>;
        }

        const words = value.split(" ");
        const content = words.map((word, index) => (
          <Fragment key={index}>
            <MaskLine inline>{word}</MaskLine>
            {index < words.length - 1 ? " " : null}
          </Fragment>
        ));

        return multiline || lineClass
          ? <span key={lineIndex} className={cn("block", lineClass)}>{content}</span>
          : <Fragment key={lineIndex}>{content}</Fragment>;
      })}
    </MaskGroup>
  );
}
