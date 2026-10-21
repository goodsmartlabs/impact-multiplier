import type { NewsletterEdition, NewsletterSubscriber, PulseEventSummary, PulseUpdate } from "@/lib/pulse/types";
import type { PulseStore, ReadOptions } from "./store";

export const PULSE_CACHE_TAG = "pulse";

type Row = Record<string, unknown>;

/* ---------- Row mapping (snake_case table ↔ camelCase app) ---------- */

function toUpdate(row: Row): PulseUpdate {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    category: row.category as PulseUpdate["category"],
    summary: row.summary as string,
    signal: row.signal as PulseUpdate["signal"],
    sourceName: row.source_name as string,
    sourceUrl: (row.source_url as string) ?? undefined,
    publishedAt: row.published_at as string,
    lastVerifiedAt: (row.last_verified_at as string) ?? undefined,
    deadline: (row.deadline as string) ?? undefined,
    expiresAt: (row.expires_at as string) ?? undefined,
    tags: (row.tags as string[]) ?? [],
    skills: (row.skills as string[]) ?? [],
    audience: (row.audience as string[]) ?? [],
    location: (row.location as string) ?? undefined,
    eligibility: (row.eligibility as string) ?? undefined,
    job: (row.job as PulseUpdate["job"]) ?? undefined,
    cta: row.cta as PulseUpdate["cta"],
    relatedCourseSlugs: (row.related_course_slugs as string[]) ?? [],
    status: row.status as PulseUpdate["status"],
    featured: Boolean(row.featured),
    verification: row.verification as PulseUpdate["verification"],
    size: row.size as PulseUpdate["size"],
    submittedBy: row.submitted_by as string,
    reviewNote: (row.review_note as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

const UPDATE_COLUMNS: Record<keyof PulseUpdate, string> = {
  id: "id", slug: "slug", title: "title", category: "category", summary: "summary", signal: "signal",
  sourceName: "source_name", sourceUrl: "source_url", publishedAt: "published_at", lastVerifiedAt: "last_verified_at",
  deadline: "deadline", expiresAt: "expires_at", tags: "tags", skills: "skills", audience: "audience",
  location: "location", eligibility: "eligibility", job: "job", cta: "cta", relatedCourseSlugs: "related_course_slugs",
  status: "status", featured: "featured", verification: "verification", size: "size", submittedBy: "submitted_by",
  reviewNote: "review_note", createdAt: "created_at", updatedAt: "updated_at",
};

function fromUpdate(update: Partial<PulseUpdate>): Row {
  const row: Row = {};
  for (const [key, value] of Object.entries(update)) {
    const column = UPDATE_COLUMNS[key as keyof PulseUpdate];
    if (column) row[column] = value ?? null;
  }
  return row;
}

function toEdition(row: Row): NewsletterEdition {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    intro: (row.intro as string) ?? "",
    sections: row.sections as NewsletterEdition["sections"],
    status: row.status as NewsletterEdition["status"],
    demo: Boolean(row.demo),
    publishedAt: (row.published_at as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function fromEdition(edition: NewsletterEdition): Row {
  return {
    id: edition.id, slug: edition.slug, title: edition.title, intro: edition.intro, sections: edition.sections,
    status: edition.status, demo: edition.demo, published_at: edition.publishedAt ?? null,
    created_at: edition.createdAt, updated_at: edition.updatedAt,
  };
}

function toSubscriber(row: Row): NewsletterSubscriber {
  return {
    id: row.id as string,
    email: row.email as string,
    name: (row.name as string) ?? undefined,
    interests: (row.interests as NewsletterSubscriber["interests"]) ?? [],
    status: row.status as NewsletterSubscriber["status"],
    unsubscribeToken: row.unsubscribe_token as string,
    source: (row.source as string) ?? undefined,
    createdAt: row.created_at as string,
    unsubscribedAt: (row.unsubscribed_at as string) ?? undefined,
  };
}

function fromSubscriber(subscriber: Partial<NewsletterSubscriber>): Row {
  const map: Record<string, string> = { id: "id", email: "email", name: "name", interests: "interests", status: "status", unsubscribeToken: "unsubscribe_token", source: "source", createdAt: "created_at", unsubscribedAt: "unsubscribed_at" };
  const row: Row = {};
  for (const [key, value] of Object.entries(subscriber)) if (map[key]) row[map[key]] = value ?? null;
  return row;
}

/* ---------- PostgREST client ---------- */

export function createSupabaseStore(url: string, secret: string): PulseStore {
  const base = `${url.replace(/\/$/, "")}/rest/v1`;
  const headers = { apikey: secret, Authorization: `Bearer ${secret}`, "Content-Type": "application/json" };

  async function request<T>(path: string, init: RequestInit & { read?: ReadOptions } = {}): Promise<T> {
    const { read, ...rest } = init;
    const cacheOptions: RequestInit = rest.method && rest.method !== "GET"
      ? { cache: "no-store" }
      : read?.fresh
        ? { cache: "no-store" }
        : { next: { revalidate: 300, tags: [PULSE_CACHE_TAG] } };
    const response = await fetch(`${base}/${path}`, { ...cacheOptions, ...rest, headers: { ...headers, ...(rest.headers as Record<string, string>) } });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Supabase ${rest.method ?? "GET"} ${path.split("?")[0]} failed (${response.status}): ${detail.slice(0, 200)}`);
    }
    if (response.status === 204) return undefined as T;
    const body = await response.text();
    return (body ? JSON.parse(body) : undefined) as T;
  }

  const inList = (values: string[]) => `in.(${values.map((value) => `"${value}"`).join(",")})`;
  const isUuid = (value: string) => /^[0-9a-f-]{36}$/i.test(value);
  const write = { method: "POST", headers: { Prefer: "return=representation" } };

  return {
    kind: "supabase",
    async listUpdates(filter, options) {
      const query = filter?.statuses?.length ? `&status=${inList(filter.statuses)}` : "";
      const rows = await request<Row[]>(`pulse_updates?select=*${query}&order=published_at.desc&limit=500`, { read: options });
      return rows.map(toUpdate);
    },
    async getUpdate(idOrSlug, options) {
      const column = isUuid(idOrSlug) ? "id" : "slug";
      const rows = await request<Row[]>(`pulse_updates?select=*&${column}=eq.${encodeURIComponent(idOrSlug)}&limit=1`, { read: options });
      return rows[0] ? toUpdate(rows[0]) : null;
    },
    async insertUpdate(update) {
      const { id: _id, ...rest } = update;
      void _id;
      const rows = await request<Row[]>("pulse_updates", { ...write, body: JSON.stringify(fromUpdate(rest)) });
      return toUpdate(rows[0]);
    },
    async patchUpdate(id, patch) {
      const rows = await request<Row[]>(`pulse_updates?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(fromUpdate({ ...patch, updatedAt: new Date().toISOString() })) });
      return toUpdate(rows[0]);
    },
    async listEditions(filter, options) {
      const query = filter?.statuses?.length ? `&status=${inList(filter.statuses)}` : "";
      const rows = await request<Row[]>(`newsletter_editions?select=*${query}&order=published_at.desc.nullsfirst,created_at.desc`, { read: options });
      return rows.map(toEdition);
    },
    async getEdition(idOrSlug, options) {
      const column = isUuid(idOrSlug) ? "id" : "slug";
      const rows = await request<Row[]>(`newsletter_editions?select=*&${column}=eq.${encodeURIComponent(idOrSlug)}&limit=1`, { read: options });
      return rows[0] ? toEdition(rows[0]) : null;
    },
    async upsertEdition(edition) {
      const row = fromEdition(edition);
      if (!isUuid(edition.id)) delete row.id;
      const rows = await request<Row[]>("newsletter_editions?on_conflict=slug", { method: "POST", headers: { Prefer: "return=representation,resolution=merge-duplicates" }, body: JSON.stringify(row) });
      return toEdition(rows[0]);
    },
    async findSubscriber(by) {
      const query = by.email ? `email=eq.${encodeURIComponent(by.email)}` : by.token ? `unsubscribe_token=eq.${encodeURIComponent(by.token)}` : null;
      if (!query) return null;
      const rows = await request<Row[]>(`newsletter_subscribers?select=*&${query}&limit=1`, { read: { fresh: true } });
      return rows[0] ? toSubscriber(rows[0]) : null;
    },
    async insertSubscriber(subscriber) {
      const { id: _id, ...rest } = subscriber;
      void _id;
      const rows = await request<Row[]>("newsletter_subscribers", { ...write, body: JSON.stringify(fromSubscriber(rest)) });
      return toSubscriber(rows[0]);
    },
    async patchSubscriber(id, patch) {
      const rows = await request<Row[]>(`newsletter_subscribers?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(fromSubscriber(patch)) });
      return toSubscriber(rows[0]);
    },
    async listSubscribers() {
      const rows = await request<Row[]>("newsletter_subscribers?select=*&order=created_at.desc&limit=1000", { read: { fresh: true } });
      return rows.map(toSubscriber);
    },
    async recordEvent(updateId, type) {
      await request("pulse_events", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ update_id: updateId, event_type: type }) });
    },
    async eventSummaries() {
      const rows = await request<Array<{ update_id: string; event_type: string }>>("pulse_events?select=update_id,event_type&order=id.desc&limit=20000", { read: { fresh: true } });
      const map = new Map<string, PulseEventSummary>();
      for (const row of rows) {
        const summary = map.get(row.update_id) ?? { updateId: row.update_id, views: 0, saves: 0, ctaClicks: 0, sourceClicks: 0 };
        if (row.event_type === "view") summary.views++;
        if (row.event_type === "save") summary.saves++;
        if (row.event_type === "cta_click") summary.ctaClicks++;
        if (row.event_type === "source_click") summary.sourceClicks++;
        map.set(row.update_id, summary);
      }
      return [...map.values()];
    },
  };
}
