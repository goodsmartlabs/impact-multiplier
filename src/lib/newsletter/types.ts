/** The two weekly editions of the ImpactFools newsletter. */
export type EditionKind = "whats_hot" | "weekend_top3";

/**
 * Issue lifecycle. `awaiting_approval` is the editorial-approval state;
 * `scheduled` means approved but waiting for its 07:00 Juba publish time.
 */
export type IssueStatus = "draft" | "awaiting_approval" | "scheduled" | "published" | "archived" | "failed";

export type Freshness = "new" | "evergreen";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

/** Free / paid labelling is shown on every resource the newsletter recommends. */
export type ResourceAccess = "free" | "paid" | "student" | "coming_soon" | "external_free" | "external_mixed";

export interface ResourceLink {
  id: string;
  title: string;
  href: string;
  provider: string;
  access: ResourceAccess;
  /** e.g. "Free", "$49", "Student access", "Free plan available". */
  accessLabel: string;
  kind: "course" | "challenge" | "path" | "tool" | "guide" | "pulse" | "build-lab";
  /** ImpactFools / Innergency product, as opposed to a third-party link. */
  inHouse: boolean;
  note?: string;
}

/** One "What's Hot" discovery — always traceable to a verified Impact Pulse record. */
export interface Discovery {
  id: string;
  name: string;
  category: string;
  whatsHappening: string;
  whyItMatters: string;
  whoShouldPayAttention: string;
  potentialValue: string;
  difficulty: Difficulty;
  firstAction: string;
  resources: ResourceLink[];
  link: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  lastVerifiedAt: string;
  freshness: Freshness;
  pulseSlug: string;
  deadline?: string;
}

export interface OpportunityMatch {
  goal: string;
  goalLabel: string;
  discoveryIds: string[];
  resource?: ResourceLink;
  note: string;
}

export interface WhatsHotContent {
  kind: "whats_hot";
  bigPicture: { headline: string; points: string[] };
  discoveries: Discovery[];
  opportunityMatch: OpportunityMatch[];
  action: { headline: string; body: string; resources: ResourceLink[] };
}

export interface WeekendExample {
  profile: string;
  goalLabels: string[];
  recommendation: { id: string; title: string; why: string; success: string; href: string };
}

export interface WeekendTop3Content {
  kind: "weekend_top3";
  intro: { headline: string; body: string };
  featured: Discovery[];
  examples: WeekendExample[];
  practicalActions: string[];
  evergreen: ResourceLink[];
}

export type IssueContent = WhatsHotContent | WeekendTop3Content;

/** A research-log entry: what was checked, when, and the verdict. */
export interface ResearchEntry {
  ref: string;
  title: string;
  sourceUrl?: string;
  checkedAt: string;
  verdict: "accepted" | "rejected" | "evergreen";
  reasons: string[];
}

export interface LinkCheck {
  href: string;
  ok: boolean;
  status?: number;
  note?: string;
}

export interface IssueResearch {
  generatedAt: string;
  method: string;
  entries: ResearchEntry[];
  linkChecks: LinkCheck[];
  warnings: string[];
}

export interface NewsletterIssue {
  id: string;
  kind: EditionKind;
  /** Juba calendar date the issue is for (YYYY-MM-DD, a Monday or Friday). */
  issueDate: string;
  slug: string;
  title: string;
  summary: string;
  content: IssueContent;
  research: IssueResearch;
  status: IssueStatus;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt?: string;
  sentAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type RunAction = "prepare" | "publish" | "send" | "schedule";
export type RunOutcome = "success" | "skipped" | "failed";

export interface NewsletterRun {
  id: string;
  action: RunAction;
  kind?: EditionKind;
  issueDate?: string;
  issueId?: string;
  trigger: "cron" | "admin" | "test";
  outcome: RunOutcome;
  message: string;
  createdAt: string;
}

export interface SendRecord {
  issueId: string;
  subscriberId: string;
  status: "claimed" | "sent" | "failed";
  providerId?: string;
  error?: string;
  createdAt: string;
}
