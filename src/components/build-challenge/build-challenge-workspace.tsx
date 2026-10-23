"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  FileText,
  FolderOpen,
  Hammer,
  Link2,
  LockKeyhole,
  Pause,
  Play,
  Plus,
  Rocket,
} from "lucide-react";
import { emptyBrief, getStageDefinitions, type BuildBrief, type BuildChallenge, type BuildType } from "@/lib/build-challenge";
import { useBuildChallengeStore } from "@/lib/store/build-challenge-store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

const BUILD_TYPES: { value: BuildType; label: string }[] = [
  { value: "app", label: "App" }, { value: "service", label: "Service" },
  { value: "digital-product", label: "Digital product" }, { value: "website", label: "Website" },
  { value: "course", label: "Course" }, { value: "template", label: "Template" },
  { value: "physical-product", label: "Physical product" }, { value: "business", label: "Business offer" },
  { value: "other", label: "Something else" },
];

const fieldClass = "mt-1.5 w-full rounded-xl border border-ink/40 bg-paper px-3.5 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-blue/20";

function importBriefFromUrl(): BuildBrief | null {
  const params = new URLSearchParams(window.location.search);
  if (params.get("source") !== "innergency") return null;
  const brief = emptyBrief();
  brief.projectName = params.get("ideaName") ?? params.get("name") ?? "";
  brief.description = params.get("description") ?? "";
  brief.buildType = (BUILD_TYPES.some((item) => item.value === params.get("type")) ? params.get("type") : "other") as BuildType;
  brief.targetCustomer = params.get("targetAudience") ?? params.get("audience") ?? "";
  brief.problem = params.get("problem") ?? "";
  brief.outcome = params.get("solution") ?? params.get("outcome") ?? "";
  brief.daySevenFinishLine = params.get("finishLine") ?? "";
  brief.offer = params.get("offer") ?? "";
  brief.pricing = params.get("pricing") ?? "";
  brief.brandDirection = params.get("brandDirection") ?? "";
  brief.researchSummary = params.get("researchSummary") ?? "";
  brief.sourceIdeaId = params.get("sourceIdeaId") ?? "";
  return Object.values(brief).some(Boolean) ? brief : null;
}

export function BuildChallengeWorkspace() {
  const hydrated = useHydrated();
  const challenges = useBuildChallengeStore((state) => state.challenges);
  const activeChallengeId = useBuildChallengeStore((state) => state.activeChallengeId);
  const createDraft = useBuildChallengeStore((state) => state.createDraft);
  const [selectedId, setSelectedId] = useState<string>();
  const importChecked = useRef(false);

  useEffect(() => {
    if (!hydrated || importChecked.current) return;
    importChecked.current = true;
    const imported = importBriefFromUrl();
    if (!imported) return;
    const existing = challenges.find((item) => item.brief.sourceIdeaId && item.brief.sourceIdeaId === imported.sourceIdeaId);
    const id = existing?.id ?? createDraft(imported, "innergency");
    queueMicrotask(() => setSelectedId(id));
  }, [challenges, createDraft, hydrated]);

  if (!hydrated) return <div className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10" aria-busy="true" />;

  const selected = challenges.find((item) => item.id === selectedId)
    ?? challenges.find((item) => item.id === activeChallengeId);

  if (selected) return <ChallengeFlow challenge={selected} onExit={() => setSelectedId(undefined)} />;

  return <ChallengeHome challenges={challenges} activeChallengeId={activeChallengeId} onSelect={setSelectedId} />;
}

