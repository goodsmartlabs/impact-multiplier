import type { Metadata } from "next";
import { MyPlanDashboard } from "@/components/newsletter/my-plan-dashboard";

export const metadata: Metadata = {
  title: "My weekend plan | ImpactFools",
  description: "Your Top 3, your weekend plan, saved opportunities and progress.",
  robots: { index: false },
};

export default function MyPlanPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-ink bg-pink-dim px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">Your dashboard</p>
          <h1 className="mt-2 font-display text-5xl font-semibold uppercase leading-none md:text-7xl">My weekend plan</h1>
          <p className="mt-3 max-w-2xl text-sm">Pick one project, tick off each step, and finish with something you can show.</p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6"><MyPlanDashboard /></div>
    </div>
  );
}
