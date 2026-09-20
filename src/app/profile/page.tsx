"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useProfileStore } from "@/lib/store/profile-store";
import { useCartStore } from "@/lib/store/cart-store";
import { useImpactMovesStore } from "@/lib/store/impact-moves-store";
import { useHydrated } from "@/lib/use-hydrated";
import { ECONOMIC_OUTCOME_OPTIONS, GROWTH_AREA_OPTIONS } from "@/lib/data/constants";
import { cn } from "@/lib/utils";

const textClass = "w-full rounded-xl border border-line p-3 text-sm outline-none focus:border-ink resize-none";

function Q({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <p className="mb-2 text-sm font-semibold text-ink">{label}</p>
      {children}
    </div>
  );
}

function MultiChip({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium",
              active ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function ProfilePage() {
  const mounted = useHydrated();
  const { name, answers, updateAnswers, setName } = useProfileStore();
  const cartCount = useCartStore((s) => s.entries.length);
  const moves = useImpactMovesStore((s) => s.moves);

  const [local, setLocal] = useState(answers);
  const [nameInput, setNameInput] = useState(name);

  // Sync local drafts when the persisted store rehydrates from localStorage.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setLocal(answers), [answers]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setNameInput(name), [name]);

  if (!mounted) return null;

  const completedMoves = moves.filter((m) => m.status === "completed").length;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-6 md:px-6 md:pt-10">
      <div className="mb-6 max-w-2xl">
        <h1 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
          Profile
        </h1>
        <p className="mt-2 text-sm text-muted md:text-base">
          The more we know, the better your discovery feed gets. Nothing here is required — answer
          what you want, whenever you want.
        </p>
      </div>

      <div className="mb-6 rounded-3xl border border-line bg-paper p-5">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Your name</p>
        <input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onBlur={() => nameInput.trim() && setName(nameInput.trim())}
          className="w-full rounded-xl border border-line p-2.5 text-sm outline-none focus:border-ink"
        />
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-display text-xl text-ink">{cartCount}</p>
            <p className="text-[11px] text-muted">Saved</p>
          </div>
          <div>
            <p className="font-display text-xl text-ink">{moves.length}</p>
            <p className="text-[11px] text-muted">Impact Moves</p>
          </div>
          <div>
            <p className="font-display text-xl text-ink">{completedMoves}</p>
            <p className="text-[11px] text-muted">Multiplied</p>
          </div>
        </div>
        <Link href="/my-impact" className="mt-4 block text-center text-xs font-semibold text-blue underline">
          View My Impact →
        </Link>
      </div>

      <div className="rounded-3xl border border-line bg-paper p-5">
        <Q label="What do you currently do?">
          <textarea
            value={local.currentWork ?? ""}
            onChange={(e) => setLocal((l) => ({ ...l, currentWork: e.target.value }))}
            onBlur={() => updateAnswers({ currentWork: local.currentWork })}
            className={cn(textClass, "h-16")}
          />
        </Q>
        <Q label="What can you already do?">
          <textarea
            value={local.currentSkills ?? ""}
            onChange={(e) => setLocal((l) => ({ ...l, currentSkills: e.target.value }))}
            onBlur={() => updateAnswers({ currentSkills: local.currentSkills })}
            className={cn(textClass, "h-16")}
          />
        </Q>
        <Q label="What are you interested in?">
          <textarea
            value={local.interests ?? ""}
            onChange={(e) => setLocal((l) => ({ ...l, interests: e.target.value }))}
            onBlur={() => updateAnswers({ interests: local.interests })}
            className={cn(textClass, "h-16")}
          />
        </Q>
        <Q label="What are you trying to increase?">
          <textarea
            value={local.increasing ?? ""}
            onChange={(e) => setLocal((l) => ({ ...l, increasing: e.target.value }))}
            onBlur={() => updateAnswers({ increasing: local.increasing })}
            className={cn(textClass, "h-16")}
          />
        </Q>
        <Q label="What direction are you trying to move toward?">
          <textarea
            value={local.direction ?? ""}
            onChange={(e) => setLocal((l) => ({ ...l, direction: e.target.value }))}
            onBlur={() => updateAnswers({ direction: local.direction })}
            className={cn(textClass, "h-16")}
          />
        </Q>
        <Q label="What are you currently building?">
          <textarea
            value={local.building ?? ""}
            onChange={(e) => setLocal((l) => ({ ...l, building: e.target.value }))}
            onBlur={() => updateAnswers({ building: local.building })}
            className={cn(textClass, "h-16")}
          />
        </Q>
        <Q label="What resources do you have?">
          <div className="flex flex-wrap gap-4">
            {(["hasPhone", "hasLaptop", "hasInternet"] as const).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={!!local[key]}
                  onChange={(e) => {
                    const next = { ...local, [key]: e.target.checked };
                    setLocal(next);
                    updateAnswers({ [key]: e.target.checked });
                  }}
                  className="h-4 w-4"
                />
                {key === "hasPhone" ? "Phone" : key === "hasLaptop" ? "Laptop" : "Internet"}
              </label>
            ))}
          </div>
        </Q>
        <Q label="How much time can you realistically invest?">
          <input
            value={local.timeAvailable ?? ""}
            onChange={(e) => setLocal((l) => ({ ...l, timeAvailable: e.target.value }))}
            onBlur={() => updateAnswers({ timeAvailable: local.timeAvailable })}
            placeholder="e.g. 3–5 hours a week"
            className="w-full rounded-xl border border-line p-3 text-sm outline-none focus:border-ink"
          />
        </Q>
        <Q label="What financial investment are you comfortable making?">
          <input
            value={local.financialComfort ?? ""}
            onChange={(e) => setLocal((l) => ({ ...l, financialComfort: e.target.value }))}
            onBlur={() => updateAnswers({ financialComfort: local.financialComfort })}
            placeholder="e.g. Free options only, for now"
            className="w-full rounded-xl border border-line p-3 text-sm outline-none focus:border-ink"
          />
        </Q>
        <Q label="What economic outcomes matter?">
          <MultiChip
            options={ECONOMIC_OUTCOME_OPTIONS}
            selected={local.economicOutcomes ?? []}
            onToggle={(v) => {
              const set = new Set(local.economicOutcomes ?? []);
              if (set.has(v)) {
                set.delete(v);
              } else {
                set.add(v);
              }
              const next = Array.from(set);
              setLocal((l) => ({ ...l, economicOutcomes: next }));
              updateAnswers({ economicOutcomes: next });
            }}
          />
        </Q>
        <Q label="What personal growth areas matter?">
          <MultiChip
            options={GROWTH_AREA_OPTIONS}
            selected={local.growthAreas ?? []}
            onToggle={(v) => {
              const set = new Set(local.growthAreas ?? []);
              if (set.has(v)) {
                set.delete(v);
              } else {
                set.add(v);
              }
              const next = Array.from(set);
              setLocal((l) => ({ ...l, growthAreas: next }));
              updateAnswers({ growthAreas: next });
            }}
          />
        </Q>
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        CraftFools Academia is an Innergency product.
      </p>
    </div>
  );
}
