"use client";

import Link from "next/link";
import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import type { ResolvedCartEntry } from "@/lib/cart-lookup";
import { useCartStore } from "@/lib/store/cart-store";
import { StartImpactMoveButton } from "@/components/discovery/start-impact-move-button";
import { IncreaseTags } from "@/components/ui/increase-tags";

export function CartItemCard({ resolved }: { resolved: ResolvedCartEntry }) {
  const { entry, discoveryItem, course, title, href, categoryLabel } = resolved;
  const remove = useCartStore((s) => s.remove);
  const updateNote = useCartStore((s) => s.updateNote);
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(entry.note ?? "");

  const increaseAreas = discoveryItem?.increaseAreas ?? course?.increaseAreas ?? [];
  const isCourse = !!course || discoveryItem?.type === "course";

  return (
    <div className="rounded-3xl border border-line bg-paper p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            {categoryLabel}
          </span>
          <Link href={href}>
            <h3 className="mt-1 font-display text-lg font-medium text-ink hover:underline">
              {title}
            </h3>
          </Link>
        </div>
        <button
          type="button"
          onClick={() => remove(entry.itemId)}
          aria-label="Remove"
          className="shrink-0 rounded-full p-2 text-muted hover:bg-ink/5 hover:text-ink"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {increaseAreas.length > 0 && <IncreaseTags areas={increaseAreas} className="mt-3" />}

      <div className="mt-3">
        {editing ? (
          <div>
            <textarea
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-16 w-full resize-none rounded-lg border border-line p-2 text-sm outline-none focus:border-ink"
              placeholder="Why does this interest you?"
            />
            <div className="mt-1.5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setNote(entry.note ?? "");
                }}
                className="text-xs text-muted hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateNote(entry.itemId, note.trim());
                  setEditing(false);
                }}
                className="text-xs font-semibold text-ink underline"
              >
                Save note
              </button>
            </div>
          </div>
        ) : entry.note ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-start gap-1.5 text-left text-sm italic text-muted hover:text-ink"
          >
            <Pencil className="mt-0.5 h-3 w-3 shrink-0" />
            &ldquo;{entry.note}&rdquo;
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-muted underline hover:text-ink"
          >
            + Add a note on why this interests you
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href={href}
          className="rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-ink"
        >
          View Details
        </Link>
        {isCourse && (
          <Link
            href={course ? `/academy/${course.slug}` : `/academy/${discoveryItem?.academyCourseSlug ?? ""}`}
            className="rounded-full bg-blue px-3.5 py-1.5 text-xs font-semibold text-white hover:opacity-90"
          >
            Start Learning
          </Link>
        )}
        <StartImpactMoveButton
          title={title}
          sourceItemSlug={discoveryItem?.slug}
          sourceCourseSlug={course?.slug}
          label="Start as Impact Move"
          className="bg-transparent px-3.5 py-1.5 text-xs border border-ink text-ink"
        />
      </div>
    </div>
  );
}
