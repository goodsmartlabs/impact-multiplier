import { getCategory } from "@/lib/pulse/categories";
import { isLive } from "@/lib/pulse/feed";
import { isSafeHref } from "@/lib/pulse/validate";
import type { PulseCategory, PulseUpdate } from "@/lib/pulse/types";
import { resolveResource, resolveResources } from "./resources";
import { EDITIONS, formatIssueDate, issueSlug } from "./schedule";
import { recommendTop3 } from "./top3";
import { GOALS, labelOf, type GoalId, type Top3Answers } from "./top3-questions";
import type {
  Difficulty,
  Discovery,
  EditionKind,
  IssueContent,
  IssueResearch,
  NewsletterIssue,
  OpportunityMatch,
  ResearchEntry,
  WeekendExample,
} from "./types";

/** Research rules. Changing these changes what may be published — keep them strict. */
export const RESEARCH_RULES = {
  /** A source must have been checked by an editor within this many days. */
  maxVerificationAgeDays: 14,
  /** Published within this many days of the issue date counts as a new development. */
  newWithinDays: 10,
  minDiscoveries: 5,
  maxDiscoveries: 7,
  maxPerCategory: 2,
} as const;

const DAY = 86_400_000;
const days = (from: string, to: string) => Math.floor((Date.parse(to) - Date.parse(from)) / DAY);

const POTENTIAL_VALUE: Record<PulseCategory, string> = {
  trending: "Early awareness — useful for positioning your skills or business before the space gets crowded.",
  jobs: "Direct income if you’re hired. Check the listing for the stated pay; none is assumed here.",
  skills: "A capability employers and clients are asking for, which widens the work you can take on.",
  learning: "Low-cost capability building. The value comes from applying it, not from finishing it.",
  money: "Better financial decisions. No returns or earnings are guaranteed.",
  opportunities: "Funding, training or access if you’re accepted — check eligibility and the deadline first.",
  ai: "Time saved in your own work, or a new service you could offer with the tool.",
  industry: "Context for career and business decisions in this sector.",
};

const DEFAULT_DIFFICULTY: Record<PulseCategory, Difficulty> = {
  trending: "Beginner", jobs: "Intermediate", skills: "Intermediate", learning: "Beginner",
  money: "Beginner", opportunities: "Intermediate", ai: "Beginner", industry: "Beginner",
};

const CATEGORY_RESOURCE: Record<PulseCategory, string> = {
  trending: "capacity-guide", jobs: "pulse-jobs", skills: "skill-challenge", learning: "academy",
  money: "course:financial-flow", opportunities: "pulse-opportunities", ai: "challenge:ai-automation", industry: "craft-paths",
};

export const GOAL_CATEGORIES: Record<GoalId, PulseCategory[]> = {
  earn: ["jobs", "money", "skills", "opportunities"],
  skills: ["skills", "learning", "ai"],
  business: ["industry", "trending", "opportunities", "ai"],
  brand: ["trending", "skills"],
  systems: ["ai", "skills"],
  wealth: ["money", "opportunities"],
  career: ["jobs", "skills", "learning"],
  products: ["trending", "ai"],
  explore: ["trending", "opportunities", "learning", "skills", "ai", "jobs", "money", "industry"],
};

const GOAL_RESOURCE: Record<GoalId, string> = {
  earn: "build-challenge", skills: "skill-challenge", business: "build-challenge", brand: "course:building-you-the-brand",
  systems: "challenge:ai-automation", wealth: "course:financial-flow", career: "pulse-jobs", products: "build-challenge", explore: "capacity-guide",
};

/* ---------- Research: evaluate candidates ---------- */

export interface Evaluation {
  update: PulseUpdate;
  accepted: boolean;
  freshness: "new" | "evergreen";
  reasons: string[];
}

/**
 * Credibility, freshness and relevance checks for every candidate. Only
 * records an editor verified recently, with a source link and a live status,
 * can become a discovery. Demo and unverified content is always rejected.
 */
