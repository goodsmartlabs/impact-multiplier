import { isLive } from "./feed";
import type { BriefItemRef, BriefSections, NewsletterEdition, PulseUpdate } from "./types";

export const BRIEF_SECTIONS: Array<{ key: keyof BriefSections; title: string; description: string; max: number }> = [
  { key: "whatsHot", title: "What’s Hot", description: "Three important developments", max: 3 },
  { key: "skillWorthBuilding", title: "Skill Worth Building", description: "One valuable skill", max: 1 },
  { key: "opportunities", title: "Opportunities Worth Exploring", description: "Five relevant opportunities", max: 5 },
  { key: "learnSomething", title: "Learn Something", description: "One course or resource", max: 1 },
  { key: "moneyMove", title: "Money Move", description: "One practical income-building idea", max: 1 },
  { key: "powerMove", title: "Your Power Move", description: "One actionable weekly challenge", max: 1 },
];

/**
 * Drafts an edition from published, live, non-demo updates. Editors review
 * and rewrite before publishing — nothing is sent automatically.
 */
export function composeEditionDraft(updates: PulseUpdate[], nowIso: string): NewsletterEdition {
  const live = updates.filter((update) => isLive(update) && update.verification !== "demo");
  const pick = (filter: (update: PulseUpdate) => boolean, count: number): BriefItemRef[] =>
    live.filter(filter).slice(0, count).map((update) => ({ slug: update.slug, title: update.title, note: update.signal.next }));

  const sections: BriefSections = {
    whatsHot: pick((u) => u.category === "trending" || u.category === "industry" || u.category === "ai", 3),
    skillWorthBuilding: pick((u) => u.category === "skills", 1),
    opportunities: pick((u) => u.category === "opportunities" || u.category === "jobs", 5),
    learnSomething: pick((u) => u.category === "learning", 1),
    moneyMove: pick((u) => u.category === "money", 1),
    powerMove: [],
  };
  const date = nowIso.slice(0, 10);
  return {
    id: "",
    slug: `impact-brief-${date}`,
    title: `The Impact Brief — ${date}`,
    intro: "",
    sections,
    status: "draft",
    demo: false,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

/** Editor format, one item per line: `title | note | slug-or-link` (slug or link optional). */
export function sectionToLines(items: BriefItemRef[]): string {
  return items.map((item) => [item.title, item.note, item.slug ?? item.href ?? ""].join(" | ").replace(/ \| $/, "")).join("\n");
}

export function parseSectionLines(value: string): { items: BriefItemRef[]; errors: string[] } {
  const items: BriefItemRef[] = [];
  const errors: string[] = [];
  for (const [index, raw] of value.split("\n").entries()) {
    const line = raw.trim();
    if (!line) continue;
    const [title = "", note = "", target = ""] = line.split("|").map((part) => part.trim());
    if (title.length < 3) {
      errors.push(`line ${index + 1} needs a title.`);
      continue;
    }
    const item: BriefItemRef = { title: title.slice(0, 160), note: note.slice(0, 400) };
    if (target) {
      if (/^https?:\/\//.test(target) || (target.startsWith("/") && !target.startsWith("//"))) item.href = target;
      else if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(target)) item.slug = target;
      else {
        errors.push(`line ${index + 1}: “${target}” isn’t a slug, /path or http(s) link.`);
        continue;
      }
    }
    items.push(item);
  }
  return { items: items.slice(0, 8), errors };
}
