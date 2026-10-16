import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChallengeHub } from "@/components/skill-challenge/challenge-hub";
import { getSkillChallenge, isSkillId, SKILL_IDS } from "@/lib/skill-challenge";

export function generateStaticParams() {
  return SKILL_IDS.map((skill) => ({ skill }));
}

export async function generateMetadata({ params }: { params: Promise<{ skill: string }> }): Promise<Metadata> {
  const challenge = getSkillChallenge((await params).skill);
  return challenge
    ? { title: `${challenge.name} — 7-Day Skill Challenge`, description: `${challenge.tagline} Build: ${challenge.project.title}.` }
    : {};
}

export default async function SkillChallengeHubPage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill } = await params;
  if (!isSkillId(skill)) notFound();
  return <ChallengeHub skillId={skill} />;
}