function ChallengeHome({ challenges, activeChallengeId, onSelect }: { challenges: BuildChallenge[]; activeChallengeId?: string; onSelect: (id: string) => void }) {
  const createDraft = useBuildChallengeStore((state) => state.createDraft);
  const [mode, setMode] = useState<"home" | "setup">("home");
  const active = challenges.find((item) => item.id === activeChallengeId);
  const parked = challenges.filter((item) => item.status === "parked");

  if (mode === "setup") return <SetupForm onCancel={() => setMode("home")} onCreate={(brief) => onSelect(createDraft(brief, "impactfools"))} />;

  return (
    <div>
      <section className="border-b border-ink bg-pink-dim px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-pink">The 7-Day Build Challenge</p>
          <h1 className="mt-3 max-w-5xl font-display text-6xl font-semibold uppercase leading-[0.8] tracking-[-0.04em] md:text-8xl">7 days.<br />One build.</h1>
          <p className="mt-6 max-w-xl text-lg font-semibold">Stop opening ideas. Start finishing them.</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink/70">Seven build stages. One active project. Every stage produces something you can point to outside your head.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        {active ? (
          <div className="rounded-3xl border-2 border-ink bg-paper p-5 shadow-[7px_7px_0_var(--im-blue)] md:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-pink">Active build · Day {active.currentDay} of 7</p><h2 className="mt-2 font-display text-4xl font-semibold">{active.brief.projectName}</h2><p className="mt-2 max-w-2xl text-sm text-muted">{active.brief.description}</p></div>
              <button type="button" onClick={() => onSelect(active.id)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white">Continue current build <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <button type="button" onClick={() => setMode("setup")} className="group rounded-3xl border-2 border-ink bg-paper p-7 text-left transition hover:-translate-y-1 hover:shadow-[7px_7px_0_var(--im-pink)]">
              <Hammer className="h-7 w-7 text-pink" /><h2 className="mt-8 font-display text-3xl font-semibold">Start with an idea</h2><p className="mt-2 text-sm leading-6 text-muted">Choose or paste one idea. Setup stays short so building can start.</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em]">Choose an idea <ChevronRight className="h-4 w-4" /></span>
            </button>
            <div className="rounded-3xl border-2 border-ink bg-blue-dim p-7">
              <FolderOpen className="h-7 w-7 text-blue" /><h2 className="mt-8 font-display text-3xl font-semibold">Import from Innergency</h2><p className="mt-2 text-sm leading-6 text-muted">Open the challenge from an Innergency Idea Stack record. Existing structured details are reused instead of requested again.</p><p className="mt-5 text-xs font-bold uppercase tracking-[0.12em]">Structured handoff ready</p>
            </div>
          </div>
        )}

        {parked.length > 0 && <div className="mt-10"><h2 className="text-xs font-bold uppercase tracking-[0.16em]">Parked builds</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{parked.map((item) => <button key={item.id} type="button" onClick={() => onSelect(item.id)} className="flex items-center justify-between rounded-2xl border border-ink/30 bg-paper p-4 text-left"><span><strong className="block text-sm">{item.brief.projectName}</strong><span className="text-xs text-muted">Saved at Day {item.currentDay}</span></span><Play className="h-4 w-4" /></button>)}</div></div>}
      </section>
    </div>
  );
}

function SetupForm({ onCancel, onCreate }: { onCancel: () => void; onCreate: (brief: BuildBrief) => void }) {
  const [brief, setBrief] = useState(emptyBrief);
  const valid = brief.projectName.trim() && brief.description.trim() && brief.targetCustomer.trim() && brief.problem.trim() && brief.daySevenFinishLine.trim();
  const update = (patch: Partial<BuildBrief>) => setBrief((current) => ({ ...current, ...patch }));
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <button type="button" onClick={onCancel} className="text-xs font-bold uppercase tracking-[0.14em] text-muted">← Back</button>
      <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-pink">Direct start</p><h1 className="mt-2 font-display text-5xl font-semibold">Choose one build.</h1><p className="mt-2 text-sm text-muted">Keep this concise. You can refine the brief before locking it.</p>
      <div className="mt-8 grid gap-5 rounded-3xl border border-ink bg-paper p-5 md:grid-cols-2 md:p-7">
        <Field label="Project name"><input className={fieldClass} value={brief.projectName} onChange={(event) => update({ projectName: event.target.value })} /></Field>
        <Field label="Build type"><select className={fieldClass} value={brief.buildType} onChange={(event) => update({ buildType: event.target.value as BuildType })}>{BUILD_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
        <Field label="You're building" wide><textarea className={cn(fieldClass, "min-h-24")} value={brief.description} onChange={(event) => update({ description: event.target.value })} placeholder="Paste your idea or describe the thing you will make." /></Field>
        <Field label="For"><input className={fieldClass} value={brief.targetCustomer} onChange={(event) => update({ targetCustomer: event.target.value })} placeholder="One specific customer" /></Field>
        <Field label="To solve"><input className={fieldClass} value={brief.problem} onChange={(event) => update({ problem: event.target.value })} placeholder="One concrete problem" /></Field>
        <Field label="Result it should deliver" wide><input className={fieldClass} value={brief.outcome} onChange={(event) => update({ outcome: event.target.value })} /></Field>
        <Field label="By Day 7" wide><input className={fieldClass} value={brief.daySevenFinishLine} onChange={(event) => update({ daySevenFinishLine: event.target.value })} placeholder="A visible, testable, shipped output" /></Field>
      </div>
      <button type="button" disabled={!valid} onClick={() => onCreate(brief)} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-35">Review build brief <ArrowRight className="h-4 w-4" /></button>
    </div>
  );
}

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={cn("text-xs font-bold uppercase tracking-[0.1em]", wide && "md:col-span-2")}>{label}{children}</label>; }

