import { TIME_SENSITIVE_CATEGORIES } from "./categories";
import type { OpportunityLifecycle, PulseCategory, PulseUpdate } from "./types";

const DAY = 24 * 60 * 60 * 1000;

/** End of the given calendar day (UTC), so a deadline of "2026-11-30" stays open all that day. */
function endOfDay(date: string): number {
  const parsed = Date.parse(date.length === 10 ? `${date}T23:59:59Z` : date);
  return Number.isNaN(parsed) ? NaN : parsed;
}

export function lifecycle(update: Pick<PulseUpdate, "deadline">, now = Date.now()): OpportunityLifecycle {
  if (!update.deadline) return "no_deadline";
  const end = endOfDay(update.deadline);
  if (Number.isNaN(end)) return "no_deadline";
  if (end < now) return "closed";
  if (end - now <= 14 * DAY) return "closing_soon";
  return "open";
}

/** Hidden from readers once past its expiry date, or once an application deadline passes. */
export function isExpired(update: Pick<PulseUpdate, "deadline" | "expiresAt" | "category">, now = Date.now()): boolean {
  if (update.expiresAt && endOfDay(update.expiresAt) < now) return true;
  if (TIME_SENSITIVE_CATEGORIES.has(update.category) && lifecycle(update, now) === "closed") return true;
  return false;
}

/** Only published, unexpired updates are ever shown as current. */
export function isLive(update: PulseUpdate, now = Date.now()): boolean {
  return update.status === "published" && !isExpired(update, now);
}

export function daysLeft(deadline: string, now = Date.now()): number {
  return Math.ceil((endOfDay(deadline) - now) / DAY);
}

/**
 * Wording for a deadline that never claims an opportunity is open unless an
 * editor verified it; unverified or demo items say "listed deadline".
 */
export function deadlineLabel(update: PulseUpdate, now = Date.now()): string | null {
  if (!update.deadline) return null;
  const state = lifecycle(update, now);
  const date = new Date(endOfDay(update.deadline)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  if (state === "closed") return `Closed ${date}`;
  if (update.verification !== "verified") return `Listed deadline ${date} — confirm with the source`;
  return state === "closing_soon" ? `Closes in ${daysLeft(update.deadline, now)} days (${date})` : `Deadline ${date}`;
}

export function sortFeed(updates: PulseUpdate[]): PulseUpdate[] {
  // Verified editorial content before demonstration content; featured first; newest first.
  const rank = (u: PulseUpdate) => (u.verification === "demo" ? 1 : 0);
  return [...updates].sort((a, b) =>
    rank(a) - rank(b) ||
    Number(b.featured) - Number(a.featured) ||
    Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  );
}

export function filterByCategory(updates: PulseUpdate[], category: PulseCategory | "all"): PulseUpdate[] {
  return category === "all" ? updates : updates.filter((update) => update.category === category);
}

const STOPWORDS = new Set(["a", "an", "the", "and", "or", "for", "to", "of", "in", "on", "with", "how", "what", "i", "my", "me", "is"]);

function haystack(update: PulseUpdate): string {
  return [
    update.title,
    update.summary,
    update.category,
    update.signal.what,
    update.signal.who,
    update.job?.company ?? "",
    update.location ?? "",
    ...update.tags,
    ...update.skills,
    ...update.audience,
  ].join(" ").toLowerCase();
}

export function searchUpdates(updates: PulseUpdate[], query: string): PulseUpdate[] {
  const q = query.trim().toLowerCase();
  if (!q) return updates;
  const words = q.split(/\s+/).filter((word) => word.length > 1 && !STOPWORDS.has(word));
  return updates
    .map((update) => {
      const text = haystack(update);
      let score = text.includes(q) ? 6 : 0;
      for (const word of words) {
        if (update.title.toLowerCase().includes(word)) score += 3;
        if (update.skills.some((skill) => skill.toLowerCase().includes(word))) score += 2;
        if (text.includes(word)) score += 1;
      }
      return { update, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.update);
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const visible = items.slice(0, page * pageSize);
  return { visible, hasMore: visible.length < items.length, total: items.length };
}

export function pickFeatured(updates: PulseUpdate[]): PulseUpdate | undefined {
  return updates.find((update) => update.featured && update.verification === "verified")
    ?? updates.find((update) => update.featured)
    ?? updates[0];
}

export function formatDate(date: string): string {
  const parsed = Date.parse(date);
  if (Number.isNaN(parsed)) return date;
  return new Date(parsed).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
