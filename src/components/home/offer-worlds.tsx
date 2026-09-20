import Link from "next/link";
import {
  AppWindow,
  ArrowUpRight,
  Blocks,
  FileImage,
  FolderOpen,
  Layers3,
  MonitorSmartphone,
  Palette,
  Presentation,
  Sparkles,
  Type,
} from "lucide-react";

const SERVICES = [
  "Brand & Visual Design",
  "Website Design",
  "Website Development",
  "No-Code Builds",
  "App / Product Design",
  "UI/UX Design",
  "Social Media Design",
  "Presentation Design",
  "Creative Direction",
  "AI-Assisted Building",
];

const PRODUCTS = [
  "Website Templates",
  "Landing Pages",
  "Portfolio Templates",
  "Social Templates",
  "Presentation Templates",
  "Brand Kits",
  "UI Kits",
  "Design Resources",
  "Productivity Templates",
  "Digital Workbooks",
  "Prompt Packs",
  "Creative Toolkits",
];

function LabelCloud({ labels, blue = false }: { labels: readonly string[]; blue?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2" aria-label={labels.join(", ")}>
      {labels.map((label) => (
        <span key={label} className={`rounded-full border border-ink px-3 py-1.5 text-[10px] font-semibold ${blue ? "bg-white/80" : "bg-paper"}`}>
          {label}
        </span>
      ))}
    </div>
  );
}

function ServicesVisual() {
  return (
    <div className="editorial-grid relative h-64 overflow-hidden rounded-2xl border border-ink bg-paper sm:h-72">
      <div className="absolute left-5 top-5 w-[72%] rounded-xl border border-ink bg-white shadow-[5px_5px_0_#0964f5] transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1">
        <div className="flex items-center gap-1.5 border-b border-ink px-3 py-2"><i className="h-2 w-2 rounded-full bg-pink" /><i className="h-2 w-2 rounded-full bg-blue" /><i className="h-2 w-2 rounded-full bg-blue-dim" /></div>
        <div className="grid grid-cols-[0.65fr_1fr] gap-3 p-4"><div className="rounded-lg bg-pink-dim" /><div className="space-y-2 py-2"><div className="h-3 w-3/4 bg-ink" /><div className="h-2 w-full bg-blue-dim" /><div className="h-2 w-2/3 bg-blue-dim" /></div></div>
      </div>
      <div className="absolute bottom-5 right-5 h-36 w-24 rounded-[1.4rem] border-2 border-ink bg-blue p-2 shadow-[4px_4px_0_#111] transition-transform duration-200 group-hover:rotate-2">
        <div className="h-full rounded-[1rem] bg-white p-2"><div className="mx-auto h-1 w-7 rounded-full bg-ink" /><div className="mt-4 h-12 rounded-lg bg-pink-dim" /><div className="mt-2 h-2 bg-ink" /><div className="mt-2 h-2 w-3/4 bg-blue-dim" /></div>
      </div>
      <div className="design-sticker absolute bottom-6 left-7 -rotate-6 rounded-lg border border-ink bg-pink p-2 text-white shadow-[3px_3px_0_#111]"><Palette className="h-6 w-6" aria-hidden="true" /></div>
      <Type className="absolute right-7 top-7 h-8 w-8 text-pink" aria-hidden="true" />
    </div>
  );
}

function ProductsVisual() {
  return (
    <div className="editorial-grid relative h-64 overflow-hidden rounded-2xl border border-ink bg-paper sm:h-72">
      <div className="absolute left-7 top-8 h-36 w-28 -rotate-6 rounded-xl border border-ink bg-blue-dim p-3 shadow-[4px_4px_0_#111] transition-transform duration-200 group-hover:-translate-y-1"><Presentation className="h-7 w-7" aria-hidden="true" /><div className="mt-8 h-3 bg-ink" /><div className="mt-2 h-2 w-4/5 bg-white" /></div>
      <div className="absolute left-1/2 top-5 h-40 w-28 -translate-x-1/2 rotate-2 rounded-xl border border-ink bg-pink p-3 text-white shadow-[4px_4px_0_#111] transition-transform duration-200 group-hover:-translate-y-1 group-hover:rotate-0"><FileImage className="h-7 w-7" aria-hidden="true" /><div className="mt-9 h-10 rounded-lg border border-white/70" /><div className="mt-3 h-2 bg-white" /></div>
      <div className="absolute bottom-5 right-6 h-36 w-28 rotate-6 rounded-xl border border-ink bg-white p-3 shadow-[4px_4px_0_#0964f5] transition-transform duration-200 group-hover:-translate-y-1"><Layers3 className="h-7 w-7 text-blue" aria-hidden="true" /><div className="mt-8 space-y-2"><div className="h-3 bg-ink" /><div className="h-2 bg-pink-dim" /><div className="h-2 w-3/4 bg-blue-dim" /></div></div>
      <FolderOpen className="absolute bottom-5 left-5 h-8 w-8 fill-pink-dim text-ink" aria-hidden="true" />
      <Sparkles className="absolute right-6 top-6 h-6 w-6 text-pink" aria-hidden="true" />
    </div>
  );
}

export function OfferWorlds() {
  return (
    <section id="what-we-offer" className="border-b border-ink px-4 py-14 md:px-6 md:py-20" aria-labelledby="what-we-offer-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">CraftFool creative ecosystem</p>
            <h2 id="what-we-offer-title" className="mt-2 font-display text-5xl font-semibold leading-none md:text-7xl">What we offer</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]"><Blocks className="h-5 w-5 text-blue" /> Learn · Build · Create</div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="group rounded-3xl border border-ink bg-pink-dim p-4 transition-transform duration-200 hover:-translate-y-1 md:p-6">
            <ServicesVisual />
            <div className="mt-6 flex items-center gap-3"><MonitorSmartphone className="h-7 w-7 text-blue" aria-hidden="true" /><h3 className="font-display text-4xl font-semibold">Services</h3></div>
            <div className="mt-4"><LabelCloud labels={SERVICES} /></div>
            <Link href="/explore" className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5">Explore Services <ArrowUpRight className="h-4 w-4" /></Link>
          </article>

          <article className="group rounded-3xl border border-ink bg-blue-dim p-4 transition-transform duration-200 hover:-translate-y-1 md:p-6">
            <ProductsVisual />
            <div className="mt-6 flex items-center gap-3"><AppWindow className="h-7 w-7 text-pink" aria-hidden="true" /><h3 className="font-display text-4xl font-semibold">Products</h3></div>
            <div className="mt-4"><LabelCloud labels={PRODUCTS} blue /></div>
            <Link href="/search" className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5">Shop Products <ArrowUpRight className="h-4 w-4" /></Link>
          </article>
        </div>

        <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-ink bg-paper text-center sm:grid-cols-6">
          {["Learn", "Build", "Create", "Get help", "Buy tools", "Use services"].map((label, index) => (
            <div key={label} className={`px-2 py-4 text-[10px] font-bold uppercase tracking-[0.14em] ${index > 0 ? "border-l border-ink" : ""} ${index > 2 ? "border-t border-ink sm:border-t-0" : ""}`}>{label}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
