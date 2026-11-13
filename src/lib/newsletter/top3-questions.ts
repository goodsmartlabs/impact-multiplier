/** FIND MY TOP 3 — the five questions, in order. Ids are stable; labels are copy. */

export const GOALS = [
  { id: "earn", letter: "A", label: "Increase my earning potential" },
  { id: "skills", letter: "B", label: "Build valuable skills and capabilities" },
  { id: "business", letter: "C", label: "Start or grow a business" },
  { id: "brand", letter: "D", label: "Build my personal brand" },
  { id: "systems", letter: "E", label: "Build systems that improve my productivity" },
  { id: "wealth", letter: "F", label: "Improve my finances and build wealth" },
  { id: "career", letter: "G", label: "Find career or remote work opportunities" },
  { id: "products", letter: "H", label: "Create and sell digital products" },
  { id: "explore", letter: "I", label: "Explore opportunities because I’m not sure where to start" },
] as const;

export const LEVELS = [
  { id: "starting", label: "Just starting" },
  { id: "some", label: "Have some knowledge" },
  { id: "working", label: "Already working on something" },
  { id: "scaling", label: "Ready to monetize or scale" },
] as const;

export const TIMES = [
  { id: "t1", label: "1–2 hours", hours: 2 },
  { id: "t2", label: "3–5 hours", hours: 5 },
  { id: "t3", label: "6–10 hours", hours: 10 },
  { id: "t4", label: "10+ hours", hours: 14 },
] as const;

export const RESOURCES_HAVE = [
  { id: "laptop", label: "Laptop" },
  { id: "smartphone", label: "Smartphone" },
  { id: "internet", label: "Internet access" },
  { id: "skills", label: "Existing skills" },
  { id: "business", label: "Existing business" },
  { id: "money", label: "Some money to invest" },
  { id: "time", label: "Mainly my time and willingness to learn" },
] as const;

export const SUCCESS = [
  { id: "learn", label: "Learning something valuable" },
  { id: "create", label: "Creating something tangible" },
  { id: "sale", label: "Making my first sale" },
  { id: "improve", label: "Improving an existing system" },
  { id: "find", label: "Finding an opportunity" },
  { id: "plan", label: "Developing a plan" },
  { id: "proof", label: "Building proof of work" },
] as const;

export type GoalId = (typeof GOALS)[number]["id"];
export type LevelId = (typeof LEVELS)[number]["id"];
export type TimeId = (typeof TIMES)[number]["id"];
export type HaveId = (typeof RESOURCES_HAVE)[number]["id"];
export type SuccessId = (typeof SUCCESS)[number]["id"];

export interface Top3Answers {
  goals: GoalId[];
  level: LevelId;
  time: TimeId;
  have: HaveId[];
  success: SuccessId;
}

const ids = <T extends { id: string }>(list: readonly T[]) => list.map((item) => item.id) as T["id"][];
export const GOAL_IDS = ids(GOALS);
export const LEVEL_IDS = ids(LEVELS);
export const TIME_IDS = ids(TIMES);
export const HAVE_IDS = ids(RESOURCES_HAVE);
export const SUCCESS_IDS = ids(SUCCESS);

export const labelOf = <T extends { id: string; label: string }>(list: readonly T[], id: string) => list.find((item) => item.id === id)?.label ?? id;

/** Validate untrusted answers (query string, local storage). Returns null when incomplete. */
export function parseAnswers(raw: Partial<Record<keyof Top3Answers, unknown>>): Top3Answers | null {
  const list = (value: unknown) => (Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : []).map(String);
  const goals = [...new Set(list(raw.goals).filter((id): id is GoalId => (GOAL_IDS as string[]).includes(id)))];
  const have = [...new Set(list(raw.have).filter((id): id is HaveId => (HAVE_IDS as string[]).includes(id)))];
  const level = (LEVEL_IDS as string[]).includes(String(raw.level)) ? (raw.level as LevelId) : null;
  const time = (TIME_IDS as string[]).includes(String(raw.time)) ? (raw.time as TimeId) : null;
  const success = (SUCCESS_IDS as string[]).includes(String(raw.success)) ? (raw.success as SuccessId) : null;
  if (!goals.length || !level || !time || !have.length || !success) return null;
  return { goals, level, time, have, success };
}
