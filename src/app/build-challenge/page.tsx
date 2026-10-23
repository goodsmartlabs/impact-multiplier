import type { Metadata } from "next";
import { BuildChallengeWorkspace } from "@/components/build-challenge/build-challenge-workspace";

export const metadata: Metadata = {
  title: "7 Days. One Build. — ImpactFools",
  description: "Choose one idea, build the minimum version, create proof and ship it in seven focused build stages.",
};

export default function BuildChallengePage() {
  return <BuildChallengeWorkspace />;
}


