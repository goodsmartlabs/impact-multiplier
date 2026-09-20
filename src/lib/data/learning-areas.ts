import type { Course, LearningAreaId } from "@/lib/types";

export type LearningArea = {
  id: LearningAreaId;
  slug: LearningAreaId;
  name: string;
  shortName: string;
  shortDescription: string;
  displayOrder: number;
};

export const LEARNING_AREAS: LearningArea[] = [
  { id: "ai-technology", slug: "ai-technology", name: "AI & Technology", shortName: "AI & Tech", shortDescription: "Learn AI platforms, practical workflows and modern technology capabilities.", displayOrder: 1 },
  { id: "finance-accounting", slug: "finance-accounting", name: "Finance & Accounting", shortName: "Finance", shortDescription: "Understand money, financial systems and practical AI applications for finance.", displayOrder: 2 },
  { id: "business-operations", slug: "business-operations", name: "Business & Operations", shortName: "Business", shortDescription: "Apply useful skills and AI inside businesses, workflows and operations.", displayOrder: 3 },
  { id: "marketing-sales", slug: "marketing-sales", name: "Marketing & Sales", shortName: "Marketing", shortDescription: "Strengthen visibility, communication, customer acquisition and sales.", displayOrder: 4 },
  { id: "design-creative", slug: "design-creative", name: "Design & Creative", shortName: "Design", shortDescription: "Use AI and modern tools to strengthen creative process and visual work.", displayOrder: 5 },
  { id: "web-digital-building", slug: "web-digital-building", name: "Web & Digital Building", shortName: "Web & Digital", shortDescription: "Build useful websites, apps, assistants and practical digital products.", displayOrder: 6 },
  { id: "career-income", slug: "career-income", name: "Career & Income", shortName: "Career", shortDescription: "Move from skill to proof, opportunity and legitimate income.", displayOrder: 7 },
  { id: "personal-brand-growth", slug: "personal-brand-growth", name: "Personal Brand & Growth", shortName: "Personal Growth", shortDescription: "Build personal capability, positioning, direction and sustainable growth.", displayOrder: 8 },
];

const COURSE_LEARNING_AREAS: Record<string, LearningAreaId[]> = {
  "ai-dramas": ["ai-technology", "design-creative"],
  "building-you-the-brand": ["personal-brand-growth", "career-income"],
  "ai-automation-foundations": ["ai-technology", "business-operations", "web-digital-building"],
  "excel-dashboards-for-beginners": ["finance-accounting", "career-income"],
  "video-editing-for-creators": ["design-creative", "career-income"],
  "financial-flow": ["finance-accounting", "personal-brand-growth"],
  "ai-for-financial-clarity": ["finance-accounting", "ai-technology"],
  "ai-accounting-judgment-assurance": ["finance-accounting", "ai-technology"],
  "the-wealth-lab": ["finance-accounting", "business-operations", "personal-brand-growth"],
  "no-code-websites": ["web-digital-building"],
  "no-code-app-building": ["web-digital-building"],
  "ai-marketing": ["marketing-sales", "ai-technology"],
  "boost-sales-with-ai": ["marketing-sales", "ai-technology"],
  "ai-for-business-operations": ["business-operations", "ai-technology"],
  "ai-for-side-gigs": ["career-income", "business-operations"],
  "ai-in-design": ["design-creative", "ai-technology"],
  "seo-fundamentals": ["marketing-sales"],
  "copywriting-fundamentals": ["marketing-sales", "career-income"],
  "claude-from-beginner-to-builder": ["ai-technology", "web-digital-building"],
  "chatgpt-prompts-to-productivity": ["ai-technology"],
  "gemini-essentials": ["ai-technology"],
  "midjourney-for-ai-visuals": ["ai-technology", "design-creative"],
  "omni-ai": ["ai-technology"],
  "ai-tools-for-finance": ["finance-accounting", "ai-technology"],
  "ai-tools-for-marketing": ["marketing-sales", "ai-technology"],
  "ai-tools-for-business": ["business-operations", "ai-technology"],
  "ai-tools-for-design-content": ["design-creative", "ai-technology"],
  "ai-tools-for-productivity": ["ai-technology", "business-operations"],
  "build-strong-portfolio-with-ai": ["career-income", "personal-brand-growth"],
  "master-claude-code": ["ai-technology", "web-digital-building"],
  "build-your-ai-assistant": ["ai-technology", "web-digital-building", "business-operations"],
  "ai-for-accountants": ["finance-accounting", "ai-technology"],
  "ai-tools-masterclass": ["ai-technology", "business-operations"],
  "land-jobs-with-ai": ["career-income", "personal-brand-growth"],
  "ai-side-hustle": ["career-income", "business-operations"],
  "claude-for-beginners": ["ai-technology"],
  "claude-for-excel": ["finance-accounting", "ai-technology"],
};

export function learningAreasForCourse(slug: string): LearningAreaId[] {
  return COURSE_LEARNING_AREAS[slug] ?? [];
}

export function coursesInLearningArea(courses: Course[], areaId: LearningAreaId): Course[] {
  return courses.filter((course) => course.learningAreas.includes(areaId));
}

export function getLearningArea(id: string | null): LearningArea | undefined {
  return LEARNING_AREAS.find((area) => area.id === id);
}
