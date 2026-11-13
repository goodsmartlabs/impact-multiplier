import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyPanel } from "@/components/newsletter/verify-panel";

export const metadata: Metadata = { title: "Confirm your subscription | ImpactFools", robots: { index: false } };

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">Confirm your subscription</h1>
      <Suspense fallback={<div className="mt-6 h-40 animate-pulse rounded-3xl bg-ink/5" aria-busy="true" />}><VerifyPanel /></Suspense>
    </div>
  );
}
