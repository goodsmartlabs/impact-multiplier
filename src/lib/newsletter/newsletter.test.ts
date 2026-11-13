import { describe, expect, it } from "vitest";
import { DEMO_UPDATES } from "@/lib/pulse/seed";
import type { PulseUpdate } from "@/lib/pulse/types";
import { collectLinks, composeWeekendTop3, composeWhatsHot, evaluateCandidate, EXAMPLE_PROFILES, validateIssueContent } from "./compose";
import { WEEKEND_PROJECTS } from "./projects";
import { resolveResource } from "./resources";
import { formatIssueDate, isCurrentIssue, issueSlug, jubaClock, latestIssueDate, publishInstant, scheduleTasks, upcomingIssueDate } from "./schedule";
import { buildPlan, recommendTop3 } from "./top3";
import { GOAL_IDS, HAVE_IDS, LEVEL_IDS, parseAnswers, SUCCESS_IDS, TIME_IDS, type Top3Answers } from "./top3-questions";

const NOW = new Date("2026-11-15T08:00:00Z"); // Sunday 10:00 in Juba

function verified(index: number, overrides: Partial<PulseUpdate> = {}): PulseUpdate {
  const base = DEMO_UPDATES[index % DEMO_UPDATES.length];
  return {
    ...base,
    id: `u${index}`,
    slug: `${base.slug}-${index}`,
    verification: "verified",
    status: "published",
    sourceUrl: `https://example.org/source/${index}`,
    lastVerifiedAt: "2026-11-12",
    publishedAt: "2026-11-11",
    deadline: undefined,
    expiresAt: undefined,
    ...overrides,
  };
}

describe("schedule (Africa/Juba, UTC+2)", () => {
  it("reads Juba wall-clock time regardless of the server zone", () => {
    expect(jubaClock(new Date("2026-11-16T05:00:00Z"))).toMatchObject({ date: "2026-11-16", weekday: 1, hour: 7 });
    expect(jubaClock(new Date("2026-11-15T22:30:00Z"))).toMatchObject({ date: "2026-11-16", weekday: 1, hour: 0 });
  });

  it("publishes at 07:00 Juba, which is 05:00 UTC", () => {
    expect(publishInstant("2026-11-16").toISOString()).toBe("2026-11-16T05:00:00.000Z");
  });

  it("prepares the day before and publishes on Monday and Friday from 07:00", () => {
    expect(scheduleTasks(new Date("2026-11-15T05:00:00Z"))).toEqual([{ action: "prepare", kind: "whats_hot", issueDate: "2026-11-16" }]);
    expect(scheduleTasks(new Date("2026-11-16T04:59:00Z"))).toEqual([]); // 06:59 Monday — too early
    expect(scheduleTasks(new Date("2026-11-16T05:00:00Z"))).toEqual([{ action: "publish", kind: "whats_hot", issueDate: "2026-11-16" }]);
    expect(scheduleTasks(new Date("2026-11-19T05:00:00Z"))).toEqual([{ action: "prepare", kind: "weekend_top3", issueDate: "2026-11-20" }]);
    expect(scheduleTasks(new Date("2026-11-20T05:10:00Z"))).toEqual([{ action: "publish", kind: "weekend_top3", issueDate: "2026-11-20" }]);
    expect(scheduleTasks(new Date("2026-11-17T05:00:00Z"))).toEqual([]);
  });

  it("finds latest and upcoming issue dates", () => {
    expect(latestIssueDate("whats_hot", "2026-11-18")).toBe("2026-11-16");
    expect(latestIssueDate("weekend_top3", "2026-11-18")).toBe("2026-11-13");
    expect(upcomingIssueDate("weekend_top3", "2026-11-18")).toBe("2026-11-20");
    expect(issueSlug("whats_hot", "2026-11-16")).toBe("whats-hot-2026-11-16");
    expect(formatIssueDate("2026-11-16")).toMatch(/^Monday,? 16 November 2026$/);
  });

  it("never treats an old issue as current", () => {
    // Monday 08:00 Juba: last week's edition is no longer current.
    expect(isCurrentIssue("whats_hot", "2026-11-09", new Date("2026-11-16T06:00:00Z"))).toBe(false);
    expect(isCurrentIssue("whats_hot", "2026-11-16", new Date("2026-11-16T06:00:00Z"))).toBe(true);
    // Monday 06:00 Juba: last week's is still the current one.
    expect(isCurrentIssue("whats_hot", "2026-11-09", new Date("2026-11-16T04:00:00Z"))).toBe(true);
  });
});

