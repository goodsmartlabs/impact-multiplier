"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getCourseBySlug } from "@/lib/data/courses";

const LEVELS = ["Just starting", "Some experience", "Confident", "Not sure yet"] as const;

function InterestForm() {
  const params = useSearchParams();
  const slugs = useMemo(() => {
    const values = [params.get("course"), ...(params.get("courses")?.split(",") ?? [])];
    return [...new Set(values.filter((value): value is string => Boolean(value)))];
  }, [params]);
  const courses = slugs.map(getCourseBySlug).filter(Boolean);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/course-interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        contact: form.get("contact"),
        learningGoal: form.get("learningGoal"),
        skillLevel: form.get("skillLevel") || null,
        courseSlugs: slugs,
        website: form.get("website"),
        sourcePage: window.location.pathname + window.location.search,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setState("error");
      setMessage(result.error ?? "We could not save your interest. Please try again.");
      return;
    }
    setState("sent");
  }

  if (state === "sent") {
    return <div className="rounded-3xl border border-ink bg-blue-dim p-8 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-blue" /><h1 className="mt-4 font-display text-3xl font-semibold text-ink">Your interest is saved.</h1><p className="mt-2 text-muted">CraftFools Academia can now follow up about the right learning path for you.</p><Link href="/academy" className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Back to courses</Link></div>;
  }

  return (
    <>
      <div className="mb-7 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink">No payment required</p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-none text-ink">Talk to CraftFools Academia</h1>
        <p className="mt-3 text-muted">Tell us what you want to build. This is an interest conversation, not a checkout or a promise of enrolment.</p>
      </div>
      {courses.length > 0 && <div className="mb-6 rounded-2xl border border-line bg-blue-dim p-4"><p className="text-xs font-bold uppercase tracking-wide text-muted">Your learning interests</p><ul className="mt-2 space-y-1">{courses.map((course) => <li key={course!.slug} className="font-semibold text-ink">{course!.title}</li>)}</ul></div>}
      <form onSubmit={submit} className="space-y-5 rounded-3xl border border-ink bg-white p-6 shadow-[6px_6px_0_#111318]">
        <label className="block text-sm font-semibold text-ink">Name<input required name="name" autoComplete="name" className="mt-2 w-full rounded-xl border border-line px-4 py-3 font-normal outline-none focus:border-blue" /></label>
        <label className="block text-sm font-semibold text-ink">WhatsApp number or email<input required name="contact" autoComplete="email" placeholder="How should we reach you?" className="mt-2 w-full rounded-xl border border-line px-4 py-3 font-normal outline-none focus:border-blue" /></label>
        <label className="block text-sm font-semibold text-ink">What is your learning goal?<textarea required name="learningGoal" rows={5} className="mt-2 w-full resize-y rounded-xl border border-line px-4 py-3 font-normal outline-none focus:border-blue" /></label>
        <label className="block text-sm font-semibold text-ink">Current skill level <span className="font-normal text-muted">(optional)</span><select name="skillLevel" defaultValue="" className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-blue"><option value="">Select one</option>{LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}</select></label>
        <label className="hidden" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        {state === "error" && <p role="alert" className="rounded-xl bg-pink-dim p-3 text-sm font-medium text-pink">{message}</p>}
        <button disabled={state === "sending"} className="w-full rounded-full bg-pink px-5 py-3.5 text-sm font-bold text-white disabled:opacity-60">{state === "sending" ? "Saving…" : "Send My Interest"}</button>
        <p className="text-center text-xs text-muted">We use these details only to respond about your learning interests.</p>
      </form>
    </>
  );
}

export default function InterestPage() {
  return <main className="mx-auto max-w-2xl px-4 pb-24 pt-8 md:px-6 md:pt-12"><Suspense fallback={<div className="min-h-[50vh]" />}><InterestForm /></Suspense></main>;
}
