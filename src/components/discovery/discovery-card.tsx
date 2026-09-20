import Link from "next/link";
import type { DiscoveryItem } from "@/lib/types";
import { SaveButton } from "@/components/ui/save-button";
import { StatusPill } from "@/components/ui/status-pill";
import { computeOpportunityStatus, isTimeSensitive } from "@/lib/opportunity";
import { cn } from "@/lib/utils";

export function DiscoveryCard({ item, className }: { item: DiscoveryItem; className?: string }) {
  const status = isTimeSensitive(item) ? computeOpportunityStatus(item) : undefined;
  const isCourse = item.type === "course";
  const isOpportunity = ["career_opportunity", "business_opportunity", "grant", "scholarship", "fellowship"].includes(item.type);
  const infoSurface = isCourse ? "bg-pink-dim" : isOpportunity ? "bg-blue-dim" : "bg-paper";
  const artSurface = isCourse ? "bg-blue-dim" : "bg-pink-dim";
  const typeLabel = item.type.replaceAll("_", " ");

  return (
    <article className={cn("brand-card group grid min-h-[310px] overflow-hidden rounded-2xl border border-ink transition-all duration-300 md:grid-cols-2", className)}>
      <div className={cn("flex flex-col justify-between p-7 md:p-10", infoSurface)}>
        <Link href={`/item/${item.slug}`} className="block">
          <div className="mb-8 flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">{item.categoryLabel}</span>
            {status && <StatusPill status={status} />}
          </div>
          <h3 className="max-w-xl font-display text-4xl font-semibold leading-[0.95] tracking-tight text-ink md:text-5xl">{item.title}</h3>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink/75">{item.shortDescription}</p>
        </Link>
        <div className="mt-8 flex items-center justify-between gap-3">
          <Link href={`/item/${item.slug}`} className="rounded-full border border-ink bg-paper px-4 py-2 text-xs font-bold transition-transform hover:-translate-y-0.5">{isCourse ? "View course →" : "Learn more →"}</Link>
          <SaveButton itemId={item.id} itemKind="discovery" />
        </div>
      </div>
      <Link href={`/item/${item.slug}`} className={cn("editorial-grid flex min-h-[240px] items-center justify-center border-t border-ink p-8 md:border-l md:border-t-0", artSurface)} aria-label={`Explore ${item.title}`}>
        <div className="text-center">
          <span className="inline-block -rotate-3 border border-ink bg-paper px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]">Impact Academia</span>
          <p className="mt-5 max-w-lg font-display text-6xl font-bold leading-[0.78] tracking-[-0.055em] text-ink md:text-7xl lg:text-8xl">{typeLabel}</p>
        </div>
      </Link>
    </article>
  );
}
