"use client";

import Link from "next/link";
import { ArrowRight, Check, Download, RotateCcw } from "lucide-react";
import { getCourseBySlug } from "@/lib/data/courses";
import { skillName } from "@/lib/capacity-guide/engine";
import type { CapacityProfile as CapacityProfileType } from "@/lib/capacity-guide/types";

function List({ items, empty = "Nothing added yet." }: { items: string[]; empty?: string }) {
  if (!items.length) return <p className="text-sm text-muted">{empty}</p>;
  return <ul className="space-y-2">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-relaxed"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue" />{item}</li>)}</ul>;
}

export function CapacityProfileView({ profile, onReset }: { profile: CapacityProfileType; onReset?: () => void }) {
  const courses = profile.recommendedCourseSlugs.map(getCourseBySlug).filter(Boolean);
  return (
    <div className="capacity-profile space-y-8">
      <header className="rounded-[2rem] border border-ink bg-blue p-6 text-white shadow-[6px_6px_0_#111] sm:p-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">ImpactFools Capacity Guide</p>
        <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.9] sm:text-7xl">Your Capacity Profile</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85">A direction—not a diagnosis. Use it to build, prove and test what may create value.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <ProfileCard title="I know"><List items={profile.existingCapacity.know} /></ProfileCard>
        <ProfileCard title="I can do"><List items={profile.existingCapacity.canDo} /></ProfileCard>
        <ProfileCard title="I have experience in"><List items={profile.existingCapacity.experience} /></ProfileCard>
        <ProfileCard title="I can create"><List items={profile.existingCapacity.canCreate} /></ProfileCard>
      </section>

      <ProfileCard title="Your strongest potential skills" accent="pink">
        <div className="flex flex-wrap gap-2">{profile.strongestSkills.map((id) => <span key={id} className="rounded-full border border-ink bg-white px-3 py-2 text-sm font-semibold">{skillName(id)}</span>)}</div>
      </ProfileCard>

      <section className="rounded-[2rem] border border-ink bg-pink-dim p-6 sm:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Recommended Capacity Stack</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {profile.recommendedStack.map((id, index) => <div key={id} className="contents"><span className="rounded-2xl border border-ink bg-white px-4 py-3 font-display text-2xl font-semibold shadow-[3px_3px_0_#111]">{skillName(id)}</span>{index < profile.recommendedStack.length - 1 && <span className="text-2xl font-bold">+</span>}</div>)}
        </div>
        <p className="mt-5 text-sm text-muted">This is a possible combination to test—not a guaranteed career or income outcome.</p>
      </section>

      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Opportunity Map</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {profile.opportunities.map((item) => (
            <article key={item.title} className="rounded-3xl border border-ink bg-white p-5 shadow-[4px_4px_0_#111]">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue">{item.mode}</span>
              <h3 className="mt-2 font-display text-2xl font-semibold">{item.title}</h3>
              <dl className="mt-4 space-y-3 text-sm leading-relaxed"><div><dt className="font-bold">Who might need it</dt><dd className="text-muted">{item.audience}</dd></div><div><dt className="font-bold">Problem it solves</dt><dd className="text-muted">{item.problem}</dd></div><div><dt className="font-bold">What you need to become capable of</dt><dd className="text-muted">{item.capability}</dd></div><div><dt className="font-bold">Possible first proof</dt><dd className="text-muted">{item.proof}</dd></div></dl>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <ProfileCard title="Your 30-Day Build" accent="blue"><dl className="space-y-3 text-sm"><Result label="Skill" value={profile.build.skill} /><Result label="Why this one" value={profile.build.why} /><Result label="Who could benefit" value={profile.build.beneficiary} /><Result label="Problem" value={profile.build.problem} /><Result label="What to learn" value={profile.build.learning} /><Result label="What you will build" value={profile.build.deliverable} /></dl></ProfileCard>
        <ProfileCard title="Your first proof" accent="pink"><p className="text-sm leading-relaxed">{profile.proof || "Choose one small finished project that somebody can inspect."}</p></ProfileCard>
      </section>

      <ProfileCard title="Your first value test">
        <dl className="grid gap-4 text-sm sm:grid-cols-2"><Result label="Three possible users" value={profile.valueTest.people} /><Result label="What you could offer" value={profile.valueTest.offer} /><Result label="Problem you could help solve" value={profile.valueTest.problem} /><Result label="Result you could help create" value={profile.valueTest.result} /><Result label="First small test" value={profile.valueTest.firstTest} /></dl>
      </ProfileCard>

      <section className="rounded-[2rem] border border-ink bg-ink p-6 text-white sm:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Personalized learning</p>
        <h2 className="mt-2 font-display text-4xl font-semibold">Relevant ImpactFools learning</h2>
        {courses.length ? <div className="mt-5 grid gap-3 md:grid-cols-2">{courses.map((course) => course && <Link key={course.slug} href={`/academy/${course.slug}`} className="group flex items-center justify-between rounded-2xl border border-white/30 bg-white/10 p-4 hover:bg-white hover:text-ink"><span><strong className="block">{course.title}</strong><small className="text-white/65 group-hover:text-muted">{course.access === "coming_soon" ? "Coming soon" : "View course"}</small></span><ArrowRight className="h-4 w-4" /></Link>)}</div> : <p className="mt-4 text-sm text-white/70">Recommended next step: find one credible beginner resource and use it to complete your first proof project.</p>}
      </section>

      <section className="rounded-[2rem] border border-ink bg-blue-dim p-6 text-center sm:p-10">
        <p className="font-display text-2xl font-semibold leading-relaxed sm:text-4xl">I HAVE ↓ I BUILD ↓ I CREATE ↓ I SOLVE ↓ I OFFER ↓ I EARN ↓ I INCREASE</p>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted">You don’t increase your income only by looking for more money. You can increase the capacity that creates it.</p>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em]">Learn it. Build it. Prove it.</p>
      </section>

      <div className="no-print flex flex-wrap gap-3">
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"><Download className="h-4 w-4" /> Download / Print Profile</button>
        {onReset && <button type="button" onClick={onReset} className="inline-flex items-center gap-2 rounded-full border border-ink bg-white px-5 py-3 text-sm font-bold"><RotateCcw className="h-4 w-4" /> Start again</button>}
      </div>
    </div>
  );
}

function ProfileCard({ title, children, accent }: { title: string; children: React.ReactNode; accent?: "pink" | "blue" }) {
  return <section className={`rounded-3xl border border-ink p-5 sm:p-6 ${accent === "pink" ? "bg-pink-dim" : accent === "blue" ? "bg-blue-dim" : "bg-white"}`}><p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{title}</p>{children}</section>;
}

function Result({ label, value }: { label: string; value: string }) {
  return <div><dt className="font-bold text-ink">{label}</dt><dd className="mt-1 text-muted">{value || "Not added yet."}</dd></div>;
}
