import Link from "next/link";
import { ArrowRight, CornerDownRight, GitBranch, MousePointer2 } from "lucide-react";

const NEEDS = [
  ["I feel stuck.", "/redirection"],
  ["I want to make more money.", "/craft-paths/make-money-with-ai"],
  ["I want to build my brand.", "/craft-paths/build-your-personal-brand"],
  ["I want to learn AI.", "/academy?area=ai-technology"],
  ["I want to change careers.", "/craft-paths/build-your-ai-career"],
  ["I want to build something.", "/craft-paths/from-idea-to-build"],
  ["I want to grow my business.", "/craft-paths/build-your-business-online"],
  ["I want to build wealth.", "/craft-paths/build-your-wealth-system"],
  ["I don’t know yet.", "/redirection"],
] as const;

export function NeedDiscovery() {
  return (
    <section className="border-b border-ink bg-blue-dim px-4 py-14 md:px-6 md:py-20" aria-labelledby="need-heading">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div className="relative lg:sticky lg:top-28">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Start with the problem</p>
          <h2 id="need-heading" className="mt-3 max-w-xl font-display text-6xl font-semibold uppercase leading-[0.8] tracking-[-0.05em] md:text-8xl">What are you trying to change?</h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/70">You don’t need to know which course to choose. Tell us what needs to move.</p>
          <GitBranch className="mt-8 h-12 w-12 text-pink" aria-hidden="true" />
        </div>
        <div className="editorial-grid relative rounded-3xl border border-ink bg-white p-4 shadow-[6px_6px_0_#111] md:p-7">
          <MousePointer2 className="absolute -right-3 -top-4 h-9 w-9 -rotate-12 fill-pink text-ink" aria-hidden="true" />
          <div className="grid gap-3 sm:grid-cols-2">{NEEDS.map(([label, href], index) => <Link key={label} href={href} className={`group flex min-h-24 items-center justify-between gap-4 rounded-2xl border border-ink p-4 transition-transform hover:-translate-y-1 ${index === NEEDS.length - 1 ? "bg-pink-dim sm:col-span-2" : index % 3 === 1 ? "bg-blue-dim/60" : "bg-paper"}`}><span><small className="block text-[9px] font-bold uppercase tracking-[0.15em] text-muted">0{index + 1}</small><strong className="mt-2 block font-display text-2xl font-semibold leading-none">{label}</strong></span><CornerDownRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" /></Link>)}</div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5"><span className="text-xs font-semibold text-muted">Problem → clarity → right solution → action → proof</span><Link href="/craft-paths" className="inline-flex items-center gap-2 text-sm font-bold">Explore Craft Paths <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </div>
    </section>
  );
}
