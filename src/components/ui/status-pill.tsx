import type { OpportunityStatus } from "@/lib/types";
import { OPPORTUNITY_STATUS_LABELS, OPPORTUNITY_STATUS_STYLES } from "@/lib/data/constants";
import { cn } from "@/lib/utils";

export function StatusPill({ status }: { status: OpportunityStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        OPPORTUNITY_STATUS_STYLES[status]
      )}
    >
      {OPPORTUNITY_STATUS_LABELS[status]}
    </span>
  );
}
