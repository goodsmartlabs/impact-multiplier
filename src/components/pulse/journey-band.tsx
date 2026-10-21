import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

const STEPS = [
  { label: "Discover", copy: "What’s happening and what’s valuable.", href: "/pulse" },
  { label: "Understand", copy: "Every update answers What, Why, Who, How and Next.", href: "/pulse/standards" },
  { label: "Learn", copy: "Build the skill in the Academy or a 7-day challenge.", href: "/academy/challenge" },
  { label: "Act", copy: "Save it, plan it and track your progress.", href: "/cart" },
  { label: "Multiply", copy: "Turn proof into value on My Impact.", href: "/my-impact" },
] as const;

/** The path every Impact Pulse story is meant to start: DISCOVER → UNDERSTAND → LEARN → ACT → MULTIPLY. */
export function JourneyBand() {
  return (
    <section aria-label="From discovery to impact" className="border-y border-ink bg-white px-4 py-10 md:px-6">
      <Stagger as="ol" stagger={0.07} className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, index) => (
          <StaggerItem as="li" key={step.label}>
            <Link href={step.href} className="im-lift group flex h-full flex-col rounded-2xl border border-ink bg-cream p-4 hover:shadow-[4px_4px_0_var(--color-blue)]">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-pink">{String(index + 1).padStart(2, "0")}</span>
              <span className="mt-1 flex items-center justify-between font-display text-2xl font-semibold">{step.label}<ArrowRight className="im-nudge h-4 w-4" /></span>
              <span className="mt-1 text-xs leading-relaxed text-muted">{step.copy}</span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
