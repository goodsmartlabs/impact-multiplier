"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Play } from "lucide-react";
import { useSkillChallengeStore } from "@/lib/store/skill-challenge-store";
import { useHydrated } from "@/lib/use-hydrated";
import { challengePath } from "@/lib/skill-challenge";
import { challengeStatus, completedDayCount } from "@/lib/skill-challenge/engine";
import type { SkillId } from "@/lib/skill-challenge/types";
import { StatusBadge } from "./parts";

/** Explore first, commit second: START only appears alongside a no-commitment preview link. */
export function SkillCardActions({ skillId }: { skillId: SkillId }) {
  const mounted = useHydrated();
  const router = useRouter();
  const progress = useSkillChallengeStore((state) => state.progress[skillId]);
  const start = useSkillChallengeStore((state) => state.start);
  const started = mounted && Boolean(progress);

  return (
    <div className="mt-auto space-y-3 pt-6">
      {started && progress && (
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={challengeStatus(progress)} />
          <span className="text-xs font-semibold text-muted">{completedDayCount(progress)}/7 days</span>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {started ? (
          <Link href={challengePath(skillId)} className="im-lift group inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-blue">
            Continue challenge <ArrowRight className="im-nudge h-4 w-4" />
          </Link>
        ) : (
          <button
            type="button"
            disabled={!mounted}
            onClick={() => {
              start(skillId);
              router.push(challengePath(skillId));
            }}
            className="im-lift group inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[3px_3px_0_var(--color-pink)] hover:bg-blue disabled:opacity-60"
          >
            <Play className="h-3.5 w-3.5 fill-current" /> Start challenge
          </button>
        )}
        <Link href={challengePath(skillId)} className="group inline-flex items-center gap-1 text-sm font-bold">
          <span className="im-underline">{started ? "View roadmap" : "Explore the 7 days"}</span> <ArrowRight className="im-nudge h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
