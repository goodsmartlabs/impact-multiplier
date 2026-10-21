import type { BriefSections, NewsletterEdition, PulseUpdate } from "./types";

/**
 * DEMONSTRATION CONTENT.
 *
 * These records show how Impact Pulse works before the editorial team (or
 * the research agents) publish verified updates. They are evergreen
 * explainers, not news: no live vacancies, no real deadlines, no invented
 * events. Every record is `verification: "demo"` and the UI labels it.
 * Hide them in production with PULSE_HIDE_DEMO=true once real content exists.
 */

const DEMO_DATE = "2026-10-21";
const DEMO_SOURCE = "ImpactFools editorial — demonstration content";

type Seed = Pick<PulseUpdate, "slug" | "title" | "category" | "summary" | "signal" | "cta"> &
  Partial<Pick<PulseUpdate, "tags" | "skills" | "audience" | "relatedCourseSlugs" | "featured" | "size" | "location" | "eligibility" | "job">>;

function demo(seed: Seed): PulseUpdate {
  return {
    id: `demo-${seed.slug}`,
    sourceName: DEMO_SOURCE,
    publishedAt: DEMO_DATE,
    tags: [],
    skills: [],
    audience: [],
    relatedCourseSlugs: [],
    featured: false,
    size: "standard",
    ...seed,
    status: "published",
    verification: "demo",
    submittedBy: "editor",
    createdAt: `${DEMO_DATE}T00:00:00.000Z`,
    updatedAt: `${DEMO_DATE}T00:00:00.000Z`,
  };
}

