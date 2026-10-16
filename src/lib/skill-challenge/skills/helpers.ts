import type { ChallengeDay, ChecklistItem, DayKey, DayNumber } from "../types";

const KEYS: Record<DayNumber, DayKey> = {
  1: "discover",
  2: "learn",
  3: "practice",
  4: "identify",
  5: "build",
  6: "prove",
  7: "multiply",
};

export const DAY_TITLES: Record<DayKey, string> = {
  discover: "Discover",
  learn: "Learn",
  practice: "Practice",
  identify: "Identify a Problem",
  build: "Build",
  prove: "Prove",
  multiply: "Multiply",
};

/** Turns plain checklist labels into stable ids (day-number + index). */
function checklist(day: DayNumber, labels: string[]): ChecklistItem[] {
  return labels.map((label, index) => ({ id: `d${day}-${index + 1}`, label }));
}

type DayInput = Omit<ChallengeDay, "key" | "title" | "checklist"> & { checklist: string[] };

export function day(input: DayInput): ChallengeDay {
  const key = KEYS[input.day];
  return { ...input, key, title: DAY_TITLES[key], checklist: checklist(input.day, input.checklist) };
}