function ChallengeFlow({ challenge, onExit }: { challenge: BuildChallenge; onExit: () => void }) {
  if (challenge.status === "draft") return <BuildBriefEditor challenge={challenge} onExit={onExit} />;
  if (challenge.status === "completed") return <BuildReport challenge={challenge} onExit={onExit} />;
  return <BuildDashboard challenge={challenge} onExit={onExit} />;
}

function BuildBriefEditor({ challenge, onExit }: { challenge: BuildChallenge; onExit: () => void }) {
  const [brief, setBrief] = useState(challenge.brief);
  const [blocked, setBlocked] = useState(false);
  const updateBrief = useBuildChallengeStore((state) => state.updateBrief);
  const lockBuild = useBuildChallengeStore((state) => state.lockBuild);
  const removeDraft = useBuildChallengeStore((state) => state.removeDraft);
  const valid = brief.projectName.trim() && brief.description.trim() && brief.targetCustomer.trim() && brief.problem.trim() && brief.daySevenFinishLine.trim();
  const update = (patch: Partial<BuildBrief>) => setBrief((current) => ({ ...current, ...patch }));
  return <div className="mx-auto max-w-4xl px-4 py-10 md:px-6"><button type="button" onClick={onExit} className="text-xs font-bold uppercase tracking-[0.14em] text-muted">← Challenge home</button><div className="mt-7 rounded-3xl border-2 border-ink bg-paper p-5 md:p-8"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">Your build</p><h1 className="mt-2 font-display text-5xl font-semibold">Build brief</h1>{challenge.source === "innergency" && <p className="mt-2 rounded-xl bg-blue-dim px-3 py-2 text-xs font-semibold">Imported from Innergency. Existing details are reused and remain editable before lock.</p>}<div className="mt-7 grid gap-5 md:grid-cols-2"><Field label="Project"><input className={fieldClass} value={brief.projectName} onChange={(e) => update({ projectName: e.target.value })} /></Field><Field label="Type"><select className={fieldClass} value={brief.buildType} onChange={(e) => update({ buildType: e.target.value as BuildType })}>{BUILD_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field><Field label="You're building" wide><textarea className={cn(fieldClass, "min-h-20")} value={brief.description} onChange={(e) => update({ description: e.target.value })} /></Field><Field label="For"><input className={fieldClass} value={brief.targetCustomer} onChange={(e) => update({ targetCustomer: e.target.value })} /></Field><Field label="To solve"><input className={fieldClass} value={brief.problem} onChange={(e) => update({ problem: e.target.value })} /></Field><Field label="Result"><input className={fieldClass} value={brief.outcome} onChange={(e) => update({ outcome: e.target.value })} /></Field><Field label="By Day 7"><input className={fieldClass} value={brief.daySevenFinishLine} onChange={(e) => update({ daySevenFinishLine: e.target.value })} /></Field></div>{blocked && <div className="mt-6 rounded-2xl border border-pink bg-pink-dim p-4"><p className="font-bold">YOU ALREADY HAVE AN ACTIVE BUILD.</p><p className="mt-1 text-sm">Continue or park the current build before switching.</p></div>}<div className="mt-7 flex flex-wrap gap-3"><button type="button" disabled={!valid} onClick={() => { updateBrief(challenge.id, brief); setBlocked(!lockBuild(challenge.id)); }} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white disabled:opacity-35"><LockKeyhole className="h-4 w-4" /> Lock this build</button><button type="button" onClick={() => { removeDraft(challenge.id); onExit(); }} className="min-h-12 rounded-full border border-ink px-5 text-sm font-bold">Discard draft</button></div></div></div>;
}

