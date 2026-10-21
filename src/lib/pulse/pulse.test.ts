import { afterEach, describe, expect, it, vi } from "vitest";
import { COURSES } from "@/lib/data/courses";
import { SKILL_IDS } from "@/lib/skill-challenge";
import { PULSE_CATEGORIES } from "./categories";
import { deadlineLabel, filterByCategory, isExpired, isLive, lifecycle, paginate, pickFeatured, searchUpdates, sortFeed } from "./feed";
import { composeEditionDraft, parseSectionLines, sectionToLines } from "./newsletter";
import { EMPTY_PREFERENCES, ruleBasedRecommender } from "./radar";
import { DEMO_EDITIONS, DEMO_UPDATES } from "./seed";
import { isSafeHref, slugify, validateUpdateInput } from "./validate";
import type { PulseUpdate } from "./types";

const NOW = Date.parse("2026-10-21T12:00:00Z");

function make(overrides: Partial<PulseUpdate> = {}): PulseUpdate {
  return { ...DEMO_UPDATES[0], id: "x", slug: "x", verification: "verified", lastVerifiedAt: "2026-10-20", sourceUrl: "https://example.org/source", featured: false, ...overrides };
}

const validInput = {
  title: "Remote data analyst internship",
  category: "jobs",
  summary: "A paid remote internship for early-career analysts working on reporting dashboards.",
  signal: { what: "A remote internship role.", why: "Entry-level data roles are scarce.", who: "Students and career changers.", how: "Apply with a dashboard sample.", next: "Build a sample dashboard this week." },
  sourceName: "Example Org careers page",
  sourceUrl: "https://example.org/careers/123",
  cta: { label: "Apply now", href: "https://example.org/careers/123" },
  skills: "Excel, Power BI",
};

describe("deadlines and expiry", () => {
  it("keeps an opportunity open through its deadline day and closes it after", () => {
    expect(lifecycle({ deadline: "2026-10-21" }, NOW)).toBe("closing_soon");
    expect(lifecycle({ deadline: "2026-12-31" }, NOW)).toBe("open");
    expect(lifecycle({ deadline: "2026-10-20" }, NOW)).toBe("closed");
    expect(lifecycle({}, NOW)).toBe("no_deadline");
  });

  it("never shows a past-deadline job or opportunity as live", () => {
    const closedJob = make({ category: "jobs", deadline: "2026-10-01" });
    expect(isExpired(closedJob, NOW)).toBe(true);
    expect(isLive(closedJob, NOW)).toBe(false);
    expect(isLive(make({ expiresAt: "2026-09-30" }), NOW)).toBe(false);
    expect(isLive(make({ status: "draft" }), NOW)).toBe(false);
    expect(isLive(make({ category: "jobs", deadline: "2026-11-30" }), NOW)).toBe(true);
  });

  it("asks readers to confirm unverified deadlines", () => {
    expect(deadlineLabel(make({ deadline: "2026-12-15", verification: "unverified" }), NOW)).toMatch(/confirm with the source/);
    // Noon on the 21st → end of the 25th is 4.5 days, rounded up so readers don't leave it to the last minute.
    expect(deadlineLabel(make({ deadline: "2026-10-25" }), NOW)).toMatch(/Closes in 5 days/);
    expect(deadlineLabel(make({ deadline: "2026-10-01" }), NOW)).toMatch(/^Closed/);
  });
});

describe("feed", () => {
  it("ranks verified content above demo content and featured stories first", () => {
    const sorted = sortFeed([make({ id: "demo", verification: "demo", featured: true }), make({ id: "plain" }), make({ id: "feat", featured: true })]);
    expect(sorted.map((update) => update.id)).toEqual(["feat", "plain", "demo"]);
    expect(pickFeatured(sorted)?.id).toBe("feat");
  });

  it("filters, searches and paginates", () => {
    expect(filterByCategory(DEMO_UPDATES, "jobs").every((update) => update.category === "jobs")).toBe(true);
    expect(searchUpdates(DEMO_UPDATES, "power bi").length).toBeGreaterThan(0);
    expect(searchUpdates(DEMO_UPDATES, "zzzz-nothing")).toHaveLength(0);
    const page = paginate(DEMO_UPDATES, 1, 5);
    expect(page.visible).toHaveLength(5);
    expect(page.hasMore).toBe(true);
  });
});

describe("demo content honesty", () => {
  const routes = new Set(["/academy/challenge", "/capacity-guide", ...SKILL_IDS.map((id) => `/academy/challenge/${id}`), ...COURSES.map((course) => `/academy/${course.slug}`), ...DEMO_UPDATES.map((update) => `/pulse/${update.slug}`)]);

  it("labels every seed record as demo and never as verified news", () => {
    for (const update of DEMO_UPDATES) {
      expect(update.verification).toBe("demo");
      expect(update.sourceUrl).toBeUndefined();
      expect(update.deadline).toBeUndefined();
    }
    expect(DEMO_EDITIONS.every((edition) => edition.demo)).toBe(true);
  });

  it("covers all eight categories with the full Impact Signal and varied CTAs", () => {
    for (const category of PULSE_CATEGORIES) expect(DEMO_UPDATES.some((update) => update.category === category.id), category.id).toBe(true);
    for (const update of DEMO_UPDATES) for (const value of Object.values(update.signal)) expect(value.length).toBeGreaterThan(20);
    expect(new Set(DEMO_UPDATES.map((update) => update.cta.label)).size).toBeGreaterThan(10);
  });

  it("only links to routes and courses that exist", () => {
    const slugs = new Set(COURSES.map((course) => course.slug));
    for (const update of DEMO_UPDATES) {
      expect(routes.has(update.cta.href), `${update.slug} → ${update.cta.href}`).toBe(true);
      for (const slug of update.relatedCourseSlugs) expect(slugs.has(slug), `${update.slug}: ${slug}`).toBe(true);
    }
  });
});

