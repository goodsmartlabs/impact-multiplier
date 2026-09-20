import Link from "next/link";
import type { DiscoveryItem } from "@/lib/types";
import { SaveButton } from "@/components/ui/save-button";
import { StatusPill } from "@/components/ui/status-pill";
import { computeOpportunityStatus, isTimeSensitive } from "@/lib/opportunity";
import { cn } from "@/lib/utils";

const OPPORTUNITY_TYPES = new Set([
  "career_opportunity",
  "business_opportunity",
  "grant",
  "scholarship",
  "fellowship",
]);

function formatType(type: DiscoveryItem["type"]) {
  return type.replaceAll("_", " ");
}

function CardActions({ item, compact = false }: { item: DiscoveryItem; compact?: boolean }) {
  const isCourse = item.type === "course";
  const isOpportunity = OPPORTUNITY_TYPES.has(item.type);

  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", compact ? "pt-5" : "pt-8")}>
      <Link
        href={`/item/${item.slug}`}
        className="inline-flex min-h-10 items-center rounded-full bg-ink px-4 py-2.5 text-xs font-bold text-paper transition-colors hover:bg-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {isCourse ? "View course" : isOpportunity ? "View opportunity" : "Explore"}
        <span aria-hidden="true" className="ml-2">→</span>
      </Link>
      <SaveButton
        itemId={item.id}
        itemKind="discovery"
        className="min-h-10 border-ink bg-paper/75 px-4 py-2.5 backdrop-blur-sm"
      />
    </div>
  );
}

export function DiscoveryCard({
  item,
  index = 0,
  variant = "compact",
  className,
}: {
  item: DiscoveryItem;
  index?: number;
  variant?: "compact" | "featured";
  className?: string;
}) {
  const status = isTimeSensitive(item) ? computeOpportunityStatus(item) : undefined;
  const isCourse = item.type === "course";
  const isOpportunity = OPPORTUNITY_TYPES.has(item.type);
  const number = String(index + 1).padStart(2, "0");
  const infoSurface = isCourse ? "bg-pink-dim" : isOpportunity ? "bg-blue-dim" : index % 2 === 0 ? "bg-blue-dim" : "bg-pink-dim";
  const artSurface = isCourse ? "bg-blue-dim" : isOpportunity ? "bg-pink-dim" : index % 2 === 0 ? "bg-pink-dim" : "bg-blue-dim";
  const accent = isCourse || index % 2 !== 0 ? "bg-blue" : "bg-pink";
  const typeLabel = formatType(item.type);

  if (variant === "compact") {
    return (
      <article className={cn("brand-card group flex min-h-[500px] flex-col overflow-hidden rounded-2xl border border-ink transition-all duration-300", infoSurface, className)}>
        <Link href={`/item/${item.slug}`} className={cn("relative isolate flex h-48 shrink-0 overflow-hidden border-b border-ink p-6", artSurface)} aria-label={`Explore ${item.title}`}>
          <span className={cn("absolute left-[-12%] top-1/2 h-5 w-[125%] -rotate-6 rounded-full opacity-90 transition-transform duration-500 group-hover:-rotate-3", accent)} />
          <span className="absolute -right-10 -top-12 h-36 w-36 rounded-full border-[26px] border-paper/55" />
          <div className="relative z-10 flex w-full items-end justify-between gap-3">
            <p className={cn("max-w-[78%] px-2 font-display text-[clamp(2rem,3.3vw,3.2rem)] font-semibold capitalize leading-[0.82] tracking-[-0.045em] text-ink", artSurface)}>{typeLabel}</p>
            <span className="mb-1 rounded-full border border-ink bg-paper px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em]">{number}</span>
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/65">{item.categoryLabel}</span>
            {status && <StatusPill status={status} />}
          </div>
          <Link href={`/item/${item.slug}`} className="mt-5">
            <h3 className="font-display text-[2rem] font-semibold leading-[0.95] tracking-[-0.025em] text-ink">{item.title}</h3>
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink/65">{item.shortDescription}</p>
          </Link>
          <div className="mt-auto"><CardActions item={item} compact /></div>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("brand-card group grid min-h-[330px] overflow-hidden rounded-2xl border border-ink transition-all duration-300 md:grid-cols-[1.05fr_0.95fr]", className)}>
      <div className={cn("flex flex-col p-7 md:p-10 lg:p-12", infoSurface)}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/65">{item.categoryLabel}</span>
          {status && <StatusPill status={status} />}
        </div>
        <Link href={`/item/${item.slug}`} className="mt-8 max-w-2xl">
          <h3 className="font-display text-4xl font-semibold leading-[0.95] tracking-[-0.025em] text-ink md:text-5xl">{item.title}</h3>
          <p className="mt-5 max-w-xl text-sm leading-6 text-ink/65 md:text-[15px]">{item.shortDescription}</p>
        </Link>
        <div className="mt-auto"><CardActions item={item} /></div>
      </div>

      <Link href={`/item/${item.slug}`} className={cn("relative isolate flex min-h-[250px] overflow-hidden border-t border-ink p-8 md:min-h-full md:border-l md:border-t-0", artSurface)} aria-label={`Explore ${item.title}`}>
        <span className={cn("absolute left-[-10%] top-1/2 h-7 w-[125%] -rotate-6 rounded-full opacity-90 transition-transform duration-500 group-hover:-rotate-3", accent)} />
        <span className="absolute -right-14 -top-16 h-56 w-56 rounded-full border-[38px] border-paper/55" />
        <span className="absolute -bottom-16 -left-14 h-40 w-40 rounded-full border-[28px] border-paper/40" />
        <div className="relative z-10 flex w-full flex-col justify-between">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full border border-ink bg-paper px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em]">Impact Academia</span>
            <span className="font-display text-3xl font-semibold tracking-[-0.05em] text-ink/55">{number}</span>
          </div>
          <p className={cn("my-10 max-w-[90%] self-center px-5 py-1 text-center font-display text-[clamp(3.5rem,7vw,6.5rem)] font-semibold capitalize leading-[0.78] tracking-[-0.055em] text-ink", artSurface)}>{typeLabel}</p>
          <p className="self-end text-[9px] font-bold uppercase tracking-[0.18em] text-ink/60">Learn · Build · Prove</p>
        </div>
      </Link>
    </article>
  );
}