export const DEMO_UPDATES: PulseUpdate[] = [
  /* 🔥 Trending */
  demo({
    slug: "small-businesses-automating-admin",
    title: "Small businesses are handing their admin to AI-assisted workflows",
    category: "trending",
    featured: true,
    size: "feature",
    summary: "Enquiry replies, invoice chasing and data entry are the first jobs small teams automate. The people who can set these workflows up are in a strong position.",
    signal: {
      what: "Affordable automation tools (Zapier, Make, n8n) now combine with AI assistants that can read, sort and draft text, so routine admin can run without copy-paste.",
      why: "Owners lose hours each week to repetitive admin and lose customers through slow replies. Automation is one of the few changes that saves time from week one.",
      who: "Freelancers, operations assistants, virtual assistants and anyone who already handles a small business’s admin.",
      how: "Learn one automation tool well, build a working follow-up workflow and use it as proof when offering setup to local businesses.",
      next: "Start the 7-Day AI Automation Challenge and finish with a working workflow you can demonstrate.",
    },
    tags: ["automation", "small business", "AI"],
    skills: ["AI Automation", "Zapier", "Make", "Process mapping"],
    audience: ["Freelancers", "Virtual assistants", "Operations"],
    relatedCourseSlugs: ["ai-automation-foundations", "ai-for-business-operations"],
    cta: { label: "Build this skill", href: "/academy/challenge/ai-automation" },
  }),
  demo({
    slug: "data-skills-outside-data-teams",
    title: "Data skills are becoming expected far beyond the data team",
    category: "trending",
    summary: "Marketing, finance and operations roles increasingly ask for people who can build their own reports. Spreadsheet and dashboard fluency is turning into a baseline skill.",
    signal: {
      what: "More roles list “reporting”, “dashboards” or “Excel/Power BI” among everyday responsibilities, not only analyst roles.",
      why: "Teams that can answer their own questions with data move faster; people who can do it become the go-to person on their team.",
      who: "Anyone in finance, marketing, sales or operations — and career changers looking for a practical first technical skill.",
      how: "Learn pivot tables and one dashboard tool, then build a dashboard on sample data and publish it as proof.",
      next: "Take the Data Analytics challenge or start Excel Dashboards for Beginners.",
    },
    tags: ["data", "careers"],
    skills: ["Excel", "Power BI", "Data Analytics", "Google Sheets"],
    audience: ["Finance", "Marketing", "Operations", "Career changers"],
    relatedCourseSlugs: ["excel-dashboards-for-beginners", "claude-for-excel"],
    cta: { label: "Explore trend", href: "/academy/challenge/data-analytics" },
  }),

  /* 💼 Jobs & Gigs — format previews only */
  demo({
    slug: "example-remote-bookkeeping-assistant",
    title: "Example listing: Remote bookkeeping assistant (part-time)",
    category: "jobs",
    summary: "A preview of how verified job listings appear in Impact Pulse. This is not a real vacancy — it shows the details every listing must include.",
    signal: {
      what: "A typical part-time remote bookkeeping role: reconciling accounts, categorising expenses and preparing monthly reports for small clients.",
      why: "Small businesses often need a few hours of reliable bookkeeping a week rather than a full-time hire, which suits flexible remote work.",
      who: "People with accounting basics, spreadsheet skills and attention to detail — including finance students and career changers.",
      how: "Strengthen spreadsheet and reconciliation skills, build a sample month-end pack and keep it ready to share with employers.",
      next: "When verified listings are published, save them to your Opportunity Cart and track your application.",
    },
    location: "Remote",
    job: { company: "Example employer (demonstration)", location: "Remote", remote: "remote", employmentType: "Part-time contract" },
    tags: ["remote", "part-time", "finance"],
    skills: ["Bookkeeping", "Excel", "Reconciliation"],
    audience: ["Finance", "Accounting students"],
    relatedCourseSlugs: ["financial-flow", "ai-for-accountants"],
    cta: { label: "Build the skills", href: "/academy/financial-flow" },
  }),
  demo({
    slug: "example-freelance-website-refresh",
    title: "Example gig: Mobile-friendly website refresh for a local service business",
    category: "jobs",
    size: "compact",
    summary: "A format preview of a freelance project post. Real gig listings will show the client, budget range, deadline and skills once verified.",
    signal: {
      what: "A short project rebuilding a small business site so prices, hours and booking work on phones.",
      why: "Many local businesses lose enquiries because their site fails on mobile — small, well-scoped projects are a common entry point for new freelancers.",
      who: "Beginner web designers using Framer, WordPress or HTML/CSS.",
      how: "Build a sample site for a fictional business first, test it on mobile and use it as your portfolio piece.",
      next: "Complete the Web Design & Development challenge to have a live example ready.",
    },
    location: "Remote",
    job: { company: "Example client (demonstration)", remote: "remote", employmentType: "Fixed-scope freelance" },
    tags: ["freelance", "web"],
    skills: ["Web Design", "Framer", "WordPress"],
    audience: ["Designers", "Freelancers"],
    relatedCourseSlugs: ["no-code-websites"],
    cta: { label: "Prepare your portfolio", href: "/academy/challenge/web-design" },
  }),

  /* 🧠 Skills */
  demo({
    slug: "skill-workflow-automation",
    title: "Skill worth building: workflow automation",
    category: "skills",
    size: "feature",
    summary: "Connecting tools so routine work runs itself is one of the most transferable skills right now — useful in almost every industry and quick to prove.",
    signal: {
      what: "Workflow automation means designing trigger → action flows across forms, spreadsheets, email and AI steps.",
      why: "It turns hours of repetitive work into minutes and produces visible, demonstrable results — ideal for a portfolio.",
      who: "Operations staff, assistants, freelancers, finance and marketing teams, small business owners.",
      how: "Pick one tool, automate one real process end to end, then document time saved (labelled as an estimate until measured).",
      next: "Start AI Automation Foundations or the 7-day challenge.",
    },
    tags: ["automation"],
    skills: ["AI Automation", "Zapier", "Make", "n8n"],
    audience: ["Operations", "Freelancers", "Finance"],
    relatedCourseSlugs: ["ai-automation-foundations", "build-your-ai-assistant"],
    cta: { label: "Start learning", href: "/academy/ai-automation-foundations" },
  }),
  demo({
    slug: "skill-financial-forecasting",
    title: "Skill worth building: cash-flow forecasting for small businesses",
    category: "skills",
    summary: "Many small businesses track what happened but not what’s coming. Building simple, driver-based forecasts is a practical skill with clear value.",
    signal: {
      what: "A three-month cash forecast built on stated assumptions (sales growth, cost percentages, fixed costs) with scenarios.",
      why: "Cash problems — not lack of profit — are a common reason small businesses struggle. A forecast gives owners warning time.",
      who: "Finance and accounting learners, bookkeepers, business students and owners themselves.",
      how: "Learn fixed vs variable costs and break-even, then build a forecast on sample data with an upside and downside case.",
      next: "Start the Financial Analysis challenge (uses a fictional bakery dataset).",
    },
    tags: ["finance"],
    skills: ["Financial Analysis", "Forecasting", "Excel"],
    audience: ["Finance", "Accounting", "Business owners"],
    relatedCourseSlugs: ["financial-flow", "ai-for-financial-clarity"],
    cta: { label: "Build this skill", href: "/academy/challenge/financial-analysis" },
  }),
  demo({
    slug: "skill-content-strategy",
    title: "Skill worth building: content strategy that’s measured, not guessed",
    category: "skills",
    size: "compact",
    summary: "Businesses don’t need more posts — they need a plan tied to a goal and a way to tell what worked.",
    signal: {
      what: "Content strategy links audience, message, channel and measurement into a campaign with one clear goal.",
      why: "It separates useful marketing from busy posting, and it’s a service small businesses understand and buy.",
      who: "Creators, marketing assistants, social media managers and small business owners.",
      how: "Plan a seven-day campaign with tracking links and a measurement table; label simulated numbers honestly.",
      next: "Try the Digital Marketing challenge.",
    },
    skills: ["Digital Marketing", "Canva", "Copywriting"],
    audience: ["Marketing", "Creators"],
    relatedCourseSlugs: ["ai-marketing", "copywriting-fundamentals"],
    cta: { label: "Plan a campaign", href: "/academy/challenge/digital-marketing" },
  }),

  /* 🎓 Learning */
  demo({
    slug: "free-course-excel-dashboards",
    title: "Free in the Academy: Excel Dashboards for Beginners",
    category: "learning",
    summary: "A free ImpactFools course that takes you from raw data to a one-page dashboard — the foundation for reporting roles and analytics gigs.",
    signal: {
      what: "A beginner course in the ImpactFools Academy covering cleaning data, formulas, pivot tables and dashboard design.",
      why: "Dashboards are one of the fastest ways to make your value visible to a manager or client.",
      who: "Beginners in any role who work with spreadsheets.",
      how: "Take the course alongside the Data Analytics challenge so you finish with a dashboard you can show.",
      next: "Open the course and complete the first module this week.",
    },
    skills: ["Excel", "Dashboards", "Data Analytics"],
    audience: ["Beginners", "Finance", "Operations"],
    relatedCourseSlugs: ["excel-dashboards-for-beginners"],
    cta: { label: "Start learning", href: "/academy/excel-dashboards-for-beginners" },
  }),
  demo({
    slug: "free-course-claude-for-beginners",
    title: "Free in the Academy: Claude for Beginners",
    category: "learning",
    size: "compact",
    summary: "Learn to use an AI assistant for real work — drafting, summarising and structuring — with practical exercises.",
    signal: {
      what: "A free ImpactFools course introducing practical AI assistant workflows.",
      why: "Knowing how to brief an AI assistant well is now a basic productivity skill across most jobs.",
      who: "Complete beginners and professionals who want to use AI responsibly at work.",
      how: "Follow the lessons, then apply one technique to a real task you do weekly.",
      next: "Start the course and pair it with the AI Automation challenge.",
    },
    skills: ["AI", "Prompting"],
    audience: ["Beginners"],
    relatedCourseSlugs: ["claude-for-beginners"],
    cta: { label: "Start course", href: "/academy/claude-for-beginners" },
  }),

  /* 💰 Money moves */
  demo({
    slug: "money-move-automation-setup-service",
    title: "Money move: package one automation as a fixed-scope service",
    category: "money",
    size: "feature",
    summary: "Instead of selling “automation”, sell one clear outcome — for example, “every enquiry answered within 5 minutes” — with a fixed scope.",
    signal: {
      what: "A productised service: one workflow, set up and documented, with optional monthly maintenance.",
      why: "Clear scope makes it easier for small businesses to say yes and easier for you to deliver well.",
      who: "People who have built at least one working automation they can demonstrate.",
      how: "Use your challenge project as a case study, define exactly what’s included, and test the offer with a few real businesses.",
      next: "Finish a 7-Day Skill Challenge — the Impact Check drafts your first service offer from your project.",
    },
    tags: ["services", "freelance"],
    skills: ["AI Automation"],
    audience: ["Freelancers", "Side income"],
    relatedCourseSlugs: ["ai-side-hustle", "ai-automation-foundations"],
    cta: { label: "Turn skill into service", href: "/academy/challenge" },
  }),
  demo({
    slug: "money-move-monthly-reporting",
    title: "Money move: offer a monthly dashboard to businesses drowning in spreadsheets",
    category: "money",
    summary: "Owners often have the data (POS exports, invoices) but no time to read it. A simple monthly dashboard with three insights is a clear, repeatable service.",
    signal: {
      what: "A recurring reporting service built from a client’s existing exports.",
      why: "Recurring work is more predictable than one-off projects, and insights tie directly to decisions owners care about.",
      who: "People with spreadsheet or Power BI skills and a sample dashboard to show.",
      how: "Build a dashboard on sample data, write three actionable insights, and offer a free first month to one business to test demand.",
      next: "Use the Data Analytics challenge to create your sample.",
    },
    skills: ["Data Analytics", "Power BI", "Excel"],
    audience: ["Freelancers", "Finance"],
    relatedCourseSlugs: ["excel-dashboards-for-beginners"],
    cta: { label: "See how to start", href: "/academy/challenge/data-analytics" },
  }),

  /* 🚀 Opportunities — format previews only */
  demo({
    slug: "example-fellowship-format",
    title: "Example: How a fellowship opportunity appears in Impact Pulse",
    category: "opportunities",
    summary: "A preview of the opportunity format. Verified fellowships, grants and competitions will show the organiser, eligibility, deadline and a link to apply at the source.",
    signal: {
      what: "Fellowships offer structured development — mentoring, training, sometimes funding — for a fixed period.",
      why: "They can accelerate a career or venture, but deadlines and eligibility rules are strict, so preparation matters.",
      who: "Early-career professionals, founders and students who meet the eligibility criteria.",
      how: "Prepare a short bio, a proof-of-work link and a clear statement of what you want to build — reusable across applications.",
      next: "Use the Capacity Guide to clarify your direction before verified opportunities are published.",
    },
    eligibility: "Shown for every verified opportunity (age, location, stage, field).",
    tags: ["fellowship"],
    audience: ["Early-career", "Founders", "Students"],
    relatedCourseSlugs: ["land-jobs-with-ai"],
    cta: { label: "Prepare with the Capacity Guide", href: "/capacity-guide" },
  }),
  demo({
    slug: "how-to-judge-a-grant",
    title: "Before you apply: how to tell a real grant from a scam",
    category: "opportunities",
    size: "compact",
    summary: "Legitimate grants never ask you to pay a fee to receive money. A short checklist to protect your time and data.",
    signal: {
      what: "A verification checklist: known organiser, published criteria, no upfront fees, official application channel, clear timeline.",
      why: "Fake “grants” target people looking for opportunities — checking first protects your money and personal information.",
      who: "Anyone applying for grants, scholarships or competitions.",
      how: "Check the organiser’s official website, search for independent mentions and never share bank details to “unlock” funds.",
      next: "Apply this checklist to every opportunity you save to your Opportunity Cart.",
    },
    tags: ["safety", "grants"],
    audience: ["Everyone"],
    cta: { label: "Read the checklist", href: "/pulse/how-to-judge-a-grant" },
  }),

  /* 🤖 AI & Technology */
  demo({
    slug: "ai-assistants-for-everyday-work",
    title: "AI assistants are most useful on the boring parts of your job",
    category: "ai",
    summary: "The biggest gains come from summarising, drafting, structuring and checking — tasks you already do — rather than from replacing whole jobs.",
    signal: {
      what: "AI assistants can draft emails, summarise documents, structure notes and check work against a checklist.",
      why: "Saving 20–30 minutes on routine tasks compounds; people who use these tools well free time for higher-value work.",
      who: "Office workers, students, freelancers and managers.",
      how: "Pick one weekly task, write a clear prompt with an example of good output, and refine it until it’s reliable.",
      next: "Learn prompting basics in Claude for Beginners or AI Tools for Productivity.",
    },
    tags: ["AI", "productivity"],
    skills: ["AI", "Prompting", "Productivity"],
    audience: ["Professionals", "Students"],
    relatedCourseSlugs: ["ai-tools-for-productivity", "claude-for-beginners"],
    cta: { label: "Explore AI tools", href: "/academy/ai-tools-for-productivity" },
  }),
  demo({
    slug: "no-code-builders-websites",
    title: "No-code builders made professional websites a beginner-friendly skill",
    category: "ai",
    size: "compact",
    summary: "Visual builders handle responsive layouts and hosting, so new designers can focus on structure, content and conversion.",
    signal: {
      what: "Tools like Framer and WordPress let you publish responsive sites without writing code from scratch.",
      why: "Lower technical barriers mean the differentiator is understanding the client’s business — a learnable skill.",
      who: "Aspiring web designers, marketers and small business owners.",
      how: "Build one complete site for a sample business and test it on mobile.",
      next: "Start No-Code Websites or the web design challenge.",
    },
    skills: ["Web Design", "Framer", "WordPress"],
    audience: ["Designers", "Small business owners"],
    relatedCourseSlugs: ["no-code-websites"],
    cta: { label: "Build a site", href: "/academy/no-code-websites" },
  }),

  /* 🌍 Industry watch */
  demo({
    slug: "finance-teams-automation-judgement",
    title: "Finance: automation is shifting work from data entry to judgement",
    category: "industry",
    summary: "As routine bookkeeping gets automated, the valuable finance skills are review, analysis, controls and explaining numbers to decision-makers.",
    signal: {
      what: "Finance work is moving from keying in transactions toward reviewing automated output and advising on decisions.",
      why: "Professionals who combine accounting judgement with automation and analysis skills become more valuable, not less.",
      who: "Accountants, bookkeepers, finance students and finance managers.",
      how: "Add one automation and one analysis skill to your accounting foundation, and learn where human review is required.",
      next: "Explore AI, Accounting Judgment & Assurance and AI for Accountants.",
    },
    tags: ["finance", "accounting"],
    skills: ["Accounting", "AI Automation", "Financial Analysis"],
    audience: ["Finance", "Accounting"],
    relatedCourseSlugs: ["ai-accounting-judgment-assurance", "ai-for-accountants"],
    cta: { label: "Read more", href: "/academy/ai-for-accountants" },
  }),
  demo({
    slug: "education-proof-over-certificates",
    title: "Education & hiring: proof of work is gaining ground on certificates alone",
    category: "industry",
    summary: "Portfolios, case studies and work samples help employers and clients see what you can actually do.",
    signal: {
      what: "Many hiring managers and clients look for evidence — a project, a case study, a live link — alongside qualifications.",
      why: "Proof reduces risk for the person hiring you and helps you stand out without years of experience.",
      who: "Students, career changers, freelancers and anyone building a new skill.",
      how: "Turn every learning sprint into one small, documented project with a public link.",
      next: "Use a 7-Day Skill Challenge to produce your first proof project.",
    },
    tags: ["careers", "education"],
    audience: ["Students", "Career changers", "Freelancers"],
    relatedCourseSlugs: ["build-strong-portfolio-with-ai", "land-jobs-with-ai"],
    cta: { label: "Build your proof", href: "/academy/challenge" },
  }),
];

