"use server";

import { headers } from "next/headers";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, requireAdmin, startSession } from "@/lib/server/admin-auth";
import { createUpdate, getPulseStore } from "@/lib/server/pulse/repository";
import { PULSE_CACHE_TAG } from "@/lib/server/pulse/supabase-store";
import { validateUpdateInput } from "@/lib/pulse/validate";
import type { PulseStatus } from "@/lib/pulse/types";
import { validateIssueContent } from "@/lib/newsletter/compose";
import { isEditionKind, jubaClock, upcomingIssueDate } from "@/lib/newsletter/schedule";
import type { EditionKind, NewsletterIssue } from "@/lib/newsletter/types";
import { approveIssue, prepareIssue, runSchedule, sendIssue } from "@/lib/server/newsletter/pipeline";
import { getNewsletterStore, NEWSLETTER_CACHE_TAG } from "@/lib/server/newsletter/store";

export type FormState = { ok?: boolean; errors?: string[]; message?: string };

function refreshPublic() {
  updateTag(PULSE_CACHE_TAG);
  revalidatePath("/", "layout");
}

/* ---------- Session ---------- */

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const headerList = await headers();
  const client = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const result = checkPassword(password, client);
  if (result.locked) return { errors: ["Too many attempts. Try again in 15 minutes."] };
  if (!result.ok) return { errors: ["Incorrect password."] };
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/* ---------- Updates ---------- */

function formToObject(formData: FormData) {
  const get = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : undefined;
  };
  return {
    title: get("title"),
    slug: get("slug") || undefined,
    category: get("category"),
    summary: get("summary"),
    signal: { what: get("signal.what"), why: get("signal.why"), who: get("signal.who"), how: get("signal.how"), next: get("signal.next") },
    sourceName: get("sourceName"),
    sourceUrl: get("sourceUrl") || undefined,
    publishedAt: get("publishedAt") || undefined,
    lastVerifiedAt: get("lastVerifiedAt") || undefined,
    deadline: get("deadline") || undefined,
    expiresAt: get("expiresAt") || undefined,
    tags: get("tags"),
    skills: get("skills"),
    audience: get("audience"),
    location: get("location"),
    eligibility: get("eligibility"),
    job: get("job.company") || get("job.location") || get("job.remote") || get("job.employmentType")
      ? { company: get("job.company"), location: get("job.location"), remote: get("job.remote"), employmentType: get("job.employmentType") }
      : undefined,
    cta: { label: get("cta.label"), href: get("cta.href") },
    relatedCourseSlugs: get("relatedCourseSlugs"),
    status: get("status"),
    featured: get("featured"),
    verification: get("verification"),
    size: get("size"),
    reviewNote: get("reviewNote"),
  };
}

export async function saveUpdate(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const store = getPulseStore();
  if (store.kind === "none") return { errors: ["Storage isn’t configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY first."] };

  const id = String(formData.get("id") ?? "");
  const existing = id ? await store.getUpdate(id, { fresh: true }) : null;
  const validation = validateUpdateInput(formToObject(formData), { submittedBy: existing?.submittedBy ?? "editor" });
  if (!validation.ok) return { errors: validation.errors };

  let createdId: string | undefined;
  try {
    if (existing) {
      const { slug, ...rest } = validation.value;
      await store.patchUpdate(existing.id, { ...rest, slug: slug && slug !== existing.slug ? slug : existing.slug, submittedBy: existing.submittedBy });
    } else {
      createdId = (await createUpdate({ ...validation.value, submittedBy: "editor" })).id;
    }
  } catch (error) {
    return { errors: [error instanceof Error ? error.message : "Could not save."] };
  }
  refreshPublic();
  if (createdId) redirect(`/admin/updates/${createdId}?saved=1`);
  return { ok: true, message: "Saved." };
}

const STATUSES: PulseStatus[] = ["draft", "pending_review", "published", "expired", "archived", "rejected"];

/** Approve / reject / publish / expire / archive from lists and the review queue. */
export async function setUpdateStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as PulseStatus;
  if (!id || !STATUSES.includes(status)) return;
  const note = String(formData.get("reviewNote") ?? "").trim();
  await getPulseStore().patchUpdate(id, { status, ...(note ? { reviewNote: note.slice(0, 600) } : {}) });
  refreshPublic();
}

export async function toggleFeatured(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const store = getPulseStore();
  const update = await store.getUpdate(id, { fresh: true });
  if (!update) return;
  await store.patchUpdate(id, { featured: !update.featured });
  refreshPublic();
}

