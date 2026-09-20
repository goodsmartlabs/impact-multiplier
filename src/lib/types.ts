// Core data model for Impact Academia

export type IncreaseArea = "capacity" | "wealth" | "leverage" | "influence";

export type DiscoveryType =
  | "skill"
  | "course"
  | "tool"
  | "article"
  | "book"
  | "research"
  | "mental_model"
  | "productivity_system"
  | "career_opportunity"
  | "business_opportunity"
  | "grant"
  | "scholarship"
  | "fellowship"
  | "challenge"
  | "project_idea"
  | "experiment"
  | "business_model";

export type DiscoveryFilterKey =
  | "for_you"
  | "trending"
  | "skills"
  | "learn"
  | "tools"
  | "money"
  | "mind"
  | "build"
  | "opportunities";

export type OpportunityStatus = "open" | "closing_soon" | "upcoming" | "expired" | "sample";

export interface SourceLink {
  name: string;
  url: string;
}

export interface DiscoveryItem {
  id: string;
  slug: string;
  title: string;
  type: DiscoveryType;
  filterKeys: DiscoveryFilterKey[];
  categoryLabel: string; // small eyebrow label shown on card, e.g. "SKILL • TRENDING"
  shortDescription: string;
  coverImage?: string;
  fullDescription: string;
  whyItMatters?: string;
  whyNow?: string;
  whoItsFor?: string;
  whatCouldThisIncrease?: string;
  requirements?: string[];
  eligibility?: string;
  whatYoullNeed?: string[];
  whatYoullLearn?: string[];
  whatYouCouldDoWithIt?: string;
  howToGetStarted?: string;
  howToApply?: string;
  howToLearnIt?: string;
  howToProveIt?: string;
  economicApplication?: string;
  timeRequirement?: string;
  estimatedCost?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  location?: string;
  deadline?: string; // ISO date
  increaseAreas: IncreaseArea[];
  featured?: boolean;
  trending?: boolean;
  sourceName?: string;
  sourceUrl?: string;
  dateFound?: string;
  lastVerified?: string;
  status?: OpportunityStatus;
  academyCourseSlug?: string;
  externalCourseUrl?: string;
  relatedItemSlugs?: string[];
  sources?: SourceLink[];
}

// ---------------- Academy ----------------

export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseAccess = "free" | "paid";
export type CourseVisibility = "public" | "private";
export type CourseStatusFlag = "draft" | "published";
export type CourseTrack =
  | "capacity"
  | "wealth"
  | "leverage"
  | "influence"
  | "career"
  | "business"
  | "money"
  | "ai"
  | "technology"
  | "productivity"
  | "personal_growth";

export interface LessonResource {
  id: string;
  label: string;
  kind: "pdf" | "template" | "worksheet" | "link" | "dataset" | "checklist" | "reading";
  url?: string;
  description?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface Assignment {
  id: string;
  title: string;
  instructions: string;
  deliverable: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  kind: "video" | "text" | "activity" | "quiz" | "assignment";
  durationMinutes: number;
  body?: string; // markdown-ish plain text content
  videoLabel?: string; // placeholder label for video content
  resources?: LessonResource[];
  quiz?: Quiz;
  assignment?: Assignment;
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  summary: string;
  lessons: Lesson[];
}

export interface ProofProject {
  title: string;
  description: string;
  deliverables: string[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  coverGradient: string; // css gradient class token for cover
  coverImage?: string;
  instructor: string;
  instructorTitle?: string;
  builds: string; // "what this course builds"
  whoItsFor: string;
  whatYoullBeAbleToDo: string[];
  requirements?: string[];
  durationLabel: string;
  level: CourseLevel;
  access: CourseAccess;
  visibility: CourseVisibility;
  statusFlag: CourseStatusFlag;
  price?: string;
  tracks: CourseTrack[];
  increaseAreas: IncreaseArea[];
  modules: Module[];
  materials: LessonResource[];
  proofProject?: ProofProject;
  certificateAvailable?: boolean;
  featured?: boolean;
  relatedItemSlugs?: string[];
  relatedCourseSlugs?: string[];
  isInnergencyClass?: boolean;
  origin: "academy" | "external";
  externalProvider?: string;
  externalUrl?: string;
  externalCost?: string;
  externalDuration?: string;
  whyWeRecommend?: string;
}

// ---------------- Impact Cart ----------------

export interface ImpactCartEntry {
  itemId: string; // discovery item id or course id (prefixed)
  itemKind: "discovery" | "course";
  note?: string;
  savedAt: string;
}

// ---------------- Impact Engine / Impact Moves ----------------

export type ImpactMoveStage =
  | "build"
  | "capacity"
  | "value"
  | "proof"
  | "money"
  | "action"
  | "impact"
  | "multiply";

export interface ImpactMove {
  id: string;
  title: string; // what they're building
  sourceItemSlug?: string;
  sourceCourseSlug?: string;
  createdAt: string;
  currentStage: ImpactMoveStage;
  completedStages: ImpactMoveStage[];
  build?: {
    what: string;
    why: string;
  };
  capacity?: {
    before: string;
    after: string;
  };
  value?: {
    problem: string;
    person: string;
    outcome: string;
  };
  proof?: {
    plan: string;
    evidenceLinks?: string[];
    completed?: boolean;
  };
  money?: {
    paths: ("earn" | "save" | "increase" | "create" | "unlock")[];
    firstExperiment: string;
  };
  action?: {
    nextAction: string;
  };
  impact?: {
    capacityChange: string;
    output: string;
    valueDelivered: string;
    economicResult: string;
    selfChange: string;
    evidence: string;
  };
  multiply?: {
    whatsNext: string;
    chain: string[];
  };
  status: "in_progress" | "completed";
}

// ---------------- Academy progress ----------------

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

export interface CourseEnrollment {
  courseSlug: string;
  enrolledAt: string;
  lessonProgress: LessonProgress[];
  quizScores?: Record<string, number>;
  completed: boolean;
  completedAt?: string;
}

// ---------------- Profile / Personalization ----------------

export interface ProfileAnswers {
  currentWork?: string;
  currentSkills?: string;
  interests?: string;
  increasing?: string;
  direction?: string;
  building?: string;
  hasPhone?: boolean;
  hasLaptop?: boolean;
  hasInternet?: boolean;
  timeAvailable?: string;
  financialComfort?: string;
  economicOutcomes?: string[];
  growthAreas?: string[];
}

export interface ProvenCapability {
  title: string;
  proofCount: number;
  peopleHelped: number;
  portfolioAvailable: boolean;
  economicApplication: boolean;
}
