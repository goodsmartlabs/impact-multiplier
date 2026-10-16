import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DayView } from "@/components/skill-challenge/day-view";
import { getSkillChallenge, isSkillId, SKILL_IDS } from "@/lib/skill-challenge";
import { DAY_NUMBERS, isDayNumber } from "@/lib/skill-challenge/engine";

type Params = Promise<{ skill: string; day: string }>;

export function generateStaticParams() {
  return SKILL_IDS.flatMap((skill) => DAY_NUMBERS.map((day) => ({ skill, day: String(day) })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { skill, day } = await params;
  const challenge = getSkillChallenge(skill);
  const entry = challenge?.days.find((item) => String(item.day) === day);
  return challenge && entry ? { title: `Day ${day}: ${entry.title} — ${challenge.name} Challenge`, description: entry.focus } : {};
}

export default async function SkillChallengeDayPage({ params }: { params: Params }) {
  const { skill, day } = await params;
  const dayNumber = Number(day);
  if (!isSkillId(skill) || !isDayNumber(dayNumber)) notFound();
  return <DayView skillId={skill} dayNumber={dayNumber} />;
}
