import { collectLinks, composeIssue, validateIssueContent } from "@/lib/newsletter/compose";
import { EDITION_KINDS, EDITIONS, isDue, jubaClock, latestIssueDate, scheduleTasks } from "@/lib/newsletter/schedule";
import type { EditionKind, IssueStatus, LinkCheck, NewsletterIssue, NewsletterRun } from "@/lib/newsletter/types";
import { getPulseStore } from "@/lib/server/pulse/repository";
import { autoPublishEnabled, emailSendingEnabled } from "./config";
import { renderIssueEmail, sendEmail } from "./email";
import { getNewsletterStore } from "./store";

type Trigger = NewsletterRun["trigger"];
export interface StepResult {
  action: NewsletterRun["action"];
  kind?: EditionKind;
  issueDate?: string;
  outcome: NewsletterRun["outcome"];
  message: string;
  issueId?: string;
}

/** Statuses that may still be (re)generated — anything not yet public. */
const EDITABLE: IssueStatus[] = ["draft", "awaiting_approval", "scheduled", "failed"];

async function log(result: StepResult, trigger: Trigger): Promise<StepResult> {
  try {
    await getNewsletterStore().recordRun({ ...result, trigger });
  } catch (error) {
    console.error("[newsletter] could not record run", error, result);
  }
  if (result.outcome === "failed") console.error("[newsletter]", result);
  return result;
}

/**
 * Check external links. A HEAD (then GET) with a short timeout; network
 * failures are recorded as warnings rather than blocking, because some
 * sites refuse automated requests. Internal links are validated structurally.
 */
export async function checkLinks(hrefs: string[]): Promise<LinkCheck[]> {
  const external = hrefs.filter((href) => href.startsWith("https://"));
  return Promise.all(external.map(async (href) => {
    for (const method of ["HEAD", "GET"] as const) {
      try {
        const response = await fetch(href, { method, redirect: "follow", cache: "no-store", signal: AbortSignal.timeout(6000), headers: { "User-Agent": "ImpactFools-LinkCheck/1.0" } });
        if (response.ok || (method === "GET" && response.status < 500 && response.status !== 404 && response.status !== 410)) return { href, ok: response.ok, status: response.status };
        if (response.status === 404 || response.status === 410) return { href, ok: false, status: response.status, note: "Not found" };
      } catch (error) {
        if (method === "GET") return { href, ok: false, note: error instanceof Error ? error.name : "Request failed" };
      }
    }
    return { href, ok: false, note: "Unreachable" };
  }));
}

/** Research + draft. Idempotent per (kind, issue date). `regenerate` rebuilds an unpublished draft. */
export async function prepareIssue(kind: EditionKind, issueDate: string, options: { trigger: Trigger; now?: Date; regenerate?: boolean }): Promise<StepResult & { issue?: NewsletterIssue }> {
  const now = options.now ?? new Date();
  const store = getNewsletterStore();
  const base = { action: "prepare" as const, kind, issueDate };
  if (store.kind === "none") return log({ ...base, outcome: "failed", message: "No database is configured, so nothing can be prepared." }, options.trigger);

  try {
    const existing = await store.findIssue(kind, issueDate);
    if (existing && (!options.regenerate || !EDITABLE.includes(existing.status))) {
      return { ...(await log({ ...base, outcome: "skipped", issueId: existing.id, message: `Already prepared (status: ${existing.status}).` }, options.trigger)), issue: existing };
    }

    const updates = await getPulseStore().listUpdates({ statuses: ["published"] }, { fresh: true });
    const { issue: draft, errors } = composeIssue(kind, updates, issueDate, now);
    const linkChecks = await checkLinks(collectLinks(draft.content));
    const broken = linkChecks.filter((check) => !check.ok);
    const research = {
      ...draft.research,
      linkChecks,
      warnings: [...draft.research.warnings, ...broken.map((check) => `Link check failed for ${check.href} (${check.status ?? check.note}). Review before publishing.`)],
    };
    const blocking = [...errors, ...validateIssueContent(draft.content, kind).filter((error) => !errors.length || !error.includes("discoveries"))];
    const status: IssueStatus = blocking.length ? "failed" : autoPublishEnabled() ? "scheduled" : "awaiting_approval";
    const record = {
      ...draft,
      research,
      status,
      failureReason: blocking.length ? blocking.join(" ") : undefined,
      approvedBy: status === "scheduled" ? "auto-publish" : undefined,
      approvedAt: status === "scheduled" ? now.toISOString() : undefined,
    };

    const saved = existing
      ? await store.patchIssue(existing.id, record, EDITABLE)
      : await store.insertIssue({ ...record, id: "", createdAt: now.toISOString(), updatedAt: now.toISOString() });
    if (!saved) {
      const current = await store.findIssue(kind, issueDate);
      return { ...(await log({ ...base, outcome: "skipped", issueId: current?.id, message: "Another run prepared this issue at the same time." }, options.trigger)), issue: current ?? undefined };
    }
    const message = status === "failed"
      ? `Draft saved but cannot be published: ${blocking.join(" ")}`
      : status === "scheduled"
        ? `Prepared and auto-approved; publishes at 07:00 Juba on ${issueDate}.`
        : "Prepared and waiting for editorial approval.";
    return { ...(await log({ ...base, outcome: status === "failed" ? "failed" : "success", issueId: saved.id, message }, options.trigger)), issue: saved };
  } catch (error) {
    return log({ ...base, outcome: "failed", message: `Preparation failed: ${error instanceof Error ? error.message : String(error)}` }, options.trigger);
  }
}

