import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowRight, Check, CircleDot, Clock3, Flag, Route } from "lucide-react";
import { CRAFT_PATHS, getCraftPath, SOLUTION_LABELS } from "@/lib/data/craft-paths";
import { getCourseBySlug } from "@/lib/data/courses";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ScrollLine } from "@/components/motion/scroll-line";
import { TextReveal } from "@/components/motion/text-reveal";

export function generateStaticParams() {
  return CRAFT_PATHS.map((path) => ({ slug: path.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const path = getCraftPath((await params).slug);
  return path ? { title: `${path.title} — ImpactFools Academia`, description: path.shortOutcome } : {};
}

export default async function CraftPathPage({ params }: { params: Promise<{ slug: string }> }) {
  const path = getCraftPath((await params).slug);
  if (!path) notFound();
  const courses = path.courseSlugs.map(getCourseBySlug).filter(Boolean);

  return (
    <div className="pb-20">
      <header className={`border-b border-ink px-4 py-12 md:px-6 md:py-20 ${path.accent === "pink" ? "bg-pink-dim" : path.accent === "blue" ? "bg-blue-dim" : "bg-ink text-white"}`}>
        <div className="mx-auto max-w-6xl">
          <Reveal immediate variant="fadeIn" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"><Route className="h-4 w-4" /> Craft Path · {path.estimatedJourney}</Reveal>
          <TextReveal as="h1" immediate delay={0.1} text={path.title} className="mt-5 max-w-5xl font-display text-5xl font-semibold uppercase leading-[0.9] md:text-7xl" />
          <Reveal immediate delay={0.4} as="p" className={`mt-6 max-w-2xl text-lg leading-relaxed ${path.accent === "ink" ? "text-white/75" : "text-ink/75"}`}>{path.shortOutcome}</Reveal>
          <Reveal immediate delay={0.55} className="mt-8">
            <Link href={path.slug === "redirection" ? "/redirection" : "#start"} className={`im-lift group inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold ${path.accent === "ink" ? "border-white bg-white text-ink hover:shadow-[4px_4px_0_#f72d79]" : "border-ink bg-ink text-white hover:shadow-[4px_4px_0_#0964f5]"}`}>{path.slug === "redirection" ? "Take the Redirection Check" : "Start this path"} <ArrowRight className="im-nudge h-4 w-4" /></Link>
          </Reveal>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <Stagger as="section" className="grid gap-4 md:grid-cols-3" aria-label="Path overview">
          <OverviewCard label="Who this is for" text={path.whoItsFor} />
          <OverviewCard label="The problem" text={path.problem} />
          <OverviewCard label="The outcome" text={path.desiredOutcome} />
        </Stagger>

        <section className="mt-16" aria-labelledby="journey-title">
          <Reveal variant="fadeIn" as="p" className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">The journey</Reveal>
          <TextReveal as="h2" id="journey-title" text="Follow the work." className="mt-2 font-display text-5xl font-semibold md:text-7xl" />
          <div className="relative mt-8 space-y-4">
            {/* The spine draws itself as the reader follows the steps */}
            <ScrollLine className="absolute bottom-8 left-6 top-8 md:left-1/2" color="bg-pink" />
            {path.steps.map((step, index) => (
              <div key={step.id} className={`relative grid gap-4 md:grid-cols-2 ${index % 2 ? "md:[&>*]:col-start-2" : ""}`}>
                <Reveal variant="popIn" amount={0.6} className="absolute left-[18px] top-7 z-10 md:left-1/2 md:-ml-1.5">
                  <span className="block h-3 w-3 rounded-full border border-ink bg-pink" />
                </Reveal>
                <Reveal as="article" variant={index % 2 ? "slideReveal" : "slideRevealLeft"} amount={0.35} className="im-float ml-12 rounded-3xl border border-ink bg-white p-5 shadow-[4px_4px_0_#bfe8ed] hover:shadow-[7px_8px_0_#bfe8ed] md:ml-0 md:p-7">
                  <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue">0{index + 1} · {step.label}</span><span className="rounded-full border border-line px-2 py-1 text-[9px] font-bold uppercase tracking-wide">{SOLUTION_LABELS[step.solutionType]}</span></div>
                  <h3 className="mt-4 font-display text-3xl font-semibold leading-none">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
                  {step.output && <p className="mt-4 border-t border-line pt-3 text-xs font-semibold"><span className="text-pink">Output:</span> {step.output}</p>}
                </Reveal>
              </div>
            ))}
          </div>
        </section>

        {courses.length > 0 && <section className="mt-16" aria-labelledby="learning-title">
          <Reveal variant="fadeIn" as="p" className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Existing ImpactFools learning</Reveal><TextReveal as="h2" id="learning-title" text="Courses in this path" className="mt-2 font-display text-4xl font-semibold md:text-6xl" />
          <Stagger stagger={0.06} className="mt-7 grid gap-3 md:grid-cols-2">{courses.map((course, index) => course && <StaggerItem key={course.id}><Link href={`/academy/${course.slug}`} className="im-lift group flex h-full items-center gap-4 rounded-2xl border border-ink bg-white p-4 hover:bg-blue-dim hover:shadow-[4px_4px_0_#111]"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink bg-pink-dim font-bold transition-colors duration-300 group-hover:bg-pink group-hover:text-white">{index + 1}</span><span><strong className="block font-display text-2xl leading-none">{course.title}</strong><small className="mt-1 block text-muted">{course.durationLabel} · {course.level}</small></span><ArrowRight className="im-nudge ml-auto h-4 w-4" /></Link></StaggerItem>)}</Stagger>
        </section>}

        <Stagger as="section" stagger={0.12} className="mt-16 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <StaggerItem className="editorial-grid rounded-3xl border border-ink bg-pink-dim p-6 md:p-8"><Flag className="h-8 w-8 text-pink" /><p className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em]">Final project</p><h2 className="mt-2 font-display text-4xl font-semibold leading-none">{path.finalProject}</h2></StaggerItem>
          <StaggerItem className="rounded-3xl border border-ink bg-white p-6 md:p-8"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue">You leave with</p><ul className="mt-5 space-y-3">{path.proof.map((item) => <li key={item} className="flex items-center gap-3 text-sm"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-dim"><Check className="h-3.5 w-3.5" /></span>{item}</li>)}</ul><div className="mt-6 flex items-center gap-2 border-t border-line pt-4 text-xs font-semibold text-muted"><Clock3 className="h-4 w-4" /> {path.estimatedJourney}</div></StaggerItem>
        </Stagger>

        <Reveal as="section" variant="scaleIn" id="start" className="mt-16 rounded-3xl border border-ink bg-blue p-7 text-white shadow-[6px_6px_0_#111] md:flex md:items-center md:justify-between md:p-10"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Learn → Build → Apply → Create value → Produce proof</p><h2 className="mt-2 font-display text-4xl font-semibold md:text-6xl">Ready to follow the path?</h2></div><Link href={path.slug === "redirection" ? "/redirection" : `/interest?course=${path.courseSlugs[0] ?? "redirection"}`} className="im-lift group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink hover:shadow-[4px_4px_0_#111] md:mt-0">{path.slug === "redirection" ? "Start Redirection" : "I’m interested"} <ArrowRight className="im-nudge h-4 w-4" /></Link></Reveal>
      </main>
    </div>
  );
}

function OverviewCard({ label, text }: { label: string; text: string }) {
  return <StaggerItem as="article" className="rounded-3xl border border-ink bg-white p-5"><CircleDot className="h-5 w-5 text-pink" /><p className="mt-7 text-[10px] font-bold uppercase tracking-[0.17em] text-blue">{label}</p><p className="mt-2 text-sm leading-relaxed text-ink/75">{text}</p><ArrowDown className="mt-5 h-4 w-4 text-muted" aria-hidden="true" /></StaggerItem>;
}
