import type { Course } from "@/lib/types";
import { getCourseBySlug } from "@/lib/data/courses";

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  courseSlugs: string[];
  specializationSlugs?: string[];
};

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "claude",
    title: "Claude Learning Path",
    description: "Start with everyday Claude skills, then move into spreadsheets, coding, and assistant building.",
    courseSlugs: ["claude-for-beginners", "claude-for-excel", "master-claude-code", "build-your-ai-assistant"],
  },
  {
    id: "career-income",
    title: "Career + Income Path",
    description: "Turn useful AI-supported skills into proof, positioning, and real opportunities.",
    courseSlugs: ["ai-side-hustle", "build-a-strong-portfolio-with-ai", "land-jobs-with-ai"],
  },
  {
    id: "finance",
    title: "Finance Path",
    description: "Build financial clarity first, then apply AI with stronger accounting judgment.",
    courseSlugs: ["financial-flow", "ai-for-financial-clarity", "ai-for-accountants", "ai-accounting-judgment-assurance"],
  },
  {
    id: "build",
    title: "Build Path",
    description: "Move from no-code websites to apps and task-specific AI assistants.",
    courseSlugs: ["no-code-websites", "no-code-app-building", "build-your-ai-assistant"],
  },
  {
    id: "ai-tools",
    title: "AI Tools Path",
    description: "Learn productive tool use, compare platforms, then choose a practical specialization.",
    courseSlugs: ["ai-tools-for-productivity", "ai-tools-masterclass"],
    specializationSlugs: ["ai-tools-for-finance", "ai-tools-for-marketing", "ai-tools-for-business", "ai-tools-for-design-content"],
  },
];

export function coursesForPath(path: LearningPath): Course[] {
  return path.courseSlugs.map(getCourseBySlug).filter((course): course is Course => Boolean(course));
}

export function pathsForCourse(slug: string): LearningPath[] {
  return LEARNING_PATHS.filter((path) => path.courseSlugs.includes(slug) || path.specializationSlugs?.includes(slug));
}
