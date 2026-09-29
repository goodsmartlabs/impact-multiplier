"use client";

import { createContext, useContext } from "react";
import {
  Code2,
  Crop,
  Folder,
  Layers3,
  MousePointer2,
  PenTool,
  Pencil,
  Ruler,
  Sparkles,
  Triangle,
} from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { BrandWordmark } from "@/components/brand-logo";
import { MaskGroup, MaskLine } from "@/components/motion/text-reveal";
import { Parallax } from "@/components/motion/parallax";
import { imageReveal, popIn, scaleIn, withDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

const toolTile =
  "design-sticker flex items-center justify-center rounded-lg border border-ink shadow-[3px_3px_0_#111]";

type Pointer = { x: MotionValue<number>; y: MotionValue<number> };
const PointerContext = createContext<Pointer | null>(null);

/**
 * A positioned layer that pops in on load and drifts with the pointer.
 * `depth` controls how far it travels, giving the artboard real layering.
 */
function Layer({ className, depth = 10, delay = 0, children }: { className?: string; depth?: number; delay?: number; children: React.ReactNode }) {
  const pointer = useContext(PointerContext);
  const fallback = useMotionValue(0);
  const x = useTransform(pointer?.x ?? fallback, (value) => value * depth);
  const y = useTransform(pointer?.y ?? fallback, (value) => value * depth);

  return (
    <motion.div className={cn("absolute", className)} style={{ x, y }}>
      <motion.div variants={withDelay(popIn, delay)}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function CreativeWorkbench() {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.6 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    rawX.set((event.clientX - rect.left) / rect.width - 0.5);
    rawY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function resetPointer() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <PointerContext.Provider value={{ x, y }}>
      <motion.div
        variants={withDelay(imageReveal, 0.15)}
        initial="hidden"
        animate="visible"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        className="creative-workbench editorial-grid relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-3xl border border-ink bg-paper p-6 md:min-h-[500px] md:p-8"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: -8 }, visible: { opacity: 1, y: 0, transition: { delay: 0.55 } } }}
          className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-ink bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] shadow-[3px_3px_0_#111]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-pink opacity-60 [animation-iteration-count:3]" />
            <span className="relative h-2 w-2 rounded-full bg-pink" />
          </span>
          Artboard 01
        </motion.div>

        <Parallax offset={18} className="mt-6 w-[92%] max-w-[440px]">
          <motion.div
            variants={withDelay(scaleIn, 0.35)}
            className="relative h-[300px] w-full border border-dashed border-blue bg-white/80 md:h-[340px]"
          >
            <span className="absolute -left-1.5 -top-1.5 h-3 w-3 border border-blue bg-white" />
            <span className="absolute -right-1.5 -top-1.5 h-3 w-3 border border-blue bg-white" />
            <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 border border-blue bg-white" />
            <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border border-blue bg-white" />

            <Layer className="left-[7%] top-[7%] z-20" depth={14} delay={0.7}>
              <div className={`${toolTile} h-12 w-12 -rotate-12 bg-[#ffe47a] md:h-14 md:w-14`}>
                <Pencil className="h-7 w-7 text-ink" aria-hidden="true" />
              </div>
            </Layer>
            <Layer className="left-[40%] top-[6%] z-20" depth={22} delay={0.8}>
              <MousePointer2 className="creative-float h-9 w-9 fill-blue-dim text-ink md:h-11 md:w-11" aria-hidden="true" />
            </Layer>
            <Layer className="right-[7%] top-[8%] z-20" depth={12} delay={0.9}>
              <div className={`${toolTile} h-11 w-[74px] rotate-[-8deg] bg-blue-dim md:w-20`}>
                <Ruler className="h-6 w-12 text-ink md:w-14" aria-hidden="true" />
              </div>
            </Layer>

            {/* Centrepiece: the mascot and the ImpactFools wordmark */}
            <div className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center">
              <Layer className="relative" depth={-6} delay={0.55}>
                <div className="flex flex-col items-center">
                  <div className="relative px-3 pb-1.5 pt-1">
                    <i className="absolute -left-1 -top-1 h-2.5 w-2.5 border border-blue bg-white" />
                    <i className="absolute -right-1 -top-1 h-2.5 w-2.5 border border-blue bg-white" />
                    <i className="absolute -bottom-1 -left-1 h-2.5 w-2.5 border border-blue bg-white" />
                    <i className="absolute -bottom-1 -right-1 h-2.5 w-2.5 border border-blue bg-white" />
                    <MaskGroup as="p" delay={0.85} immediate className="text-[2.6rem] sm:text-[3rem] md:text-[3.5rem]">
                      <MaskLine inline innerClassName="leading-none">
                        <BrandWordmark />
                      </MaskLine>
                    </MaskGroup>
                  </div>
                </div>
              </Layer>
            </div>

            <Layer className="bottom-[9%] left-[6%] z-20" depth={16} delay={1.0}>
              <div className={`${toolTile} h-12 w-12 rotate-[-7deg] bg-pink-dim`}>
                <Triangle className="h-7 w-7 fill-white text-ink" aria-hidden="true" />
              </div>
            </Layer>
            <Layer className="bottom-[6%] left-[30%] z-20" depth={10} delay={1.08}>
              <div className={`${toolTile} h-11 w-12 rotate-3 bg-blue-dim`}>
                <Code2 className="h-7 w-7 text-ink" aria-hidden="true" />
              </div>
            </Layer>
            <Layer className="bottom-[5%] right-[29%] z-20" depth={18} delay={1.16}>
              <div className={`${toolTile} h-11 w-12 rotate-[-5deg] bg-white`}>
                <Layers3 className="h-7 w-7 text-pink" aria-hidden="true" />
              </div>
            </Layer>
            <Layer className="bottom-[9%] right-[6%] z-20" depth={12} delay={1.24}>
              <Folder className="creative-float h-10 w-10 fill-[#ffe47a] text-ink md:h-12 md:w-12" aria-hidden="true" />
            </Layer>

            <Layer className="right-[3%] top-[38%]" depth={26} delay={1.3}>
              <Sparkles className="creative-float h-6 w-6 text-pink" aria-hidden="true" />
            </Layer>
            <Layer className="left-[4%] top-[42%] hidden sm:block" depth={20} delay={1.35}>
              <PenTool className="h-7 w-7 -rotate-12 fill-white text-ink" aria-hidden="true" />
            </Layer>
          </motion.div>
        </Parallax>

        <Crop className="absolute bottom-24 right-5 h-5 w-5 text-muted" aria-hidden="true" />
        <motion.span
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 1.4 } } }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted"
        >
          Create · Test · Refine
        </motion.span>
      </motion.div>
    </PointerContext.Provider>
  );
}
