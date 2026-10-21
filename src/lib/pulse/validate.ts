import { isPulseCategory } from "./categories";
import type { CardSize, PulseStatus, PulseUpdateInput, Verification } from "./types";

const STATUSES: PulseStatus[] = ["draft", "pending_review", "published", "expired", "archived", "rejected"];
const VERIFICATIONS: Verification[] = ["verified", "unverified", "demo"];
const SIZES: CardSize[] = ["feature", "standard", "compact"];

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

/** CTAs may point inside the site (/academy/…) or to an external http(s) page. */
export function isSafeHref(value: unknown): value is string {
  return typeof value === "string" && ((value.startsWith("/") && !value.startsWith("//")) || isHttpUrl(value));
}

export function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value) && !Number.isNaN(Date.parse(value));
}

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const list = (value: unknown, maxItems = 12, maxLength = 60): string[] =>
  Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === "string").map((item) => item.trim().slice(0, maxLength)).filter(Boolean))].slice(0, maxItems)
    : typeof value === "string"
      ? list(value.split(","), maxItems, maxLength)
      : [];
const optionalDate = (value: unknown) => (isIsoDate(value) ? value.slice(0, 10) : undefined);

export type ValidationResult = { ok: true; value: PulseUpdateInput } | { ok: false; errors: string[] };

/**
 * One validator for every way content enters Impact Pulse: the admin editor
 * and agent ingestion. Unknown fields are dropped; nothing is trusted as-is.
 */
export function validateUpdateInput(raw: unknown, defaults: Partial<PulseUpdateInput> = {}): ValidationResult {
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const signal = (body.signal && typeof body.signal === "object" ? body.signal : {}) as Record<string, unknown>;
  const cta = (body.cta && typeof body.cta === "object" ? body.cta : {}) as Record<string, unknown>;
  const job = (body.job && typeof body.job === "object" ? body.job : undefined) as Record<string, unknown> | undefined;
  const errors: string[] = [];

  const title = text(body.title, 160);
  const summary = text(body.summary, 600);
  if (title.length < 8) errors.push("Title must be at least 8 characters.");
  if (summary.length < 30) errors.push("Summary must be at least 30 characters.");
  if (!isPulseCategory(body.category)) errors.push("Category is missing or not recognised.");

  const signalValue = {
    what: text(signal.what, 800),
    why: text(signal.why, 800),
    who: text(signal.who, 600),
    how: text(signal.how, 800),
    next: text(signal.next, 600),
  };
  for (const [key, value] of Object.entries(signalValue)) {
    if (value.length < 10) errors.push(`Impact Signal “${key.toUpperCase()}” needs at least 10 characters.`);
  }

  const sourceName = text(body.sourceName, 120);
  if (!sourceName) errors.push("Source name is required.");
  const sourceUrl = body.sourceUrl === undefined || body.sourceUrl === "" ? undefined : body.sourceUrl;
  if (sourceUrl !== undefined && !isHttpUrl(sourceUrl)) errors.push("Source URL must be a full http(s) link.");

  const verification = VERIFICATIONS.includes(body.verification as Verification) ? (body.verification as Verification) : defaults.verification ?? "unverified";
  const lastVerifiedAt = optionalDate(body.lastVerifiedAt);
  if (verification === "verified" && (!sourceUrl || !lastVerifiedAt)) {
    errors.push("Verified updates need a source URL and a last-verified date.");
  }

  const ctaLabel = text(cta.label, 40);
  if (!ctaLabel) errors.push("CTA label is required.");
  if (!isSafeHref(cta.href)) errors.push("CTA destination must be an internal path (/…) or an http(s) URL.");

  const publishedAt = optionalDate(body.publishedAt) ?? new Date().toISOString().slice(0, 10);
  const deadline = optionalDate(body.deadline);
  const expiresAt = optionalDate(body.expiresAt);
  if (body.deadline && !deadline) errors.push("Deadline must be a date (YYYY-MM-DD).");
  if (body.expiresAt && !expiresAt) errors.push("Expiry must be a date (YYYY-MM-DD).");

  const status = STATUSES.includes(body.status as PulseStatus) ? (body.status as PulseStatus) : defaults.status ?? "draft";
  const slug = body.slug ? slugify(String(body.slug)) : undefined;

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      slug,
      title,
      category: body.category as PulseUpdateInput["category"],
      summary,
      signal: signalValue,
      sourceName,
      sourceUrl: sourceUrl as string | undefined,
      publishedAt,
      lastVerifiedAt,
      deadline,
      expiresAt,
      tags: list(body.tags),
      skills: list(body.skills),
      audience: list(body.audience),
      location: text(body.location, 120) || undefined,
      eligibility: text(body.eligibility, 400) || undefined,
      job: job
        ? {
            company: text(job.company, 120) || undefined,
            location: text(job.location, 120) || undefined,
            remote: ["remote", "hybrid", "onsite"].includes(job.remote as string) ? (job.remote as "remote" | "hybrid" | "onsite") : undefined,
            employmentType: text(job.employmentType, 60) || undefined,
          }
        : undefined,
      cta: { label: ctaLabel, href: cta.href as string },
      relatedCourseSlugs: list(body.relatedCourseSlugs, 6, 80),
      status,
      featured: body.featured === true || body.featured === "true" || body.featured === "on",
      verification,
      size: SIZES.includes(body.size as CardSize) ? (body.size as CardSize) : "standard",
      submittedBy: text(body.submittedBy, 40) || defaults.submittedBy || "editor",
      reviewNote: text(body.reviewNote, 600) || undefined,
    },
  };
}

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}
