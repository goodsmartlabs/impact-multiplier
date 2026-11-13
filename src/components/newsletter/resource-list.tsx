import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResourceLink } from "@/lib/newsletter/types";
import { cn } from "@/lib/utils";

const ACCESS_STYLE: Record<ResourceLink["access"], string> = {
  free: "bg-blue-dim text-ink",
  external_free: "bg-blue-dim text-ink",
  external_mixed: "bg-white text-ink border border-ink/25",
  student: "bg-pink-dim text-ink",
  paid: "bg-pink text-white",
  coming_soon: "bg-ink/10 text-ink",
};

/** Free / paid is always visible — recommendations never hide what something costs. */
export function AccessBadge({ resource }: { resource: ResourceLink }) {
  return <span className={cn("inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]", ACCESS_STYLE[resource.access])}>{resource.accessLabel}</span>;
}

export function ResourceList({ resources, compact = false }: { resources: ResourceLink[]; compact?: boolean }) {
  if (!resources.length) return null;
  return (
    <ul className={cn("grid gap-2", !compact && "sm:grid-cols-2")}>
      {resources.map((resource) => {
        const external = !resource.href.startsWith("/");
        const body = (
          <>
            <span className="min-w-0">
              <span className="flex items-center gap-1 text-sm font-bold">{resource.title}{external && <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}</span>
              <span className="block text-[11px] text-muted">{resource.inHouse ? resource.provider : `${resource.provider} · external`}</span>
            </span>
            <AccessBadge resource={resource} />
          </>
        );
        const className = "im-press flex items-start justify-between gap-3 rounded-2xl border border-ink/20 bg-white p-3 hover:border-ink";
        return (
          <li key={resource.id}>
            {external
              ? <a href={resource.href} target="_blank" rel="noopener noreferrer" className={className}>{body}<span className="sr-only"> (opens in a new tab)</span></a>
              : <Link href={resource.href} className={className}>{body}</Link>}
          </li>
        );
      })}
    </ul>
  );
}
