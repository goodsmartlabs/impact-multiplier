import { Brackets, Crop, Folder, MousePointer2, PenTool, Sparkles } from "lucide-react";

export function CreativeWorkbench() {
  return (
    <div className="creative-workbench editorial-grid relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-3xl border border-ink bg-paper p-8 md:min-h-[500px]">
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-ink bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] shadow-[3px_3px_0_#111]">
        <span className="h-2 w-2 rounded-full bg-pink" /> Artboard 01
      </div>

      <div className="design-sticker absolute right-6 top-8 rotate-6 rounded-xl border border-ink bg-blue px-3 py-2 text-white shadow-[4px_4px_0_#111]">
        <MousePointer2 className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="design-sticker absolute bottom-8 left-6 -rotate-6 rounded-xl border border-ink bg-pink px-3 py-2 text-white shadow-[4px_4px_0_#111]">
        <PenTool className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="design-sticker absolute bottom-7 right-8 rotate-3 rounded-xl border border-ink bg-blue-dim px-3 py-2 shadow-[4px_4px_0_#111]">
        <Brackets className="h-6 w-6" aria-hidden="true" />
      </div>
      <Folder className="creative-float absolute left-8 top-24 h-9 w-9 fill-pink-dim text-ink" aria-hidden="true" />
      <Sparkles className="creative-float absolute right-12 top-28 h-7 w-7 text-pink" aria-hidden="true" />

      <div className="relative w-[78%] max-w-[390px]">
        <span className="absolute -left-3 -top-3 h-3 w-3 border border-blue bg-white" />
        <span className="absolute -right-3 -top-3 h-3 w-3 border border-blue bg-white" />
        <span className="absolute -bottom-3 -left-3 h-3 w-3 border border-blue bg-white" />
        <span className="absolute -bottom-3 -right-3 h-3 w-3 border border-blue bg-white" />
        <div className="relative h-56 overflow-hidden border border-dashed border-blue bg-white p-4 md:h-64 md:p-5">
          <div className="absolute left-5 top-4 w-[60%] rounded-lg border border-ink bg-paper shadow-[4px_4px_0_#bfe8ed]">
            <div className="flex gap-1 border-b border-ink px-2 py-1.5"><i className="h-1.5 w-1.5 rounded-full bg-pink" /><i className="h-1.5 w-1.5 rounded-full bg-blue" /></div>
            <div className="grid grid-cols-[0.7fr_1fr] gap-2 p-3"><div className="h-16 rounded bg-pink-dim" /><div className="space-y-2 pt-1"><div className="h-3 w-4/5 bg-ink" /><div className="h-2 bg-blue-dim" /><div className="h-2 w-2/3 bg-blue-dim" /></div></div>
          </div>

          <div className="absolute left-1/2 top-[43%] z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border border-blue bg-white/95 px-4 py-3 text-center shadow-[4px_4px_0_#111]">
            <i className="absolute -left-1.5 -top-1.5 h-3 w-3 border border-blue bg-white" />
            <i className="absolute -right-1.5 -top-1.5 h-3 w-3 border border-blue bg-white" />
            <i className="absolute -bottom-1.5 -left-1.5 h-3 w-3 border border-blue bg-white" />
            <i className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border border-blue bg-white" />
            <p className="text-3xl font-black leading-none tracking-[-0.065em] md:text-[2.65rem]"><span className="text-pink">Craft</span><span className="text-blue">Fool</span></p>
            <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.27em] text-blue md:text-[14px]" style={{ fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif' }}>Academia</p>
          </div>

          <div className="absolute bottom-4 right-5 w-28 rotate-3 border border-ink bg-blue p-3 text-white shadow-[3px_3px_0_#111]">
            <p className="font-display text-4xl font-semibold leading-none">Aa</p>
            <div className="mt-3 flex gap-1"><i className="h-3 w-3 rounded-full bg-pink" /><i className="h-3 w-3 rounded-full bg-white" /><i className="h-3 w-3 rounded-full bg-blue-dim" /></div>
          </div>
          <div className="absolute bottom-4 left-7 grid grid-cols-2 gap-1"><i className="h-6 w-6 border border-ink bg-pink" /><i className="h-6 w-6 border border-ink bg-blue-dim" /><i className="h-6 w-6 border border-ink bg-white" /><i className="h-6 w-6 border border-ink bg-blue" /></div>
        </div>
      </div>

      <Crop className="absolute bottom-24 right-5 h-5 w-5 text-muted" aria-hidden="true" />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Create · Test · Refine</span>
    </div>
  );
}
