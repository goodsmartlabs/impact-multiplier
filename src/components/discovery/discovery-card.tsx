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
  const accent = isCourse ? "bg-pink" : isOpportunity ? "bg-blue" : "bg-gradient-to-r from-pink to-blue";
  const surface = isCourse ? "bg-pink-dim/45" : isOpportunity ? "bg-blue-dim/55" : "bg-paper";

  return (
    <div
      className={cn(
        "brand-card group relative flex min-h-[250px] flex-col overflow-hidden rounded-3xl border border-line p-5 transition-all duration-300 hover:-translate-y-1",
        surface,
        className
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-1.5", accent)} />
      <Link href={`/item/${item.slug}`} className="flex flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            {item.categoryLabel}
          </span>
          {status && <StatusPill status={status} />}
        </div>
        <h3 className="font-display text-[1.35rem] font-medium leading-snug text-ink transition-colors group-hover:text-blue">{item.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {item.shortDescription}
        </p>
      </Link>
      <div className="mt-4 flex items-center justify-between gap-2">
        <Link
          href={`/item/${item.slug}`}
          className="text-xs font-semibold text-ink underline-offset-4 hover:underline"
        >
          {isCourse ? "View course →" : "Learn more →"}
        </Link>
        <SaveButton itemId={item.id} itemKind="discovery" />
      </div>
    </div>
  );
}
