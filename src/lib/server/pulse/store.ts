import type {
  NewsletterEdition,
  NewsletterSubscriber,
  PulseEventSummary,
  PulseEventType,
  PulseStatus,
  PulseUpdate,
} from "@/lib/pulse/types";

export class StoreNotConfiguredError extends Error {
  constructor() {
    super("Impact Pulse storage is not configured (set SUPABASE_URL and SUPABASE_SECRET_KEY).");
  }
}

export interface ReadOptions {
  /** Public reads may be cached briefly; admin reads always bypass caches. */
  fresh?: boolean;
}

/** Everything Impact Pulse persists goes through this interface. */
export interface PulseStore {
  kind: "supabase" | "file" | "none";
  listUpdates(filter?: { statuses?: PulseStatus[] }, options?: ReadOptions): Promise<PulseUpdate[]>;
  getUpdate(idOrSlug: string, options?: ReadOptions): Promise<PulseUpdate | null>;
  insertUpdate(update: PulseUpdate): Promise<PulseUpdate>;
  patchUpdate(id: string, patch: Partial<PulseUpdate>): Promise<PulseUpdate>;

  listEditions(filter?: { statuses?: NewsletterEdition["status"][] }, options?: ReadOptions): Promise<NewsletterEdition[]>;
  getEdition(idOrSlug: string, options?: ReadOptions): Promise<NewsletterEdition | null>;
  upsertEdition(edition: NewsletterEdition): Promise<NewsletterEdition>;

  findSubscriber(by: { email?: string; token?: string }): Promise<NewsletterSubscriber | null>;
  insertSubscriber(subscriber: NewsletterSubscriber): Promise<NewsletterSubscriber>;
  patchSubscriber(id: string, patch: Partial<NewsletterSubscriber>): Promise<NewsletterSubscriber>;
  listSubscribers(): Promise<NewsletterSubscriber[]>;

  recordEvent(updateId: string, type: PulseEventType): Promise<void>;
  eventSummaries(): Promise<PulseEventSummary[]>;
}

export const notConfiguredStore: PulseStore = {
  kind: "none",
  listUpdates: async () => [],
  getUpdate: async () => null,
  insertUpdate: async () => { throw new StoreNotConfiguredError(); },
  patchUpdate: async () => { throw new StoreNotConfiguredError(); },
  listEditions: async () => [],
  getEdition: async () => null,
  upsertEdition: async () => { throw new StoreNotConfiguredError(); },
  findSubscriber: async () => null,
  insertSubscriber: async () => { throw new StoreNotConfiguredError(); },
  patchSubscriber: async () => { throw new StoreNotConfiguredError(); },
  listSubscribers: async () => [],
  recordEvent: async () => {},
  eventSummaries: async () => [],
};
