"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Plus, Save } from "lucide-react";
import { CAPACITY_SKILL_BY_ID, CAPACITY_SKILLS, CAPACITY_STEPS } from "@/lib/capacity-guide/data";
import { EMPTY_SCORES, opportunitiesForStack, proofIdeasForStack, rankSkills, skillName, suggestStack } from "@/lib/capacity-guide/engine";
import type { CapacityScores } from "@/lib/capacity-guide/types";
import { useCapacityGuideStore } from "@/lib/store/capacity-guide-store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";
import { CapacityProgress } from "./capacity-progress";

const scoreLabels: { key: keyof CapacityScores; label: string; help: string }[] = [
  { key: "interest", label: "Interest", help: "How strongly do you want to explore this?" },
  { key: "existingAbility", label: "Existing ability", help: "How much useful foundation do you already have?" },
  { key: "demand", label: "Demand", help: "Based on what you currently know, how often do people or businesses need this?" },
  { key: "incomePotential", label: "Income potential", help: "Could this support a paid outcome after you build proof?" },
  { key: "buildability", label: "Buildability", help: "How realistically can you become useful with your current time and resources?" },
];

export function CapacityGuideWizard() {
  const router = useRouter();
  const hydrated = useHydrated();
  const store = useCapacityGuideStore();
  const start = useCapacityGuideStore((state) => state.start);
  const [error, setError] = useState("");

  useEffect(() => { start(); }, [start]);

  const ranked = useMemo(() => rankSkills(store.answers.potential.selectedSkills, store.answers.scores), [store.answers.potential.selectedSkills, store.answers.scores]);
  const stack = useMemo(() => suggestStack(store.answers), [store.answers]);
  const opportunities = useMemo(() => opportunitiesForStack(stack), [stack]);
  const proofIdeas = useMemo(() => proofIdeasForStack(stack), [stack]);

  if (!hydrated) return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-sm text-muted">Opening your saved Capacity Guide…</div>;

  const validate = () => {
    const { answers, currentStep } = store;
    if (currentStep === 0 && !Object.values(answers.current).some((value) => value.trim())) return "Add at least one honest answer about what is already in your hands.";
    if (currentStep === 1 && !answers.potential.selectedSkills.length) return "Choose at least one potential skill to explore.";
    if (currentStep === 3 && !stack.length) return "Choose at least one skill for your Capacity Stack.";
    if (currentStep === 4 && !answers.selectedOpportunity) return "Choose one opportunity direction to explore next.";
    if (currentStep === 5 && (!answers.build.skill.trim() || !answers.build.deliverable.trim())) return "Choose your primary skill and what you will build in the next 30 days.";
    if (currentStep === 6 && !answers.proof.trim()) return "Choose a first proof project before creating your profile.";
    return "";
  };

  const next = () => {
    const message = validate();
    if (message) { setError(message); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setError("");
    if (store.currentStep === 6) {
      store.complete();
      router.push("/capacity-guide/profile");
      return;
    }
    store.setStep(Math.min(6, store.currentStep + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-paper px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-2xl border border-line bg-white p-4 sm:p-5"><CapacityProgress currentStep={store.currentStep} /></div>
        {error && <div role="alert" className="mb-6 rounded-2xl border border-pink bg-pink-dim p-4 text-sm font-semibold text-ink">{error}</div>}

        <main className="rounded-[2rem] border border-ink bg-white p-5 shadow-[6px_6px_0_#111] sm:p-8 md:p-10">
          {store.currentStep === 0 && <CurrentStep />}
          {store.currentStep === 1 && <PotentialStep />}
          {store.currentStep === 2 && <ValueStep />}
          {store.currentStep === 3 && <StackStep stack={stack} ranked={ranked} />}
          {store.currentStep === 4 && <OpportunityStep opportunities={opportunities} />}
          {store.currentStep === 5 && <BuildStep ranked={ranked} />}
          {store.currentStep === 6 && <ProofStep proofIdeas={proofIdeas} />}
        </main>

        <footer className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => { setError(""); store.setStep(Math.max(0, store.currentStep - 1)); }} disabled={store.currentStep === 0} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink bg-white px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-35"><ArrowLeft className="h-4 w-4" /> Back</button>
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted"><Save className="h-3.5 w-3.5" /> Your answers save automatically on this device.</span>
            <button type="button" onClick={next} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white shadow-[3px_3px_0_var(--color-blue)] sm:w-auto">{store.currentStep === 6 ? "Create My Capacity Profile" : "Next"}<ArrowRight className="h-4 w-4" /></button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function StepHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <header className="mb-9"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">{eyebrow}</p><h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[0.92] sm:text-6xl">{title}</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{copy}</p></header>;
}

function Question({ label, help, value, onChange, placeholder }: { label: string; help?: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="block"><span className="block font-display text-2xl font-semibold leading-tight">{label}</span>{help && <span className="mt-1 block text-sm leading-relaxed text-muted">{help}</span>}<textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={3} className="mt-3 w-full resize-y rounded-2xl border border-line bg-paper p-4 text-base outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/15" /></label>;
}

function CurrentStep() {
  const current = useCapacityGuideStore((state) => state.answers.current);
  const update = useCapacityGuideStore((state) => state.updateCurrent);
  return <><StepHeader eyebrow="01 Current Capacity" title="What’s already in your hands?" copy="Don’t start with what you wish you could do. Start with what already exists. Work skills, creative skills, technical skills and self-taught skills all count."/><div className="grid gap-7 md:grid-cols-2"><Question label="What do you currently know how to do?" value={current.knowHow} onChange={(knowHow) => update({ knowHow })} placeholder="Bookkeeping, writing reports, organizing events…"/><Question label="What do people ask you for help with?" value={current.askedForHelp} onChange={(askedForHelp) => update({ askedForHelp })}/><Question label="What feels easier to you than it seems to feel for other people?" value={current.feelsEasy} onChange={(feelsEasy) => update({ feelsEasy })}/><Question label="What have you done repeatedly enough to become good at?" value={current.repeatedExperience} onChange={(repeatedExperience) => update({ repeatedExperience })}/><Question label="What have you learned through your jobs?" value={current.jobLearning} onChange={(jobLearning) => update({ jobLearning })}/><Question label="What tools or software can you already use?" value={current.tools} onChange={(tools) => update({ tools })}/><div className="md:col-span-2"><Question label="What have you created before?" help="Reports, designs, spreadsheets, videos, systems, events, businesses, presentations, websites, documents or campaigns." value={current.created} onChange={(created) => update({ created })}/></div></div></>;
}

function PotentialStep() {
  const potential = useCapacityGuideStore((state) => state.answers.potential);
  const update = useCapacityGuideStore((state) => state.updatePotential);
  const [custom, setCustom] = useState("");
  const toggle = (id: string) => update({ selectedSkills: potential.selectedSkills.includes(id) ? potential.selectedSkills.filter((item) => item !== id) : [...potential.selectedSkills, id].slice(0, 5) });
  return <><StepHeader eyebrow="02 Potential" title="What could you become really good at?" copy="Potential is not a promise. It is a direction worth testing through focused learning and finished work."/><div className="grid gap-7 md:grid-cols-2"><Question label="What are you naturally curious about?" value={potential.curiousAbout} onChange={(curiousAbout) => update({ curiousAbout })}/><Question label="What skill have you wanted to learn but keep postponing?" value={potential.postponedSkill} onChange={(postponedSkill) => update({ postponedSkill })}/><Question label="What work can you spend hours doing without hating it?" value={potential.energizingWork} onChange={(energizingWork) => update({ energizingWork })}/><Question label="What do you see others doing and think, ‘I could learn that’?" value={potential.couldLearn} onChange={(couldLearn) => update({ couldLearn })}/><div className="md:col-span-2"><Question label="I would love to be able to say: I know how to…" value={potential.futureStatement} onChange={(futureStatement) => update({ futureStatement })}/></div></div><section className="mt-10 border-t border-line pt-8"><h2 className="font-display text-3xl font-semibold">Choose up to five potential skills</h2><p className="mt-2 text-sm text-muted">Choose fewer if fewer genuinely fit. You can change them later.</p><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{CAPACITY_SKILLS.map((skill) => { const selected = potential.selectedSkills.includes(skill.id); return <button type="button" key={skill.id} onClick={() => toggle(skill.id)} className={cn("min-h-28 rounded-2xl border p-4 text-left transition", selected ? "border-ink bg-blue-dim shadow-[3px_3px_0_#111]" : "border-line bg-paper hover:border-ink")}><span className="flex items-start justify-between gap-3"><strong>{skill.name}</strong>{selected && <Check className="h-4 w-4 shrink-0 text-blue" />}</span><span className="mt-2 block text-xs leading-relaxed text-muted">{skill.description}</span></button>; })}</div><div className="mt-5 flex flex-col gap-2 sm:flex-row"><input value={custom} onChange={(event) => setCustom(event.target.value)} placeholder="Add another skill direction" className="min-h-12 flex-1 rounded-full border border-line bg-paper px-4 outline-none focus:border-blue"/><button type="button" onClick={() => { const name = custom.trim(); if (!name) return; const id = `custom:${name}`; if (!potential.selectedSkills.includes(id) && potential.selectedSkills.length < 5) update({ selectedSkills: [...potential.selectedSkills, id] }); setCustom(""); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink px-5 text-sm font-bold"><Plus className="h-4 w-4" /> Add</button></div>{potential.selectedSkills.some((id) => id.startsWith("custom:")) && <div className="mt-3 flex flex-wrap gap-2">{potential.selectedSkills.filter((id) => id.startsWith("custom:")).map((id) => <button type="button" key={id} onClick={() => toggle(id)} className="rounded-full bg-pink-dim px-3 py-2 text-sm font-semibold">{skillName(id).replace("custom:", "")} ×</button>)}</div>}</section></>;
}

function ValueStep() {
  const selected = useCapacityGuideStore((state) => state.answers.potential.selectedSkills);
  const scores = useCapacityGuideStore((state) => state.answers.scores);
  const setScore = useCapacityGuideStore((state) => state.setScore);
  return <><StepHeader eyebrow="03 Value" title="Where is the value?" copy="Interest matters, but it is only one signal. Score each direction to support your decision—not to pretend the future is scientifically certain."/><div className="space-y-6">{selected.map((id) => { const skill = CAPACITY_SKILL_BY_ID.get(id); const current = scores[id] ?? EMPTY_SCORES; return <section key={id} className="rounded-3xl border border-ink bg-paper p-5 sm:p-6"><h2 className="font-display text-3xl font-semibold">{skill?.name ?? id.replace("custom:", "")}</h2>{skill && <div className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2"><p><strong className="text-ink">Who may need it:</strong> {skill.opportunities[0]?.audience}</p><p><strong className="text-ink">Problem it may solve:</strong> {skill.opportunities[0]?.problem}</p><p><strong className="text-ink">Possible outcome:</strong> {skill.opportunities[0]?.proof}</p><p><strong className="text-ink">Ways to apply it:</strong> {skill.opportunities.map((item) => item.mode).join("; ")}</p></div>}<div className="mt-6 grid gap-5 md:grid-cols-5">{scoreLabels.map((score) => <label key={score.key}><span className="block text-xs font-bold uppercase tracking-wide">{score.label}</span><span className="mt-1 block min-h-12 text-[11px] leading-relaxed text-muted">{score.help}</span><select value={current[score.key]} onChange={(event) => setScore(id, { [score.key]: Number(event.target.value) })} className="mt-2 min-h-11 w-full rounded-xl border border-line bg-white px-3 font-bold outline-none focus:border-blue">{[1,2,3,4,5].map((value) => <option key={value} value={value}>{value} / 5</option>)}</select></label>)}</div></section>; })}</div></>;
}

function StackStep({ stack, ranked }: { stack: string[]; ranked: string[] }) {
  const selected = useCapacityGuideStore((state) => state.answers.selectedStack);
  const setStack = useCapacityGuideStore((state) => state.setStack);
  useEffect(() => { if (!selected.length && stack.length) setStack(stack); }, [selected.length, setStack, stack]);
  const active = selected.length ? selected : stack;
  const toggle = (id: string) => setStack(active.includes(id) ? active.filter((item) => item !== id) : [...active, id].slice(0, 3));
  return <><StepHeader eyebrow="04 Capacity Stack" title="Build your Capacity Stack" copy="You don’t necessarily need one perfect niche. Sometimes your strongest possibility comes from combining what you already know with something new."/><div className="rounded-[2rem] border border-ink bg-pink-dim p-6 text-center sm:p-10"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Possible Capacity Stack</p><div className="mt-5 flex flex-wrap items-center justify-center gap-3">{active.map((id, index) => <div key={id} className="contents"><span className="rounded-2xl border border-ink bg-white px-4 py-3 font-display text-2xl font-semibold shadow-[3px_3px_0_#111]">{skillName(id).replace("custom:", "")}</span>{index < active.length - 1 && <span className="text-2xl font-bold">+</span>}</div>)}</div><p className="mt-6 text-sm text-muted">Current capacity + new capacity = new possibility</p></div><section className="mt-8"><h2 className="font-display text-2xl font-semibold">Edit your preferred stack</h2><p className="mt-1 text-sm text-muted">Select one to three directions. This is a possible combination, not a guaranteed career.</p><div className="mt-4 flex flex-wrap gap-2">{ranked.map((id) => <button type="button" key={id} onClick={() => toggle(id)} className={cn("rounded-full border px-4 py-2 text-sm font-semibold", active.includes(id) ? "border-ink bg-blue text-white" : "border-line bg-paper")}>{skillName(id).replace("custom:", "")}</button>)}</div></section></>;
}

function OpportunityStep({ opportunities }: { opportunities: ReturnType<typeof opportunitiesForStack> }) {
  const selected = useCapacityGuideStore((state) => state.answers.selectedOpportunity);
  const setSelected = useCapacityGuideStore((state) => state.setOpportunity);
  return <><StepHeader eyebrow="05 Opportunities" title="Where could this take you?" copy="Explore realistic directions across employment, freelancing, consulting, services, products, teaching and entrepreneurship. These are possibilities to investigate—not promises."/><div className="grid gap-4 md:grid-cols-2">{opportunities.map((item) => <button type="button" key={item.title} onClick={() => setSelected(item.title)} className={cn("rounded-3xl border p-5 text-left transition", selected === item.title ? "border-ink bg-blue-dim shadow-[4px_4px_0_#111]" : "border-line bg-paper hover:border-ink")}><span className="flex items-start justify-between gap-3"><span><small className="font-bold uppercase tracking-wide text-blue">{item.mode}</small><strong className="mt-2 block font-display text-2xl">{item.title}</strong></span>{selected === item.title && <Check className="h-5 w-5 text-blue" />}</span><dl className="mt-4 space-y-2 text-sm"><div><dt className="font-bold">Who might need it</dt><dd className="text-muted">{item.audience}</dd></div><div><dt className="font-bold">Problem</dt><dd className="text-muted">{item.problem}</dd></div><div><dt className="font-bold">Capability to build</dt><dd className="text-muted">{item.capability}</dd></div><div><dt className="font-bold">First proof</dt><dd className="text-muted">{item.proof}</dd></div></dl></button>)}</div>{!opportunities.length && <p className="rounded-2xl bg-blue-dim p-5 text-sm">For this custom direction, research three real people or businesses who use it, identify the problem they pay to solve, and define one small proof project.</p>}</>;
}

function BuildStep({ ranked }: { ranked: string[] }) {
  const build = useCapacityGuideStore((state) => state.answers.build);
  const opportunity = useCapacityGuideStore((state) => state.answers.selectedOpportunity);
  const update = useCapacityGuideStore((state) => state.updateBuild);
  return <><StepHeader eyebrow="06 Build" title="Choose your build" copy="You don’t need to build everything. Choose the one capacity direction you are going to move for the next 30 days."/><div className="grid gap-7 md:grid-cols-2"><label className="block"><span className="block font-display text-2xl font-semibold">Skill</span><select value={build.skill} onChange={(event) => update({ skill: event.target.value })} className="mt-3 min-h-14 w-full rounded-2xl border border-line bg-paper px-4 text-base outline-none focus:border-blue"><option value="">Choose one primary direction</option>{ranked.map((id) => <option key={id} value={skillName(id).replace("custom:", "")}>{skillName(id).replace("custom:", "")}</option>)}</select></label><Question label="Why this one?" value={build.why} onChange={(why) => update({ why })}/><Question label="Who could benefit?" value={build.beneficiary} onChange={(beneficiary) => update({ beneficiary })}/><Question label="What problem do you want to learn to solve?" value={build.problem} onChange={(problem) => update({ problem })} placeholder={opportunity ? `Use your selected direction: ${opportunity}` : undefined}/><Question label="What do you need to learn?" value={build.learning} onChange={(learning) => update({ learning })}/><Question label="What will you build in 30 days?" value={build.deliverable} onChange={(deliverable) => update({ deliverable })}/></div></>;
}

function ProofStep({ proofIdeas }: { proofIdeas: string[] }) {
  const proof = useCapacityGuideStore((state) => state.answers.proof);
  const setProof = useCapacityGuideStore((state) => state.setProof);
  const test = useCapacityGuideStore((state) => state.answers.valueTest);
  const update = useCapacityGuideStore((state) => state.updateValueTest);
  return <><StepHeader eyebrow="07 Proof" title="Don’t just learn it. Prove it." copy="Learning should produce evidence of capability: something finished that another person can inspect, understand and respond to."/><section><h2 className="font-display text-2xl font-semibold">Choose or write your first proof</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{proofIdeas.map((idea) => <button type="button" key={idea} onClick={() => setProof(idea)} className={cn("rounded-2xl border p-4 text-left text-sm font-semibold transition", proof === idea ? "border-ink bg-pink-dim shadow-[3px_3px_0_#111]" : "border-line bg-paper hover:border-ink")}>{idea}</button>)}</div><div className="mt-5"><Question label="What will you build as your first proof?" value={proof} onChange={setProof}/></div></section><section className="mt-10 border-t border-line pt-8"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Turn Capacity Into Value</p><h2 className="mt-2 font-display text-4xl font-semibold">Run a small real-world test</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">This is not “make money immediately.” It is a responsible test of whether your growing capacity can help create a useful outcome.</p><div className="mt-7 grid gap-7 md:grid-cols-2"><Question label="Who are three people or businesses that could use this?" value={test.people} onChange={(people) => update({ people })}/><Question label="What could you offer them?" value={test.offer} onChange={(offer) => update({ offer })}/><Question label="What problem could you help solve?" value={test.problem} onChange={(problem) => update({ problem })}/><Question label="What result could you help create?" value={test.result} onChange={(result) => update({ result })}/><div className="md:col-span-2"><Question label="What could your first small offer or test look like?" value={test.firstTest} onChange={(firstTest) => update({ firstTest })}/></div></div></section></>;
}

export { CAPACITY_STEPS };
