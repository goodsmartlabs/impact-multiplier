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

const toolTile =
  "design-sticker absolute z-20 flex items-center justify-center rounded-lg border border-ink shadow-[3px_3px_0_#111]";

export function CreativeWorkbench() {
  return (
    <div className="creative-workbench editorial-grid relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-3xl border border-ink bg-paper p-8 md:min-h-[500px]">
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-ink bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] shadow-[3px_3px_0_#111]">
        <span className="h-2 w-2 rounded-full bg-pink" /> Artboard 01
      </div>

      <div className="relative mt-6 h-[270px] w-[88%] max-w-[430px] border border-dashed border-blue bg-white/80 md:h-[330px]">
        <span className="absolute -left-1.5 -top-1.5 h-3 w-3 border border-blue bg-white" />
        <span className="absolute -right-1.5 -top-1.5 h-3 w-3 border border-blue bg-white" />
        <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 border border-blue bg-white" />
        <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border border-blue bg-white" />

        <div className={`${toolTile} left-[8%] top-[9%] h-12 w-12 -rotate-12 bg-[#ffe47a] md:h-14 md:w-14`}>
          <Pencil className="h-7 w-7 text-ink" aria-hidden="true" />
        </div>
        <MousePointer2 className="creative-float absolute left-[38%] top-[8%] h-9 w-9 fill-blue-dim text-ink md:h-11 md:w-11" aria-hidden="true" />
        <div className={`${toolTile} right-[8%] top-[10%] h-11 w-[74px] rotate-[-8deg] bg-blue-dim md:w-20`}>
          <Ruler className="h-6 w-12 text-ink md:w-14" aria-hidden="true" />
        </div>

        <div className="absolute left-1/2 top-1/2 z-10 w-[91%] -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="relative inline-flex w-full flex-col items-center px-3 py-4">
            <i className="absolute -left-1 -top-1 h-2.5 w-2.5 border border-blue bg-white" />
            <i className="absolute -right-1 -top-1 h-2.5 w-2.5 border border-blue bg-white" />
            <i className="absolute -bottom-1 -left-1 h-2.5 w-2.5 border border-blue bg-white" />
            <i className="absolute -bottom-1 -right-1 h-2.5 w-2.5 border border-blue bg-white" />
            <p className="font-playful whitespace-nowrap text-[2.35rem] font-semibold leading-[0.88] tracking-[-0.04em] sm:text-[2.9rem] md:text-[3.55rem]">
              <span className="text-pink">Impact</span><span className="text-blue">Fools</span>
            </p>
            <p className="mt-3 w-[92%] text-center font-sans text-[0.7rem] font-medium uppercase leading-none tracking-[0.48em] text-blue sm:text-[0.8rem] md:text-[0.95rem]">
              Academia
            </p>
          </div>
        </div>

        <div className={`${toolTile} bottom-[12%] left-[7%] h-12 w-12 rotate-[-7deg] bg-pink-dim`}>
          <Triangle className="h-7 w-7 fill-white text-ink" aria-hidden="true" />
        </div>
        <div className={`${toolTile} bottom-[9%] left-[31%] h-11 w-12 rotate-3 bg-blue-dim`}>
          <Code2 className="h-7 w-7 text-ink" aria-hidden="true" />
        </div>
        <div className={`${toolTile} bottom-[8%] right-[30%] h-11 w-12 rotate-[-5deg] bg-white`}>
          <Layers3 className="h-7 w-7 text-pink" aria-hidden="true" />
        </div>
        <Folder className="creative-float absolute bottom-[12%] right-[7%] h-10 w-10 fill-[#ffe47a] text-ink md:h-12 md:w-12" aria-hidden="true" />

        <Sparkles className="creative-float absolute right-[4%] top-[42%] h-6 w-6 text-pink" aria-hidden="true" />
        <PenTool className="absolute bottom-[39%] right-[10%] h-8 w-8 rotate-12 fill-white text-ink" aria-hidden="true" />
        <span className="absolute bottom-[34%] right-[7%] h-2.5 w-2.5 border border-ink bg-white" />
        <span className="absolute bottom-[49%] right-[19%] h-2.5 w-2.5 border border-ink bg-white" />
        <span className="absolute bottom-[42%] right-[13%] w-10 rotate-[-48deg] border-t border-dashed border-ink" />
      </div>

      <Crop className="absolute bottom-24 right-5 h-5 w-5 text-muted" aria-hidden="true" />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Create · Test · Refine</span>
    </div>
  );
}
