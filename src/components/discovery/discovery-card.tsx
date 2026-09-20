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

export function DiscoveryCard({
  item,
  index = 0,
  className,
}: {
  item: DiscoveryItem;
  index?: number;
  className?: string;
}) {
  const status = isTimeSensitive(item) ? computeOpportunityStatus(item) : undefined;
  const isCourse = item.type === "course";
  const isOpportunity = OPPORTUNITY_TYPES.has(item.type);
  const number = String(index + 1).padStart(2, "0");
  const panelSurface = isCourse ? "bg-pink-dim" : isOpportunity ? "bg-blue-dim" : "bg-cream";
  const orbSurface = isCourse ? "border-pink bg-pink/10" : isOpportunity ? "border-blue bg-blue/10" : "border-ink/20 bg-paper/40";

  return (
    <article
      className={cn(
        "brand-card group grid overflow-hidden rounded-2xl border border-ink bg-paper transition-all duration-300 md:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]",
        className
      )}
    >
      <div className="flex min-h-[310px] flex-col p-7 md:p-10 lg:p-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/65">
            {item.categoryLabel}
          </span>
          {status && <StatusPill status={status} />}
        </div>

        <Link href={`/item/${item.slug}`} className="mt-8 max-w-2xl">
          <h3 className="font-display text-4xl font-semibold leading-[0.95] tracking-[-0.025em] text-ink md:text-5xl">
            {item.title}
          </h3>
          <p className="mt-5 max-w-xl text-sm leading-6 text-ink/65 md:text-[15px]">
            {item.shortDescription}
          </p>
        </Link>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
          <Link
            href={`/item/${item.slug}`}
            className="inline-flex min-h-10 items-center rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-paper transition-colors hover:bg-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {isCourse ? "View course" : isOpportunity ? "View opportunity" : "Explore"}
            <span aria-hidden="true" className="ml-2">→</span>
          </Link>
          <SaveButton
            itemId={item.id}
            itemKind="discovery"
            className="min-h-10 border-ink bg-paper px-5 py-2.5"
          />
        </div>
      </div>

      <Link
        href={`/item/${item.slug}`}
        className={cn(
          "relative isolate flex min-h-[220px] overflow-hidden border-t border-ink p-7 md:min-h-full md:border-l md:border-t-0 md:p-9",
          panelSurface
        )}
        aria-label={`Explore ${item.title}`}
      >
        <div className={cn("absolute -right-16 -top-20 h-64 w-64 rounded-full border-[42px] opacity-80", orbSurface)} />
        <div className={cn("absolute -bottom-20 -left-16 h-48 w-48 rounded-full border-[32px] opacity-60", orbSurface)} />

        <div className="relative z-10 flex w-full flex-col justify-between">
          <span className="w-fit rounded-full border border-ink/50 bg-paper/80 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] backdrop-blur-sm">
            Curated pick
          </span>
          <div className="mt-12 flex items-end justify-between gap-4 md:mt-auto">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/55">Explore</p>
              <p className="mt-1 text-sm font-semibold capitalize text-ink">{formatType(item.type)}</p>
            </div>
            <span className="font-display text-7xl font-semibold leading-none tracking-[-0.08em] text-ink/90 md:text-8xl">
              {number}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
