import Link from "next/link";
import { FlaskConical } from "lucide-react";
import type { PulseUpdate } from "@/lib/pulse/types";

/** Shown whenever the feed includes demonstration content, so nothing reads as live news by accident. */
export function DemoNotice({ updates }: { updates: PulseUpdate[] }) {
  const demoCount = updates.filter((update) => update.verification === "demo").length;
  if (!demoCount) return null;
  const all = demoCount === updates.length;
  return (
    <p className="mb-6 flex items-start gap-2 rounded-2xl border border-ink/20 bg-white p-3 text-xs leading-relaxed text-ink/75">
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
      <span>
        {all ? "Impact Pulse is launching: every update below is" : `${demoCount} of these updates are`} <strong>demonstration content</strong> marked “Demo” — evergreen explainers and format previews, not live news or open vacancies. Verified updates from the editorial team appear first as they’re published.{" "}
        <Link href="/pulse/standards" className="font-semibold underline underline-offset-2">How we verify</Link>
      </span>
    </p>
  );
}