const sections: BriefSections = {
  whatsHot: [
    { slug: "small-businesses-automating-admin", title: "Small businesses are handing their admin to AI-assisted workflows", note: "Setup skills are in a strong position." },
    { slug: "data-skills-outside-data-teams", title: "Data skills are becoming expected far beyond the data team", note: "Reporting is turning into a baseline skill." },
    { slug: "finance-teams-automation-judgement", title: "Finance: automation is shifting work from data entry to judgement", note: "Review and analysis gain value." },
  ],
  skillWorthBuilding: [{ slug: "skill-workflow-automation", title: "Workflow automation", note: "Transferable, quick to prove, useful everywhere." }],
  opportunities: [
    { slug: "example-fellowship-format", title: "How fellowship listings will look", note: "Verified opportunities will appear here." },
    { slug: "how-to-judge-a-grant", title: "How to tell a real grant from a scam", note: "Use before every application." },
    { slug: "example-remote-bookkeeping-assistant", title: "Example remote bookkeeping listing", note: "Format preview — not a real vacancy." },
    { slug: "example-freelance-website-refresh", title: "Example freelance website gig", note: "Format preview — not a real project." },
    { title: "7-Day Skill Challenge", note: "Build one project in a week.", href: "/academy/challenge" },
  ],
  learnSomething: [{ slug: "free-course-excel-dashboards", title: "Excel Dashboards for Beginners", note: "Free in the Academy." }],
  moneyMove: [{ slug: "money-move-automation-setup-service", title: "Package one automation as a fixed-scope service", note: "Sell an outcome, not a tool." }],
  powerMove: [{ title: "Automate one task you repeat every week", note: "Pick it today, build it by Sunday, write down the minutes saved (as an estimate).", href: "/academy/challenge/ai-automation" }],
};

export const DEMO_EDITIONS: NewsletterEdition[] = [
  {
    id: "demo-edition-preview",
    slug: "preview-edition",
    title: "Preview edition: what The Impact Brief will look like",
    intro: "This is a demonstration edition built from Impact Pulse’s sample content. It was not emailed to anyone — real editions will appear here once the editorial team publishes them.",
    sections,
    status: "published",
    demo: true,
    publishedAt: DEMO_DATE,
    createdAt: `${DEMO_DATE}T00:00:00.000Z`,
    updatedAt: `${DEMO_DATE}T00:00:00.000Z`,
  },
];
