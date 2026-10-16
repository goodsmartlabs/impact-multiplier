import { aiAutomation } from "./skills/ai-automation";
import { dataAnalytics } from "./skills/data-analytics";
import { digitalMarketing } from "./skills/digital-marketing";
import { financialAnalysis } from "./skills/financial-analysis";
import { processImprovement } from "./skills/process-improvement";
import { webDesign } from "./skills/web-design";
import type { SkillChallenge, SkillId } from "./types";

export const SKILL_CHALLENGES: SkillChallenge[] = [
  aiAutomation,
  dataAnalytics,
  digitalMarketing,
  webDesign,
  processImprovement,
  financialAnalysis,
];

export const SKILL_IDS = SKILL_CHALLENGES.map((challenge) => challenge.id);

export function getSkillChallenge(id: string): SkillChallenge | undefined {
  return SKILL_CHALLENGES.find((challenge) => challenge.id === id);
}

export function isSkillId(id: string): id is SkillId {
  return SKILL_IDS.includes(id as SkillId);
}

export const CHALLENGE_BASE_PATH = "/academy/challenge";

export function challengePath(id: SkillId, day?: number) {
  return day ? `${CHALLENGE_BASE_PATH}/${id}/day/${day}` : `${CHALLENGE_BASE_PATH}/${id}`;
}
