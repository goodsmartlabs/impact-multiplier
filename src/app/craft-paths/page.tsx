import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GitBranch, MousePointer2, Route, Sparkles } from "lucide-react";
import { CraftPathCard } from "@/components/craft-paths/craft-path-card";
import { CRAFT_PATHS } from "@/lib/data/craft-paths";

export const metadata: Metadata = {
  title: "Craft Paths — ImpactFools Academia",
  description: "Outcome-based journeys that connect the right learning, tools, challenges and proof.",
};

export default function CraftPathsPage() {
  const redirection = CRAFT_PATHS.find((path) => path.slug === "redirection")!;
  const paths = CRAFT_PATHS.filter((path) => path.slug !== "redirection");

  return (
    <div className="pb-20">
      <header className="overflow-hidden border-b border-ink bg-pink-dim px-4 py-12 md:px-6 md:py-20">
        <div className="relative mx-auto max-w-7xl">
          <Route className="creative-float absolute right-[8%] top-0 hidden h-16 w-16 text-blue md:block" aria-hidden="true" />
          <MousePointer2 className="absolute bottom-0 right-[28%] hidden h-9 w-9 -rotate-12 fill-white md:block" aria-hidden="true" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">ImpactFools Academia · Guided outcomes</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl font-semibold uppercase leading-[0.78] tracking-[-0.055em] md:text-8xl lg:text-[9rem]">Don’t choose blindly.<br /><span className="text-blue">Follow a path.</span></h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-ink/75">Courses teach a skill. Craft Paths connect the learning, tools, action and proof needed to reach an outcome.</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-18">
        <section aria-labelledby="start-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">Flagship starting point</p><h2 id="start-heading" className="mt-1 font-display text-4xl font-semibold md:text-6xl">Not sure what you need?</h2></div>
            <Sparkles className="h-8 w-8 text-pink" aria-hidden="true" />
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <CraftPathCard path={redirection} large />
            <div className="editorial-grid flex min-h-[280px] flex-col justify-between rounded-3xl border border-ink bg-white p-6 md:p-8">
              <GitBranch className="h-10 w-10 text-blue" aria-hidden="true" />
              <div><p className="font-display text-4xl font-semibold leading-none">Something needs to change.</p><p className="mt-3 text-sm text-muted">Let’s figure out what—before recommending a course.</p></div>
              <Link href="/redirection" className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white">Take the Redirection Check <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="paths-heading">
          <div className="mb-7"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Choose by outcome</p><h2 id="paths-heading" className="mt-1 font-display text-5xl font-semibold md:text-7xl">Where are you going?</h2></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{paths.map((path) => <CraftPathCard key={path.id} path={path} />)}</div>
        </section>
      </main>
    </div>
  );
}
