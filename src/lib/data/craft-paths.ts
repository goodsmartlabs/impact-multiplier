import type { CraftPath, ProblemType, SolutionType } from "@/lib/types";

export const PROBLEM_TYPES: ProblemType[] = [
  { id: "clarity", label: "Clarity", statement: "I don’t know what I want." },
  { id: "direction", label: "Direction", statement: "Something needs to change, but I don’t know what." },
  { id: "capability", label: "Capability", statement: "I know what I want, but I don’t know how." },
  { id: "application", label: "Application", statement: "I keep learning, but I’m not using it." },
  { id: "proof", label: "Proof", statement: "I can do the work, but I have little to show." },
  { id: "income", label: "Income", statement: "I have skills, but don’t know how to earn from them." },
  { id: "visibility", label: "Visibility", statement: "I have value, but people don’t know about me." },
  { id: "building", label: "Building", statement: "I have an idea, but don’t know how to make it real." },
  { id: "career", label: "Career", statement: "I want to strengthen or change my career." },
  { id: "business", label: "Business", statement: "I want to start or improve a business." },
  { id: "money-wealth", label: "Money + Wealth", statement: "I need to direct my resources intentionally." },
  { id: "growth", label: "Growth", statement: "I’ve started, but don’t know my next level." },
];

export const SOLUTION_LABELS: Record<SolutionType, string> = {
  course: "Course",
  craft_path: "Craft Path",
  digital_product: "Digital Product",
  challenge: "Challenge",
  consulting: "Guided Support",
  service: "Service",
  project: "Proof Project",
};

const proofStep = (title: string, output: string) => ({
  id: "prove",
  label: "Prove",
  title,
  description: "Turn the capability into visible, useful evidence.",
  solutionType: "project" as const,
  output,
});