describe("research checks", () => {
  it("rejects demo, unverified, unsourced, stale and expired items", () => {
    const issueDate = "2026-11-16";
    expect(evaluateCandidate(DEMO_UPDATES[0], issueDate, NOW).accepted).toBe(false);
    expect(evaluateCandidate(verified(0, { verification: "unverified" }), issueDate, NOW).accepted).toBe(false);
    expect(evaluateCandidate(verified(0, { sourceUrl: "http://insecure.example" }), issueDate, NOW).accepted).toBe(false);
    expect(evaluateCandidate(verified(0, { lastVerifiedAt: "2026-10-01" }), issueDate, NOW).reasons.join(" ")).toMatch(/older than 14 days/);
    expect(evaluateCandidate(verified(0, { category: "opportunities", deadline: "2026-11-10" }), issueDate, NOW).accepted).toBe(false);
    expect(evaluateCandidate(verified(0), issueDate, NOW)).toMatchObject({ accepted: true, freshness: "new" });
    expect(evaluateCandidate(verified(0, { publishedAt: "2026-09-01" }), issueDate, NOW)).toMatchObject({ accepted: true, freshness: "evergreen" });
  });

  it("refuses to compose What’s Hot from demo content", () => {
    const { errors, issue } = composeWhatsHot(DEMO_UPDATES, "2026-11-16", NOW);
    expect(errors[0]).toMatch(/at least 5/);
    expect(issue.content.kind === "whats_hot" && issue.content.discoveries).toHaveLength(0);
    expect(issue.research.entries.every((entry) => entry.verdict === "rejected")).toBe(true);
  });

  it("composes 5–7 sourced discoveries, at most two per category, with a research log", () => {
    const updates = Array.from({ length: 12 }, (_, index) => verified(index));
    const { errors, issue } = composeWhatsHot(updates, "2026-11-16", NOW);
    expect(errors).toEqual([]);
    if (issue.content.kind !== "whats_hot") throw new Error("wrong kind");
    const { discoveries } = issue.content;
    expect(discoveries.length).toBeGreaterThanOrEqual(5);
    expect(discoveries.length).toBeLessThanOrEqual(7);
    const perCategory = discoveries.reduce<Record<string, number>>((acc, discovery) => ({ ...acc, [discovery.category]: (acc[discovery.category] ?? 0) + 1 }), {});
    expect(Math.max(...Object.values(perCategory))).toBeLessThanOrEqual(2);
    for (const discovery of discoveries) {
      expect(discovery.sourceUrl).toMatch(/^https:\/\//);
      expect(discovery.potentialValue).not.toMatch(/\$\d|guaranteed income/i);
    }
    expect(issue.research.entries).toHaveLength(12);
    expect(validateIssueContent(issue.content, "whats_hot")).toEqual([]);
    expect(issue.slug).toBe("whats-hot-2026-11-16");
  });

  it("validation blocks unsourced or malformed content", () => {
    const updates = Array.from({ length: 12 }, (_, index) => verified(index));
    const { issue } = composeWhatsHot(updates, "2026-11-16", NOW);
    const content = structuredClone(issue.content);
    if (content.kind !== "whats_hot") throw new Error("wrong kind");
    content.discoveries[0].sourceUrl = "";
    content.discoveries[1].link = "javascript:alert(1)";
    const errors = validateIssueContent(content, "whats_hot");
    expect(errors.join(" ")).toMatch(/https source/);
    expect(errors.join(" ")).toMatch(/safe URL/);
    expect(validateIssueContent(content, "weekend_top3")[0]).toMatch(/kind/);
  });

  it("composes a Weekend Top 3 even with no verified opportunities, without inventing any", () => {
    const { errors, issue } = composeWeekendTop3(DEMO_UPDATES, "2026-11-20", NOW);
    expect(errors).toEqual([]);
    if (issue.content.kind !== "weekend_top3") throw new Error("wrong kind");
    expect(issue.content.featured).toEqual([]);
    expect(issue.content.examples).toHaveLength(3);
    expect(issue.research.warnings[0]).toMatch(/evergreen/);
    expect(collectLinks(issue.content).every((href) => href.startsWith("/") || href.startsWith("https://"))).toBe(true);
  });
});

const answers = (overrides: Partial<Top3Answers> = {}): Top3Answers => ({ goals: ["earn"], level: "some", time: "t2", have: ["laptop", "internet"], success: "create", ...overrides });

describe("FIND MY TOP 3", () => {
  it("validates answers from untrusted input", () => {
    expect(parseAnswers({ goals: "earn,nope", level: "some", time: "t2", have: ["laptop"], success: "sale" })).toEqual({ goals: ["earn"], level: "some", time: "t2", have: ["laptop"], success: "sale" });
    expect(parseAnswers({ goals: [], level: "some", time: "t2", have: ["laptop"], success: "sale" })).toBeNull();
    expect(parseAnswers({ goals: ["earn"], level: "guru", time: "t2", have: ["laptop"], success: "sale" })).toBeNull();
  });

  it("returns three specific, different recommendations with all six parts", () => {
    const top = recommendTop3(answers({ goals: ["earn", "business"], success: "sale", have: ["laptop", "internet", "skills"] }));
    expect(top).toHaveLength(3);
    expect(new Set(top.map((rec) => rec.projectId)).size).toBe(3);
    for (const rec of top) {
      expect(rec.title).not.toMatch(/^learn /i);
      expect(rec.why.length).toBeGreaterThan(1);
      expect(rec.gain).not.toMatch(/guarantee(d)? (income|earnings)|\$\d/i);
      expect(rec.plan.map((day) => day.day)).toEqual(["Friday", "Saturday", "Sunday"]);
      expect(rec.plan.every((day) => day.steps.length > 0)).toBe(true);
      expect(rec.startHere.length).toBeGreaterThan(0);
      expect(rec.success.length).toBeGreaterThan(20);
    }
  });

  it("never recommends projects that need more time or equipment than the person has", () => {
    const top = recommendTop3(answers({ goals: ["business", "products", "brand"], time: "t1", have: ["smartphone"] }));
    for (const rec of top) {
      const project = WEEKEND_PROJECTS.find((item) => item.id === rec.projectId)!;
      expect(project.minTime).toBe("t1");
      expect(project.needs).not.toContain("laptop");
    }
  });

  it("adapts the weekend plan to available time", () => {
    const project = WEEKEND_PROJECTS.find((item) => item.id === "ai-inquiry-workflow")!;
    const short = buildPlan(project, "t2").flatMap((day) => day.steps);
    const long = buildPlan(project, "t4").flatMap((day) => day.steps);
    expect(long.length).toBeGreaterThan(short.length);
    expect(buildPlan(project, "t1")[1].timebox).toBe("45 min");
  });

  it("skips completed projects when making the next recommendations", () => {
    const first = recommendTop3(answers());
    const next = recommendTop3(answers(), { exclude: first.map((rec) => rec.projectId) });
    expect(next.some((rec) => first.some((done) => done.projectId === rec.projectId))).toBe(false);
  });

  it("returns something feasible for every combination of goal, level, time and device", () => {
    for (const goal of GOAL_IDS) for (const level of LEVEL_IDS) for (const time of TIME_IDS) for (const device of ["laptop", "smartphone"] as const) {
      const top = recommendTop3({ goals: [goal], level, time, have: [device, "internet"], success: SUCCESS_IDS[0] });
      expect(top.length, `${goal}/${level}/${time}/${device}`).toBeGreaterThan(0);
    }
  });

  it("example profiles in the Friday edition each get a recommendation", () => {
    for (const { answers: profile } of EXAMPLE_PROFILES) expect(recommendTop3(profile).length).toBe(3);
  });
});

describe("catalogue integrity", () => {
  it("every Start Here reference resolves to an available resource with a free/paid label", () => {
    for (const project of WEEKEND_PROJECTS) {
      expect(project.startHere.length, project.id).toBeGreaterThan(0);
      for (const ref of project.startHere) {
        const resource = resolveResource(ref);
        expect(resource, `${project.id} → ${ref}`).toBeDefined();
        expect(resource!.accessLabel.length).toBeGreaterThan(0);
        expect(resource!.href.startsWith("/") || resource!.href.startsWith("https://")).toBe(true);
      }
    }
  });

  it("labels paid courses as paid and never resolves unpublished courses", () => {
    expect(resolveResource("course:video-editing-for-creators")).toMatchObject({ access: "paid", accessLabel: expect.stringMatching(/^Paid · \$49/) });
    expect(resolveResource("course:ai-dramas")).toMatchObject({ access: "free", accessLabel: "Free course" });
    expect(resolveResource("course:ai-for-side-gigs")).toBeUndefined(); // coming soon
    expect(resolveResource("course:does-not-exist")).toBeUndefined();
  });

  it("uses only known answer ids in the catalogue", () => {
    for (const project of WEEKEND_PROJECTS) {
      project.goals.forEach((goal) => expect(GOAL_IDS).toContain(goal));
      project.levels.forEach((level) => expect(LEVEL_IDS).toContain(level));
      project.success.forEach((success) => expect(SUCCESS_IDS).toContain(success));
      project.needs.forEach((need) => expect([...HAVE_IDS, "device"]).toContain(need));
    }
  });
});
