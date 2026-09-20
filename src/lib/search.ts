import type { Course, DiscoveryItem } from "@/lib/types";
import { DISCOVERY_ITEMS } from "@/lib/data/discovery-items";
import { COURSES } from "@/lib/data/courses";
import { TYPE_LABELS, INCREASE_AREA_LABELS } from "@/lib/data/constants";

function haystack(item: DiscoveryItem) {
  return [
    item.title,
    item.shortDescription,
    item.fullDescription,
    item.categoryLabel,
    TYPE_LABELS[item.type],
    ...(item.increaseAreas ?? []).map((a) => INCREASE_AREA_LABELS[a]),
    item.whatCouldThisIncrease ?? "",
    item.whoItsFor ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "i",
  "me",
  "my",
  "with",
  "for",
  "to",
  "of",
  "in",
  "on",
  "how",
  "what",
  "do",
  "i",
  "can",
  "become",
  "and",
  "at",
]);

export function searchDiscoveryItems(query: string): DiscoveryItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter((w) => w.length > 1 && !STOPWORDS.has(w));

  const scored = DISCOVERY_ITEMS.map((item) => {
    const text = haystack(item);
    let score = 0;
    if (text.includes(q)) score += 5;
    for (const w of words) {
      if (item.title.toLowerCase().includes(w)) score += 3;
      if (text.includes(w)) score += 1;
    }
    return { item, score };
  }).filter((r) => r.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.map((r) => r.item);
}

export function searchCourses(query: string): Course[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter((word) => word.length > 1 && !STOPWORDS.has(word));

  return COURSES.map((course) => {
    const text = [
      course.title,
      course.shortDescription,
      course.category,
      course.builds,
      course.whoItsFor,
      ...course.whatYoullBeAbleToDo,
      ...course.tracks,
    ]
      .join(" ")
      .toLowerCase();
    let score = text.includes(q) ? 5 : 0;
    for (const word of words) {
      if (course.title.toLowerCase().includes(word)) score += 3;
      if (text.includes(word)) score += 1;
    }
    return { course, score };
  })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.course);
}
