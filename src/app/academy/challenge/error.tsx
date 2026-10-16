"use client";

import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";

export default function SkillChallengeError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <div role="alert" className="rounded-3xl border border-ink bg-pink-dim p-6 shadow-[6px_6px_0_#111] md:p-8">
        <p className="flex items-center gap-2 font-display text-3xl font-semibold"><TriangleAlert className="h-6 w-6 text-pink" />Something went wrong</p>
        <p className="mt-3 text-sm leading-relaxed text-ink/80">This part of the 7-Day Skill Challenge couldn’t load. Your saved progress is stored in this browser and hasn’t been deleted.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="im-press inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white"><RotateCcw className="h-4 w-4" />Try again</button>
          <Link href="/academy/challenge" className="im-press inline-flex items-center rounded-full border border-ink bg-white px-5 py-2.5 text-sm font-bold">Back to all skills</Link>
        </div>
      </div>
    </div>
  );
}
