"use client";

import { cn } from "@/lib/utils";

export function FilterPills<T extends string>({
  options,
  active,
  onChange,
}: {
  options: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
}) {
  return (
    <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
            active === opt.key
              ? "border-ink bg-ink text-paper"
              : "border-line bg-paper text-muted hover:border-ink hover:text-ink"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
