import { getCategory } from "./categories";
import type { PulseCategory, PulseUpdate } from "./types";

export interface RadarPreferences {
  existingSkills: string[];
  skillsToLearn: string[];
  interests: string[];
  industries: string[];
  careerGoals: string[];
  locations: string[];
  remote: "remote_only" | "open" | "onsite_ok";
  learningInterests: string[];
  incomeInterests: string[];
  categories: PulseCategory[];
}

export const EMPTY_PREFERENCES: RadarPreferences = {
  existingSkills: [],
  skillsToLearn: [],
  interests: [],
  industries: [],
  careerGoals: [],
  locations: [],
  remote: "open",
  learningInterests: [],
  incomeInterests: [],
  categories: [],
};

export function hasPreferences(prefs: RadarPreferences): boolean {
  return (
    prefs.existingSkills.length + prefs.skillsToLearn.length + prefs.interests.length + prefs.industries.length +
    prefs.careerGoals.length + prefs.learningInterests.length + prefs.incomeInterests.length + prefs.categories.length
  ) > 0;
}

export interface Recommendation {
  update: PulseUpdate;
  score: number;
  /** Plain-language reasons shown to the user — every point is explained. */
  reasons: string[];
}

/** Any recommender (rule-based today, AI-assisted later) implements this. */
export interface Recommender {
  id: string;
  recommend(updates: PulseUpdate[], prefs: RadarPreferences, limit?: number): Recommendation[];
}

const norm = (value: string) => value.trim().toLowerCase();

/** Loose term match: "power bi" matches "Power BI dashboards"; "finance" matches "Finance". */
function matches(term: string, candidates: string[]): string | undefined {
  const t = norm(term);
  if (t.length < 2) return undefined;
  return candidates.find((candidate) => {
    const c = norm(candidate);
    return c === t || c.includes(t) || (c.length > 3 && t.includes(c));
  });
}

function textOf(update: PulseUpdate): string[] {
  return [update.title, update.summary, update.signal.who, ...update.tags, ...update.skills, ...update.audience];
}

const WEIGHTS = {
  skillToLearn: 5,
  existingSkill: 4,
  category: 3,
  interest: 3,
  industry: 3,
  careerGoal: 2,
  learning: 2,
  income: 2,
  location: 2,
  remote: 2,
} as const;

export const ruleBasedRecommender: Recommender = {
  id: "rules-v1",
  recommend(updates, prefs, limit = 6) {
    if (!hasPreferences(prefs)) return [];
    const results: Recommendation[] = [];

    for (const update of updates) {
      let score = 0;
      const reasons: string[] = [];
      const add = (points: number, reason: string) => {
        score += points;
        if (!reasons.includes(reason)) reasons.push(reason);
      };
      const haystack = textOf(update);

      for (const skill of prefs.skillsToLearn) {
        const hit = matches(skill, [...update.skills, ...update.tags]);
        if (hit) add(WEIGHTS.skillToLearn, `You want to learn ${skill}`);
      }
      for (const skill of prefs.existingSkills) {
        const hit = matches(skill, [...update.skills, ...update.tags]);
        if (hit) add(WEIGHTS.existingSkill, `Uses your existing skill: ${skill}`);
      }
      if (prefs.categories.includes(update.category)) add(WEIGHTS.category, `You follow ${getCategory(update.category).label}`);
      for (const interest of prefs.interests) if (matches(interest, haystack)) add(WEIGHTS.interest, `Matches your interest in ${interest}`);
      for (const industry of prefs.industries) if (matches(industry, haystack)) add(WEIGHTS.industry, `Relevant to ${industry}`);
      for (const goal of prefs.careerGoals) if (matches(goal, haystack)) add(WEIGHTS.careerGoal, `Supports your goal: ${goal}`);
      if (update.category === "learning") for (const topic of prefs.learningInterests) if (matches(topic, haystack)) add(WEIGHTS.learning, `You want to learn about ${topic}`);
      if (update.category === "money" || update.category === "jobs") for (const topic of prefs.incomeInterests) if (matches(topic, haystack)) add(WEIGHTS.income, `Fits your income interest: ${topic}`);

      if (update.category === "jobs" || update.category === "opportunities") {
        const isRemote = update.job?.remote === "remote" || /remote|online|global/i.test(update.location ?? "");
        if (prefs.remote === "remote_only" && !isRemote) continue; // respect a hard preference
        if (prefs.remote === "remote_only" && isRemote) add(WEIGHTS.remote, "Remote — as you prefer");
        for (const place of prefs.locations) if (update.location && matches(place, [update.location, update.eligibility ?? ""])) add(WEIGHTS.location, `Open in ${place}`);
      }

      if (score > 0) {
        // Small boost for verified items so checked information ranks above demonstrations.
        if (update.verification === "verified") score += 1;
        results.push({ update, score, reasons: reasons.slice(0, 3) });
      }
    }

    return results.sort((a, b) => b.score - a.score || Date.parse(b.update.publishedAt) - Date.parse(a.update.publishedAt)).slice(0, limit);
  },
};

/** Parse a comma-separated input into a clean list. */
export function parseList(value: string, max = 12): string[] {
  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))].slice(0, max);
}
