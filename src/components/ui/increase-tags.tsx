import type { IncreaseArea } from "@/lib/types";
import { INCREASE_AREA_LABELS } from "@/lib/data/constants";
import { cn } from "@/lib/utils";

const DOT_COLOR: Record<IncreaseArea, string> = {
  capacity: "bg-blue",
  wealth: "bg-pink",
  leverage: "bg-ink",
  influence: "bg-blue",
};

export function IncreaseTags({ areas, className }: { areas: IncreaseArea[]; className?: string }) {
  if (!areas?.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {areas.map((area) => (
        <span
          key={area}
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-ink"
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", DOT_COLOR[area])} />
          {INCREASE_AREA_LABELS[area]}
        </span>
      ))}
    </div>
  );
}
