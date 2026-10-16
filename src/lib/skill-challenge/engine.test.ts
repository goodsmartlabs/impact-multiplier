import { describe, expect, it } from "vitest";
import { COURSES } from "@/lib/data/courses";
import { SKILL_CHALLENGES, getSkillChallenge } from "./index";
import { getResource } from "./resources";
import {
  challengeStatus,
  checkDayRequirements,
  currentDay,
  draftServiceOffer,
  isDayUnlocked,
  isValidUrl,
  progressPercent,
} from "./engine";
import type { ChallengeProgress, DayNumber, SkillChallenge } from "./types";

const fresh = (skillId = SKILL_CHALLENGES[0].id): ChallengeProgress => ({
  skillId,
  startedAt: "2026-10-16T00:00:00.000Z",
  updatedAt: "2026-10-16T00:00:00.000Z",
  days: {},
  notes: "",
  savedResources: [],
});

/** Fills a day's requirements exactly as a learner would. */
function satisfy(challenge: SkillChallenge, progress: ChallengeProgress, day: DayNumber, complete = true): ChallengeProgress {
  const def = challenge.days[day - 1];
  return {
    ...progress,
    days: {
      ...progress.days,
      [day]: {
        checked: def.checklist.map((item) => item.id),
        response: "x".repeat(def.deliverable.minLength),
        evidenceUrl: def.deliverable.evidence === "required" ? "https://example.com/proof" : "",
        completedAt: complete ? "2026-10-16T00:00:00.000Z" : undefined,
      },
    },
  };
}

describe("challenge content", () => {
  it("has six skills, each with seven complete, distinct days", () => {
    expect(SKILL_CHALLENGES).toHaveLength(6);
    for (const challenge of SKILL_CHALLENGES) {
      expect(challenge.days.map((d) => d.day)).toEqual([1, 2, 3, 4, 5, 6, 7]);
      expect(challenge.days.map((d) => d.key)).toEqual(["discover", "learn", "practice", "identify", "build", "prove", "multiply"]);
      for (const d of challenge.days) {
        expect(d.lesson.length).toBeGreaterThanOrEqual(2);
        expect(d.steps.length).toBeGreaterThanOrEqual(3);
        expect(d.checklist.length).toBeGreaterThanOrEqual(3);
        expect(d.deliverable.minLength).toBeGreaterThanOrEqual(100);
      }
      // The build, prove and multiply days must require evidence — completion is earned.
      expect(challenge.days.slice(4).every((d) => d.deliverable.evidence === "required")).toBe(true);
    }
  });

  it("only references resources and Academy courses that exist", () => {
    const slugs = new Set(COURSES.map((course) => course.slug));
    for (const challenge of SKILL_CHALLENGES) {
      for (const slug of challenge.academyCourses) expect(slugs.has(slug), `${challenge.id}: ${slug}`).toBe(true);
      for (const d of challenge.days) for (const id of d.resourceIds) expect(getResource(id), `${challenge.id} day ${d.day}: ${id}`).toBeDefined();
    }
  });

  it("does not repeat lesson text between skills", () => {
    const seen = new Set<string>();
    for (const challenge of SKILL_CHALLENGES) for (const d of challenge.days) for (const block of d.lesson) {
      expect(seen.has(block.body)).toBe(false);
      seen.add(block.body);
    }
  });
});

describe("day requirements", () => {
  const challenge = getSkillChallenge("data-analytics")!;

  it("blocks completion when nothing is done", () => {
    const result = checkDayRequirements(challenge.days[0], fresh(challenge.id));
    expect(result.ready).toBe(false);
    expect(result.missing.length).toBeGreaterThanOrEqual(2);
  });

  it("requires earlier days before a later day can be completed", () => {
    const progress = satisfy(challenge, fresh(challenge.id), 2, false);
    expect(isDayUnlocked(progress, 2)).toBe(false);
    expect(checkDayRequirements(challenge.days[1], progress).ready).toBe(false);
  });

  it("requires a valid link on evidence days", () => {
    let progress = fresh(challenge.id);
    for (const n of [1, 2, 3, 4] as DayNumber[]) progress = satisfy(challenge, progress, n);
    progress = satisfy(challenge, progress, 5, false);
    expect(checkDayRequirements(challenge.days[4], progress).ready).toBe(true);
    progress.days[5] = { ...progress.days[5]!, evidenceUrl: "my dashboard" };
    expect(checkDayRequirements(challenge.days[4], progress).ready).toBe(false);
  });

  it("only reports proof once the Impact Check has a real link", () => {
    let progress = fresh(challenge.id);
    for (const n of [1, 2, 3, 4, 5, 6, 7] as DayNumber[]) progress = satisfy(challenge, progress, n);
    expect(progressPercent(progress)).toBe(100);
    expect(currentDay(progress)).toBe(7);
    expect(challengeStatus(progress)).toBe("days_complete");
    progress.impactCheck = { canDoNow: "", skillLearned: "", projectCompleted: "", problemAddressed: "", evidenceUrl: "https://example.com/case-study", potentialService: "", nextAction: "", recordedAt: "" };
    expect(challengeStatus(progress)).toBe("proof_recorded");
  });
});

describe("helpers", () => {
  it("validates URLs strictly", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("example.com")).toBe(false);
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
    expect(isValidUrl("https://localhost")).toBe(false);
  });

  it("drafts an offer from the learner's answers without income promises", () => {
    const challenge = getSkillChallenge("ai-automation")!;
    const text = draftServiceOffer(challenge, { problem: "Lost enquiries", who: "Florists", service: "Enquiry follow-up setup", deliverable: "A working workflow", demonstrate: "", firstStep: "Message two florists" }, "https://example.com/demo");
    expect(text).toContain("Enquiry follow-up setup");
    expect(text).toContain("https://example.com/demo");
    expect(text).toMatch(/pricing and demand still need to be tested/i);
    expect(text).not.toMatch(/guarantee/i);
  });
});
