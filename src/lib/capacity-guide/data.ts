import type { CapacitySkill } from "./types";

export const CAPACITY_SKILLS: CapacitySkill[] = [
  {
    id: "ai-automation",
    name: "AI Automation",
    category: "AI & Technology",
    description: "Connect AI and workflow tools to improve repetitive work.",
    stackPartners: ["data-analysis", "business-operations", "finance-accounting"],
    courseSlugs: ["ai-automation-foundations", "build-your-ai-assistant", "ai-for-business-operations"],
    proofIdeas: ["Build one working workflow that removes a repetitive step", "Document a before-and-after process", "Create a simple automation demo"],
    opportunities: [
      { title: "Workflow automation support", audience: "Small businesses and operations teams", problem: "Repeated manual processes consume time", capability: "Map a process, choose safe tools, build and test a reliable workflow", proof: "Automate one weekly reporting or follow-up workflow", mode: "Freelancing / consulting" },
      { title: "AI-assisted operations", audience: "Administrators and growing teams", problem: "Documentation and recurring tasks are inconsistent", capability: "Design human-reviewed AI workflows and operating guides", proof: "Create a documented internal assistant prototype", mode: "Employment / service business" },
    ],
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    category: "Data & Finance",
    description: "Turn raw information into useful patterns, dashboards and decisions.",
    stackPartners: ["finance-accounting", "ai-automation", "business-operations"],
    courseSlugs: ["excel-dashboards-for-beginners", "ai-tools-for-finance"],
    proofIdeas: ["Build a dashboard from a public or sample dataset", "Create a short insight report", "Clean and explain a messy spreadsheet"],
    opportunities: [
      { title: "Management dashboards", audience: "SMEs and department leads", problem: "Decision-makers cannot see performance clearly", capability: "Clean data, define useful measures and build readable dashboards", proof: "Build a dashboard with a one-page insight summary", mode: "Employment / freelancing" },
      { title: "Reporting support", audience: "Finance and operations teams", problem: "Monthly reports take too long to prepare", capability: "Structure repeatable analysis and reporting", proof: "Create a reusable monthly reporting template", mode: "Consulting / current profession" },
    ],
  },
  {
    id: "finance-accounting",
    name: "Finance & Accounting",
    category: "Finance",
    description: "Organize, interpret and communicate financial information responsibly.",
    stackPartners: ["data-analysis", "ai-automation", "business-operations"],
    courseSlugs: ["financial-flow", "ai-for-financial-clarity", "ai-for-accountants", "ai-accounting-judgment-assurance"],
    proofIdeas: ["Create sample management accounts", "Build a cash-flow model", "Write a financial analysis with assumptions clearly stated"],
    opportunities: [
      { title: "SME finance support", audience: "Small-business owners", problem: "Owners lack clear, timely financial information", capability: "Prepare accurate records and explain useful financial patterns", proof: "Create sample management accounts and a decision brief", mode: "Consulting / service business" },
      { title: "Finance automation", audience: "Finance teams", problem: "Reporting relies on repeated manual work", capability: "Combine accounting judgment with safe data and automation workflows", proof: "Prototype an automated monthly reporting workflow", mode: "Current profession / consulting" },
    ],
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    category: "Design & Creative",
    description: "Create visual communication that makes ideas clearer and brands more consistent.",
    stackPartners: ["content-strategy", "personal-branding", "web-design"],
    courseSlugs: ["ai-in-design", "midjourney-for-ai-visuals"],
    proofIdeas: ["Create three campaign designs for one fictional brief", "Build a small brand visual system", "Redesign one weak communication piece and explain the choices"],
    opportunities: [
      { title: "Brand content design", audience: "Small businesses and creators", problem: "Their communication looks inconsistent or unclear", capability: "Translate a brief into consistent, usable visual assets", proof: "Create a three-piece campaign with a short case study", mode: "Freelancing / service business" },
      { title: "Marketing design support", audience: "Marketing teams", problem: "Campaign ideas need strong visual execution", capability: "Design channel-ready creative within a brand system", proof: "Build a sample campaign toolkit", mode: "Employment / freelancing" },
    ],
  },
  {
    id: "content-strategy",
    name: "Content & Social Media",
    category: "Marketing",
    description: "Plan useful content around an audience, message and measurable goal.",
    stackPartners: ["graphic-design", "video-editing", "personal-branding"],
    courseSlugs: ["ai-marketing", "copywriting-fundamentals"],
    proofIdeas: ["Create a sample 30-day content strategy", "Build a five-post campaign", "Audit and improve one brand's content structure"],
    opportunities: [
      { title: "Content strategy", audience: "Experts, founders and small brands", problem: "They post without a clear message or system", capability: "Research an audience and build a practical content plan", proof: "Create a 30-day strategy with five finished examples", mode: "Freelancing / consulting" },
      { title: "Social media support", audience: "Local businesses", problem: "Their channels are inconsistent and time-consuming", capability: "Plan, produce and review useful channel content", proof: "Build a sample monthly content system", mode: "Service business" },
    ],
  },
  {
    id: "video-editing",
    name: "Short-Form Video Editing",
    category: "Design & Creative",
    description: "Shape raw footage into clear, engaging short-form stories.",
    stackPartners: ["content-strategy", "graphic-design", "personal-branding"],
    courseSlugs: ["video-editing-for-creators"],
    proofIdeas: ["Edit three portfolio videos with different goals", "Create before-and-after editing comparisons", "Build a repeatable editing template"],
    opportunities: [
      { title: "Short-form editing", audience: "Creators and small brands", problem: "They have footage but cannot turn it into consistent content", capability: "Edit for clarity, pacing, captions and platform delivery", proof: "Edit three varied portfolio videos", mode: "Freelancing / service business" },
      { title: "Campaign video production", audience: "Marketing teams", problem: "Campaigns need adaptable video assets", capability: "Turn one brief into multiple short-form cuts", proof: "Create a three-format campaign sample", mode: "Employment / freelancing" },
    ],
  },
  {
    id: "web-design",
    name: "Web Design & No-Code Building",
    category: "Web & Digital",
    description: "Turn a business goal into a clear, responsive digital experience.",
    stackPartners: ["graphic-design", "content-strategy", "ai-automation"],
    courseSlugs: ["no-code-websites", "no-code-app-building", "master-claude-code"],
    proofIdeas: ["Build one responsive landing page", "Redesign a small-business homepage", "Document a problem-to-prototype process"],
    opportunities: [
      { title: "Small-business websites", audience: "Businesses without a useful online presence", problem: "Customers cannot understand or access their offer", capability: "Plan and build a responsive, accessible website", proof: "Publish one complete landing page", mode: "Freelancing / service business" },
      { title: "Digital product prototypes", audience: "Founders and teams testing ideas", problem: "They need to validate a workflow before heavy investment", capability: "Map a user journey and build a testable prototype", proof: "Create one working prototype and test notes", mode: "Consulting / entrepreneurship" },
    ],
  },
  {
    id: "business-operations",
    name: "Business Operations",
    category: "Business",
    description: "Create systems, documentation and workflows that help work run better.",
    stackPartners: ["ai-automation", "data-analysis", "project-management"],
    courseSlugs: ["ai-for-business-operations", "ai-tools-for-business"],
    proofIdeas: ["Map and improve one business process", "Create a practical operations manual", "Build a simple workflow dashboard"],
    opportunities: [
      { title: "Systems setup", audience: "Growing small businesses", problem: "Work depends on memory and inconsistent routines", capability: "Document processes and introduce maintainable systems", proof: "Create one end-to-end operating system for a sample business", mode: "Consulting / service business" },
      { title: "Virtual operations", audience: "Founders and remote teams", problem: "Coordination and follow-through are weak", capability: "Manage repeatable workflows, tools and reporting", proof: "Build a sample weekly operations dashboard", mode: "Employment / freelancing" },
    ],
  },
  {
    id: "personal-branding",
    name: "Personal Brand Strategy",
    category: "Career & Growth",
    description: "Clarify positioning and make real capability visible through proof.",
    stackPartners: ["content-strategy", "graphic-design", "career-development"],
    courseSlugs: ["building-you-the-brand", "build-strong-portfolio-with-ai", "land-jobs-with-ai"],
    proofIdeas: ["Create a positioning statement and proof portfolio", "Build a case-study-led profile", "Design a four-week visibility plan"],
    opportunities: [
      { title: "Proof-led personal branding", audience: "Professionals and independent experts", problem: "Their value is hard to understand or verify", capability: "Clarify positioning and organize credible proof", proof: "Create a positioning and portfolio package", mode: "Consulting / current career" },
      { title: "Portfolio strategy", audience: "Career changers and freelancers", problem: "They have skills but no visible evidence", capability: "Turn work into focused case studies", proof: "Build three proof pieces and a simple portfolio", mode: "Teaching / service business" },
    ],
  },
  {
    id: "project-management",
    name: "Project Management",
    category: "Business",
    description: "Coordinate people, priorities and delivery around a clear outcome.",
    stackPartners: ["business-operations", "data-analysis", "ai-automation"],
    courseSlugs: ["ai-for-business-operations", "ai-tools-for-productivity"],
    proofIdeas: ["Create a complete project plan", "Build a delivery tracker and risk log", "Document a small project from brief to review"],
    opportunities: [
      { title: "Project coordination", audience: "Small teams and community organizations", problem: "Important work loses direction and follow-through", capability: "Plan scope, responsibilities, timelines and risks", proof: "Build a complete project delivery pack", mode: "Employment / consulting" },
    ],
  },
  {
    id: "copywriting",
    name: "Copywriting",
    category: "Marketing",
    description: "Write clear, persuasive communication for a specific audience and action.",
    stackPartners: ["content-strategy", "personal-branding", "web-design"],
    courseSlugs: ["copywriting-fundamentals", "ai-marketing"],
    proofIdeas: ["Write three samples for different business goals", "Rewrite a landing page", "Create an email mini-campaign"],
    opportunities: [
      { title: "Marketing copy", audience: "Small businesses and service providers", problem: "Their offers are unclear or unconvincing", capability: "Research an audience and write clear outcome-led copy", proof: "Create a landing page, email and social campaign sample", mode: "Freelancing / employment" },
    ],
  },
  {
    id: "career-development",
    name: "Career Development",
    category: "Career & Growth",
    description: "Translate experience into stronger positioning, proof and career moves.",
    stackPartners: ["personal-branding", "data-analysis", "project-management"],
    courseSlugs: ["land-jobs-with-ai", "build-strong-portfolio-with-ai", "building-you-the-brand"],
    proofIdeas: ["Build a role-targeted portfolio", "Create three STAR case studies", "Map a focused 30-day career campaign"],
    opportunities: [
      { title: "Stronger career positioning", audience: "Professionals seeking growth or transition", problem: "Their experience is not expressed as evidence of value", capability: "Translate work into focused outcomes and proof", proof: "Build a role-specific profile with three case studies", mode: "Better-paying employment" },
    ],
  },
];

export const CAPACITY_SKILL_BY_ID = new Map(CAPACITY_SKILLS.map((skill) => [skill.id, skill]));

export const CAPACITY_STEPS = [
  "Current Capacity",
  "Potential",
  "Value",
  "Capacity Stack",
  "Opportunities",
  "Build",
  "Proof",
] as const;
