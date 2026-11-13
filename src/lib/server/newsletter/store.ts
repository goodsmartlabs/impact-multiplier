import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import type { EditionKind, IssueStatus, NewsletterIssue, NewsletterRun, SendRecord } from "@/lib/newsletter/types";
import { StoreNotConfiguredError } from "@/lib/server/pulse/store";

export const NEWSLETTER_CACHE_TAG = "newsletter";

/** Persistence for issues, the run log and the per-recipient send ledger. */
export interface NewsletterStore {
  kind: "supabase" | "file" | "none";
  listIssues(filter?: { kinds?: EditionKind[]; statuses?: IssueStatus[]; limit?: number }, options?: { fresh?: boolean }): Promise<NewsletterIssue[]>;
  getIssue(idOrSlug: string, options?: { fresh?: boolean }): Promise<NewsletterIssue | null>;
  findIssue(kind: EditionKind, issueDate: string): Promise<NewsletterIssue | null>;
  /** Insert; returns null if an issue for (kind, issueDate) already exists. */
  insertIssue(issue: NewsletterIssue): Promise<NewsletterIssue | null>;
  /** Patch, optionally only when the current status is one of `onlyIf` (compare-and-set). Returns null when the guard failed. */
  patchIssue(id: string, patch: Partial<NewsletterIssue>, onlyIf?: IssueStatus[]): Promise<NewsletterIssue | null>;
  recordRun(run: Omit<NewsletterRun, "id" | "createdAt">): Promise<void>;
  listRuns(limit?: number): Promise<NewsletterRun[]>;
  /** Claim a recipient for an issue. False if already claimed — the duplicate-send guard. */
  claimSend(issueId: string, subscriberId: string): Promise<boolean>;
  finishSend(issueId: string, subscriberId: string, patch: Pick<SendRecord, "status"> & Partial<SendRecord>): Promise<void>;
  sendCounts(issueId: string): Promise<{ sent: number; failed: number; claimed: number }>;
}

const reject = async (): Promise<never> => { throw new StoreNotConfiguredError(); };

export const notConfiguredNewsletterStore: NewsletterStore = {
  kind: "none",
  listIssues: async () => [],
  getIssue: async () => null,
  findIssue: async () => null,
  insertIssue: reject,
  patchIssue: reject,
  recordRun: async (run) => { console.warn("[newsletter] run not recorded (no database)", run); },
  listRuns: async () => [],
  claimSend: reject,
  finishSend: reject,
  sendCounts: async () => ({ sent: 0, failed: 0, claimed: 0 }),
};

/* ---------- Supabase (PostgREST) ---------- */

type Row = Record<string, unknown>;

