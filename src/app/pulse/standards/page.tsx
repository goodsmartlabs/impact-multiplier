import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Bot, CalendarX2, FlaskConical, ShieldQuestion } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SIGNAL_ROWS } from "@/lib/pulse/signal";
import { PULSE_AGENTS } from "@/lib/pulse/agents";

export const metadata: Metadata = {
  title: "How Impact Pulse works — editorial standards",
  description: "How ImpactFools sources, verifies, labels and retires updates — and what our research agents can and can’t do.",
};

const LABELS = [
  { icon: BadgeCheck, title: "Verified", copy: "An editor checked the original source and recorded the date. Verified items must link to that source." },
  { icon: ShieldQuestion, title: "Not yet verified", copy: "Published from a credible source, but not every detail has been confirmed. Always check dates and eligibility at the source." },
  { icon: FlaskConical, title: "Demo", copy: "Evergreen explainers and format previews that ship with ImpactFools while the editorial pipeline launches. Not news, not live vacancies, never indexed as news." },
];

export default function StandardsPage() {
  return (
    <div className="pb-20">
      <header className="border-b border-ink bg-blue-dim px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-4xl">
          <Reveal immediate variant="fadeIn" as="p" className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Impact Pulse</Reveal>
          <Reveal immediate as="h1" delay={0.05} className="mt-3 font-display text-5xl font-semibold leading-none md:text-6xl">How Impact Pulse works</Reveal>
          <Reveal immediate as="p" delay={0.12} className="mt-4 text-lg text-ink/75">ImpactFools doesn’t just tell you what’s happening in the world. It helps you find your place in what’s happening — so every update has to be trustworthy and actionable.</Reveal>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-12 px-4 py-10 md:px-6">
        <section aria-labelledby="signal-heading">
          <h2 id="signal-heading" className="font-display text-3xl font-semibold">Every update answers five questions</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-5">{SIGNAL_ROWS.map((row) => <li key={row.key} className="rounded-2xl border border-ink bg-white p-4"><p className="font-display text-2xl font-semibold text-blue">{row.label}</p><p className="mt-1 text-xs text-muted">{row.question}</p></li>)}</ul>
        </section>

        <section aria-labelledby="labels-heading">
          <h2 id="labels-heading" className="font-display text-3xl font-semibold">What the labels mean</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">{LABELS.map(({ icon: Icon, title, copy }) => <li key={title} className="rounded-3xl border border-ink bg-white p-5"><Icon className="h-6 w-6 text-blue" /><p className="mt-3 font-display text-xl font-semibold">{title}</p><p className="mt-2 text-sm leading-relaxed text-ink/75">{copy}</p></li>)}</ul>
        </section>

        <section aria-labelledby="expiry-heading" className="rounded-3xl border border-ink bg-pink-dim p-6">
          <h2 id="expiry-heading" className="flex items-center gap-2 font-display text-3xl font-semibold"><CalendarX2 className="h-6 w-6 text-pink" />Deadlines and expiry</h2>
          <p className="mt-3 text-sm leading-relaxed">Jobs and opportunities leave the feed automatically the day after their deadline or expiry date. Old links stay readable but say clearly that the opportunity has closed. Unverified deadlines are shown as “listed deadline — confirm with the source”.</p>
        </section>

        <section aria-labelledby="agents-heading">
          <h2 id="agents-heading" className="flex items-center gap-2 font-display text-3xl font-semibold"><Bot className="h-7 w-7 text-blue" />Research agents</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/80">Impact Pulse has an ingestion pipeline ready for specialised research agents. <strong>No agent is running yet.</strong> When they are connected, every submission arrives as “pending review” and is published only after a human editor approves it.</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">{PULSE_AGENTS.map((agent) => <li key={agent.id} className="rounded-2xl border border-ink bg-white p-4"><p className="font-display text-xl font-semibold">{agent.name}</p><p className="text-sm text-muted">{agent.role}</p></li>)}</ul>
        </section>

        <p className="text-sm">Spotted something wrong or outdated? <Link href="/interest" className="font-semibold underline underline-offset-4">Tell the ImpactFools team</Link>.</p>
      </div>
    </div>
  );
}
