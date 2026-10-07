import { describe, expect, it } from "vitest";
import { buildCapacityProfile, opportunitiesForStack, rankSkills, suggestStack } from "./engine";
import type { CapacityGuideAnswers } from "./types";

const answers: CapacityGuideAnswers = {
  current: {
    knowHow: "Bookkeeping, financial reporting",
    askedForHelp: "Excel reports",
    feelsEasy: "Finding errors in numbers",
    repeatedExperience: "Month-end reporting",
    jobLearning: "Finance controls",
    tools: "Excel",
    created: "Reports, spreadsheets, dashboards",
  },
  potential: {
    curiousAbout: "Automation",
    postponedSkill: "Data analysis",
    energizingWork: "Solving finance problems",
    couldLearn: "AI workflows",
    futureStatement: "automate useful finance reports",
    selectedSkills: ["finance-accounting", "ai-automation", "data-analysis"],
  },
  scores: {
    "finance-accounting": { interest: 4, existingAbility: 5, demand: 4, incomePotential: 4, buildability: 5 },
    "ai-automation": { interest: 5, existingAbility: 2, demand: 5, incomePotential: 5, buildability: 4 },
    "data-analysis": { interest: 5, existingAbility: 3, demand: 4, incomePotential: 4, buildability: 4 },
  },
  selectedStack: [],
  selectedOpportunity: "Finance automation",
  build: { skill: "AI Automation", why: "It extends my finance work", beneficiary: "Finance teams", problem: "Manual reporting", learning: "Workflow design", deliverable: "Automated monthly dashboard" },
  proof: "Build one working workflow",
  valueTest: { people: "Three small businesses", offer: "Reporting prototype", problem: "Slow reporting", result: "Faster monthly review", firstTest: "Test with sample data" },
};

describe("Capacity Guide recommendation engine", () => {
  it("ranks skills by the five decision-support scores", () => {
    expect(rankSkills(answers.potential.selectedSkills, answers.scores)[0]).toBe("finance-accounting");
  });

  it("combines compatible directions into a capacity stack", () => {
    expect(suggestStack(answers)).toEqual(["finance-accounting", "ai-automation"]);
  });

  it("returns useful opportunity fields without salary or income promises", () => {
    const opportunities = opportunitiesForStack(["finance-accounting", "ai-automation"]);
    expect(opportunities.length).toBeGreaterThan(0);
    expect(opportunities[0]).toEqual(expect.objectContaining({ title: expect.any(String), audience: expect.any(String), problem: expect.any(String), capability: expect.any(String), proof: expect.any(String) }));
    expect(JSON.stringify(opportunities).toLowerCase()).not.toMatch(/guaranteed|salary/);
  });

  it("creates a profile from actual answers and known course slugs", () => {
    const profile = buildCapacityProfile(answers);
    expect(profile.existingCapacity.know).toContain("Bookkeeping");
    expect(profile.recommendedStack).toEqual(["finance-accounting", "ai-automation"]);
    expect(profile.build.deliverable).toBe("Automated monthly dashboard");
    expect(profile.recommendedCourseSlugs).toContain("ai-automation-foundations");
  });
});
