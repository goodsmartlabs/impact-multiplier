import type { EditionKind } from "./types";

/** All newsletter scheduling happens in South Sudan time (UTC+2, no daylight saving). */
export const NEWSLETTER_TIME_ZONE = "Africa/Juba";
export const PUBLISH_HOUR = 7;

export const EDITIONS: Record<EditionKind, { label: string; short: string; weekday: number; day: string; emoji: string; slugPrefix: string; tagline: string }> = {
  whats_hot: { label: "Monday: What’s Hot", short: "What’s Hot", weekday: 1, day: "Monday", emoji: "🔥", slugPrefix: "whats-hot", tagline: "The skills, tools and opportunities worth your attention this week." },
  weekend_top3: { label: "Friday: Your Weekend Top 3", short: "Weekend Top 3", weekday: 5, day: "Friday", emoji: "🎯", slugPrefix: "weekend-top-3", tagline: "Stop collecting opportunities. Start building something." },
};

export const EDITION_KINDS = Object.keys(EDITIONS) as EditionKind[];

export function isEditionKind(value: unknown): value is EditionKind {
  return value === "whats_hot" || value === "weekend_top3";
}

export interface JubaClock {
  date: string; // YYYY-MM-DD
  weekday: number; // 0 = Sunday
  hour: number;
  minute: number;
}

/** Wall-clock time in Juba for an instant, via Intl so it never depends on the server's zone. */
export function jubaClock(at: Date): JubaClock {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: NEWSLETTER_TIME_ZONE,
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short", hourCycle: "h23",
  }).formatToParts(at);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    weekday: weekdays.indexOf(get("weekday")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function weekdayOf(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).getUTCDay();
}

/** The most recent issue date for an edition on or before `today` (Juba date). */
export function latestIssueDate(kind: EditionKind, today: string): string {
  const diff = (weekdayOf(today) - EDITIONS[kind].weekday + 7) % 7;
  return addDays(today, -diff);
}

/** The next issue date strictly after `today`, or today itself if it is the edition's day. */
export function upcomingIssueDate(kind: EditionKind, today: string): string {
  const diff = (EDITIONS[kind].weekday - weekdayOf(today) + 7) % 7;
  return addDays(today, diff);
}

/** The instant an issue is due: 07:00 Juba on its issue date (05:00 UTC). */
export function publishInstant(issueDate: string): Date {
  return new Date(`${issueDate}T0${PUBLISH_HOUR - 2}:00:00Z`);
}

export function isDue(issueDate: string, now: Date): boolean {
  return now.getTime() >= publishInstant(issueDate).getTime();
}

export type ScheduleTask = { action: "prepare" | "publish"; kind: EditionKind; issueDate: string };

/**
 * What the daily scheduler should do at `now`.
 * - The day before an edition (Sunday / Thursday) it prepares the draft so editors can review it.
 * - On the edition day from 07:00 Juba it publishes (preparing first if no draft exists).
 * Every task is idempotent, so a cron that fires twice, or late, is harmless.
 */
export function scheduleTasks(now: Date): ScheduleTask[] {
  const clock = jubaClock(now);
  const tasks: ScheduleTask[] = [];
  for (const kind of EDITION_KINDS) {
    const { weekday } = EDITIONS[kind];
    if (clock.weekday === weekday && clock.hour >= PUBLISH_HOUR) tasks.push({ action: "publish", kind, issueDate: clock.date });
    else if ((clock.weekday + 1) % 7 === weekday) tasks.push({ action: "prepare", kind, issueDate: addDays(clock.date, 1) });
  }
  return tasks;
}

export function issueSlug(kind: EditionKind, issueDate: string) {
  return `${EDITIONS[kind].slugPrefix}-${issueDate}`;
}

export function formatIssueDate(isoDate: string, style: "long" | "short" = "long") {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: style === "long" ? "long" : "short",
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  }).format(new Date(`${isoDate}T12:00:00Z`));
}

/**
 * Whether a published issue is the one expected right now. When it isn't
 * (the scheduled edition failed or is still awaiting approval) the site
 * keeps showing it, but labels it with its real date rather than as new.
 */
export function isCurrentIssue(kind: EditionKind, issueDate: string, now: Date): boolean {
  const today = jubaClock(now).date;
  let expected = latestIssueDate(kind, today);
  if (!isDue(expected, now)) expected = addDays(expected, -7);
  return issueDate >= expected;
}
