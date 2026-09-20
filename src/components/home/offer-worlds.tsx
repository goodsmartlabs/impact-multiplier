import Link from "next/link";
import { ArrowUpRight, Award, Crop, FileStack, FolderOpen, MousePointer2, Palette, PenTool, Pencil, Play, Ruler, Type } from "lucide-react";

const SERVICE_LABELS = ["Brand & Visual Design", "Web Design + Development", "UI/UX & Product Design", "Creative Direction", "AI-Assisted Building"] as const;
const PRODUCT_LABELS = ["Templates", "Brand Kits", "UI Kits", "Workbooks", "Prompt Packs", "Creative Toolkits"] as const;

function SelectionHandles() {
  return <><i className="absolute -left-1.5 -top-1.5 h-3 w-3 border border-blue bg-white" /><i className="absolute -right-1.5 -top-1.5 h-3 w-3 border border-blue bg-white" /><i className="absolute -bottom-1.5 -left-1.5 h-3 w-3 border border-blue bg-white" /><i className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border border-blue bg-white" /></>;
}

function ServicesCanvas() {
  return (
    <div className="editorial-grid relative min-h-[390px] overflow-hidden rounded-2xl border border-ink bg-white md:min-h-[470px]">
      <div className="absolute left-[7%] top-[9%] w-[67%] rounded-xl border border-ink bg-paper shadow-[6px_6px_0_#0964f5] transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1">
        <div className="flex items-center gap-1.5 border-b border-ink px-3 py-2"><i className="h-2 w-2 rounded-full bg-pink" /><i className="h-2 w-2 rounded-full bg-blue" /><span className="ml-2 text-[8px] font-bold uppercase tracking-[0.16em]">Website canvas</span></div>
        <div className="grid grid-cols-[0.72fr_1fr] gap-3 p-4"><div className="h-36 rounded-lg bg-pink-dim" /><div className="space-y-3 pt-4"><div className="h-4 w-4/5 bg-ink" /><div className="h-2 w-full bg-blue-dim" /><div className="h-2 w-2/3 bg-blue-dim" /><div className="mt-5 h-8 w-24 rounded-full bg-blue" /></div></div>
      </div>
      <div className="absolute bottom-[8%] right-[7%] h-52 w-32 rotate-3 rounded-[1.7rem] border-2 border-ink bg-blue p-2 shadow-[5px_5px_0_#111] transition-transform duration-200 group-hover:-translate-y-1 group-hover:rotate-1">
        <div className="h-full rounded-[1.2rem] bg-white p-3"><div className="mx-auto h-1 w-8 rounded-full bg-ink" /><div className="mt-5 h-16 rounded-lg bg-blue-dim" /><div className="mt-3 h-3 bg-ink" /><div className="mt-2 h-2 w-4/5 bg-pink-dim" /><div className="mt-2 h-2 w-2/3 bg-pink-dim" /></div>
      </div>
      <div className="absolute bottom-[10%] left-[9%] w-44 -rotate-4 border border-ink bg-pink p-4 text-white shadow-[4px_4px_0_#111] transition-transform duration-200 group-hover:-translate-y-1 group-hover:-rotate-2">
        <Type className="h-7 w-7" /><p className="mt-7 font-display text-4xl font-semibold leading-none">Type<br />system</p><div className="mt-4 flex gap-2"><i className="h-4 w-4 rounded-full bg-white" /><i className="h-4 w-4 rounded-full bg-blue" /><i className="h-4 w-4 rounded-full bg-blue-dim" /></div>
      </div>
      <div className="design-sticker absolute right-[8%] top-[8%] rounded-lg border border-ink bg-blue-dim p-2 shadow-[3px_3px_0_#111]"><MousePointer2 className="h-6 w-6" /></div>
      <PenTool className="absolute bottom-5 left-1/2 h-7 w-7 -translate-x-1/2 text-blue" aria-hidden="true" />
      <div className="absolute left-[5%] top-[42%] h-20 w-20 border border-dashed border-blue"><SelectionHandles /></div>
    </div>
  );
}

const COURSE_PREVIEWS = [
  { title: "Financial FLOW", className: "left-4 top-10 -rotate-6 bg-pink text-white" },
  { title: "AI for Financial Clarity", className: "left-[30%] top-6 rotate-2 bg-blue text-white" },
  { title: "Claude for Beginners", className: "right-4 top-12 rotate-6 bg-blue-dim text-ink" },
] as const;

function CoursesCanvas() {
  return (
    <div className="editorial-grid relative h-64 overflow-hidden rounded-2xl border border-ink bg-white">
      {COURSE_PREVIEWS.map((course, index) => (
        <div key={course.title} className={`absolute h-36 w-[36%] min-w-28 rounded-xl border border-ink p-3 shadow-[4px_4px_0_#111] transition-transform duration-200 group-hover:-translate-y-2 ${course.className}`}>
          <span className="text-[8px] font-bold uppercase tracking-[0.16em]">Course 0{index + 1}</span>
          <p className="mt-7 font-display text-xl font-semibold leading-[0.92]">{course.title}</p>
          <Play className="absolute bottom-3 right-3 h-5 w-5 fill-current" />
        </div>
      ))}
      <div className="absolute bottom-4 left-5 right-5 rounded-lg border border-ink bg-paper p-3 shadow-[3px_3px_0_#0964f5]">
        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.13em]"><span>Module progress</span><span>64%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full border border-ink bg-white"><div className="h-full w-[64%] bg-pink" /></div>
      </div>
      <Pencil className="absolute bottom-16 right-5 h-6 w-6 rotate-12 text-pink" aria-hidden="true" />
      <Award className="absolute bottom-16 left-5 h-6 w-6 text-blue" aria-hidden="true" />
    </div>
  );
}

