import Link from "next/link";
import type { DiscoveryItem } from "@/lib/types";
import { SaveButton } from "@/components/ui/save-button";
import { StatusPill } from "@/components/ui/status-pill";
import { computeOpportunityStatus, isTimeSensitive } from "@/lib/opportunity";
import { cn } from "@/lib/utils";

export function DiscoveryCard({ item, className }: { item: DiscoveryItem; className?: string }) {
  const status = isTimeSensitive(item) ? computeOpportunityStatus(item) : undefined;
  const isCourse = item.type === "course";

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-3xl border border-line bg-paper p-5 transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
        className
      )}
    >
      <Link href={`/item/${item.slug}`} className="flex flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            {item.categoryLabel}
          </span>
          {status && <StatusPill status={status} />}
        </div>
        <h3 className="font-display text-xl font-medium leading-snug text-ink">{item.title}</h3>
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
