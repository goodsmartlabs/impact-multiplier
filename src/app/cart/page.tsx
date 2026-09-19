"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { resolveCartEntry } from "@/lib/cart-lookup";
import { CartItemCard } from "@/components/cart/cart-item-card";
import { FilterPills } from "@/components/discovery/filter-pills";
import { useHydrated } from "@/lib/use-hydrated";
import { formatDate } from "@/lib/utils";

type CartFilterKey = "all" | "skills" | "learning" | "opportunities" | "tools" | "mind" | "money" | "build";

const FILTERS: { key: CartFilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "skills", label: "Skills" },
  { key: "learning", label: "Learning" },
  { key: "opportunities", label: "Opportunities" },
  { key: "tools", label: "Tools" },
  { key: "mind", label: "Mind" },
  { key: "money", label: "Money" },
  { key: "build", label: "Build" },
];

export default function CartPage() {
  const mounted = useHydrated();
  const entries = useCartStore((s) => s.entries);
  const [filter, setFilter] = useState<CartFilterKey>("all");
  const [compare, setCompare] = useState(false);

  const resolved = useMemo(
    () => entries.map(resolveCartEntry).filter((r): r is NonNullable<typeof r> => !!r),
    [entries]
  );

  const filtered = resolved.filter((r) => {
    if (filter === "all") return true;
    if (filter === "learning") return !!r.course || r.discoveryItem?.type === "course";
    if (!r.discoveryItem) return false;
    if (filter === "skills") return r.discoveryItem.type === "skill";
    if (filter === "tools") return r.discoveryItem.type === "tool";
    return r.discoveryItem.filterKeys.includes(filter);
  });

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:px-6 md:pt-10">
      <div className="mb-6 max-w-2xl">
        <h1 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
          My Impact Cart
        </h1>
        <p className="mt-2 text-sm text-muted md:text-base">
          Not an ecommerce cart — this is your personal shelf of possibilities.
        </p>
      </div>

      {resolved.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line p-10 text-center">
          <p className="text-sm text-muted">Nothing saved yet.</p>
          <Link
            href="/explore"
            className="mt-3 inline-block rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper"
          >
            Start exploring
          </Link>
        </div>
      ) : (
        <>
          {resolved.length >= 14 && (
            <div className="mb-6 rounded-2xl border border-pink bg-pink-dim p-5 text-pink">
              <p className="font-display text-lg">You&apos;ve saved {resolved.length} possibilities.</p>
              <p className="mt-1 text-sm">You don&apos;t need {resolved.length} new commitments. What are you increasing next?</p>
              <button
                type="button"
                onClick={() => setCompare((c) => !c)}
                className="mt-3 rounded-full bg-pink px-4 py-2 text-xs font-semibold text-white"
              >
                {compare ? "Hide Comparison" : "Compare My Options"}
              </button>
            </div>
          )}

          {compare && (
            <div className="mb-8 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-ink/5 text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Item</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Time</th>
                    <th className="px-4 py-3 font-semibold">Cost</th>
                    <th className="px-4 py-3 font-semibold">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {resolved.map((r) => (
                    <tr key={r.entry.itemId} className="border-t border-line">
                      <td className="px-4 py-3 font-medium text-ink">{r.title}</td>
                      <td className="px-4 py-3 text-muted">{r.categoryLabel}</td>
                      <td className="px-4 py-3 text-muted">
                        {r.discoveryItem?.timeRequirement ?? r.course?.durationLabel ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {r.discoveryItem?.estimatedCost ?? r.course?.price ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {r.discoveryItem?.deadline ? formatDate(r.discoveryItem.deadline) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mb-6">
            <FilterPills options={FILTERS} active={filter} onChange={setFilter} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map((r) => (
              <CartItemCard key={r.entry.itemId} resolved={r} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
