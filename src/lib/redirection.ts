import { CRAFT_PATHS, PROBLEM_TYPES } from "@/lib/data/craft-paths";
import type { ProblemTypeId, RedirectionAnswers, RedirectionResult, Recommendation } from "@/lib/types";

const PATH_BONUSES: Record<string, Partial<Record<ProblemTypeId, number>>> = {
  "build-your-personal-brand": { visibility: 5, proof: 4, career: 2 },
  "make-money-with-ai": { income: 5, capability: 2, proof: 3 },
  "ai-powered-accountant": { career: 4, capability: 4, proof: 3 },
  "build-your-digital-presence": { visibility: 5, building: 3, proof: 4 },
  "build-your-ai-career": { career: 5, capability: 3, proof: 4 },
  "build-your-business-online": { business: 5, building: 3, growth: 3 },
  "build-your-wealth-system": { "money-wealth": 6, direction: 2, growth: 2 },
  "from-idea-to-build": { building: 6, capability: 3, business: 2 },
  redirection: { clarity: 7, direction: 7 },
};

function labelFor(id: ProblemTypeId) {
  return PROBLEM_TYPES.find((problem) => problem.id === id)?.label ?? id;
}

export function recommendCraftPaths(answers: RedirectionAnswers): Recommendation[] {
  const signals = [...answers.change, ...answers.desiredOutcome];

  return CRAFT_PATHS.map((path) => {
    let score = path.featured ? 1 : 0;
    const matched = new Set<ProblemTypeId>();

    signals.forEach((signal) => {
      if (path.problemTypes.includes(signal)) {
        score += 4;
        matched.add(signal);
      }
      score += PATH_BONUSES[path.slug]?.[signal] ?? 0;
    });

    if (answers.strengths.includes("accounting") && path.slug === "ai-powered-accountant") score += 10;
    if (answers.strengths.includes("technology") && path.slug === "from-idea-to-build") score += 3;
    if (answers.strengths.includes("creative") && path.slug === "build-your-personal-brand") score += 3;
    if (answers.leaks.includes("learning-without-building") && path.problemTypes.includes("proof")) score += 4;
    if (answers.leaks.includes("unclear-priorities") && path.slug === "redirection") score += 4;

    return {
      pathSlug: path.slug,
      score,
      reasons: [...matched].slice(0, 3).map((id) => `Your ${labelFor(id).toLowerCase()} goal aligns with this path.`),
      solutionTypes: ["craft_path", "course", "challenge", "project"],
    } satisfies Recommendation;
  }).sort((a, b) => b.score - a.score);
}

export function buildRedirectionResult(answers: RedirectionAnswers): RedirectionResult {
  const recommendation = recommendCraftPaths(answers)[0];
  const path = CRAFT_PATHS.find((entry) => entry.slug === recommendation.pathSlug) ?? CRAFT_PATHS[0];
  const mainNeed = answers.change[0] ? labelFor(answers.change[0]) : "Direction";
  const strengthLabels: Record<string, string> = {
    accounting: "Accounting / finance experience",
    creative: "Creative thinking and communication",
    technology: "Digital tools and technology",
    business: "Business or operational experience",
    people: "Relationships and people skills",
    knowledge: "Knowledge you can apply or teach",
  };
  const leakLabels: Record<string, string> = {
    "learning-without-building": "Learning without producing proof",
    "unclear-priorities": "Too many competing priorities",
    "attention-scatter": "Scattered attention",
    "money-without-plan": "Money moving without an intentional plan",
    "ideas-without-execution": "Ideas without a build rhythm",
  };

  return {
    whereYouAre: answers.current || `You are looking for stronger ${mainNeed.toLowerCase()}.`,
    whatYouHave: answers.strengths.map((item) => strengthLabels[item] ?? item),
    whatIsNotWorking: answers.leaks.map((item) => leakLabels[item] ?? item),
    whatToRedirect: answers.leaks.length ? `Redirect energy away from ${leakLabels[answers.leaks[0]]?.toLowerCase() ?? answers.leaks[0]}.` : "Redirect one resource toward a visible, useful output.",
    whatToBuildNext: path.finalProject,
    nextMove: path.slug === "redirection" ? "Choose one resource—time, attention or money—and run a seven-day redirect." : `Open ${path.title} and complete its first practical step.`,
    recommendation,
  };
}
