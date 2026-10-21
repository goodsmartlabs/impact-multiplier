import type { PulseCategory } from "./types";

/**
 * Research agents that may submit updates through POST /api/pulse/ingest.
 *
 * This is a registry and contract only. No agent runs automatically yet:
 * each one must be built and given the ingest token. Every submission lands
 * as "pending_review" and is published only after an editor approves it.
 */
export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  categories: PulseCategory[];
}

export const PULSE_AGENTS: AgentDefinition[] = [
  { id: "trend-scout", name: "Trend Scout", role: "Emerging trends and industry developments", categories: ["trending", "industry", "ai"] },
  { id: "skill-scout", name: "Skill Scout", role: "In-demand skills and learning pathways", categories: ["skills"] },
  { id: "job-spy", name: "Job Spy", role: "Jobs, freelance work and internships", categories: ["jobs", "money"] },
  { id: "opportunity-scout", name: "Opportunity Scout", role: "Grants, scholarships, fellowships and competitions", categories: ["opportunities"] },
  { id: "course-scout", name: "Course Scout", role: "Courses and certifications", categories: ["learning"] },
  { id: "impact-editor", name: "Impact Editor", role: "Verification, summarisation, categorisation and prioritisation", categories: ["trending", "jobs", "skills", "learning", "money", "opportunities", "ai", "industry"] },
];

export function getAgent(id: string): AgentDefinition | undefined {
  return PULSE_AGENTS.find((agent) => agent.id === id);
}
