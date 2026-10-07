import type { Metadata } from "next";
import { CapacityGuideWizard } from "@/components/capacity-guide/capacity-guide-wizard";

export const metadata: Metadata = {
  title: "Start Your Capacity Guide — ImpactFools",
  description: "Move from current capacity to a 30-day build, proof project and value test.",
};

export default function StartCapacityGuidePage() {
  return <CapacityGuideWizard />;
}
