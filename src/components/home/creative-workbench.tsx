import { Brackets, Crop, Folder, MousePointer2, PenTool, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

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
        <div className="border border-dashed border-blue p-4 md:p-6">
          <BrandLogo className="w-full" />
        </div>
      </div>

      <Crop className="absolute bottom-24 right-5 h-5 w-5 text-muted" aria-hidden="true" />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Create · Test · Refine</span>
    </div>
  );
}
