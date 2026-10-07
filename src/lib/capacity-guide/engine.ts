import { CAPACITY_SKILL_BY_ID, CAPACITY_SKILLS } from "./data";
import type { CapacityGuideAnswers, CapacityProfile, CapacityScores, OpportunityDirection } from "./types";

export const EMPTY_SCORES: CapacityScores = {
  interest: 3,
  existingAbility: 3,
  demand: 3,
  incomePotential: 3,
  buildability: 3,
};

export function scoreSkill(scores?: CapacityScores) {
  const value = scores ?? EMPTY_SCORES;
  return (value.interest + value.existingAbility + value.demand + value.incomePotential + value.buildability) / 5;
}

export function rankSkills(ids: string[], scores: Record<string, CapacityScores>) {
  return [...ids].sort((a, b) => scoreSkill(scores[b]) - scoreSkill(scores[a]));
}

function cleanList(value: string, limit = 6) {
  return value
    .split(/\n|,|;|•/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

export function suggestStack(answers: CapacityGuideAnswers) {
  if (answers.selectedStack.length) return answers.selectedStack;
  const ranked = rankSkills(answers.potential.selectedSkills, answers.scores);
  if (!ranked.length) return [];
  const primary = CAPACITY_SKILL_BY_ID.get(ranked[0]);
  const partner = ranked.slice(1).find((id) => primary?.stackPartners.includes(id)) ?? ranked[1];
  return [ranked[0], partner].filter((value): value is string => Boolean(value));
}

export function opportunitiesForStack(stack: string[]): OpportunityDirection[] {
  const seen = new Set<string>();
  return stack
    .flatMap((id) => CAPACITY_SKILL_BY_ID.get(id)?.opportunities ?? [])
    .filter((item) => {
      if (seen.has(item.title)) return false;
      seen.add(item.title);
      return true;
    })
    .slice(0, 6);
}

export function proofIdeasForStack(stack: string[]) {
  return stack.flatMap((id) => CAPACITY_SKILL_BY_ID.get(id)?.proofIdeas ?? []).slice(0, 6);
}

export function buildCapacityProfile(answers: CapacityGuideAnswers): CapacityProfile {
  const ranked = rankSkills(answers.potential.selectedSkills, answers.scores);
  const stack = suggestStack(answers);
  const courses = [...new Set(stack.flatMap((id) => CAPACITY_SKILL_BY_ID.get(id)?.courseSlugs ?? []))];

  return {
    generatedAt: new Date().toISOString(),
    existingCapacity: {
      know: cleanList([answers.current.knowHow, answers.current.tools].filter(Boolean).join(", ")),
      canDo: cleanList([answers.current.askedForHelp, answers.current.feelsEasy].filter(Boolean).join(", ")),
      experience: cleanList([answers.current.repeatedExperience, answers.current.jobLearning].filter(Boolean).join(", ")),
      canCreate: cleanList(answers.current.created),
    },
    strongestSkills: ranked.slice(0, 5),
    recommendedStack: stack,
    opportunities: opportunitiesForStack(stack),
    build: answers.build,
    proof: answers.proof,
    valueTest: answers.valueTest,
    recommendedCourseSlugs: courses,
  };
}

export function skillName(id: string) {
  return CAPACITY_SKILL_BY_ID.get(id)?.name ?? id;
}

export function isKnownSkill(id: string) {
  return CAPACITY_SKILLS.some((skill) => skill.id === id);
}
