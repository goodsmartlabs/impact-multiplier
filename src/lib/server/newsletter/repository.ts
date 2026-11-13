import { EDITION_KINDS, isCurrentIssue } from "@/lib/newsletter/schedule";
import type { EditionKind, NewsletterIssue } from "@/lib/newsletter/types";
import { getNewsletterStore } from "./store";

const PUBLIC_STATUSES = ["published", "archived"] as const;

async function safe<T>(read: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await read();
  } catch (error) {
    console.error("[newsletter] read failed", error);
    return fallback;
  }
}

export interface CurrentEdition {
  kind: EditionKind;
  issue: NewsletterIssue | null;
  /** False when the scheduled edition hasn't been published — the site then shows the latest one with its real date. */
  isCurrent: boolean;
}

/** The latest public issue of each edition. Never invents one when none exists. */
export async function getCurrentEditions(now = new Date()): Promise<CurrentEdition[]> {
  const issues = await safe(() => getNewsletterStore().listIssues({ statuses: [...PUBLIC_STATUSES], limit: 40 }), []);
  return EDITION_KINDS.map((kind) => {
    const issue = issues.filter((item) => item.kind === kind).sort((a, b) => b.issueDate.localeCompare(a.issueDate))[0] ?? null;
    return { kind, issue, isCurrent: issue ? isCurrentIssue(kind, issue.issueDate, now) : false };
  });
}

export async function getArchive(kind?: EditionKind): Promise<NewsletterIssue[]> {
  return safe(() => getNewsletterStore().listIssues({ statuses: [...PUBLIC_STATUSES], kinds: kind ? [kind] : undefined, limit: 200 }), []);
}

export async function getPublicIssue(slug: string): Promise<NewsletterIssue | null> {
  const issue = await safe(() => getNewsletterStore().getIssue(slug), null);
  return issue && (PUBLIC_STATUSES as readonly string[]).includes(issue.status) ? issue : null;
}