export const CRAFT_PATHS: CraftPath[] = [
  {
    id: "path-redirection",
    slug: "redirection",
    title: "Redirection",
    shortOutcome: "Clarity, direction and one useful next move.",
    whoItsFor: "People at a crossroads who know something needs to change but cannot yet see the right move.",
    problem: "Your time, attention, money or skills are moving, but not toward meaningful progress.",
    desiredOutcome: "Understand what you have, identify what is leaking, and choose the right path before investing more effort.",
    problemTypes: ["clarity", "direction", "growth"],
    courseSlugs: [],
    tools: ["Redirection Check", "Source–Current–Leaks–Reservoir–Delta Map"],
    challenges: ["One-resource redirect"],
    finalProject: "Your personal Redirection Map",
    proof: ["A clear next move", "A matched Craft Path", "A practical first action"],
    estimatedJourney: "15–25 minutes to diagnose; 7 days to test the redirect",
    featured: true,
    accent: "pink",
    steps: [
      { id: "discover", label: "Discover", title: "Name what needs to change", description: "Start with your lived problem—not a catalogue.", solutionType: "consulting", referenceSlug: "/redirection" },
      { id: "diagnose", label: "Diagnose", title: "Map your FLOW", description: "See your source, current, leaks, reservoir and possible delta.", solutionType: "digital_product" },
      { id: "redirect", label: "Redirect", title: "Choose the right intervention", description: "Match the problem to a path, course, tool, challenge or guided support.", solutionType: "craft_path" },
      proofStep("Test one next move", "A completed Redirection Map and first-week action"),
    ],
  },
  {
    id: "path-personal-brand", slug: "build-your-personal-brand", title: "Build Your Personal Brand", shortOutcome: "Position your value and make your capability visible.",
    whoItsFor: "People with useful experience or skills who need clearer positioning, content direction and proof.", problem: "You are visible without a clear value story—or valuable without enough visibility.", desiredOutcome: "A coherent position, brand presence, content direction and proof portfolio.",
    problemTypes: ["visibility", "proof", "career"], courseSlugs: ["building-you-the-brand", "ai-marketing", "ai-in-design", "build-a-strong-portfolio-with-ai"], tools: ["Positioning canvas", "Content direction board"], challenges: ["Publish one proof-led brand piece"], finalProject: "A proof-led personal brand page", proof: ["Positioning statement", "Visual direction", "Portfolio sample"], estimatedJourney: "4–6 weeks", accent: "pink",
    steps: [
      { id: "position", label: "Learn", title: "Find your position", description: "Clarify what you want to be known for and the value beneath the brand.", solutionType: "course", referenceSlug: "building-you-the-brand" },
      { id: "express", label: "Build", title: "Create the brand system", description: "Shape the visual and content language that makes the position legible.", solutionType: "course", referenceSlug: "ai-in-design" },
      proofStep("Publish your proof", "A public brand and portfolio page"),
    ],
  },
  {
    id: "path-ai-income", slug: "make-money-with-ai", title: "Make Money With AI", shortOutcome: "Turn an AI-enabled capability into a credible offer.",
    whoItsFor: "People who want an ethical, practical route from AI skills to additional income.", problem: "You know AI is useful but do not know which capability to monetize or how to demonstrate it.", desiredOutcome: "Choose a useful capability, create an offer, build proof and define a route to a first opportunity.",
    problemTypes: ["income", "capability", "proof"], courseSlugs: ["ai-side-hustle", "ai-tools-for-productivity", "ai-tools-masterclass", "ai-marketing", "build-a-strong-portfolio-with-ai"], tools: ["Capability-to-offer canvas", "Opportunity shortlist"], challenges: ["Build one sample for a real audience"], finalProject: "A tested AI-enabled service offer", proof: ["Offer statement", "Work sample", "Outreach plan"], estimatedJourney: "4–6 weeks", accent: "blue",
    steps: [
      { id: "choose", label: "Learn", title: "Choose a useful capability", description: "Match an AI-supported skill to a real problem.", solutionType: "course", referenceSlug: "ai-side-hustle" },
      { id: "offer", label: "Build", title: "Turn capability into an offer", description: "Define who it helps, what changes and how the work is delivered.", solutionType: "challenge" },
      proofStep("Create market-ready proof", "One credible work sample and an offer page"),
    ],
  },
  {
    id: "path-ai-accountant", slug: "ai-powered-accountant", title: "AI-Powered Accountant", shortOutcome: "Apply AI with stronger accounting judgment and evidence.",
    whoItsFor: "Accountants and finance professionals strengthening practical AI capability.", problem: "Generic AI knowledge does not translate automatically into responsible accounting work.", desiredOutcome: "Use AI in finance workflows with clarity, judgment, assurance and practical proof.",
    problemTypes: ["career", "capability", "proof"], courseSlugs: ["ai-for-financial-clarity", "ai-for-accountants", "ai-accounting-judgment-assurance", "ai-tools-for-finance"], tools: ["Finance workflow map", "Judgment checklist"], challenges: ["Improve one accounting workflow"], finalProject: "An AI-enhanced accounting workflow case study", proof: ["Workflow comparison", "Controls and judgment notes", "Practical case study"], estimatedJourney: "5–8 weeks", accent: "blue",
    steps: [
      { id: "clarity", label: "Learn", title: "Strengthen financial clarity", description: "Start with the decisions and information that matter.", solutionType: "course", referenceSlug: "ai-for-financial-clarity" },
      { id: "apply", label: "Build", title: "Apply AI to accounting work", description: "Use tools with appropriate review and professional judgment.", solutionType: "course", referenceSlug: "ai-for-accountants" },
      proofStep("Document an improved workflow", "A responsible AI accounting case study"),
    ],
  },
  {
    id: "path-digital-presence", slug: "build-your-digital-presence", title: "Build Your Digital Presence", shortOutcome: "Create a brand, website and proof portfolio that work together.",
    whoItsFor: "Professionals and creators who need a credible home for their work.", problem: "Your value is scattered across platforms or difficult to understand quickly.", desiredOutcome: "A focused brand presence, working website and evidence of capability.", problemTypes: ["visibility", "proof", "building"], courseSlugs: ["building-you-the-brand", "no-code-websites", "build-a-strong-portfolio-with-ai"], tools: ["Website brief", "Proof inventory"], challenges: ["Ship a one-page presence"], finalProject: "A live portfolio website", proof: ["Live URL", "Three proof pieces", "Clear positioning"], estimatedJourney: "3–5 weeks", accent: "pink",
    steps: [{ id: "position", label: "Learn", title: "Clarify the message", description: "Define the value the site must communicate.", solutionType: "course", referenceSlug: "building-you-the-brand" }, { id: "site", label: "Build", title: "Build the website", description: "Turn the message into a focused digital home.", solutionType: "course", referenceSlug: "no-code-websites" }, proofStep("Publish a credible presence", "A live website with portfolio proof")],
  },
  {
    id: "path-ai-career", slug: "build-your-ai-career", title: "Build Your AI Career", shortOutcome: "Build useful AI capability, proof and stronger career positioning.",
    whoItsFor: "People preparing for AI-influenced roles or strengthening their current work.", problem: "You have explored AI but cannot yet demonstrate job-relevant capability.", desiredOutcome: "Practical AI skill, visible proof and a responsible career strategy.", problemTypes: ["career", "capability", "proof"], courseSlugs: ["ai-tools-for-productivity", "build-a-strong-portfolio-with-ai", "land-jobs-with-ai"], tools: ["Capability inventory", "Application research sheet"], challenges: ["Complete one role-relevant proof project"], finalProject: "An AI-enhanced professional portfolio", proof: ["Work sample", "Portfolio", "Positioning materials"], estimatedJourney: "4–6 weeks", accent: "blue",
    steps: [{ id: "skills", label: "Learn", title: "Build useful AI fluency", description: "Use AI to improve real work rather than collect prompts.", solutionType: "course", referenceSlug: "ai-tools-for-productivity" }, { id: "position", label: "Apply", title: "Position the capability", description: "Connect proof to roles and opportunities without claiming guaranteed employment.", solutionType: "course", referenceSlug: "land-jobs-with-ai" }, proofStep("Show role-relevant work", "An AI-enhanced portfolio project")],
  },
  {
    id: "path-business-online", slug: "build-your-business-online", title: "Build Your Business Online", shortOutcome: "Create the digital, operational and growth foundation for a business.",
    whoItsFor: "Founders and small teams moving a business from scattered activity to a working online system.", problem: "The business lacks a joined-up presence, operations and route to customers.", desiredOutcome: "A working online presence, clearer operations and a practical marketing and sales foundation.", problemTypes: ["business", "building", "growth"], courseSlugs: ["no-code-websites", "ai-for-business-operations", "ai-marketing", "boost-sales-with-ai"], tools: ["Business system map", "Customer journey board"], challenges: ["Publish and test one acquisition route"], finalProject: "A working online business foundation", proof: ["Website", "Operations map", "Marketing experiment"], estimatedJourney: "6–8 weeks", accent: "ink",
    steps: [{ id: "presence", label: "Build", title: "Create the digital front door", description: "Make the offer understandable and accessible online.", solutionType: "course", referenceSlug: "no-code-websites" }, { id: "system", label: "Apply", title: "Connect operations and growth", description: "Design how attention becomes delivery and customer value.", solutionType: "course", referenceSlug: "ai-for-business-operations" }, proofStep("Test the business system", "A live presence and one measured growth experiment")],
  },
  {
    id: "path-wealth", slug: "build-your-wealth-system", title: "Build Your Wealth System", shortOutcome: "Understand your flow and direct resources toward a stronger structure.",
    whoItsFor: "People earning or managing resources who need more intentional financial direction.", problem: "Money moves, but the current system does not consistently build stability or future capacity.", desiredOutcome: "Understand current flow, redirect resources and build a practical wealth structure.", problemTypes: ["money-wealth", "direction", "growth"], courseSlugs: ["financial-flow", "the-wealth-lab", "ai-for-financial-clarity"], tools: ["FLOW map", "Wealth structure canvas"], challenges: ["Redirect one financial leak"], finalProject: "A personal wealth operating map", proof: ["Flow diagnosis", "Resource redirect", "Next financial capability"], estimatedJourney: "4–6 weeks", accent: "ink",
    steps: [{ id: "flow", label: "Diagnose", title: "Understand your current flow", description: "See source, current, leaks, reservoir and delta clearly.", solutionType: "course", referenceSlug: "financial-flow" }, { id: "structure", label: "Build", title: "Design the wealth structure", description: "Strengthen the system before adding future investing capability.", solutionType: "course", referenceSlug: "the-wealth-lab" }, proofStep("Put the system into use", "A personal financial FLOW and wealth structure map")],
  },
  {
    id: "path-idea-build", slug: "from-idea-to-build", title: "From Idea to Build", shortOutcome: "Move from concept to a working prototype and launch foundation.",
    whoItsFor: "People with an idea who need a practical route into building and testing it.", problem: "The idea stays abstract because the build feels too technical or too large.", desiredOutcome: "A focused concept, working prototype and initial launch foundation.", problemTypes: ["building", "capability", "business"], courseSlugs: ["no-code-app-building", "no-code-websites", "ai-tools-masterclass", "ai-marketing"], tools: ["Concept brief", "Prototype scope"], challenges: ["Build the smallest useful version"], finalProject: "A working prototype", proof: ["Prototype", "Build log", "Launch test"], estimatedJourney: "4–8 weeks", accent: "blue",
    steps: [{ id: "scope", label: "Discover", title: "Shrink the idea into a useful test", description: "Define the user, problem and smallest meaningful outcome.", solutionType: "digital_product" }, { id: "prototype", label: "Build", title: "Create the working version", description: "Use no-code and appropriate AI tools to build deliberately.", solutionType: "course", referenceSlug: "no-code-app-building" }, proofStep("Put the prototype in front of people", "A working prototype and feedback record")],
  },
];

export function getCraftPath(slug: string) {
  return CRAFT_PATHS.find((path) => path.slug === slug);
}
