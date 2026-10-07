export type CapacityScores = {
  interest: number;
  existingAbility: number;
  demand: number;
  incomePotential: number;
  buildability: number;
};

export type CurrentCapacityAnswers = {
  knowHow: string;
  askedForHelp: string;
  feelsEasy: string;
  repeatedExperience: string;
  jobLearning: string;
  tools: string;
  created: string;
};

export type PotentialAnswers = {
  curiousAbout: string;
  postponedSkill: string;
  energizingWork: string;
  couldLearn: string;
  futureStatement: string;
  selectedSkills: string[];
};

export type CapacityBuild = {
  skill: string;
  why: string;
  beneficiary: string;
  problem: string;
  learning: string;
  deliverable: string;
};

export type ValueTest = {
  people: string;
  offer: string;
  problem: string;
  result: string;
  firstTest: string;
};

export type CapacityGuideAnswers = {
  current: CurrentCapacityAnswers;
  potential: PotentialAnswers;
  scores: Record<string, CapacityScores>;
  selectedStack: string[];
  selectedOpportunity: string;
  build: CapacityBuild;
  proof: string;
  valueTest: ValueTest;
};

export type OpportunityDirection = {
  title: string;
  audience: string;
  problem: string;
  capability: string;
  proof: string;
  mode: string;
};

export type CapacityProfile = {
  generatedAt: string;
  existingCapacity: {
    know: string[];
    canDo: string[];
    experience: string[];
    canCreate: string[];
  };
  strongestSkills: string[];
  recommendedStack: string[];
  opportunities: OpportunityDirection[];
  build: CapacityBuild;
  proof: string;
  valueTest: ValueTest;
  recommendedCourseSlugs: string[];
};

export type CapacitySkill = {
  id: string;
  name: string;
  category: string;
  description: string;
  stackPartners: string[];
  courseSlugs: string[];
  proofIdeas: string[];
  opportunities: OpportunityDirection[];
};
