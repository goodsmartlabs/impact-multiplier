import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Top3Wizard } from "@/components/newsletter/top3-wizard";

export const metadata: Metadata = {
  title: "FIND MY TOP 3 — Your weekend projects | ImpactFools",
  description: "Five quick questions. Three specific weekend projects matched to your goals, time and resources — each with a Friday-to-Sunday plan and one clear finish line.",
  alternates: { canonical: "/newsletter/top-3" },
};

export default function FindMyTop3Page() {
  return (
    <div className="pb-20">
      <section className="border-b border-ink bg-blue-dim px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Friday: Your Weekend Top 3 🎯</p>
          <h1 className="mt-2 font-display text-5xl font-semibold uppercase leading-none md:text-7xl">Find my Top 3</h1>
          <p className="mt-3 text-lg font-semibold">Stop collecting opportunities. Start building something.</p>
          <p className="mt-2 max-w-2xl text-sm">No sign-up needed. Your answers stay in this browser. <Link href="/newsletter#subscribe" className="font-semibold underline">Subscribe</Link> to get a fresh prompt every Friday.</p>
        </div>
      </section>
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-[2rem] bg-ink/5" aria-busy="true" />}>
          <Top3Wizard />
        </Suspense>
      </div>
    </div>
  );
}
