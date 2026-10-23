export const BUILD_STAGES = [
  "decide",
  "shape",
  "brand",
  "build",
  "prove",
  "put-it-out",
  "ship",
] as const;

export type BuildStage = (typeof BUILD_STAGES)[number];
export type BuildType =
  | "app"
  | "service"
  | "digital-product"
  | "website"
  | "course"
  | "template"
  | "physical-product"
  | "business"
  | "other";

export type ChallengeStatus = "draft" | "active" | "parked" | "completed";

export interface BuildBrief {
  projectName: string;
  description: string;
  buildType: BuildType;
  targetCustomer: string;
  problem: string;
  outcome: string;
  daySevenFinishLine: string;
  offer?: string;
  pricing?: string;
  brandDirection?: string;
  researchSummary?: string;
  sourceIdeaId?: string;
}

export interface BuildArtifact {
  id: string;
  label: string;
  url: string;
  stage: BuildStage;
  createdAt: string;
}

export interface BuildDayRecord {
  completedTaskIds: string[];
  workspace: string;
  output: string;
  completedAt?: string;
}

export interface BuildChallenge {
  id: string;
  brief: BuildBrief;
  source: "impactfools" | "innergency";
  status: ChallengeStatus;
  currentDay: number;
  createdAt: string;
  activatedAt?: string;
  completedAt?: string;
  days: Partial<Record<BuildStage, BuildDayRecord>>;
  artifacts: BuildArtifact[];
}

export interface StageDefinition {
  key: BuildStage;
  day: number;
  title: string;
  objective: string;
  why: string;
  outputPrompt: string;
  tasks: string[];
}

const TYPE_TASKS: Record<BuildType, Partial<Record<BuildStage, string[]>>> = {
  app: {
    shape: ["Map the one core user flow from entry to result.", "Choose the MVP features and list what will not be built yet."],
    build: ["Build the primary screen or function end to end.", "Make the core flow usable without explaining it live."],
    prove: ["Run the core flow with a real test case and record what breaks.", "Capture a demo or screenshots of the working flow."],
    ship: ["Share the prototype or live build with at least one real potential user."],
  },
  service: {
    shape: ["Define the scope, deliverables, timeline and price.", "Write the boundary: what is explicitly not included."],
    build: ["Create the offer page or service one-pager.", "Create the delivery process and first reusable client template."],
    prove: ["Create a clearly labelled sample result or walk a potential client through the offer."],
    ship: ["Send the offer to a real potential client or publish its booking page."],
  },
  "digital-product": {
    shape: ["Define the core content or features, format, price and delivery method."],
    build: ["Create the minimum useful product files.", "Package the files so a customer can actually receive and use them."],
    prove: ["Test every file and create a sample output or walkthrough."],
    ship: ["Publish the product listing or send the product to a real tester."],
  },
  website: {
    shape: ["Define the essential pages, primary visitor action and minimum content."],
    build: ["Build and connect the minimum usable pages.", "Check the primary action on mobile and desktop."],
    prove: ["Test every public link and capture screenshots of the working experience."],
    ship: ["Publish the site to a public URL and record it below."],
  },
  course: {
    shape: ["Define the learner outcome, minimum curriculum and first delivery format."],
    build: ["Create the minimum lessons needed to produce the promised outcome.", "Create the learner exercise or proof assignment."],
    prove: ["Run one lesson with a real or representative learner and record useful feedback."],
    ship: ["Publish enrollment or invite a real learner to the first delivery."],
  },
  template: {
    shape: ["Define the exact situation, inputs and completed result the template supports."],
    build: ["Build the working template and a clean reusable version.", "Create a short usage guide."],
    prove: ["Complete the template with a realistic example and fix confusing fields."],
    ship: ["Publish or share the template with a real intended user."],
  },
  "physical-product": {
    shape: ["Define the minimum testable product, materials, quantity and target cost."],
    build: ["Create the first physical prototype or production-ready specification."],
    prove: ["Test the prototype and document the result with clear photos or video."],
    ship: ["Show, list or test the product with a real potential buyer."],
  },
  business: {
    shape: ["Define the first offer, customer journey, delivery method and price."],
    build: ["Create the basic operating setup and the assets needed to deliver the first offer."],
    prove: ["Run the offer through a realistic customer scenario and fix the obvious gaps."],
    ship: ["Publish the offer or contact the first real potential customer."],
  },
  other: {},
};

const BASE_STAGES: Omit<StageDefinition, "tasks">[] = [
  { key: "decide", day: 1, title: "DECIDE", objective: "Lock the idea and remove ambiguity.", why: "A finishable build needs one customer, one problem and one clear finish line.", outputPrompt: "Write the final minimum build and Day 7 finish line." },
  { key: "shape", day: 2, title: "SHAPE", objective: "Turn the idea into a clear, minimum offer or product structure.", why: "Scope turns enthusiasm into something you can actually finish.", outputPrompt: "Record the offer, scope, deliverables, features or customer flow you shaped." },
  { key: "brand", day: 3, title: "BRAND", objective: "Make the build recognizable and easy to understand.", why: "People need to understand what it is before they can value or test it.", outputPrompt: "Add the name, message and minimum brand assets you completed." },
  { key: "build", day: 4, title: "BUILD", objective: "Create the thing.", why: "This is production day. The build must move from plan to usable output.", outputPrompt: "Link or describe the usable version you built today." },
  { key: "prove", day: 5, title: "PROVE", objective: "Create honest evidence that the build works or deserves attention.", why: "Proof reveals what is useful and what still needs fixing.", outputPrompt: "Record the test, demo, sample output or real feedback. Never invent results." },
  { key: "put-it-out", day: 6, title: "PUT IT OUT", objective: "Create the smallest useful way for people to discover the build.", why: "A private build cannot create impact until someone can find and understand it.", outputPrompt: "Add the page, post, message, profile, demo or CTA you prepared." },
  { key: "ship", day: 7, title: "SHIP", objective: "Move the build outside your private workspace.", why: "Completion requires a meaningful shipping action, not checked boxes.", outputPrompt: "Record the public URL, outreach, pitch, listing or real-user share that shipped the build." },
];

const BASE_TASKS: Record<BuildStage, string[]> = {
  decide: [
    "Write one sentence describing the customer you are building this for.",
    "State the problem and the result your build will deliver.",
    "Cut the build to the smallest version you can finish in seven stages.",
    "Set one concrete Day 7 finish line.",
  ],
  shape: ["Define the offer or product structure.", "Choose the essential deliverables and remove non-essential scope."],
  brand: ["Confirm the name, one-line promise and key message.", "Create or gather only the visual assets required to ship."],
  build: ["Produce the core deliverable before polishing extras.", "Test the main use from start to finish."],
  prove: ["Create a demo, walkthrough, sample output or test with a real person.", "Fix the most obvious problem the proof reveals."],
  "put-it-out": ["Choose the single smallest useful distribution channel.", "Create the page, post or outreach message with one clear call to action."],
  ship: ["Complete one meaningful public or real-user shipping action.", "Record what shipped and the next concrete action."],
};

export function getStageDefinitions(brief: BuildBrief): StageDefinition[] {
  return BASE_STAGES.map((stage) => ({
    ...stage,
    tasks: [...BASE_TASKS[stage.key], ...(TYPE_TASKS[brief.buildType][stage.key] ?? [])],
  }));
}

export function emptyBrief(): BuildBrief {
  return {
    projectName: "",
    description: "",
    buildType: "other",
    targetCustomer: "",
    problem: "",
    outcome: "",
    daySevenFinishLine: "",
  };
}


