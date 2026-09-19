import { DISCOVERY_ITEMS } from "@/lib/data/discovery-items";
import { COURSES } from "@/lib/data/courses";
import type { DiscoveryItem, Course, ImpactCartEntry } from "@/lib/types";

export interface ResolvedCartEntry {
  entry: ImpactCartEntry;
  discoveryItem?: DiscoveryItem;
  course?: Course;
  title: string;
  slug: string;
  href: string;
  categoryLabel: string;
}

export function resolveCartEntry(entry: ImpactCartEntry): ResolvedCartEntry | null {
  if (entry.itemKind === "discovery") {
    const item = DISCOVERY_ITEMS.find((i) => i.id === entry.itemId);
    if (!item) return null;
    return {
      entry,
      discoveryItem: item,
      title: item.title,
      slug: item.slug,
      href: `/item/${item.slug}`,
      categoryLabel: item.categoryLabel,
    };
  }
  const course = COURSES.find((c) => c.id === entry.itemId);
  if (!course) return null;
  return {
    entry,
    course,
    title: course.title,
    slug: course.slug,
    href: `/academy/${course.slug}`,
    categoryLabel: "COURSE • IMPACT MULTIPLIER ACADEMY",
  };
}
