import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** A small cross-link used on course, opportunity and dashboard pages. */
export function NewsletterNudge({ context = "default" }: { context?: "course" | "opportunity" | "dashboard" | "default" }) {
  const copy = {
    course: "Not sure this is your next step? Get three weekend projects matched to your goals — with the courses that support them.",
    opportunity: "Want opportunities like this every Monday, and a weekend plan every Friday?",
    dashboard: "Turn what you’ve saved into a Friday-to-Sunday plan with one clear finish line.",
    default: "Every Monday: what’s worth your attention. Every Friday: what to build this weekend.",
  }[context];
  return (
    <aside className="flex flex-col gap-4 rounded-3xl border border-ink bg-pink-dim p-5 md:flex-row md:items-center md:justify-between">
      <p className="text-sm font-semibold">{copy}</p>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Link href="/newsletter/top-3" className="im-press inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-xs font-bold text-white">FIND MY TOP 3 <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
        {context === "dashboard"
          ? <Link href="/newsletter/my-plan" className="im-press inline-flex min-h-10 items-center rounded-full border border-ink bg-white px-4 text-xs font-bold">My weekend plan</Link>
          : <Link href="/newsletter" className="im-press inline-flex min-h-10 items-center rounded-full border border-ink bg-white px-4 text-xs font-bold">DISCOVER WHAT’S HOT</Link>}
      </div>
    </aside>
  );
}
