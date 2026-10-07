import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Capacity Guide — ImpactFools Academia",
  description: "Discover what you can build from what is already in your hands.",
};

export default function CapacityGuideLayout({ children }: { children: ReactNode }) {
  return children;
}
