"use server";

import { headers } from "next/headers";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, requireAdmin, startSession } from "@/lib/server/admin-auth";
import { createUpdate, getPulseStore, newToken } from "@/lib/server/pulse/repository";
import { PULSE_CACHE_TAG } from "@/lib/server/pulse/supabase-store";
import { slugify, validateUpdateInput } from "@/lib/pulse/validate";
import { composeEditionDraft, parseSectionLines } from "@/lib/pulse/newsletter";
import type { BriefSections, NewsletterEdition, PulseStatus } from "@/lib/pulse/types";

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

/* ---------- Newsletter ---------- */

export async function composeEdition() {
  await requireAdmin();
  const store = getPulseStore();
  const updates = await store.listUpdates({ statuses: ["published"] }, { fresh: true });
  const now = new Date().toISOString();
  const draft = composeEditionDraft(updates, now);
  const saved = await store.upsertEdition({ ...draft, slug: `${draft.slug}-${newToken().slice(0, 6).toLowerCase().replace(/[^a-z0-9]/g, "x")}` });
  redirect(`/admin/newsletter/${saved.id}`);
}

export async function saveEdition(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const store = getPulseStore();
  const id = String(formData.get("id") ?? "");
  const existing = await store.getEdition(id, { fresh: true });
  if (!existing) return { errors: ["Edition not found."] };

  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? ""));
  const intro = String(formData.get("intro") ?? "").trim().slice(0, 1200);
  const status = String(formData.get("status") ?? "draft") as NewsletterEdition["status"];
  const errors: string[] = [];
  if (title.length < 4) errors.push("Title must be at least 4 characters.");
  if (!slug || slug === "manage") errors.push("Choose a valid slug.");
  if (!["draft", "published", "archived"].includes(status)) errors.push("Unknown status.");

  const sections = {} as BriefSections;
  for (const key of ["whatsHot", "skillWorthBuilding", "opportunities", "learnSomething", "moneyMove", "powerMove"] as const) {
    const parsed = parseSectionLines(String(formData.get(`section.${key}`) ?? ""));
    errors.push(...parsed.errors.map((error) => `${key}: ${error}`));
    sections[key] = parsed.items;
  }
  if (errors.length) return { errors };

  await store.upsertEdition({
    ...existing,
    title,
    slug,
    intro,
    sections,
    status,
    publishedAt: status === "published" ? existing.publishedAt ?? new Date().toISOString().slice(0, 10) : existing.publishedAt,
    updatedAt: new Date().toISOString(),
  });
  refreshPublic();
  return { ok: true, message: status === "published" ? "Saved and published to the web archive. No emails were sent (delivery isn’t configured)." : "Saved." };
}
