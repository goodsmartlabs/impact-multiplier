"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CapacityProfileView } from "@/components/capacity-guide/capacity-profile";
import { useCapacityGuideStore } from "@/lib/store/capacity-guide-store";
import { useHydrated } from "@/lib/use-hydrated";

export default function CapacityProfilePage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = useCapacityGuideStore((state) => state.profile);
  const reset = useCapacityGuideStore((state) => state.reset);

  if (!hydrated) return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-sm text-muted">Opening your saved Capacity Profile…</div>;
  if (!profile) return <div className="mx-auto max-w-2xl px-4 py-20 text-center"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue">Capacity Guide</p><h1 className="mt-3 font-display text-5xl font-semibold">Your profile is waiting to be built.</h1><p className="mt-4 text-muted">Complete the guide to generate your Capacity Profile.</p><Link href="/capacity-guide/start" className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white">Start the guide <ArrowRight className="h-4 w-4" /></Link></div>;

  return <div className="bg-paper px-4 py-10 sm:px-6 sm:py-16"><div className="mx-auto max-w-5xl"><CapacityProfileView profile={profile} onReset={() => { reset(); router.push("/capacity-guide/start"); }} /></div></div>;
}
