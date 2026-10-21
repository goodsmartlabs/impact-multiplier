import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import type { NewsletterEdition, NewsletterSubscriber, PulseEventSummary, PulseEventType, PulseUpdate } from "@/lib/pulse/types";
import type { PulseStore } from "./store";

/**
 * LOCAL DEVELOPMENT ONLY. A JSON file standing in for Supabase so admin
 * publishing and newsletter flows can be exercised without a database.
 * Never used in production (see getPulseStore).
 */
interface FileData {
  updates: PulseUpdate[];
  editions: NewsletterEdition[];
  subscribers: NewsletterSubscriber[];
  events: Array<{ updateId: string; type: PulseEventType; at: string }>;
}

export function createFileStore(file = path.join(process.cwd(), ".data", "pulse-dev.json")): PulseStore {
  let queue = Promise.resolve();

  async function load(): Promise<FileData> {
    try {
      return JSON.parse(await readFile(file, "utf8")) as FileData;
    } catch {
      return { updates: [], editions: [], subscribers: [], events: [] };
    }
  }

  /** Serialise writes so concurrent requests can't clobber each other. */
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

  const match = (idOrSlug: string) => (item: { id: string; slug: string }) => item.id === idOrSlug || item.slug === idOrSlug;

  return {
    kind: "file",
    async listUpdates(filter) {
      const { updates } = await load();
      return filter?.statuses?.length ? updates.filter((update) => filter.statuses!.includes(update.status)) : updates;
    },
    async getUpdate(idOrSlug) {
      return (await load()).updates.find(match(idOrSlug)) ?? null;
    },
    insertUpdate: (update) =>
      mutate((data) => {
        if (data.updates.some((existing) => existing.slug === update.slug)) throw new Error(`Slug "${update.slug}" already exists.`);
        const created = { ...update, id: randomUUID() };
        data.updates.push(created);
        return created;
      }),
    patchUpdate: (id, patch) =>
      mutate((data) => {
        const index = data.updates.findIndex((update) => update.id === id);
        if (index < 0) throw new Error("Update not found.");
        data.updates[index] = { ...data.updates[index], ...patch, id, updatedAt: new Date().toISOString() };
        return data.updates[index];
      }),
    async listEditions(filter) {
      const { editions } = await load();
      return filter?.statuses?.length ? editions.filter((edition) => filter.statuses!.includes(edition.status)) : editions;
    },
    async getEdition(idOrSlug) {
      return (await load()).editions.find(match(idOrSlug)) ?? null;
    },
    upsertEdition: (edition) =>
      mutate((data) => {
        const index = data.editions.findIndex((existing) => existing.id === edition.id || existing.slug === edition.slug);
        const saved = { ...edition, id: index >= 0 ? data.editions[index].id : randomUUID() };
        if (index >= 0) data.editions[index] = saved;
        else data.editions.push(saved);
        return saved;
      }),
    async findSubscriber(by) {
      const { subscribers } = await load();
      return subscribers.find((subscriber) => (by.email && subscriber.email === by.email) || (by.token && subscriber.unsubscribeToken === by.token)) ?? null;
    },
    insertSubscriber: (subscriber) =>
      mutate((data) => {
        const created = { ...subscriber, id: randomUUID() };
        data.subscribers.push(created);
        return created;
      }),
    patchSubscriber: (id, patch) =>
      mutate((data) => {
        const index = data.subscribers.findIndex((subscriber) => subscriber.id === id);
        if (index < 0) throw new Error("Subscriber not found.");
        data.subscribers[index] = { ...data.subscribers[index], ...patch, id };
        return data.subscribers[index];
      }),
    async listSubscribers() {
      return (await load()).subscribers;
    },
    recordEvent: (updateId, type) =>
      mutate((data) => {
        data.events.push({ updateId, type, at: new Date().toISOString() });
      }),
    async eventSummaries() {
      const map = new Map<string, PulseEventSummary>();
      for (const event of (await load()).events) {
        const summary = map.get(event.updateId) ?? { updateId: event.updateId, views: 0, saves: 0, ctaClicks: 0, sourceClicks: 0 };
        if (event.type === "view") summary.views++;
        if (event.type === "save") summary.saves++;
        if (event.type === "cta_click") summary.ctaClicks++;
        if (event.type === "source_click") summary.sourceClicks++;
        map.set(event.updateId, summary);
      }
      return [...map.values()];
    },
  };
}
