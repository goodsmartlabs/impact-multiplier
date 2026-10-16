"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Target } from "lucide-react";
import { useSkillChallengeStore } from "@/lib/store/skill-challenge-store";
import { challengePath, getSkillChallenge, SKILL_CHALLENGES } from "@/lib/skill-challenge";
import { challengeStatus, completedDayCount } from "@/lib/skill-challenge/engine";
import { StatusBadge } from "./parts";

/** 7-Day Skill Challenges on My Impact: progress and self-reported proof kept clearly apart. */
export function SkillChallengeSummary() {
  const progress = useSkillChallengeStore((state) => state.progress);
  const started = SKILL_CHALLENGES.filter((challenge) => progress[challenge.id]);

  return (
    <section className="mb-8 rounded-3xl border border-ink bg-white p-5" aria-labelledby="skill-challenges-heading">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="skill-challenges-heading" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><Target className="h-4 w-4 text-pink" />7-Day Skill Challenges</h2>
        <Link href="/academy/challenge" className="text-xs font-semibold text-ink underline underline-offset-4">{started.length ? "Start another" : "Browse skills"}</Link>
      </div>
      {started.length === 0 ? (
        <p className="text-sm text-muted">No challenge started yet. Pick one skill and build one project in seven days.</p>
      ) : (
        <ul className="space-y-2">
          {started.map(({ id }) => {
            const challenge = getSkillChallenge(id)!;
            const entry = progress[id]!;
            const check = entry.impactCheck;
            return (
              <li key={id} className="rounded-2xl border border-line p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={challengePath(id)} className="group inline-flex items-center gap-1 font-semibold text-ink">{challenge.name}<ArrowRight className="im-nudge h-3.5 w-3.5" /></Link>
                  <StatusBadge status={challengeStatus(entry)} />
                </div>
                <p className="mt-1 text-xs text-muted">{completedDayCount(entry)}/7 days · {challenge.project.title}</p>
                {check && (
                  <div className="mt-2 rounded-xl bg-blue-dim p-2 text-xs">
                    <p><strong>Can do now:</strong> {check.canDoNow}</p>
                    <a href={check.evidenceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 font-semibold underline underline-offset-2">Project evidence <ExternalLink className="h-3 w-3" /></a>
                    <p className="mt-1 text-muted">Self-reported · potential service “{check.potentialService}” is untested.</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