describe("validation (admin editor + agent ingestion)", () => {
  it("accepts a complete record and normalises lists", () => {
    const result = validateUpdateInput(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.skills).toEqual(["Excel", "Power BI"]);
      expect(result.value.status).toBe("draft");
    }
  });

  it("rejects missing Impact Signal answers, bad links and unsupported verification", () => {
    const result = validateUpdateInput({ ...validInput, signal: { what: "x" }, sourceUrl: "not a url", cta: { label: "Go", href: "javascript:alert(1)" } });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((error) => error.includes("WHY"))).toBe(true);
      expect(result.errors.some((error) => error.includes("Source URL"))).toBe(true);
      expect(result.errors.some((error) => error.includes("CTA destination"))).toBe(true);
    }
    const unverifiable = validateUpdateInput({ ...validInput, sourceUrl: undefined, verification: "verified" });
    expect(unverifiable.ok).toBe(false);
  });

  it("guards slugs and hrefs", () => {
    expect(slugify("  Hello, World! Café ")).toBe("hello-world-cafe");
    expect(isSafeHref("/academy")).toBe(true);
    expect(isSafeHref("//evil.example")).toBe(false);
    expect(isSafeHref("https://example.org")).toBe(true);
  });
});

describe("Impact Radar", () => {
  it("recommends nothing without preferences", () => {
    expect(ruleBasedRecommender.recommend(DEMO_UPDATES, EMPTY_PREFERENCES)).toEqual([]);
  });

  it("explains every recommendation", () => {
    const finance = ruleBasedRecommender.recommend(DEMO_UPDATES, { ...EMPTY_PREFERENCES, existingSkills: ["Excel"], skillsToLearn: ["Power BI"], industries: ["Finance"] });
    expect(finance.length).toBeGreaterThan(0);
    for (const recommendation of finance) expect(recommendation.reasons.length).toBeGreaterThan(0);
    expect(finance[0].reasons.join(" ")).toMatch(/Power BI|Excel|Finance/);
  });

  it("respects a remote-only preference for jobs", () => {
    const onsite = make({ id: "onsite", category: "jobs", job: { remote: "onsite" }, location: "Kampala", skills: ["Bookkeeping"] });
    const remote = make({ id: "remote", category: "jobs", job: { remote: "remote" }, skills: ["Bookkeeping"] });
    const result = ruleBasedRecommender.recommend([onsite, remote], { ...EMPTY_PREFERENCES, existingSkills: ["Bookkeeping"], remote: "remote_only" });
    expect(result.map((item) => item.update.id)).toEqual(["remote"]);
  });
});

describe("The Impact Brief", () => {
  it("round-trips editor lines and rejects unsafe targets", () => {
    const parsed = parseSectionLines("Skill A | why it matters | skill-a\nCourse | free | /academy/x\nBad | x | javascript:alert(1)");
    expect(parsed.items).toHaveLength(2);
    expect(parsed.errors).toHaveLength(1);
    expect(sectionToLines(parsed.items)).toContain("Skill A | why it matters | skill-a");
  });

  it("drafts editions from live, non-demo updates only", () => {
    const draft = composeEditionDraft([...DEMO_UPDATES, make({ id: "real", category: "skills", status: "published" })], "2026-10-21T00:00:00.000Z");
    expect(draft.status).toBe("draft");
    expect(draft.sections.skillWorthBuilding.map((item) => item.slug)).toEqual(["x"]);
    expect(draft.sections.whatsHot).toHaveLength(0);
  });
});

describe("admin sessions", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("signs, verifies and expires sessions; stays locked without secrets", async () => {
    const auth = await import("@/lib/server/admin-auth");
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(auth.adminConfigured()).toBe(false);
    expect(auth.checkPassword("anything", "a").ok).toBe(false);

    vi.stubEnv("ADMIN_PASSWORD", "correct horse battery staple");
    vi.stubEnv("ADMIN_SESSION_SECRET", "s".repeat(40));
    const session = auth.createSessionValue(NOW);
    expect(auth.verifySessionValue(session, NOW)).toBe(true);
    expect(auth.verifySessionValue(session.replace(/.$/, "x"), NOW)).toBe(false);
    expect(auth.verifySessionValue(session, NOW + 13 * 60 * 60 * 1000)).toBe(false);
    expect(auth.checkPassword("correct horse battery staple", "b").ok).toBe(true);
    for (let i = 0; i < 5; i++) auth.checkPassword("wrong", "c");
    expect(auth.checkPassword("correct horse battery staple", "c").locked).toBe(true);
  });

  it("requires a long ingest token", async () => {
    const auth = await import("@/lib/server/admin-auth");
    vi.stubEnv("PULSE_INGEST_TOKEN", "t".repeat(32));
    expect(auth.verifyIngestToken(`Bearer ${"t".repeat(32)}`)).toBe(true);
    expect(auth.verifyIngestToken("Bearer nope")).toBe(false);
    expect(auth.verifyIngestToken(null)).toBe(false);
  });
});
