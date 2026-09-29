"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { DURATION, EASE_OUT, SPRING_POP } from "@/lib/motion";
import { useCartStore } from "@/lib/store/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

export function SaveButton({
  itemId,
  itemKind,
  size = "sm",
  className,
}: {
  itemId: string;
  itemKind: "discovery" | "course";
  size?: "sm" | "md";
  className?: string;
}) {
  const mounted = useHydrated();
  const has = useCartStore((s) => s.has(itemId));
  const add = useCartStore((s) => s.add);
  const remove = useCartStore((s) => s.remove);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");

  if (!mounted) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted",
          size === "md" && "px-4 py-2 text-sm",
          className
        )}
      >
        <Plus className="h-3.5 w-3.5" /> Save
      </span>
    );
  }

  const saved = has;

  return (
    <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          if (saved) {
            remove(itemId);
          } else {
            setShowNote(true);
          }
        }}
        className={cn(
          "im-press group/save inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
          saved ? "border-ink bg-ink text-paper" : "border-line text-ink hover:border-ink",
          size === "md" && "px-4 py-2 text-sm",
          className
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={saved ? "saved" : "add"}
            initial={{ scale: 0.3, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={SPRING_POP}
            className="flex"
          >
            {saved ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 transition-transform duration-300 group-hover/save:rotate-90" />}
          </motion.span>
        </AnimatePresence>
        {saved ? "In Your Impact Cart" : "Add to Impact Cart"}
      </button>

      <AnimatePresence>
      {showNote && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: DURATION.micro } }}
          transition={{ duration: DURATION.fast, ease: EASE_OUT }}
          style={{ transformOrigin: "top right" }}
          className="absolute right-0 top-full z-20 mt-2 w-72 rounded-2xl border border-line bg-paper p-4 shadow-xl"
        >
          <p className="mb-2 text-sm font-semibold text-ink">Why does this interest you?</p>
          <textarea
            autoFocus
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional — a short note for future you"
            className="h-20 w-full resize-none rounded-lg border border-line p-2 text-sm outline-none focus:border-ink"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowNote(false);
                setNote("");
              }}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-muted hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                add(itemId, itemKind, note.trim() || undefined);
                setShowNote(false);
                setNote("");
              }}
              className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-paper"
            >
              Save
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