function ProductsCanvas() {
  return (
    <div className="editorial-grid relative h-56 overflow-hidden rounded-2xl border border-ink bg-white">
      <div className="absolute left-7 top-8 h-32 w-28 -rotate-6 border border-ink bg-blue-dim p-3 shadow-[4px_4px_0_#111] transition-transform duration-200 group-hover:-translate-x-2 group-hover:-rotate-8"><span className="text-[8px] font-bold uppercase tracking-[0.14em]">Workbook</span><div className="mt-7 space-y-2"><i className="block h-2 bg-ink" /><i className="block h-2 bg-white" /><i className="block h-2 w-3/4 bg-white" /></div></div>
      <div className="absolute left-1/2 top-5 h-36 w-28 -translate-x-1/2 rotate-2 border border-ink bg-pink p-3 text-white shadow-[4px_4px_0_#111] transition-transform duration-200 group-hover:-translate-y-2"><Palette className="h-6 w-6" /><span className="absolute bottom-3 left-3 text-[9px] font-bold uppercase tracking-[0.14em]">Brand kit</span></div>
      <div className="absolute right-7 top-9 h-32 w-28 rotate-6 border border-ink bg-blue p-3 text-white shadow-[4px_4px_0_#111] transition-transform duration-200 group-hover:translate-x-2 group-hover:rotate-8"><FileStack className="h-6 w-6" /><span className="absolute bottom-3 left-3 text-[9px] font-bold uppercase tracking-[0.14em]">UI kit</span></div>
      <FolderOpen className="absolute bottom-3 left-4 h-7 w-7 fill-pink-dim text-ink" aria-hidden="true" />
      <Crop className="absolute bottom-3 right-4 h-6 w-6 text-blue" aria-hidden="true" />
    </div>
  );
}

function OfferHeader({ number, title, line }: { number: string; title: string; line: string }) {
  return <div className="flex items-end justify-between gap-4"><div><span className="text-[9px] font-bold uppercase tracking-[0.2em] text-pink">{number}</span><h3 className="font-display text-4xl font-semibold leading-none md:text-5xl">{title}</h3><p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{line}</p></div><Ruler className="h-6 w-6 text-blue" aria-hidden="true" /></div>;
}

function ShortLabels({ labels }: { labels: readonly string[] }) {
  return <ul className="mt-4 grid gap-x-4 gap-y-2 text-xs font-semibold sm:grid-cols-2">{labels.map((label) => <li key={label} className="flex items-center gap-2"><span className="text-pink">+</span>{label}</li>)}</ul>;
}

export function OfferWorlds() {
  return (
    <section id="what-we-offer" className="relative overflow-hidden border-b border-ink px-4 py-14 md:px-6 md:py-20" aria-labelledby="what-we-offer-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">CraftFool creative ecosystem</p><h2 id="what-we-offer-title" className="mt-2 font-display text-5xl font-semibold leading-none md:text-7xl">What we offer</h2></div>
          <p className="max-w-xs text-right text-xs font-bold uppercase leading-relaxed tracking-[0.12em]">Built for you · learned by you · ready when you are</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:grid-rows-[auto_auto]">
          <article className="group rounded-3xl border border-ink bg-pink-dim p-4 shadow-[6px_6px_0_#111] md:p-6 lg:row-span-2">
            <OfferHeader number="01" title="Services" line="We build with you." />
            <div className="mt-5"><ServicesCanvas /></div>
            <ShortLabels labels={SERVICE_LABELS} />
            <Link href="/explore" className="mt-5 inline-flex items-center gap-1 text-sm font-bold underline decoration-2 underline-offset-4">Explore Services <ArrowUpRight className="h-4 w-4" /></Link>
          </article>

          <article className="group rounded-3xl border border-ink bg-blue-dim p-4 shadow-[6px_6px_0_#0964f5] md:p-6">
            <OfferHeader number="02" title="Courses" line="Learn it. Build it. Prove it." />
            <div className="mt-5"><CoursesCanvas /></div>
            <Link href="/academy" className="mt-5 inline-flex items-center gap-1 text-sm font-bold underline decoration-2 underline-offset-4">Explore Courses <ArrowUpRight className="h-4 w-4" /></Link>
          </article>

          <article className="group ml-0 rounded-3xl border border-ink bg-paper p-4 shadow-[6px_6px_0_#f72d79] md:p-6 lg:ml-10">
            <OfferHeader number="03" title="Digital Products" line="Made to help you create faster." />
            <div className="mt-5"><ProductsCanvas /></div>
            <ShortLabels labels={PRODUCT_LABELS} />
            <Link href="/search" className="mt-5 inline-flex items-center gap-1 text-sm font-bold underline decoration-2 underline-offset-4">Shop Products <ArrowUpRight className="h-4 w-4" /></Link>
          </article>
        </div>
      </div>
    </section>
  );
}
