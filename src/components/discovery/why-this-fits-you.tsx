"use client";

import { Sparkles } from "lucide-react";
import { useProfileStore } from "@/lib/store/profile-store";
import { useCartStore } from "@/lib/store/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { resolveCartEntry } from "@/lib/cart-lookup";
import type { DiscoveryItem } from "@/lib/types";
import { INCREASE_AREA_LABELS } from "@/lib/data/constants";

function buildReason(item: DiscoveryItem, interests: string, increasing: string, sharedAreaMatches: number, sharedTypeCount: number): string | null {
  const words = `${interests} ${increasing}`.toLowerCase();
  const itemWords = `${item.title} ${item.categoryLabel} ${item.type}`.toLowerCase();
  const overlap = itemWords
    .split(/\W+/)
    .filter((w) => w.length > 3)
    .some((w) => words.includes(w));

  if (overlap && increasing) {
    return `You said you're trying to increase: "${increasing.trim()}". This could speak directly to that.`;
  }
  if (sharedTypeCount >= 2) {
    return `You've saved ${sharedTypeCount} similar items already. This could help close a gap showing up across those saves.`;
  }
  if (sharedAreaMatches >= 2) {
    const areas = item.increaseAreas.map((a) => INCREASE_AREA_LABELS[a]).join(" and ");
    return `Several things you've saved also touch ${areas} — this builds on that same direction.`;
  }
  return null;
}

export function WhyThisFitsYou({ item }: { item: DiscoveryItem }) {
  const mounted = useHydrated();
  const answers = useProfileStore((s) => s.answers);
  const entries = useCartStore((s) => s.entries);

  if (!mounted) return null;

  const resolved = entries.map(resolveCartEntry).filter((r): r is NonNullable<typeof r> => !!r);
  const sharedAreaMatches = resolved.filter(
    (r) => r.discoveryItem && r.discoveryItem.increaseAreas.some((a) => item.increaseAreas.includes(a))
  ).length;
  const sharedTypeCount = resolved.filter((r) => r.discoveryItem?.type === item.type).length;

  const reason = buildReason(
    item,
    answers.interests ?? "",
    answers.increasing ?? "",
    sharedAreaMatches,
    sharedTypeCount
  );

  if (!reason) return null;

  return (
    <div className="mt-5 flex gap-3 rounded-2xl border border-blue bg-blue-dim p-4 text-blue">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide">Why we&apos;re showing you this</p>
        <p className="mt-1 text-sm">{reason}</p>
      </div>
    </div>
  );
}
