import type { DiscoveryItem, OpportunityStatus } from "@/lib/types";
import { daysUntil } from "@/lib/utils";

const TIME_SENSITIVE_TYPES = new Set(["grant", "scholarship", "fellowship", "career_opportunity", "business_opportunity"]);

export function isTimeSensitive(item: DiscoveryItem) {
  return TIME_SENSITIVE_TYPES.has(item.type);
}

export function computeOpportunityStatus(item: DiscoveryItem): OpportunityStatus | undefined {
  if (!isTimeSensitive(item)) return item.status;
  if (!item.deadline) return item.status ?? "open";
  const days = daysUntil(item.deadline);
  if (days === null) return item.status;
  if (days < 0) return "expired";
  if (days <= 14) return "closing_soon";
  if (item.status === "upcoming") return "upcoming";
  return "open";
}
