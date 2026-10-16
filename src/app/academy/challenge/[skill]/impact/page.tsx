import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ImpactView } from "@/components/skill-challenge/impact-view";
import { getSkillChallenge, isSkillId, SKILL_IDS } from "@/lib/skill-challenge";

type Params = Promise<{ skill: string }>;

export function generateStaticParams() {
  return SKILL_IDS.map((skill) => ({ skill }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const challenge = getSkillChallenge((await params).skill);
  return challenge ? { title: `Impact Check — ${challenge.name} Challenge`, description: "What can you do now that you couldn’t do before? Record your proof and turn it into a service." } : {};
}

export default async function SkillChallengeImpactPage({ params }: { params: Params }) {
  const { skill } = await params;
  if (!isSkillId(skill)) notFound();
  return <ImpactView skillId={skill} />;
}