/**
 * Approve an issue. If its 07:00 Juba time has passed it publishes now;
 * otherwise it is scheduled and the next scheduler run publishes it.
 */
export async function approveIssue(id: string, options: { by: string; now?: Date; publishNow?: boolean }): Promise<StepResult> {
  const now = options.now ?? new Date();
  const store = getNewsletterStore();
  const issue = await store.getIssue(id, { fresh: true });
  if (!issue) return { action: "publish", outcome: "failed", message: "Issue not found." };
  const errors = validateIssueContent(issue.content, issue.kind);
  if (errors.length) return log({ action: "publish", kind: issue.kind, issueDate: issue.issueDate, issueId: issue.id, outcome: "failed", message: `Not approved: ${errors.join(" ")}` }, "admin");
  const approved = await store.patchIssue(issue.id, { status: "scheduled", approvedBy: options.by, approvedAt: now.toISOString(), failureReason: undefined }, ["draft", "awaiting_approval", "failed", "scheduled"]);
  if (!approved) return { action: "publish", outcome: "skipped", message: `Issue is already ${issue.status}.` };
  if (options.publishNow || isDue(issue.issueDate, now)) return publishIssue(approved, { trigger: "admin", now });
  return log({ action: "publish", kind: issue.kind, issueDate: issue.issueDate, issueId: issue.id, outcome: "success", message: `Approved; will publish at 07:00 Juba on ${issue.issueDate}.` }, "admin");
}

/** Publish a scheduled issue exactly once, archive the previous one, then send. */
export async function publishIssue(issue: NewsletterIssue, options: { trigger: Trigger; now?: Date }): Promise<StepResult> {
  const now = options.now ?? new Date();
  const store = getNewsletterStore();
  const base = { action: "publish" as const, kind: issue.kind, issueDate: issue.issueDate, issueId: issue.id };
  const errors = validateIssueContent(issue.content, issue.kind);
  if (errors.length) {
    await store.patchIssue(issue.id, { status: "failed", failureReason: errors.join(" ") }, EDITABLE);
    return log({ ...base, outcome: "failed", message: `Not published — the previous edition stays live. ${errors.join(" ")}` }, options.trigger);
  }
  const published = await store.patchIssue(issue.id, { status: "published", publishedAt: now.toISOString(), failureReason: undefined }, ["scheduled"]);
  if (!published) return log({ ...base, outcome: "skipped", message: "Already published or not approved (duplicate publish prevented)." }, options.trigger);

  const previous = await store.listIssues({ kinds: [issue.kind], statuses: ["published"] }, { fresh: true });
  for (const older of previous) if (older.id !== published.id && older.issueDate < published.issueDate) await store.patchIssue(older.id, { status: "archived" }, ["published"]);

  const result = await log({ ...base, outcome: "success", message: `Published ${EDITIONS[issue.kind].short} for ${issue.issueDate}.` }, options.trigger);
  if (emailSendingEnabled()) await sendIssue(published, { trigger: options.trigger });
  else await log({ action: "send", kind: issue.kind, issueDate: issue.issueDate, issueId: issue.id, outcome: "skipped", message: "Email delivery not configured — published to the website only." }, options.trigger);
  return result;
}

/**
 * Email one issue to every verified, active subscriber who chose that edition.
 * Each recipient is claimed in newsletter_sends before sending, so overlapping
 * or repeated runs never email anyone twice; unfinished batches resume next run.
 */