function toIssue(row: Row): NewsletterIssue {
  return {
    id: row.id as string,
    kind: row.kind as EditionKind,
    issueDate: row.issue_date as string,
    slug: row.slug as string,
    title: row.title as string,
    summary: (row.summary as string) ?? "",
    content: row.content as NewsletterIssue["content"],
    research: row.research as NewsletterIssue["research"],
    status: row.status as IssueStatus,
    approvedBy: (row.approved_by as string) ?? undefined,
    approvedAt: (row.approved_at as string) ?? undefined,
    publishedAt: (row.published_at as string) ?? undefined,
    sentAt: (row.sent_at as string) ?? undefined,
    failureReason: (row.failure_reason as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

const ISSUE_COLUMNS: Partial<Record<keyof NewsletterIssue, string>> = {
  kind: "kind", issueDate: "issue_date", slug: "slug", title: "title", summary: "summary", content: "content", research: "research",
  status: "status", approvedBy: "approved_by", approvedAt: "approved_at", publishedAt: "published_at", sentAt: "sent_at",
  failureReason: "failure_reason", createdAt: "created_at", updatedAt: "updated_at",
};

function fromIssue(issue: Partial<NewsletterIssue>): Row {
  const row: Row = {};
  for (const [key, value] of Object.entries(issue)) {
    const column = ISSUE_COLUMNS[key as keyof NewsletterIssue];
    if (column) row[column] = value ?? null;
  }
  return row;
}

export function createSupabaseNewsletterStore(url: string, secret: string): NewsletterStore {
  const base = `${url.replace(/\/$/, "")}/rest/v1`;
  const headers = { apikey: secret, Authorization: `Bearer ${secret}`, "Content-Type": "application/json" };
  const isUuid = (value: string) => /^[0-9a-f-]{36}$/i.test(value);
  const inList = (values: string[]) => `in.(${values.map((value) => `"${value}"`).join(",")})`;

  async function request<T>(pathAndQuery: string, init: RequestInit & { fresh?: boolean } = {}): Promise<{ status: number; body: T }> {
    const { fresh, ...rest } = init;
    const isRead = !rest.method || rest.method === "GET";
    const cache: RequestInit = isRead && !fresh ? { next: { revalidate: 300, tags: [NEWSLETTER_CACHE_TAG] } } : { cache: "no-store" };
    const response = await fetch(`${base}/${pathAndQuery}`, { ...cache, ...rest, headers: { ...headers, ...(rest.headers as Record<string, string>) } });
    if (!response.ok && response.status !== 409) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Supabase ${rest.method ?? "GET"} ${pathAndQuery.split("?")[0]} failed (${response.status}): ${detail.slice(0, 200)}`);
    }
    const text = response.status === 204 ? "" : await response.text();
    return { status: response.status, body: (text ? JSON.parse(text) : undefined) as T };
  }

  return {
    kind: "supabase",
    async listIssues(filter, options) {
      const query = [
        filter?.kinds?.length ? `kind=${inList(filter.kinds)}` : "",
        filter?.statuses?.length ? `status=${inList(filter.statuses)}` : "",
      ].filter(Boolean).join("&");
      const { body } = await request<Row[]>(`newsletter_issues?select=*${query ? `&${query}` : ""}&order=issue_date.desc,created_at.desc&limit=${filter?.limit ?? 200}`, { fresh: options?.fresh });
      return body.map(toIssue);
    },
    async getIssue(idOrSlug, options) {
      const column = isUuid(idOrSlug) ? "id" : "slug";
      const { body } = await request<Row[]>(`newsletter_issues?select=*&${column}=eq.${encodeURIComponent(idOrSlug)}&limit=1`, { fresh: options?.fresh });
      return body[0] ? toIssue(body[0]) : null;
    },
    async findIssue(kind, issueDate) {
      const { body } = await request<Row[]>(`newsletter_issues?select=*&kind=eq.${kind}&issue_date=eq.${issueDate}&limit=1`, { fresh: true });
      return body[0] ? toIssue(body[0]) : null;
    },
    async insertIssue(issue) {
      const { id: _id, ...rest } = issue;
      void _id;
      const { status, body } = await request<Row[]>("newsletter_issues?on_conflict=kind,issue_date", {
        method: "POST",
        headers: { Prefer: "return=representation,resolution=ignore-duplicates" },
        body: JSON.stringify(fromIssue(rest)),
      });
      if (status === 409 || !body?.length) return null;
      return toIssue(body[0]);
    },
    async patchIssue(id, patch, onlyIf) {
      const guard = onlyIf?.length ? `&status=${inList(onlyIf)}` : "";
      const { body } = await request<Row[]>(`newsletter_issues?id=eq.${encodeURIComponent(id)}${guard}`, {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(fromIssue({ ...patch, updatedAt: new Date().toISOString() })),
      });
      return body?.[0] ? toIssue(body[0]) : null;
    },
    async recordRun(run) {
      await request("newsletter_runs", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ action: run.action, kind: run.kind ?? null, issue_date: run.issueDate ?? null, issue_id: run.issueId && isUuid(run.issueId) ? run.issueId : null, trigger: run.trigger, outcome: run.outcome, message: run.message.slice(0, 2000) }),
      });
    },
    async listRuns(limit = 50) {
      const { body } = await request<Row[]>(`newsletter_runs?select=*&order=id.desc&limit=${limit}`, { fresh: true });
      return body.map((row) => ({
        id: String(row.id), action: row.action as NewsletterRun["action"], kind: (row.kind as EditionKind) ?? undefined, issueDate: (row.issue_date as string) ?? undefined,
        issueId: (row.issue_id as string) ?? undefined, trigger: row.trigger as NewsletterRun["trigger"], outcome: row.outcome as NewsletterRun["outcome"],
        message: row.message as string, createdAt: row.created_at as string,
      }));
    },
    async claimSend(issueId, subscriberId) {
      const { status, body } = await request<Row[]>("newsletter_sends?on_conflict=issue_id,subscriber_id", {
        method: "POST",
        headers: { Prefer: "return=representation,resolution=ignore-duplicates" },
        body: JSON.stringify({ issue_id: issueId, subscriber_id: subscriberId, status: "claimed" }),
      });
      return status !== 409 && Array.isArray(body) && body.length > 0;
    },
    async finishSend(issueId, subscriberId, patch) {
      await request(`newsletter_sends?issue_id=eq.${issueId}&subscriber_id=eq.${subscriberId}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ status: patch.status, provider_id: patch.providerId ?? null, error: patch.error?.slice(0, 500) ?? null }),
      });
    },
    async sendCounts(issueId) {
      const { body } = await request<Array<{ status: string }>>(`newsletter_sends?select=status&issue_id=eq.${issueId}&limit=100000`, { fresh: true });
      return {
        sent: body.filter((row) => row.status === "sent").length,
        failed: body.filter((row) => row.status === "failed").length,
        claimed: body.filter((row) => row.status === "claimed").length,
      };
    },
  };
}

