import type { PulseCategory } from "./types";

export interface CategoryMeta {
  id: PulseCategory;
  label: string;
  emoji: string;
  /** Short description used on filters and category pages. */
  blurb: string;
  tone: "pink" | "blue" | "ink";
}

export const PULSE_CATEGORIES: CategoryMeta[] = [
  { id: "trending", label: "Trending Now", emoji: "🔥", blurb: "Emerging trends, new technologies and market shifts.", tone: "pink" },
  { id: "jobs", label: "Jobs & Gigs", emoji: "💼", blurb: "Remote roles, freelance projects, internships and contracts.", tone: "blue" },
  { id: "skills", label: "Skills in Demand", emoji: "🧠", blurb: "Skills gaining value — who needs them and how to learn them.", tone: "pink" },
  { id: "learning", label: "Courses & Learning", emoji: "🎓", blurb: "Courses, certifications, workshops and resources.", tone: "blue" },
  { id: "money", label: "Money Moves", emoji: "💰", blurb: "Legitimate ways to turn skills into income.", tone: "pink" },
  { id: "opportunities", label: "Opportunities", emoji: "🚀", blurb: "Fellowships, grants, competitions, accelerators and scholarships.", tone: "blue" },
  { id: "ai", label: "AI & Technology", emoji: "🤖", blurb: "Useful tools and automation changing how people work.", tone: "ink" },
  { id: "industry", label: "Industry Watch", emoji: "🌍", blurb: "Developments across finance, business, education and more.", tone: "blue" },
];

const BY_ID = new Map(PULSE_CATEGORIES.map((category) => [category.id, category]));

export function getCategory(id: PulseCategory): CategoryMeta {
  return BY_ID.get(id)!;
}

export function isPulseCategory(value: unknown): value is PulseCategory {
  return typeof value === "string" && BY_ID.has(value as PulseCategory);
}

/** Categories whose items are things people apply for, so deadlines matter. */
export const TIME_SENSITIVE_CATEGORIES = new Set<PulseCategory>(["jobs", "opportunities"]);
