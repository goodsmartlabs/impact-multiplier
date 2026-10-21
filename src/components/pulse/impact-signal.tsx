"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Radar } from "lucide-react";
import type { ImpactSignal as Signal } from "@/lib/pulse/types";
import { SIGNAL_ROWS } from "@/lib/pulse/signal";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function SignalList({ signal, dark = false }: { signal: Signal; dark?: boolean }) {
  return (
    <dl className="grid gap-3">
      {SIGNAL_ROWS.map((row) => (
        <div key={row.key} className="grid grid-cols-[4.5rem_1fr] gap-3">
          <dt className={cn("font-display text-lg font-semibold leading-tight", row.key === "next" ? "text-pink" : dark ? "text-blue-dim" : "text-blue")}>{row.label}</dt>
          <dd className={cn("text-sm leading-relaxed", dark ? "text-white/85" : "text-ink/80")}>{signal[row.key]}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Collapsible WHAT / WHY / WHO / HOW / NEXT panel used inside feed cards. */
export function ImpactSignalToggle({ signal, dark = false }: { signal: Signal; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={cn("rounded-2xl border", dark ? "border-white/25" : "border-ink/15")}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className={cn("flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2 text-left text-[11px] font-bold uppercase tracking-[0.14em] transition-colors", dark ? "hover:bg-white/10" : "hover:bg-blue-dim/50")}
      >
        <span className="inline-flex items-center gap-1.5"><Radar className="h-3.5 w-3.5" />Impact Signal</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: DURATION.fast, ease: EASE_OUT }} className="overflow-hidden">
            <div className="px-3 pb-3 pt-1"><SignalList signal={signal} dark={dark} /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
