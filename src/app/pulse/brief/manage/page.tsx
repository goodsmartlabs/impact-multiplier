import type { Metadata } from "next";
import { Suspense } from "react";
import { ManageSubscription } from "@/components/pulse/manage-subscription";

export const metadata: Metadata = {
  title: "Manage your Impact Brief subscription",
  robots: { index: false },
};

export default function ManageSubscriptionPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">Your Impact Brief</h1>
      <Suspense fallback={<div className="mt-6 h-40 animate-pulse rounded-3xl bg-ink/5" aria-busy="true" />}>
        <ManageSubscription />
      </Suspense>
    </div>
  );
}