export async function sendIssue(issue: NewsletterIssue, options: { trigger: Trigger; budgetMs?: number }): Promise<StepResult> {
  const started = Date.now();
  const budget = options.budgetMs ?? 45_000;
  const base = { action: "send" as const, kind: issue.kind, issueDate: issue.issueDate, issueId: issue.id };
  if (!emailSendingEnabled()) return log({ ...base, outcome: "skipped", message: "Email delivery is not configured." }, options.trigger);
  if (issue.status !== "published") return log({ ...base, outcome: "skipped", message: "Only published issues are emailed." }, options.trigger);
  const store = getNewsletterStore();
  const subscribers = (await getPulseStore().listSubscribers()).filter((subscriber) =>
    subscriber.status === "active" && subscriber.verifiedAt && (subscriber.editions ?? ["whats_hot", "weekend_top3"]).includes(issue.kind));

  let sent = 0;
  let failed = 0;
  let skipped = 0;
  let outOfTime = false;
  for (const subscriber of subscribers) {
    if (Date.now() - started > budget) { outOfTime = true; break; }
    if (!(await store.claimSend(issue.id, subscriber.id))) { skipped++; continue; }
    try {
      const email = renderIssueEmail(issue, subscriber);
      const { id } = await sendEmail({ to: subscriber.email, ...email, idempotencyKey: `issue-${issue.id}-${subscriber.id}` });
      await store.finishSend(issue.id, subscriber.id, { status: "sent", providerId: id });
      sent++;
    } catch (error) {
      failed++;
      await store.finishSend(issue.id, subscriber.id, { status: "failed", error: error instanceof Error ? error.message : String(error) });
    }
  }
  if (!outOfTime) await store.patchIssue(issue.id, { sentAt: new Date().toISOString() });
  return log({
    ...base,
    outcome: failed && !sent ? "failed" : "success",
    message: `${sent} sent, ${failed} failed, ${skipped} already handled of ${subscribers.length} eligible subscribers.${outOfTime ? " Time budget reached — the rest continue on the next scheduler run." : ""}`,
  }, options.trigger);
}

/**
 * The scheduler entry point (Vercel Cron → /api/cron/newsletter, daily at
 * 05:00 UTC = 07:00 Juba). Safe to call any number of times.
 */
export async function runSchedule(options: { trigger: Trigger; now?: Date }): Promise<StepResult[]> {
  const now = options.now ?? new Date();
  const store = getNewsletterStore();
  if (store.kind === "none") return [await log({ action: "schedule", outcome: "failed", message: "No database is configured; the scheduler did nothing." }, options.trigger)];
  const results: StepResult[] = [];

  for (const task of scheduleTasks(now)) {
    if (task.action === "prepare") {
      results.push(summary(await prepareIssue(task.kind, task.issueDate, { trigger: options.trigger, now })));
      continue;
    }
    // Publish day: prepare if missing, retry research if the draft failed.
    let issue = await store.findIssue(task.kind, task.issueDate);
    if (!issue || issue.status === "failed") {
      const prepared = await prepareIssue(task.kind, task.issueDate, { trigger: options.trigger, now, regenerate: true });
      results.push(summary(prepared));
      issue = prepared.issue ?? null;
    }
    results.push(await publishScheduled(issue, task.kind, task.issueDate, options.trigger, now));
  }

  // Catch-up: an approved issue whose time has passed (late approval, missed cron) is published now.
  const today = jubaClock(now).date;
  for (const kind of EDITION_KINDS) {
    const issueDate = latestIssueDate(kind, today);
    if (!isDue(issueDate, now) || results.some((result) => result.kind === kind && result.action === "publish")) continue;
    const issue = await store.findIssue(kind, issueDate);
    if (issue?.status === "scheduled") results.push(await publishIssue(issue, { trigger: options.trigger, now }));
  }

  // Resume unfinished email batches from the last few days.
  if (emailSendingEnabled()) {
    const recent = await store.listIssues({ statuses: ["published"], limit: 6 }, { fresh: true });
    for (const issue of recent) if (!issue.sentAt && issue.issueDate >= latestIssueDate(issue.kind, today)) results.push(await sendIssue(issue, { trigger: options.trigger }));
  }

  if (!results.length) results.push({ action: "schedule", outcome: "skipped", message: `Nothing due at ${jubaClock(now).date} ${String(jubaClock(now).hour).padStart(2, "0")}:${String(jubaClock(now).minute).padStart(2, "0")} Juba.` });
  return results;
}

/** Scheduler results carry status only, never issue content. */
function summary({ action, kind, issueDate, outcome, message, issueId }: StepResult & { issue?: NewsletterIssue }): StepResult {
  return { action, kind, issueDate, outcome, message, issueId };
}

async function publishScheduled(issue: NewsletterIssue | null, kind: EditionKind, issueDate: string, trigger: Trigger, now: Date): Promise<StepResult> {
  const base = { action: "publish" as const, kind, issueDate, issueId: issue?.id };
  if (!issue) return log({ ...base, outcome: "failed", message: "No issue could be prepared. The previous edition stays live with its original date." }, trigger);
  if (issue.status === "published" || issue.status === "archived") return { ...base, outcome: "skipped", message: "Already published." };
  if (issue.status === "failed") return log({ ...base, outcome: "failed", message: `Not published — the previous edition stays live with its original date. ${issue.failureReason ?? ""}`.trim() }, trigger);
  if (issue.status !== "scheduled") return log({ ...base, outcome: "skipped", message: "Waiting for editorial approval. The previous edition stays live with its original date." }, trigger);
  return publishIssue(issue, { trigger, now });
}