export function evaluateCandidate(update: PulseUpdate, issueDate: string, now: Date): Evaluation {
  const reasons: string[] = [];
  const today = now.toISOString().slice(0, 10);
  if (update.status !== "published") reasons.push(`Not published (status: ${update.status}).`);
  if (update.verification !== "verified") reasons.push(update.verification === "demo" ? "Demonstration content — never used in a newsletter." : "Not verified by an editor.");
  if (!update.sourceUrl || !/^https:\/\//.test(update.sourceUrl)) reasons.push("No secure (https) source link.");
  if (!update.lastVerifiedAt) reasons.push("No verification date recorded.");
  else if (days(update.lastVerifiedAt, today) > RESEARCH_RULES.maxVerificationAgeDays) reasons.push(`Last verified ${update.lastVerifiedAt} — older than ${RESEARCH_RULES.maxVerificationAgeDays} days; re-check the source.`);
  if (!isLive(update, now.getTime())) reasons.push("Expired or past its deadline.");
  if (update.deadline && update.deadline < issueDate) reasons.push(`Deadline ${update.deadline} is before the issue date.`);
  const age = days(update.publishedAt, issueDate);
  const freshness = age <= RESEARCH_RULES.newWithinDays ? "new" : "evergreen";
  return { update, accepted: reasons.length === 0, freshness, reasons: reasons.length ? reasons : [freshness === "new" ? `New development (published ${update.publishedAt}).` : `Still live and verified; published ${update.publishedAt}, so labelled as ongoing.`] };
}

function difficultyOf(update: PulseUpdate): Difficulty {
  const text = [...update.tags, ...update.skills].join(" ").toLowerCase();
  if (/advanced|expert|senior/.test(text)) return "Advanced";
  if (/beginner|no experience|entry/.test(text)) return "Beginner";
  return DEFAULT_DIFFICULTY[update.category];
}

export function toDiscovery(evaluation: Evaluation): Discovery {
  const { update } = evaluation;
  const resources = resolveResources([...update.relatedCourseSlugs.map((slug) => `course:${slug}`), CATEGORY_RESOURCE[update.category]]);
  return {
    id: update.id,
    name: update.title,
    category: getCategory(update.category).label,
    whatsHappening: update.signal.what,
    whyItMatters: update.signal.why,
    whoShouldPayAttention: update.signal.who,
    potentialValue: POTENTIAL_VALUE[update.category],
    difficulty: difficultyOf(update),
    firstAction: update.signal.how,
    resources,
    link: `/pulse/${update.slug}`,
    sourceName: update.sourceName,
    sourceUrl: update.sourceUrl!,
    publishedAt: update.publishedAt,
    lastVerifiedAt: update.lastVerifiedAt!,
    freshness: evaluation.freshness,
    pulseSlug: update.slug,
    deadline: update.deadline,
  };
}

/** Pick 5–7 discoveries: newest and featured first, at most two per category. */
export function selectDiscoveries(evaluations: Evaluation[], max: number = RESEARCH_RULES.maxDiscoveries): Discovery[] {
  const ranked = evaluations
    .filter((evaluation) => evaluation.accepted)
    .sort((a, b) =>
      Number(b.freshness === "new") - Number(a.freshness === "new") ||
      Number(b.update.featured) - Number(a.update.featured) ||
      b.update.publishedAt.localeCompare(a.update.publishedAt));
  const perCategory = new Map<string, number>();
  const picked: Evaluation[] = [];
  for (const evaluation of ranked) {
    const count = perCategory.get(evaluation.update.category) ?? 0;
    if (count >= RESEARCH_RULES.maxPerCategory) continue;
    perCategory.set(evaluation.update.category, count + 1);
    picked.push(evaluation);
    if (picked.length === max) break;
  }
  return picked.map(toDiscovery);
}

export function opportunityMatch(discoveries: Discovery[], updates: PulseUpdate[]): OpportunityMatch[] {
  const categoryOf = new Map(updates.map((update) => [update.id, update.category]));
  return GOALS.flatMap(({ id }) => {
    const matched = discoveries.filter((discovery) => GOAL_CATEGORIES[id].includes(categoryOf.get(discovery.id) as PulseCategory)).slice(0, id === "explore" ? 2 : 3);
    if (!matched.length) return [];
    return [{
      goal: id,
      goalLabel: labelOf(GOALS, id),
      discoveryIds: matched.map((discovery) => discovery.id),
      resource: resolveResource(GOAL_RESOURCE[id]),
      note: id === "explore" ? "Not sure where to start? Begin with these two, then take FIND MY TOP 3 on Friday." : `Start with “${matched[0].name}”.`,
    }];
  });
}

/* ---------- Edition composition ---------- */

export interface ComposeResult {
  issue: Omit<NewsletterIssue, "id" | "status" | "createdAt" | "updatedAt">;
  errors: string[];
}

function researchLog(evaluations: Evaluation[], now: Date, method: string, warnings: string[]): IssueResearch {
  const checkedAt = now.toISOString();
  const entries: ResearchEntry[] = evaluations.map(({ update, accepted, reasons }) => ({
    ref: update.slug, title: update.title, sourceUrl: update.sourceUrl, checkedAt, verdict: accepted ? "accepted" : "rejected", reasons,
  }));
  return { generatedAt: checkedAt, method, entries, linkChecks: [], warnings };
}

export function composeWhatsHot(updates: PulseUpdate[], issueDate: string, now: Date): ComposeResult {
  const evaluations = updates.map((update) => evaluateCandidate(update, issueDate, now));
  const discoveries = selectDiscoveries(evaluations);
  const errors: string[] = [];
  const warnings: string[] = [];
  if (discoveries.length < RESEARCH_RULES.minDiscoveries) {
    errors.push(`Only ${discoveries.length} verified, current discoveries are available — What’s Hot needs at least ${RESEARCH_RULES.minDiscoveries}. Verify more Impact Pulse records (with source links checked in the last ${RESEARCH_RULES.maxVerificationAgeDays} days) before publishing.`);
  }
  const categories = [...new Set(discoveries.map((discovery) => discovery.category))];
  const fresh = discoveries.filter((discovery) => discovery.freshness === "new").length;
  if (discoveries.length && fresh === 0) warnings.push("None of the selected discoveries is a new development this week; all are ongoing.");

  const content: IssueContent = {
    kind: "whats_hot",
    bigPicture: {
      headline: discoveries.length
        ? `${discoveries.length} verified developments across ${categories.length} area${categories.length === 1 ? "" : "s"} this week`
        : "Not enough verified developments yet",
      points: discoveries.slice(0, 3).map((discovery) => `${discovery.category}: ${discovery.name} — ${discovery.whyItMatters}`),
    },
    discoveries,
    opportunityMatch: opportunityMatch(discoveries, updates),
    action: {
      headline: "Turn discovery into action",
      body: "Pick one discovery that matches your goal and take its first action today. If you want structure, these ImpactFools paths turn it into a finished, provable result.",
      resources: resolveResources([...new Set(discoveries.flatMap((discovery) => discovery.resources.filter((resource) => resource.kind === "course").map((resource) => resource.id)))].slice(0, 2).concat(["skill-challenge", "build-challenge", "academy"])),
    },
  };
  return {
    issue: {
      kind: "whats_hot",
      issueDate,
      slug: issueSlug("whats_hot", issueDate),
      title: `What’s Hot 🔥 — ${formatIssueDate(issueDate)}`,
      summary: content.bigPicture.headline,
      content,
      research: researchLog(evaluations, now, "Verified Impact Pulse records only. Each must be published, editor-verified, link to an https source, have been re-checked within the verification window, and be live on the issue date.", warnings),
    },
    errors,
  };
}

/** Example profiles used to show how FIND MY TOP 3 adapts. They are illustrative, not real people. */
export const EXAMPLE_PROFILES: Array<{ profile: string; answers: Top3Answers }> = [
  { profile: "Just starting, 1–2 hours, smartphone only", answers: { goals: ["explore", "skills"], level: "starting", time: "t1", have: ["smartphone", "internet", "time"], success: "plan" } },
  { profile: "Some skills, 3–5 hours, wants a first sale", answers: { goals: ["earn", "business"], level: "some", time: "t2", have: ["laptop", "internet", "skills"], success: "sale" } },
  { profile: "Running a small business, 6–10 hours", answers: { goals: ["systems", "business"], level: "working", time: "t3", have: ["laptop", "internet", "business"], success: "improve" } },
];

export function composeWeekendTop3(updates: PulseUpdate[], issueDate: string, now: Date): ComposeResult {
  const evaluations = updates.map((update) => evaluateCandidate(update, issueDate, now));
  const featured = selectDiscoveries(evaluations.filter((evaluation) => ["opportunities", "jobs", "learning", "skills"].includes(evaluation.update.category)), 3);
  const examples: WeekendExample[] = EXAMPLE_PROFILES.map(({ profile, answers }) => {
    const [top] = recommendTop3(answers);
    return {
      profile,
      goalLabels: answers.goals.map((goal) => labelOf(GOALS, goal)),
      recommendation: { id: top.projectId, title: top.title, why: top.why[0], success: top.success, href: `/newsletter/top-3?project=${top.projectId}` },
    };
  });
  const errors = examples.length < 3 ? ["The Top 3 engine returned fewer than three example recommendations."] : [];
  const warnings = featured.length ? [] : ["No verified opportunities qualified this week, so the edition features evergreen weekend projects only."];
  const content: IssueContent = {
    kind: "weekend_top3",
    intro: {
      headline: "Stop collecting opportunities. Start building something.",
      body: "Answer five quick questions and get three weekend projects matched to your goals, time and resources — each with a Friday-to-Sunday plan and one clear finish line.",
    },
    featured,
    examples,
    practicalActions: [
      "Pick one project — not three. Finishing one beats starting all of them.",
      "Block the time in your calendar now: a short Friday session, a longer Saturday, a finishing Sunday.",
      "Decide your finish line before you start, and share the result on Sunday evening.",
    ],
    evergreen: resolveResources(["build-challenge", "skill-challenge", "capacity-guide"]),
  };
  return {
    issue: {
      kind: "weekend_top3",
      issueDate,
      slug: issueSlug("weekend_top3", issueDate),
      title: `Your Weekend Top 3 🎯 — ${formatIssueDate(issueDate)}`,
      summary: featured.length ? `${featured.length} verified opportunit${featured.length === 1 ? "y" : "ies"} plus personalised weekend projects.` : "Personalised weekend projects with a Friday-to-Sunday plan.",
      content,
      research: researchLog(evaluations, now, "Featured items use the same verification rules as What’s Hot. Weekend projects come from the ImpactFools project catalogue; every course and challenge they link to is checked to exist and be available.", warnings),
    },
    errors,
  };
}

export function composeIssue(kind: EditionKind, updates: PulseUpdate[], issueDate: string, now: Date): ComposeResult {
  return kind === "whats_hot" ? composeWhatsHot(updates, issueDate, now) : composeWeekendTop3(updates, issueDate, now);
}

/* ---------- Validation ---------- */

export function collectLinks(content: IssueContent): string[] {
  const links = new Set<string>();
  const add = (href?: string) => href && links.add(href);
  if (content.kind === "whats_hot") {
    for (const discovery of content.discoveries) {
      add(discovery.link);
      add(discovery.sourceUrl);
      discovery.resources.forEach((resource) => add(resource.href));
    }
    content.opportunityMatch.forEach((match) => add(match.resource?.href));
    content.action.resources.forEach((resource) => add(resource.href));
  } else {
    for (const discovery of content.featured) {
      add(discovery.link);
      add(discovery.sourceUrl);
    }
    content.examples.forEach((example) => add(example.recommendation.href));
    content.evergreen.forEach((resource) => add(resource.href));
  }
  return [...links];
}

/** Structural checks that block publishing. Editors can't publish a broken or unsourced issue. */
export function validateIssueContent(content: unknown, kind: EditionKind): string[] {
  const errors: string[] = [];
  if (!content || typeof content !== "object") return ["Content is missing."];
  const value = content as IssueContent;
  if (value.kind !== kind) return [`Content kind must be "${kind}".`];
  if (value.kind === "whats_hot") {
    if (!Array.isArray(value.discoveries)) return ["discoveries must be a list."];
    if (value.discoveries.length < RESEARCH_RULES.minDiscoveries || value.discoveries.length > RESEARCH_RULES.maxDiscoveries) errors.push(`What’s Hot needs ${RESEARCH_RULES.minDiscoveries}–${RESEARCH_RULES.maxDiscoveries} discoveries (has ${value.discoveries.length}).`);
    value.discoveries.forEach((discovery, index) => {
      const label = `Discovery ${index + 1}`;
      for (const field of ["name", "whatsHappening", "whyItMatters", "whoShouldPayAttention", "potentialValue", "firstAction", "sourceName"] as const) {
        if (typeof discovery[field] !== "string" || !discovery[field].trim()) errors.push(`${label}: “${field}” is required.`);
      }
      if (!/^https:\/\//.test(discovery.sourceUrl ?? "")) errors.push(`${label}: needs an https source link.`);
      if (!discovery.lastVerifiedAt) errors.push(`${label}: needs a verification date.`);
      if (!isSafeHref(discovery.link ?? "")) errors.push(`${label}: link is not a safe URL.`);
    });
    if (!value.bigPicture?.headline) errors.push("The Big Picture needs a headline.");
  } else {
    if (!value.intro?.headline) errors.push("The intro needs a headline.");
    if (!Array.isArray(value.examples) || value.examples.length < 3) errors.push("Weekend Top 3 needs three example recommendations.");
    (value.featured ?? []).forEach((discovery, index) => {
      if (!/^https:\/\//.test(discovery.sourceUrl ?? "")) errors.push(`Featured ${index + 1}: needs an https source link.`);
    });
  }
  for (const href of collectLinks(value)) if (!isSafeHref(href)) errors.push(`Unsafe link: ${href}`);
  return errors;
}

export function editionLabel(kind: EditionKind) {
  return `${EDITIONS[kind].label} ${EDITIONS[kind].emoji}`;
}