/** Marks every published update past its deadline/expiry as expired. */
export async function expirePastDeadline() {
  await requireAdmin();
  const { isExpired } = await import("@/lib/pulse/feed");
  const store = getPulseStore();
  const published = await store.listUpdates({ statuses: ["published"] }, { fresh: true });
  for (const update of published.filter((item) => isExpired(item))) {
    await store.patchUpdate(update.id, { status: "expired" });
  }
  refreshPublic();
}

/* ---------- Newsletter engine ---------- */

function refreshNewsletter() {
  updateTag(NEWSLETTER_CACHE_TAG);
  revalidatePath("/", "layout");
}

const asKind = (value: FormDataEntryValue | null): EditionKind | null => (isEditionKind(value) ? value : null);

/** Prepare (or regenerate) the next issue of an edition now, instead of waiting for the scheduler. */
export async function prepareNextIssue(formData: FormData) {
  await requireAdmin();
  const kind = asKind(formData.get("kind"));
  if (!kind) return;
  const issueDate = upcomingIssueDate(kind, jubaClock(new Date()).date);
  const result = await prepareIssue(kind, issueDate, { trigger: "admin", regenerate: formData.get("regenerate") === "1" });
  refreshNewsletter();
  if (result.issue) redirect(`/admin/newsletter/${result.issue.id}`);
  redirect(`/admin/newsletter?message=${encodeURIComponent(result.message)}`);
}

export async function regenerateIssue(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const issue = await getNewsletterStore().getIssue(id, { fresh: true });
  if (!issue) return;
  await prepareIssue(issue.kind, issue.issueDate, { trigger: "admin", regenerate: true });
  refreshNewsletter();
  redirect(`/admin/newsletter/${id}`);
}

export async function approveIssueAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const result = await approveIssue(id, { by: "editor", publishNow: formData.get("now") === "1" });
  refreshNewsletter();
  redirect(`/admin/newsletter/${id}?message=${encodeURIComponent(result.message)}`);
}

export async function unscheduleIssue(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await getNewsletterStore().patchIssue(id, { status: "awaiting_approval", approvedAt: undefined, approvedBy: undefined }, ["scheduled"]);
  refreshNewsletter();
  redirect(`/admin/newsletter/${id}`);
}

/** Withdraw a published issue from the site. Emails already sent can't be recalled. */
export async function archiveIssue(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await getNewsletterStore().patchIssue(id, { status: "archived" }, ["published"]);
  refreshNewsletter();
  redirect(`/admin/newsletter/${id}`);
}

export async function sendIssueAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const issue = await getNewsletterStore().getIssue(id, { fresh: true });
  if (!issue) return;
  const result = await sendIssue(issue, { trigger: "admin" });
  redirect(`/admin/newsletter/${id}?message=${encodeURIComponent(result.message)}`);
}

/** Save editorial changes to an unpublished issue's structured content. */
export async function saveIssueContent(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const store = getNewsletterStore();
  const id = String(formData.get("id") ?? "");
  const issue = await store.getIssue(id, { fresh: true });
  if (!issue) return { errors: ["Issue not found."] };
  if (!["draft", "awaiting_approval", "failed", "scheduled"].includes(issue.status)) return { errors: ["Published issues can’t be edited. Archive it and prepare a new one instead."] };
  let content: unknown;
  try {
    content = JSON.parse(String(formData.get("content") ?? ""));
  } catch {
    return { errors: ["Content isn’t valid JSON."] };
  }
  const errors = validateIssueContent(content, issue.kind);
  if (errors.length) return { errors };
  const title = String(formData.get("title") ?? "").trim().slice(0, 200) || issue.title;
  await store.patchIssue(issue.id, { content: content as NewsletterIssue["content"], title, status: "awaiting_approval", failureReason: undefined, approvedAt: undefined, approvedBy: undefined }, ["draft", "awaiting_approval", "failed", "scheduled"]);
  refreshNewsletter();
  return { ok: true, message: "Saved. The issue is back in the approval queue." };
}

export async function runSchedulerNow() {
  await requireAdmin();
  const results = await runSchedule({ trigger: "admin" });
  refreshNewsletter();
  redirect(`/admin/newsletter?message=${encodeURIComponent(results.map((result) => `${result.action}${result.kind ? ` ${result.kind}` : ""}: ${result.outcome} — ${result.message}`).join(" | "))}`);
}
