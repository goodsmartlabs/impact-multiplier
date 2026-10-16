export type SkillId =
  | "ai-automation"
  | "data-analytics"
  | "digital-marketing"
  | "web-design"
  | "process-improvement"
  | "financial-analysis";

export type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type DayKey = "discover" | "learn" | "practice" | "identify" | "build" | "prove" | "multiply";

/** How much proof a day's deliverable needs before the day can be completed. */
export type EvidenceRule = "none" | "optional" | "required";

export interface ChallengeResource {
  id: string;
  title: string;
  provider: string;
  url: string;
  kind: "docs" | "course" | "tool" | "guide" | "dataset";
  note: string;
}

export interface LessonBlock {
  heading: string;
  body: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface Deliverable {
  /** What the learner must submit for the day. */
  prompt: string;
  placeholder: string;
  /** Minimum characters in the written response. */
  minLength: number;
  evidence: EvidenceRule;
  evidenceHint?: string;
}

export interface ChallengeDay {
  day: DayNumber;
  key: DayKey;
  title: string;
  focus: string;
  lesson: LessonBlock[];
  steps: string[];
  exercise: { title: string; brief: string };
  checklist: ChecklistItem[];
  deliverable: Deliverable;
  resourceIds: string[];
}

export interface SkillChallenge {
  id: SkillId;
  name: string;
  tagline: string;
  /** What the skill helps businesses accomplish. */
  businessValue: string;
  difficulty: "Beginner";
  timePerDay: string;
  tools: string[];
  project: { title: string; summary: string; finalProof: string };
  exampleServices: string[];
  accent: "pink" | "blue";
  /** Existing Academy courses that go deeper on this skill. */
  academyCourses: string[];
  /** Fictional sample data bundled with the challenge, if any. */
  dataset?: { label: string; href: string; note: string };
  /** Honesty notes shown wherever results are discussed. */
  caution?: string;
  days: ChallengeDay[];
}

export interface DayProgress {
  checked: string[];
  response: string;
  evidenceUrl: string;
  completedAt?: string;
}

export interface ImpactCheck {
  canDoNow: string;
  skillLearned: string;
  projectCompleted: string;
  problemAddressed: string;
  evidenceUrl: string;
  potentialService: string;
  nextAction: string;
  recordedAt: string;
}

export interface ServiceOffer {
  problem: string;
  who: string;
  service: string;
  deliverable: string;
  demonstrate: string;
  firstStep: string;
  /** The editable offer text the learner keeps. */
  offerText: string;
  updatedAt: string;
}

export interface ChallengeProgress {
  skillId: SkillId;
  startedAt: string;
  updatedAt: string;
  days: Partial<Record<DayNumber, DayProgress>>;
  notes: string;
  savedResources: string[];
  impactCheck?: ImpactCheck;
  serviceOffer?: ServiceOffer;
}

export type ChallengeStatus =
  | "not_started"
  | "in_progress"
  /** All seven days done, but no Impact Check with evidence yet. */
  | "days_complete"
  /** Impact Check recorded with a project link. Self-reported, not reviewed. */
  | "proof_recorded";
