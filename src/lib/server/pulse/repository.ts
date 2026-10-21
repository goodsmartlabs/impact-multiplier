import { randomBytes } from "node:crypto";
import { isLive, sortFeed } from "@/lib/pulse/feed";
import { DEMO_EDITIONS, DEMO_UPDATES } from "@/lib/pulse/seed";
import { slugify } from "@/lib/pulse/validate";
import type { NewsletterEdition, PulseCategory, PulseUpdate, PulseUpdateInput } from "@/lib/pulse/types";
import { createFileStore } from "./file-store";
import { notConfiguredStore, type PulseStore } from "./store";
import { createSupabaseStore } from "./supabase-store";

let cached: PulseStore | undefined;

/**
 * Supabase in production. The JSON file store is only allowed outside
 * production, when PULSE_STORE=file is set explicitly.
 */
export function getPulseStore(): PulseStore {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (url && secret) cached = createSupabaseStore(url, secret);
  else if (process.env.PULSE_STORE === "file" && process.env.NODE_ENV !== "production") cached = createFileStore();
  else cached = notConfiguredStore;
  return cached;
}

export function storeStatus() {
  const store = getPulseStore();
  return { kind: store.kind, configured: store.kind !== "none" };
}

const showDemo = () => process.env.PULSE_HIDE_DEMO !== "true";

/** Reads must never take the public site down: on a storage error, fall back to demo content. */
async function safe<T>(read: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await read();
  } catch (error) {
    console.error("[impact-pulse] read failed", error);
    return fallback;
  }
}

/** Published, unexpired updates for readers — stored content first, then labelled demo content. */
export async function getPublicUpdates(): Promise<PulseUpdate[]> {
  const stored = await safe(() => getPulseStore().listUpdates({ statuses: ["published"] }), []);
  const storedSlugs = new Set(stored.map((update) => update.slug));
  const demo = showDemo() ? DEMO_UPDATES.filter((update) => !storedSlugs.has(update.slug)) : [];
  return sortFeed([...stored, ...demo].filter((update) => isLive(update)));
}

/** Detail pages also resolve expired items so old links explain that the opportunity has closed. */
export async function getPublicUpdate(slug: string): Promise<PulseUpdate | null> {
  const stored = await safe(() => getPulseStore().getUpdate(slug), null);
  if (stored && (stored.status === "published" || stored.status === "expired")) return stored;
  if (!showDemo()) return null;
  return DEMO_UPDATES.find((update) => update.slug === slug) ?? null;
}

export async function getPublicEditions(): Promise<NewsletterEdition[]> {
  const stored = await safe(() => getPulseStore().listEditions({ statuses: ["published"] }), []);
  const demo = showDemo() ? DEMO_EDITIONS.filter((edition) => !stored.some((item) => item.slug === edition.slug)) : [];
  return [...stored, ...demo].sort((a, b) => Date.parse(b.publishedAt ?? b.createdAt) - Date.parse(a.publishedAt ?? a.createdAt));
}

export async function getPublicEdition(slug: string): Promise<NewsletterEdition | null> {
  const stored = await safe(() => getPulseStore().getEdition(slug), null);
  if (stored?.status === "published") return stored;
  return showDemo() ? DEMO_EDITIONS.find((edition) => edition.slug === slug) ?? null : null;
}

/* ---------- Writes (admin + ingestion) ---------- */

/** Static routes under /pulse that a slug must never shadow. */
const RESERVED_SLUGS = new Set(["category", "radar", "brief", "standards", "manage"]);

async function uniqueSlug(base: string): Promise<string> {
  const store = getPulseStore();
  const slugged = slugify(base) || "update";
  const root = RESERVED_SLUGS.has(slugged) ? `${slugged}-update` : slugged;
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = attempt === 0 ? root : `${root}-${attempt + 1}`;
    const clashesWithDemo = DEMO_UPDATES.some((update) => update.slug === candidate);
    if (!clashesWithDemo && !(await store.getUpdate(candidate, { fresh: true }))) return candidate;
  }
  return `${root}-${randomBytes(3).toString("hex")}`;
}

export async function createUpdate(input: PulseUpdateInput): Promise<PulseUpdate> {
  const now = new Date().toISOString();
  const slug = await uniqueSlug(input.slug || input.title);
  return getPulseStore().insertUpdate({ ...input, slug, id: "", createdAt: now, updatedAt: now });
}

export function newToken(): string {
  return randomBytes(24).toString("base64url");
}

export type { PulseCategory };
