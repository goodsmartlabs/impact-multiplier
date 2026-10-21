export type PulseCategory =
  | "trending"
  | "jobs"
  | "skills"
  | "learning"
  | "money"
  | "opportunities"
  | "ai"
  | "industry";

/** Editorial lifecycle. Only "published" reaches readers. */
export type PulseStatus = "draft" | "pending_review" | "published" | "expired" | "archived" | "rejected";

/**
 * "verified": an editor checked the original source on `lastVerifiedAt`.
 * "demo": illustrative content that ships with the site — never presented as news.
 */
export type Verification = "verified" | "unverified" | "demo";

export type CardSize = "feature" | "standard" | "compact";

/** The five questions every update must answer. */
export interface ImpactSignal {
  what: string;
  why: string;
  who: string;
  how: string;
  next: string;
}

export interface PulseCta {
  label: string;
  /** Internal path (/academy/…) or external https URL. */
  href: string;
}

export interface PulseJobDetails {
  company?: string;
  location?: string;
  remote?: "remote" | "hybrid" | "onsite";
  employmentType?: string;
}

export interface PulseUpdate {
  id: string;
  slug: string;
  title: string;
  category: PulseCategory;
  summary: string;
  signal: ImpactSignal;
  sourceName: string;
  sourceUrl?: string;
  publishedAt: string;
  lastVerifiedAt?: string;
  /** Applications / offers close at the end of this day. */
  deadline?: string;
  /** After this date the update is hidden from the feed. */
  expiresAt?: string;
  tags: string[];
  skills: string[];
  audience: string[];
  location?: string;
  eligibility?: string;
  job?: PulseJobDetails;
  cta: PulseCta;
  relatedCourseSlugs: string[];
  status: PulseStatus;
  featured: boolean;
  verification: Verification;
  size: CardSize;
  /** Which agent (or "editor") produced the record. */
  submittedBy: string;
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
}

/** What admins and agents may submit — the server fills ids, timestamps and defaults. */
export type PulseUpdateInput = Omit<PulseUpdate, "id" | "createdAt" | "updatedAt" | "slug"> & { slug?: string };

export type OpportunityLifecycle = "open" | "closing_soon" | "closed" | "no_deadline";

/* ---------- Newsletter ---------- */

export interface BriefItemRef {
  /** Pulse update slug, if the item points at one. */
  slug?: string;
  title: string;
  note: string;
  href?: string;
}

export interface BriefSections {
  whatsHot: BriefItemRef[];
  skillWorthBuilding: BriefItemRef[];
  opportunities: BriefItemRef[];
  learnSomething: BriefItemRef[];
  moneyMove: BriefItemRef[];
  powerMove: BriefItemRef[];
}

export type EditionStatus = "draft" | "published" | "archived";

export interface NewsletterEdition {
  id: string;
  slug: string;
  title: string;
  intro: string;
  sections: BriefSections;
  status: EditionStatus;
  /** Demonstration editions are labelled and never claimed as sent. */
  demo: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type SubscriberStatus = "active" | "unsubscribed";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  interests: PulseCategory[];
  status: SubscriberStatus;
  unsubscribeToken: string;
  source?: string;
  createdAt: string;
  unsubscribedAt?: string;
}

export type PulseEventType = "view" | "save" | "cta_click" | "source_click";

export interface PulseEventSummary {
  updateId: string;
  views: number;
  saves: number;
  ctaClicks: number;
  sourceClicks: number;
}
