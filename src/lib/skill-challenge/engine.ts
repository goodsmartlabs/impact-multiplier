import type {
  ChallengeDay,
  ChallengeProgress,
  ChallengeStatus,
  DayNumber,
  DayProgress,
  SkillChallenge,
} from "./types";

export const DAY_NUMBERS: DayNumber[] = [1, 2, 3, 4, 5, 6, 7];

export const EMPTY_DAY: DayProgress = { checked: [], response: "", evidenceUrl: "" };

export function isDayNumber(value: number): value is DayNumber {
  return Number.isInteger(value) && value >= 1 && value <= 7;
}

/** Only http(s) links count as evidence. */
export function isValidUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function dayProgress(progress: ChallengeProgress | undefined, day: DayNumber): DayProgress {
  return progress?.days[day] ?? EMPTY_DAY;
}

export function isDayComplete(progress: ChallengeProgress | undefined, day: DayNumber): boolean {
  return Boolean(progress?.days[day]?.completedAt);
}

/** A day can be worked on once every earlier day is complete. Reading is always allowed. */
export function isDayUnlocked(progress: ChallengeProgress | undefined, day: DayNumber): boolean {
  if (!progress) return false;
  return DAY_NUMBERS.filter((n) => n < day).every((n) => isDayComplete(progress, n));
}

export interface DayRequirementCheck {
  ready: boolean;
  missing: string[];
}

/**
 * Completion is earned, not clicked: every checklist item, a written
 * deliverable of real length, and a working link where proof is required.
 */
export function checkDayRequirements(day: ChallengeDay, progress: ChallengeProgress | undefined): DayRequirementCheck {
  const current = dayProgress(progress, day.day);
  const missing: string[] = [];

  if (!progress) missing.push("Start the challenge first.");
  else if (!isDayUnlocked(progress, day.day)) missing.push(`Complete Day ${String(day.day - 1).padStart(2, "0")} first.`);

  const unchecked = day.checklist.filter((item) => !current.checked.includes(item.id));
  if (unchecked.length) missing.push(`Tick off ${unchecked.length} checklist ${unchecked.length === 1 ? "item" : "items"}.`);

  const length = current.response.trim().length;
  if (length < day.deliverable.minLength) {
    missing.push(`Write your deliverable (${length}/${day.deliverable.minLength} characters minimum).`);
  }

  const hasUrl = current.evidenceUrl.trim().length > 0;
  if (day.deliverable.evidence === "required" && !isValidUrl(current.evidenceUrl)) {
    missing.push("Add a working link (https://…) to your project evidence.");
  } else if (day.deliverable.evidence !== "required" && hasUrl && !isValidUrl(current.evidenceUrl)) {
    missing.push("Fix the evidence link — it must start with https://");
  }

  return { ready: missing.length === 0, missing };
}

export function completedDayCount(progress: ChallengeProgress | undefined): number {
  return DAY_NUMBERS.filter((day) => isDayComplete(progress, day)).length;
}

export function progressPercent(progress: ChallengeProgress | undefined): number {
  return Math.round((completedDayCount(progress) / DAY_NUMBERS.length) * 100);
}

/** The first day that is not complete yet (or 7 when everything is done). */
export function currentDay(progress: ChallengeProgress | undefined): DayNumber {
  return DAY_NUMBERS.find((day) => !isDayComplete(progress, day)) ?? 7;
}

export function evidenceLinks(challenge: SkillChallenge, progress: ChallengeProgress | undefined) {
  return challenge.days
    .map((day) => ({ day: day.day, title: day.title, url: dayProgress(progress, day.day).evidenceUrl.trim() }))
    .filter((entry) => isValidUrl(entry.url));
}

export function hasRecordedProof(progress: ChallengeProgress | undefined): boolean {
  return Boolean(progress?.impactCheck && isValidUrl(progress.impactCheck.evidenceUrl));
}

export function challengeStatus(progress: ChallengeProgress | undefined): ChallengeStatus {
  if (!progress) return "not_started";
  if (completedDayCount(progress) < DAY_NUMBERS.length) return "in_progress";
  return hasRecordedProof(progress) ? "proof_recorded" : "days_complete";
}

export const STATUS_LABELS: Record<ChallengeStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  days_complete: "7 days done — proof not recorded",
  proof_recorded: "Proof recorded (self-reported)",
};

export interface ServiceOfferInput {
  problem: string;
  who: string;
  service: string;
  deliverable: string;
  demonstrate: string;
  firstStep: string;
}

/**
 * Drafts a plain-language offer from the learner's own answers and project.
 * Deliberately says nothing about earnings: pricing and demand are untested.
 */
export function draftServiceOffer(challenge: SkillChallenge, input: ServiceOfferInput, projectLink?: string): string {
  const clean = (value: string, fallback: string) => value.trim().replace(/\s+/g, " ") || fallback;
  const service = clean(input.service, challenge.exampleServices[0]);
  const lines = [
    `${service}`,
    "",
    `For: ${clean(input.who, "[who has this problem]")}`,
    `Problem I help with: ${clean(input.problem, "[the problem you solve]")}`,
    `What you receive: ${clean(input.deliverable, "[the deliverable]")}`,
    "",
    `Why I can do this: I completed the ImpactFools 7-Day ${challenge.name} Challenge and built "${challenge.project.title}". ${clean(input.demonstrate, "")}`.trim(),
  ];
  if (projectLink && isValidUrl(projectLink)) lines.push(`See the work: ${projectLink.trim()}`);
  lines.push(
    "",
    `Next step: ${clean(input.firstStep, "[your first step toward a customer]")}`,
    "",
    "Note: this is a starting offer. Scope, pricing and demand still need to be tested with real customers."
  );
  return lines.join("\n");
}
