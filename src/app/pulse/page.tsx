import type { Metadata } from "next";
import { PulseIndex } from "@/components/pulse/pulse-index";
import { getPublicUpdates } from "@/lib/server/pulse/repository";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Impact Pulse — What’s happening. What’s valuable. What’s next for you.",
  description: "Trends, skills in demand, jobs and gigs, courses, money moves and opportunities — every update explains what it means and what to do next.",
  alternates: { canonical: "/pulse" },
};

export default async function PulsePage() {
  const updates = await getPublicUpdates();
  return <PulseIndex updates={updates} category="all" />;
}