/* ---------- Local development file store ---------- */

interface FileData {
  issues: NewsletterIssue[];
  runs: NewsletterRun[];
  sends: SendRecord[];
}

/** LOCAL DEVELOPMENT ONLY — never used in production (see getNewsletterStore). */
export function createFileNewsletterStore(file = path.join(process.cwd(), ".data", "newsletter-dev.json")): NewsletterStore {
  let queue = Promise.resolve();
  async function load(): Promise<FileData> {
    try {
      return JSON.parse(await readFile(file, "utf8")) as FileData;
    } catch {
      return { issues: [], runs: [], sends: [] };
    }
  }
  function mutate<T>(change: (data: FileData) => T): Promise<T> {
    const run = queue.then(async () => {
      const data = await load();
      const result = change(data);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, JSON.stringify(data, null, 2));
      return result;
    });
    queue = run.then(() => undefined, () => undefined);
    return run;
  }
  const sorted = (issues: NewsletterIssue[]) => [...issues].sort((a, b) => b.issueDate.localeCompare(a.issueDate) || b.createdAt.localeCompare(a.createdAt));

  return {
    kind: "file",
    async listIssues(filter) {
      const { issues } = await load();
      return sorted(issues.filter((issue) => (!filter?.kinds?.length || filter.kinds.includes(issue.kind)) && (!filter?.statuses?.length || filter.statuses.includes(issue.status)))).slice(0, filter?.limit ?? 200);
    },
    async getIssue(idOrSlug) {
      return (await load()).issues.find((issue) => issue.id === idOrSlug || issue.slug === idOrSlug) ?? null;
    },
    async findIssue(kind, issueDate) {
      return (await load()).issues.find((issue) => issue.kind === kind && issue.issueDate === issueDate) ?? null;
    },
    insertIssue: (issue) =>
      mutate((data) => {
        if (data.issues.some((existing) => (existing.kind === issue.kind && existing.issueDate === issue.issueDate) || existing.slug === issue.slug)) return null;
        const created = { ...issue, id: randomUUID() };
        data.issues.push(created);
        return created;
      }),
    patchIssue: (id, patch, onlyIf) =>
      mutate((data) => {
        const index = data.issues.findIndex((issue) => issue.id === id);
        if (index < 0) return null;
        if (onlyIf?.length && !onlyIf.includes(data.issues[index].status)) return null;
        data.issues[index] = { ...data.issues[index], ...patch, id, updatedAt: new Date().toISOString() };
        return data.issues[index];
      }),
    recordRun: (run) =>
      mutate((data) => {
        data.runs.unshift({ ...run, id: randomUUID(), createdAt: new Date().toISOString() });
        data.runs = data.runs.slice(0, 500);
      }),
    async listRuns(limit = 50) {
      return (await load()).runs.slice(0, limit);
    },
    claimSend: (issueId, subscriberId) =>
      mutate((data) => {
        if (data.sends.some((send) => send.issueId === issueId && send.subscriberId === subscriberId)) return false;
        data.sends.push({ issueId, subscriberId, status: "claimed", createdAt: new Date().toISOString() });
        return true;
      }),
    finishSend: (issueId, subscriberId, patch) =>
      mutate((data) => {
        const send = data.sends.find((item) => item.issueId === issueId && item.subscriberId === subscriberId);
        if (send) Object.assign(send, patch);
      }),
    async sendCounts(issueId) {
      const sends = (await load()).sends.filter((send) => send.issueId === issueId);
      return { sent: sends.filter((send) => send.status === "sent").length, failed: sends.filter((send) => send.status === "failed").length, claimed: sends.filter((send) => send.status === "claimed").length };
    },
  };
}

let cached: NewsletterStore | undefined;

/** Same selection rules as the Impact Pulse store. */
export function getNewsletterStore(): NewsletterStore {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (url && secret) cached = createSupabaseNewsletterStore(url, secret);
  else if (process.env.PULSE_STORE === "file" && process.env.NODE_ENV !== "production") cached = createFileNewsletterStore();
  else cached = notConfiguredNewsletterStore;
  return cached;
}
