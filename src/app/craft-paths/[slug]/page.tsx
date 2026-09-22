import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowRight, Check, CircleDot, Clock3, Flag, Route } from "lucide-react";
import { CRAFT_PATHS, getCraftPath, SOLUTION_LABELS } from "@/lib/data/craft-paths";
import { getCourseBySlug } from "@/lib/data/courses";

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
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"><Route className="h-4 w-4" /> Craft Path · {path.estimatedJourney}</div>
          <h1 className="mt-5 max-w-5xl font-display text-6xl font-semibold uppercase leading-[0.8] tracking-[-0.05em] md:text-8xl">{path.title}</h1>
          <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${path.accent === "ink" ? "text-white/75" : "text-ink/75"}`}>{path.shortOutcome}</p>
          <Link href={path.slug === "redirection" ? "/redirection" : "#start"} className={`mt-8 inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold ${path.accent === "ink" ? "border-white bg-white text-ink" : "border-ink bg-ink text-white"}`}>{path.slug === "redirection" ? "Take the Redirection Check" : "Start this path"} <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <section className="grid gap-4 md:grid-cols-3" aria-label="Path overview">
          <OverviewCard label="Who this is for" text={path.whoItsFor} />
          <OverviewCard label="The problem" text={path.problem} />
          <OverviewCard label="The outcome" text={path.desiredOutcome} />
        </section>

        <section className="mt-16" aria-labelledby="journey-title">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">The journey</p>
          <h2 id="journey-title" className="mt-2 font-display text-5xl font-semibold md:text-7xl">Follow the work.</h2>
          <div className="relative mt-8 space-y-4 before:absolute before:bottom-8 before:left-6 before:top-8 before:w-px before:bg-ink md:before:left-1/2">
            {path.steps.map((step, index) => (
              <div key={step.id} className={`relative grid gap-4 md:grid-cols-2 ${index % 2 ? "md:[&>*]:col-start-2" : ""}`}>
                <span className="absolute left-[18px] top-7 z-10 h-3 w-3 rounded-full border border-ink bg-pink md:left-1/2 md:-translate-x-1/2" />
                <article className="ml-12 rounded-3xl border border-ink bg-white p-5 shadow-[4px_4px_0_#bfe8ed] md:ml-0 md:p-7">
                  <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue">0{index + 1} · {step.label}</span><span className="rounded-full border border-line px-2 py-1 text-[9px] font-bold uppercase tracking-wide">{SOLUTION_LABELS[step.solutionType]}</span></div>
                  <h3 className="mt-4 font-display text-3xl font-semibold leading-none">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
                  {step.output && <p className="mt-4 border-t border-line pt-3 text-xs font-semibold"><span className="text-pink">Output:</span> {step.output}</p>}
                </article>
              </div>
            ))}
          </div>
        </section>

        {courses.length > 0 && <section className="mt-16" aria-labelledby="learning-title">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Existing ImpactFools learning</p><h2 id="learning-title" className="mt-2 font-display text-4xl font-semibold md:text-6xl">Courses in this path</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-2">{courses.map((course, index) => course && <Link key={course.id} href={`/academy/${course.slug}`} className="group flex items-center gap-4 rounded-2xl border border-ink bg-white p-4 hover:bg-blue-dim"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink bg-pink-dim font-bold">{index + 1}</span><span><strong className="block font-display text-2xl leading-none">{course.title}</strong><small className="mt-1 block text-muted">{course.durationLabel} · {course.level}</small></span><ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>)}</div>
        </section>}

        <section className="mt-16 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="editorial-grid rounded-3xl border border-ink bg-pink-dim p-6 md:p-8"><Flag className="h-8 w-8 text-pink" /><p className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em]">Final project</p><h2 className="mt-2 font-display text-4xl font-semibold leading-none">{path.finalProject}</h2></div>
          <div className="rounded-3xl border border-ink bg-white p-6 md:p-8"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue">You leave with</p><ul className="mt-5 space-y-3">{path.proof.map((item) => <li key={item} className="flex items-center gap-3 text-sm"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-dim"><Check className="h-3.5 w-3.5" /></span>{item}</li>)}</ul><div className="mt-6 flex items-center gap-2 border-t border-line pt-4 text-xs font-semibold text-muted"><Clock3 className="h-4 w-4" /> {path.estimatedJourney}</div></div>
        </section>

        <section id="start" className="mt-16 rounded-3xl border border-ink bg-blue p-7 text-white shadow-[6px_6px_0_#111] md:flex md:items-center md:justify-between md:p-10"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Learn → Build → Apply → Create value → Produce proof</p><h2 className="mt-2 font-display text-4xl font-semibold md:text-6xl">Ready to follow the path?</h2></div><Link href={path.slug === "redirection" ? "/redirection" : `/interest?course=${path.courseSlugs[0] ?? "redirection"}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink md:mt-0">{path.slug === "redirection" ? "Start Redirection" : "I’m interested"} <ArrowRight className="h-4 w-4" /></Link></section>
      </main>
    </div>
  );
}

function OverviewCard({ label, text }: { label: string; text: string }) {
  return <article className="rounded-3xl border border-ink bg-white p-5"><CircleDot className="h-5 w-5 text-pink" /><p className="mt-7 text-[10px] font-bold uppercase tracking-[0.17em] text-blue">{label}</p><p className="mt-2 text-sm leading-relaxed text-ink/75">{text}</p><ArrowDown className="mt-5 h-4 w-4 text-muted" aria-hidden="true" /></article>;
}
