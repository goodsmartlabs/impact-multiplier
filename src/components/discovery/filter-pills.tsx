"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SPRING_SOFT } from "@/lib/motion";

export function FilterPills<T extends string>({
  options,
  active,
  onChange,
}: {
  options: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
}) {
  // Each pill group gets its own shared-layout id so the active fill glides between options.
  const groupId = useId();

  return (
    <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
      {options.map((opt) => {
        const selected = active === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(opt.key)}
            className={cn(
              "im-press relative shrink-0 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300",
              selected
                ? "border-ink text-paper"
                : "border-line bg-paper text-muted hover:border-ink hover:text-ink"
            )}
          >
            {selected && (
              <motion.span
                layoutId={`pill-${groupId}`}
                aria-hidden="true"
                transition={SPRING_SOFT}
                className="absolute inset-0 rounded-full bg-ink"
              />
            )}
            <span className="relative">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
