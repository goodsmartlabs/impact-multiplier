import type { CourseAccess, DiscoveryFilterKey, DiscoveryType, IncreaseArea, OpportunityStatus, CourseTrack } from "@/lib/types";

export const DISCOVERY_FILTERS: { key: DiscoveryFilterKey; label: string }[] = [
  { key: "for_you", label: "For You" },
  { key: "trending", label: "Trending" },
  { key: "skills", label: "Skills" },
  { key: "learn", label: "Learn" },
  { key: "tools", label: "Tools" },
  { key: "money", label: "Money" },
  { key: "mind", label: "Mind" },
  { key: "build", label: "Build" },
  { key: "opportunities", label: "Opportunities" },
];

export const INCREASE_AREA_LABELS: Record<IncreaseArea, string> = {
  capacity: "Capacity",
  wealth: "Wealth",
  leverage: "Leverage",
  influence: "Influence",
};

export const INCREASE_AREA_COPY: Record<IncreaseArea, string> = {
  capacity: "What you can do.",
  wealth: "What you can earn, save, own or create.",
  leverage: "What your existing time, money, knowledge or systems can produce.",
  influence: "The positive effect your work can have beyond you.",
};

export const TYPE_LABELS: Record<DiscoveryType, string> = {
  skill: "Skill",
  course: "Course",
  tool: "Tool",
  article: "Article",
  book: "Book",
  research: "Research",
  mental_model: "Mental Model",
  productivity_system: "Productivity",
  career_opportunity: "Career Opportunity",
  business_opportunity: "Business Opportunity",
  grant: "Grant",
  scholarship: "Scholarship",
  fellowship: "Fellowship",
  challenge: "Challenge",
  project_idea: "Project Idea",
  experiment: "Experiment",
  business_model: "Business Model",
};

export const OPPORTUNITY_STATUS_LABELS: Record<OpportunityStatus, string> = {
  open: "Open",
  closing_soon: "Closing Soon",
  upcoming: "Upcoming",
  expired: "Expired",
  sample: "Sample Data",
};

export const OPPORTUNITY_STATUS_STYLES: Record<OpportunityStatus, string> = {
  open: "bg-blue-dim text-blue",
  closing_soon: "bg-pink-dim text-pink",
  upcoming: "bg-ink/5 text-ink",
  expired: "bg-ink/5 text-muted",
  sample: "bg-ink/5 text-muted",
};

export const COURSE_TRACK_LABELS: Record<CourseTrack, string> = {
  capacity: "Capacity",
  wealth: "Wealth",
  leverage: "Leverage",
  influence: "Influence",
  career: "Career",
  business: "Business",
  money: "Money",
  ai: "AI",
  technology: "Technology",
  finance: "Finance",
  marketing: "Marketing",
  sales: "Sales",
  design: "Design",
  digital_skills: "Digital Skills",
  personal_branding: "Personal Branding",
  productivity: "Productivity",
  personal_growth: "Personal Growth",
};

export const COURSE_ACCESS_LABELS: Record<CourseAccess, string> = {
  free: "Free",
  student: "Student",
  coming_soon: "Coming Soon",
};

export const ECONOMIC_OUTCOME_OPTIONS = [
  "Earn more",
  "Save more",
  "Increase career value",
  "Build a business",
  "Create assets",
  "Find opportunities",
  "Increase productivity",
  "Build additional income",
];

export const GROWTH_AREA_OPTIONS = [
  "Thinking",
  "Knowledge",
  "Confidence",
  "Judgement",
  "Experience",
  "Discipline",
  "Network",
];
