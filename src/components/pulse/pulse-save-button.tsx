"use client";

import { AnimatePresence, motion } from "motion/react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { trackPulse } from "@/lib/pulse/track";
import { SPRING_POP } from "@/lib/motion";
import type { PulseUpdate } from "@/lib/pulse/types";
import { cn } from "@/lib/utils";

/** Saves an update to the existing Impact Cart as a trackable opportunity. */
export function PulseSaveButton({ update, className, tone = "light" }: { update: PulseUpdate; className?: string; tone?: "light" | "dark" }) {
  const mounted = useHydrated();
  const saved = useCartStore((state) => state.entries.some((entry) => entry.itemId === update.id));
  const add = useCartStore((state) => state.add);
  const remove = useCartStore((state) => state.remove);

  const toggle = () => {
    if (saved) return remove(update.id);
    add(update.id, "pulse", undefined, {
      slug: update.slug,
      title: update.title,
      category: update.category,
      summary: update.summary,
      next: update.signal.next,
      skills: update.skills,
      sourceName: update.sourceName,
      sourceUrl: update.sourceUrl,
      deadline: update.deadline,
      verification: update.verification,
      relatedCourseSlugs: update.relatedCourseSlugs,
      cta: update.cta,
    });
    trackPulse(update.id, "save");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!mounted}
      aria-pressed={saved}
      aria-label={saved ? `Remove “${update.title}” from your Opportunity Cart` : `Save “${update.title}” for later`}
      className={cn(
        "im-press inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold",
        tone === "dark"
          ? saved ? "border-white bg-white text-ink" : "border-white/60 text-white hover:border-white"
          : saved ? "border-ink bg-ink text-white" : "border-ink bg-white text-ink hover:bg-pink-dim",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={saved ? "saved" : "save"} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={SPRING_POP} className="flex">
          {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
        </motion.span>
      </AnimatePresence>
      {saved ? "Saved" : "Save for later"}
    </button>
  );
}