function BuildDashboard({ challenge, onExit }: { challenge: BuildChallenge; onExit: () => void }) {
  const resumeBuild = useBuildChallengeStore((state) => state.resumeBuild);
  const parkBuild = useBuildChallengeStore((state) => state.parkBuild);
  const updateDay = useBuildChallengeStore((state) => state.updateDay);
  const completeDay = useBuildChallengeStore((state) => state.completeDay);
  const addArtifact = useBuildChallengeStore((state) => state.addArtifact);
  const [viewDay, setViewDay] = useState(challenge.currentDay);
  const [showArtifact, setShowArtifact] = useState(false);
  const [artifactLabel, setArtifactLabel] = useState("");
  const [artifactUrl, setArtifactUrl] = useState("");
  const [resumeBlocked, setResumeBlocked] = useState(false);
  const stages = useMemo(() => getStageDefinitions(challenge.brief), [challenge.brief]);
  const stage = stages[viewDay - 1];
  const day = challenge.days[stage.key] ?? { completedTaskIds: [], workspace: "", output: "" };
  const currentStage = stages[challenge.currentDay - 1];
  const isCurrent = viewDay === challenge.currentDay;
  const allTasksDone = stage.tasks.every((_, index) => day.completedTaskIds.includes(`${stage.key}-${index}`));

  if (challenge.status === "parked") return <div className="mx-auto max-w-3xl px-4 py-14 text-center"><Pause className="mx-auto h-9 w-9 text-blue" /><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Parked build · Day {challenge.currentDay} of 7</p><h1 className="mt-2 font-display text-5xl font-semibold">{challenge.brief.projectName}</h1><p className="mx-auto mt-3 max-w-lg text-sm text-muted">Your progress is saved. Resuming makes this your one active challenge.</p>{resumeBlocked && <p className="mt-4 font-bold text-pink">YOU ALREADY HAVE AN ACTIVE BUILD. Park it before switching.</p>}<button type="button" onClick={() => { const ok = resumeBuild(challenge.id); setResumeBlocked(!ok); }} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white"><Play className="h-4 w-4" /> Resume build</button><button type="button" onClick={onExit} className="ml-3 min-h-12 rounded-full border border-ink px-5 text-sm font-bold">Back</button></div>;

  return <div className="min-h-screen overflow-x-hidden bg-cream"><section className="border-b border-ink bg-blue-dim px-4 py-6 md:px-6"><div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between"><div className="min-w-0"><button type="button" onClick={onExit} className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">← Challenge home</button><p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Active build · {challenge.brief.buildType.replaceAll("-", " ")}</p><h1 className="mt-1 break-words font-display text-4xl font-semibold md:text-5xl">{challenge.brief.projectName}</h1></div><div className="flex items-center gap-3"><span className="rounded-full border border-ink bg-paper px-4 py-2 text-xs font-bold">Day {challenge.currentDay} / 7</span><button type="button" onClick={() => parkBuild(challenge.id)} className="inline-flex items-center gap-1 rounded-full border border-ink px-4 py-2 text-xs font-bold"><Pause className="h-3.5 w-3.5" /> Park build</button></div></div></section>
    <div className="mx-auto grid min-w-0 max-w-7xl gap-6 px-4 py-6 md:px-6 lg:grid-cols-[15rem_minmax(0,1fr)_18rem]">
      <aside className="order-2 min-w-0 lg:order-1"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Build progress</p><div className="flex max-w-full gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1">{stages.map((item) => { const complete = Boolean(challenge.days[item.key]?.completedAt); return <button key={item.key} type="button" onClick={() => setViewDay(item.day)} className={cn("flex min-w-32 items-center gap-3 rounded-xl border px-3 py-2 text-left text-xs font-bold lg:w-full", viewDay === item.day ? "border-ink bg-ink text-white" : "border-transparent", complete && viewDay !== item.day && "bg-blue-dim text-ink")}><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current">{complete ? <Check className="h-3.5 w-3.5" /> : item.day}</span><span>{item.title}</span></button>; })}</div></aside>
      <main className="order-1 min-w-0 lg:order-2"><div className="overflow-hidden rounded-3xl border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_var(--im-pink)] md:p-8"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-pink">Today&apos;s objective · Day {stage.day}</p><h2 className="mt-2 font-display text-5xl font-semibold">{stage.title}</h2><p className="mt-3 text-lg font-semibold">{stage.objective}</p><p className="mt-2 text-sm leading-6 text-muted">{stage.why}</p><div className="mt-8"><h3 className="text-xs font-bold uppercase tracking-[0.14em]">Today&apos;s tasks</h3><div className="mt-3 space-y-2">{stage.tasks.map((task, index) => { const id = `${stage.key}-${index}`; const checked = day.completedTaskIds.includes(id); return <label key={id} className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-sm", checked ? "border-blue bg-blue-dim/60" : "border-ink/25")}><input type="checkbox" className="mt-0.5 h-4 w-4 accent-black" checked={checked} disabled={!isCurrent} onChange={() => updateDay(challenge.id, stage.key, { completedTaskIds: checked ? day.completedTaskIds.filter((value) => value !== id) : [...day.completedTaskIds, id] })} /><span>{task}</span></label>; })}</div></div><div className="mt-8"><label className="text-xs font-bold uppercase tracking-[0.14em]">Build area / workspace<textarea value={day.workspace} disabled={!isCurrent} onChange={(e) => updateDay(challenge.id, stage.key, { workspace: e.target.value })} className={cn(fieldClass, "min-h-32 normal-case tracking-normal")} placeholder="Draft, decisions, working notes and links for this stage…" /></label></div><div className="mt-6 rounded-2xl border border-ink bg-pink-dim/50 p-4"><label className="text-xs font-bold uppercase tracking-[0.14em]">Output required<textarea value={day.output} disabled={!isCurrent} onChange={(e) => updateDay(challenge.id, stage.key, { output: e.target.value })} className={cn(fieldClass, "min-h-24 normal-case tracking-normal")} placeholder={stage.outputPrompt} /></label></div>{isCurrent ? <button type="button" disabled={!allTasksDone || !day.output.trim()} onClick={() => { completeDay(challenge.id, stage.key, day.completedTaskIds, day.output); if (stage.day < 7) setViewDay(stage.day + 1); }} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-35">{stage.day === 7 ? "Complete challenge" : "Done for today"} <ArrowRight className="h-4 w-4" /></button> : <p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.12em] text-muted">{day.completedAt ? "Stage completed" : `Continue ${currentStage.title} first`}</p>}</div></main>
      <aside className="order-3 min-w-0 space-y-4"><div className="rounded-2xl border border-ink bg-paper p-4"><div className="flex items-center justify-between"><h3 className="text-xs font-bold uppercase tracking-[0.14em]">Build files</h3><button type="button" onClick={() => setShowArtifact((value) => !value)} aria-label="Add build artifact" className="flex h-8 w-8 items-center justify-center rounded-full border border-ink"><Plus className="h-4 w-4" /></button></div>{showArtifact && <div className="mt-3 space-y-2"><input value={artifactLabel} onChange={(e) => setArtifactLabel(e.target.value)} className={fieldClass} placeholder="Artifact name" /><input value={artifactUrl} onChange={(e) => setArtifactUrl(e.target.value)} className={fieldClass} placeholder="https://…" inputMode="url" /><button type="button" disabled={!artifactLabel.trim() || !artifactUrl.trim()} onClick={() => { addArtifact(challenge.id, { label: artifactLabel, url: artifactUrl, stage: currentStage.key }); setArtifactLabel(""); setArtifactUrl(""); setShowArtifact(false); }} className="w-full rounded-full bg-ink py-2 text-xs font-bold text-white disabled:opacity-30">Save link</button></div>}<div className="mt-3 space-y-2">{challenge.artifacts.length === 0 ? <p className="text-xs leading-5 text-muted">Links and proof will accumulate here.</p> : challenge.artifacts.map((artifact) => <a key={artifact.id} href={artifact.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-ink/20 p-2 text-xs font-semibold"><span className="truncate">{artifact.label}</span><ExternalLink className="h-3.5 w-3.5 shrink-0" /></a>)}</div></div><div className="rounded-2xl border border-ink bg-paper p-4"><h3 className="text-xs font-bold uppercase tracking-[0.14em]">Finish line</h3><p className="mt-2 text-sm leading-5">{challenge.brief.daySevenFinishLine}</p></div>{stage.key === "brand" && <SupportCard title="Need creative support?" text="ImpactFools services can help with identity or launch assets, but support is optional—the challenge remains completable without purchase." />}{stage.key === "put-it-out" && <SupportCard title="Need the skill first?" text="Use Academia only for a specific gap. Keep today focused on the smallest useful distribution setup." href="/academy" />}</aside>
    </div></div>;
}

function SupportCard({ title, text, href }: { title: string; text: string; href?: string }) { const body = <><p className="font-display text-xl font-semibold">{title}</p><p className="mt-2 text-xs leading-5 text-muted">{text}</p></>; return href ? <Link href={href} className="block rounded-2xl border border-ink bg-pink-dim p-4">{body}</Link> : <div className="rounded-2xl border border-ink bg-pink-dim p-4">{body}</div>; }

function BuildReport({ challenge, onExit }: { challenge: BuildChallenge; onExit: () => void }) {
  const stages = getStageDefinitions(challenge.brief);
  const report = [`BUILD REPORT`, `PROJECT: ${challenge.brief.projectName}`, `ORIGINAL IDEA: ${challenge.brief.description}`, `TARGET CUSTOMER: ${challenge.brief.targetCustomer}`, `OFFER: ${challenge.brief.offer || challenge.brief.outcome || "Not recorded"}`, "", ...stages.map((stage) => `${stage.day}. ${stage.title}: ${challenge.days[stage.key]?.output ?? ""}`), "", `WHAT WAS SHIPPED: ${challenge.days.ship?.output ?? ""}`, "NEXT ACTIONS: Improve the proof, follow up with real users, and grow what works.", "", "ARTIFACTS:", ...challenge.artifacts.map((item) => `${item.label}: ${item.url}`)].join("\n");
  const [copied, setCopied] = useState(false);
  return <div className="mx-auto max-w-5xl px-4 py-10 md:px-6"><button type="button" onClick={onExit} className="text-xs font-bold uppercase tracking-[0.14em] text-muted">← Challenge home</button><div className="mt-7 rounded-3xl border-2 border-ink bg-pink-dim p-6 shadow-[8px_8px_0_var(--im-blue)] md:p-10"><Rocket className="h-8 w-8 text-pink" /><p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em]">Challenge complete</p><h1 className="mt-2 font-display text-6xl font-semibold uppercase">You built it.</h1><p className="mt-3 max-w-xl text-sm leading-6">The proof is not the checklist. It is the thing you shipped: {challenge.days.ship?.output}</p></div><div className="mt-8 rounded-3xl border border-ink bg-paper p-5 md:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue">Build report</p><h2 className="mt-1 font-display text-4xl font-semibold">{challenge.brief.projectName}</h2></div><button type="button" onClick={async () => { await navigator.clipboard.writeText(report); setCopied(true); }} className="inline-flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-xs font-bold"><ClipboardCheck className="h-4 w-4" /> {copied ? "Copied" : "Copy report"}</button></div><dl className="mt-7 grid gap-5 md:grid-cols-2"><ReportItem label="Original idea" value={challenge.brief.description} /><ReportItem label="Target customer" value={challenge.brief.targetCustomer} /><ReportItem label="What you built" value={challenge.days.build?.output ?? challenge.brief.daySevenFinishLine} /><ReportItem label="What was shipped" value={challenge.days.ship?.output ?? ""} /></dl><div className="mt-7"><p className="text-xs font-bold uppercase tracking-[0.14em]">Build record</p><div className="mt-3 space-y-3">{stages.map((stage) => <div key={stage.key} className="rounded-xl border border-ink/20 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Day {stage.day} · {stage.title}</p><p className="mt-1 text-sm">{challenge.days[stage.key]?.output}</p></div>)}</div></div>{challenge.artifacts.length > 0 && <div className="mt-7"><p className="text-xs font-bold uppercase tracking-[0.14em]">Links and artifacts</p><div className="mt-3 flex flex-wrap gap-2">{challenge.artifacts.map((item) => <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-ink px-3 py-2 text-xs font-bold"><Link2 className="h-3.5 w-3.5" /> {item.label}</a>)}</div></div>}</div><div className="mt-8 grid gap-3 sm:grid-cols-3"><ActionCard icon={Rocket} title="Grow it" text="Double down on the proof that worked." /><ActionCard icon={FileText} title="Improve it" text="Turn feedback into the next version." /><button type="button" onClick={async () => { await navigator.clipboard.writeText(report); setCopied(true); }} className="rounded-2xl border border-ink bg-blue-dim p-5 text-left"><ArrowRight className="h-5 w-5" /><strong className="mt-4 block">Send next tasks to FlowAssist</strong><span className="mt-1 block text-xs leading-5 text-muted">Copies an honest handoff report. No live connection is currently configured.</span></button></div></div>;
}

function ReportItem({ label, value }: { label: string; value: string }) { return <div><dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{label}</dt><dd className="mt-1 text-sm leading-6">{value}</dd></div>; }
function ActionCard({ icon: Icon, title, text }: { icon: typeof Rocket; title: string; text: string }) { return <div className="rounded-2xl border border-ink bg-paper p-5"><Icon className="h-5 w-5" /><strong className="mt-4 block">{title}</strong><span className="mt-1 block text-xs leading-5 text-muted">{text}</span></div>; }


