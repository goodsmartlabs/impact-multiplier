import Link from "next/link";
import { ArrowRight, CornerDownRight, Route } from "lucide-react";
import type { CraftPath } from "@/lib/types";

const backgrounds = {
  pink: "bg-pink-dim",
  blue: "bg-blue-dim",
  ink: "bg-ink text-white",
};

export function CraftPathCard({ path, large = false }: { path: CraftPath; large?: boolean }) {
  return (
    <Link
      href={`/craft-paths/${path.slug}`}
      className={`im-lift group relative flex h-full overflow-hidden rounded-3xl border border-ink p-5 shadow-[4px_4px_0_#111] hover:shadow-[7px_8px_0_#111] ${backgrounds[path.accent]} ${large ? "min-h-[390px] md:p-8" : "min-h-[280px]"}`}
    >
      <div className="editorial-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative z-10 flex w-full flex-col">
        <div className="flex items-center justify-between gap-3">
          <span className={`rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-[0.17em] ${path.accent === "ink" ? "border-white/50" : "border-ink"}`}>
            Craft Path
          </span>
          <Route className="h-6 w-6 transition-transform duration-500 ease-out group-hover:rotate-12" aria-hidden="true" />
        </div>
        <h2 className={`${large ? "mt-14 text-5xl md:text-7xl" : "mt-9 text-4xl"} max-w-xl font-display font-semibold leading-[0.88]`}>{path.title}</h2>
        <p className={`mt-4 max-w-lg text-sm leading-relaxed ${path.accent === "ink" ? "text-white/75" : "text-ink/70"}`}>{path.shortOutcome}</p>
        <div className="mt-auto pt-8">
          <div className="mb-5 flex items-center gap-2" aria-hidden="true">
            {["Discover", "Build", "Prove"].map((label, index) => (
              <span key={label} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.12em]">
                <i
                  style={{ transitionDelay: `${index * 90}ms` }}
                  className={`h-2.5 w-2.5 rounded-full border transition-colors duration-300 ${index === 2 ? "bg-pink" : "bg-white group-hover:bg-blue"}`}
                />
                {label}
                {index < 2 && <CornerDownRight className="h-3.5 w-3.5" />}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-bold"><span className="im-underline">View the path</span> <ArrowRight className="im-nudge h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  );
}
