import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Hammer, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { SkillCardActions } from "@/components/skill-challenge/skill-card-actions";
import { SKILL_CHALLENGES } from "@/lib/skill-challenge";
import { DAY_TITLES } from "@/lib/skill-challenge/skills/helpers";

export const metadata: Metadata = {
  title: "7-Day Skill Challenge — ImpactFools Academia",
  description: "Pick one skill. Build one project. Create real value. Seven days of practical learning in AI automation, data, marketing, web, process improvement or financial analysis.",
};

const FRAMEWORK = [
  ["discover", "Understand the skill and the problems it solves."],
  ["learn", "Fundamental concepts and tools."],
  ["practice", "Guided exercises in the tools."],
  ["identify", "Choose a realistic business problem."],
  ["build", "Create a small working project."],
  ["prove", "Test, document and improve it."],
  ["multiply", "Package it and explore who would pay."],
] as const;

export default function SkillChallengePage() {
  return (
    <div className="pb-20">
      <header className="overflow-hidden border-b border-ink bg-pink-dim px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal immediate variant="fadeIn" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"><Sparkles className="h-4 w-4 text-pink" /> ImpactFools Academy · 7-Day Skill Challenge</Reveal>
          <TextReveal
            as="h1"
            by="line"
            immediate
            delay={0.08}
            lines={["Pick one skill.", { text: "Build one project.", className: "text-blue" }, { text: "Create real value.", className: "text-pink" }]}
            className="mt-5 max-w-5xl font-display text-5xl font-semibold uppercase leading-[0.92] md:text-7xl"
          />
          <Reveal immediate delay={0.4} as="p" className="mt-7 max-w-2xl text-base leading-relaxed text-ink/75 md:text-lg">
            Seven days won’t make you an expert. They will give you the foundations, a small working project and a clear view of how the skill creates economic value — so you can decide what to build next.
          </Reveal>
          <Reveal immediate delay={0.5} className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="#skills" className="im-lift group inline-flex min-h-12 items-center gap-2 rounded-full border border-ink bg-ink px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#0964f5]">Choose your skill <ArrowRight className="im-nudge h-4 w-4" /></Link>
            <span className="text-xs font-semibold text-muted">Free · 60–120 minutes a day · beginner friendly</span>
          </Reveal>
        </div>
      </header>

      <section className="border-b border-ink bg-white px-4 py-10 md:px-6" aria-labelledby="framework-heading">
        <div className="mx-auto max-w-7xl">
          <h2 id="framework-heading" className="sr-only">The seven-day framework</h2>
          <Stagger stagger={0.06} as="ul" className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {FRAMEWORK.map(([key, copy], index) => (
              <StaggerItem as="li" key={key} className="rounded-2xl border border-ink bg-cream p-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-pink">Day {String(index + 1).padStart(2, "0")}</span>
                <p className="mt-1 font-display text-xl font-semibold leading-tight">{DAY_TITLES[key]}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{copy}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="skills" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-14 md:px-6 md:py-20" aria-labelledby="skills-heading">
        <div className="mb-8 max-w-3xl">
          <Reveal variant="fadeIn" as="p" className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Six commercially useful skills</Reveal>
          <TextReveal as="h2" id="skills-heading" text="Which skill will you build?" className="mt-2 font-display text-4xl font-semibold leading-none md:text-6xl" />
          <Reveal delay={0.15} as="p" className="mt-4 text-sm leading-relaxed text-muted">Explore every day of a challenge before you commit. Starting one doesn’t lock you out of the others.</Reveal>
        </div>

        <Stagger amount={0.05} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {SKILL_CHALLENGES.map((challenge, index) => (
            <StaggerItem key={challenge.id} as="article" className={`im-float flex h-full flex-col rounded-3xl border border-ink p-5 md:p-6 ${challenge.accent === "pink" ? "bg-pink-dim shadow-[6px_6px_0_#111] hover:shadow-[9px_10px_0_#111]" : "bg-blue-dim shadow-[6px_6px_0_#0964f5] hover:shadow-[9px_10px_0_#0964f5]"}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Skill {String(index + 1).padStart(2, "0")}</span>
                <span className="rounded-full border border-ink bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]">{challenge.difficulty}</span>
              </div>
              <h3 className="mt-4 font-display text-3xl font-semibold leading-none md:text-4xl">{challenge.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{challenge.businessValue}</p>

              <dl className="mt-5 space-y-4 rounded-2xl border border-ink bg-white p-4 text-sm">
                <div>
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-blue"><Hammer className="h-3.5 w-3.5" />You’ll build</dt>
                  <dd className="mt-1 font-semibold">{challenge.project.title}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-blue"><Wrench className="h-3.5 w-3.5" />Tools needed</dt>
                  <dd className="mt-1 text-ink/80">{challenge.tools.join(" · ")}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-blue"><BadgeCheck className="h-3.5 w-3.5" />Services you could eventually offer</dt>
                  <dd className="mt-1 text-ink/80">{challenge.exampleServices.join(" · ")}</dd>
                </div>
              </dl>

              <SkillCardActions skillId={challenge.id} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-y border-ink bg-blue-dim px-4 py-14 md:px-6" aria-labelledby="proof-heading">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div>
            <Reveal variant="fadeIn" as="p" className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">How completion works</Reveal>
            <TextReveal as="h2" id="proof-heading" text="Proof, not badges." className="mt-2 font-display text-4xl font-semibold leading-none md:text-6xl" />
          </div>
          <Stagger as="ul" className="grid gap-3 text-sm">
            {[
              "A day only completes when every checklist item is done and you’ve written its deliverable — clicking through isn’t enough.",
              "Build, Prove and Multiply days need a working link to your project (a live site, shared file, recording or case study).",
              "Your final Impact Check separates what you actually completed from claims you haven’t evidenced yet.",
              "Service ideas and pricing stay labelled as untested. We never promise income.",
            ].map((copy) => (
              <StaggerItem as="li" key={copy} className="flex gap-3 rounded-2xl border border-ink bg-white p-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue" />{copy}</StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
}
