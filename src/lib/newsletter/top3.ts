import { getProject, WEEKEND_PROJECTS, type PlanStep, type WeekendProject } from "./projects";
import { resolveResources } from "./resources";
import { GOALS, LEVELS, RESOURCES_HAVE, TIMES, labelOf, type Top3Answers, type TimeId } from "./top3-questions";
import type { ResourceLink } from "./types";

export interface DayPlan {
  day: "Friday" | "Saturday" | "Sunday";
  timebox: string;
  steps: string[];
}

export interface Top3Recommendation {
  projectId: string;
  rank: number;
  title: string;
  summary: string;
  why: string[];
  gain: string;
  plan: DayPlan[];
  startHere: ResourceLink[];
  success: string;
  score: number;
}

const TIME_ORDER: TimeId[] = ["t1", "t2", "t3", "t4"];
const TIMEBOXES: Record<TimeId, [string, string, string]> = {
  t1: ["20 min", "45 min", "30 min"],
  t2: ["45 min", "2 hours", "1½ hours"],
  t3: ["1 hour", "4 hours", "3 hours"],
  t4: ["2 hours", "5 hours", "4 hours"],
};
const LEVEL_ORDER = LEVELS.map((level) => level.id);

function hasNeeds(project: WeekendProject, answers: Top3Answers) {
  const have = new Set(answers.have);
  return project.needs.every((need) => {
    if (need === "device") return have.has("laptop") || have.has("smartphone");
    // Internet is implied by someone using this site, but respect an explicit list.
    if (need === "internet") return have.has("internet") || have.has("laptop") || have.has("smartphone");
    return have.has(need);
  });
}

/** Score a project for a set of answers. Returns null if it isn't feasible. */
export function scoreProject(project: WeekendProject, answers: Top3Answers): { score: number; reasons: string[] } | null {
  if (TIME_ORDER.indexOf(project.minTime) > TIME_ORDER.indexOf(answers.time)) return null;
  if (!hasNeeds(project, answers)) return null;

  let score = 0;
  const reasons: string[] = [];
  const matchedGoals = answers.goals.filter((goal) => project.goals.includes(goal));
  if (matchedGoals.length) {
    score += matchedGoals.length * 3;
    reasons.push(`It moves you toward ${matchedGoals.map((goal) => labelOf(GOALS, goal).toLowerCase()).join(" and ")}.`);
  } else if (answers.goals.includes("explore")) {
    score += 1;
  } else {
    return null; // Never recommend something unrelated to what the person asked for.
  }

  const levelIndex = LEVEL_ORDER.indexOf(answers.level);
  if (project.levels.includes(answers.level)) {
    score += 2;
    reasons.push(`It suits where you are: “${labelOf(LEVELS, answers.level).toLowerCase()}”.`);
  } else if (project.levels.some((level) => Math.abs(LEVEL_ORDER.indexOf(level) - levelIndex) === 1)) {
    score += 0;
  } else {
    score -= 3;
  }

  if (project.success.includes(answers.success)) {
    score += 3;
    reasons.push("Its finish line is the kind of success you said matters to you.");
  }

  const boosts = (project.boosts ?? []).filter((boost) => answers.have.includes(boost));
  if (boosts.length) {
    score += boosts.length;
    reasons.push(`It uses what you already have: ${boosts.map((boost) => labelOf(RESOURCES_HAVE, boost).toLowerCase()).join(", ")}.`);
  }

  const onlyPhone = answers.have.includes("smartphone") && !answers.have.includes("laptop");
  reasons.push(
    `It fits in ${labelOf(TIMES, answers.time)} this weekend${onlyPhone ? " and can be done from a smartphone" : ""}.`,
  );
  return { score, reasons };
}

export function buildPlan(project: WeekendProject, time: TimeId): DayPlan[] {
  const tier = TIME_ORDER.indexOf(time) + 1; // t1 → 1 … t4 → 4
  const keep = (steps: PlanStep[]) => steps.filter((step) => (step.tier ?? 1) <= tier).map((step) => step.text);
  const [fri, sat, sun] = TIMEBOXES[time];
  return [
    { day: "Friday", timebox: fri, steps: keep(project.plan.friday) },
    { day: "Saturday", timebox: sat, steps: keep(project.plan.saturday) },
    { day: "Sunday", timebox: sun, steps: keep(project.plan.sunday) },
  ];
}

export function toRecommendation(project: WeekendProject, answers: Top3Answers, rank: number, score: number, why: string[]): Top3Recommendation {
  return {
    projectId: project.id,
    rank,
    title: project.title,
    summary: project.summary,
    why,
    gain: project.gain,
    plan: buildPlan(project, answers.time),
    startHere: resolveResources(project.startHere),
    success: project.deliverable,
    score,
  };
}

/**
 * The Top 3 engine: feasible projects only (time, equipment, relevance),
 * ranked by goal / level / success fit, one per area so the three options are
 * genuinely different, and never something the person already completed.
 * Paid resources are labelled, and never affect ranking.
 */
export function recommendTop3(answers: Top3Answers, options: { exclude?: string[] } = {}): Top3Recommendation[] {
  const exclude = new Set(options.exclude ?? []);
  const scored = WEEKEND_PROJECTS.filter((project) => !exclude.has(project.id))
    .map((project, index) => ({ project, index, result: scoreProject(project, answers) }))
    .filter((entry): entry is { project: WeekendProject; index: number; result: { score: number; reasons: string[] } } => entry.result !== null)
    .sort((a, b) => b.result.score - a.result.score || a.index - b.index);

  const picked: typeof scored = [];
  const areas = new Set<string>();
  for (const entry of scored) {
    if (picked.length === 3) break;
    if (areas.has(entry.project.area)) continue;
    areas.add(entry.project.area);
    picked.push(entry);
  }
  // If distinct areas ran out, fill with the next best.
  for (const entry of scored) {
    if (picked.length === 3) break;
    if (!picked.includes(entry)) picked.push(entry);
  }
  return picked.map((entry, index) => toRecommendation(entry.project, answers, index + 1, entry.result.score, entry.result.reasons));
}

export function describeAnswers(answers: Top3Answers) {
  return {
    goals: answers.goals.map((goal) => labelOf(GOALS, goal)),
    level: labelOf(LEVELS, answers.level),
    time: labelOf(TIMES, answers.time),
    have: answers.have.map((have) => labelOf(RESOURCES_HAVE, have)),
  };
}

export { getProject };
