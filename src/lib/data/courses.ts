import type { Course } from "@/lib/types";
import { COMING_SOON_COURSES } from "@/lib/data/course-catalogue";
import { learningAreasForCourse } from "@/lib/data/learning-areas";

const COURSE_RECORDS: Omit<Course, "learningAreas">[] = [
  {
    id: "c-ai-dramas",
    slug: "ai-dramas",
    title: "AI DRAMAS",
    shortDescription: "Create cinematic AI stories with stronger characters, scripts, visuals, and scene continuity.",
    category: "AI",
    coverGradient: "from-pink to-blue",
    coverImage: "/course-covers/ai-dramas.webp",
    instructor: "Olivia Byamukama",
    instructorTitle: "Founder, Innergency",
    builds: "A repeatable workflow for developing, producing, and publishing an AI-assisted drama with consistent characters and a clear story arc.",
    whoItsFor: "Creators, storytellers, filmmakers, and brands who want to turn original ideas into polished AI drama episodes.",
    whatYoullBeAbleToDo: [
      "Develop a drama concept with a strong conflict and episode arc",
      "Write scene-ready scripts and dialogue for AI production",
      "Create consistent characters, locations, and visual direction",
      "Build and publish a short AI drama episode as proof of work",
    ],
    requirements: ["A phone or laptop", "Internet access", "An original story idea"],
    durationLabel: "~5 hours",
    level: "beginner",
    access: "free",
    visibility: "public",
    statusFlag: "published",
    price: "Free",
    tracks: ["ai", "technology", "business", "career"],
    increaseAreas: ["capacity", "influence", "leverage"],
    featured: true,
    certificateAvailable: true,
    isInnergencyClass: true,
    origin: "academy",
    relatedItemSlugs: ["ai-dramas-course", "ai-literacy-non-technical", "video-editing-for-creators"],
    relatedCourseSlugs: ["building-you-the-brand"],
    materials: [
      { id: "m-ai-drama-story-bible", label: "AI Drama Story Bible", kind: "template", description: "Keep characters, settings, motives, and visual rules consistent." },
      { id: "m-ai-drama-scene-sheet", label: "Five-Scene Production Sheet", kind: "worksheet", description: "Plan each scene's story beat, voice-over, visual prompt, and motion direction." },
      { id: "m-ai-drama-continuity", label: "Character Continuity Checklist", kind: "checklist", description: "Check identity, wardrobe, setting, lighting, and emotional continuity." },
    ],
    proofProject: {
      title: "Publish One AI Drama Scene",
      description: "Produce one finished cinematic scene—or a short connected sequence—that demonstrates story, character consistency, and intentional motion.",
      deliverables: ["A story brief", "A scene-ready script", "Final edited AI drama scene", "A short production reflection"],
    },
    modules: [
      {
        id: "ai-drama-mod-1",
        slug: "story-before-tools",
        title: "Story Before Tools",
        summary: "Build the dramatic spine before generating a single frame.",
        lessons: [
          { id: "ai-drama-1-1", slug: "what-makes-a-drama-work", title: "What Makes a Drama Work", kind: "text", durationMinutes: 12, body: "AI can generate images, voices, and motion, but it cannot rescue a story without tension. Start with a person who wants something, a force that makes it difficult, and a choice that changes the situation. This lesson turns that dramatic spine into a clear episode premise." },
          { id: "ai-drama-1-2", slug: "build-the-story-bible", title: "Build Your Story Bible", kind: "activity", durationMinutes: 25, body: "Define the world, main characters, visual rules, relationships, and the facts that cannot change between scenes. Keep the document concise enough to reuse in every generation prompt.", resources: [{ id: "r-ai-story-bible", label: "AI Drama Story Bible", kind: "template" }] },
          { id: "ai-drama-1-3", slug: "write-the-scene", title: "Write a Scene That Turns", kind: "assignment", durationMinutes: 30, assignment: { id: "a-ai-scene", title: "Write a Scene That Turns", instructions: "Write one scene where the character enters wanting one outcome and leaves facing a different reality.", deliverable: "A scene-ready script with action, dialogue, and a clear turn." } },
        ],
      },
      {
        id: "ai-drama-mod-2",
        slug: "visual-continuity",
        title: "Visual Direction and Continuity",
        summary: "Make every generated shot feel like it belongs to the same production.",
        lessons: [
          { id: "ai-drama-2-1", slug: "directing-the-frame", title: "Directing the Frame", kind: "text", durationMinutes: 15, body: "A strong visual prompt directs subject, environment, framing, light, texture, and emotion. Learn how to describe what the camera sees without burying the essential story beat under decorative detail." },
          { id: "ai-drama-2-2", slug: "character-consistency", title: "Protect Character Consistency", kind: "activity", durationMinutes: 25, body: "Create a fixed identity description and continuity reference for each main character. Check the same facial features, hair, wardrobe logic, body proportions, and emotional state across every scene.", resources: [{ id: "r-ai-continuity", label: "Character Continuity Checklist", kind: "checklist" }] },
          { id: "ai-drama-2-3", slug: "plan-five-scenes", title: "Plan a Five-Scene Sequence", kind: "activity", durationMinutes: 35, body: "Map a short sequence into no more than five scenes. Give each scene one story beat, voice-over or dialogue goal, image prompt, and motion direction.", resources: [{ id: "r-ai-scenes", label: "Five-Scene Production Sheet", kind: "worksheet" }] },
        ],
      },
      {
        id: "ai-drama-mod-3",
        slug: "produce-and-publish",
        title: "Produce, Edit, and Publish",
        summary: "Turn separate generations into one intentional finished scene.",
        lessons: [
          { id: "ai-drama-3-1", slug: "motion-and-performance", title: "Motion, Voice, and Performance", kind: "text", durationMinutes: 15, body: "Use realistic motion direction: one primary action, believable camera movement, and restrained facial performance. Match voice pacing and ambient sound to the emotional temperature of the scene." },
          { id: "ai-drama-3-2", slug: "edit-for-continuity", title: "Edit for Continuity", kind: "activity", durationMinutes: 30, body: "Assemble the sequence, remove distracting generations, match color and sound, and cut on emotional movement rather than using every asset you created." },
          { id: "ai-drama-3-3", slug: "publish-proof-scene", title: "Assignment: Publish Your Proof Scene", kind: "assignment", durationMinutes: 60, assignment: { id: "a-ai-proof", title: "Publish Your AI Drama Proof Scene", instructions: "Finish and export one original AI drama scene or short sequence. Include the story brief and a short note explaining your production decisions.", deliverable: "A published AI drama scene with its story brief and production reflection." } },
        ],
      },
    ],
  },
  {
    id: "c-building-you-the-brand",
    slug: "building-you-the-brand",
    title: "Building YOU, The Brand",
    shortDescription: "Learn how to build real capability underneath your personal brand.",
    category: "Personal Branding",
    coverGradient: "from-pink to-blue",
    coverImage: "/course-covers/building-you-brand.webp",
    instructor: "Olivia Byamukama",
    instructorTitle: "Founder, Innergency",
    builds:
      "The substance behind a credible personal brand: a clear position, real proof of work, and a system for staying visible.",
    whoItsFor:
      "Freelancers, job seekers, founders, and anyone whose next opportunity depends on being visible and credible.",
    whatYoullBeAbleToDo: [
      "Write a one-sentence position you're known for",
      "Turn past work into a visible proof piece",
      "Run a simple, sustainable sharing system for 30 days",
    ],
    requirements: ["A laptop or phone", "One piece of past work to draw from (any size)"],
    durationLabel: "~4 hours",
    level: "beginner",
    access: "student",
    visibility: "public",
    statusFlag: "published",
    price: "Free",
    tracks: ["influence", "personal_growth", "career"],
    increaseAreas: ["influence", "leverage"],
    featured: true,
    certificateAvailable: true,
    isInnergencyClass: true,
    origin: "academy",
    relatedItemSlugs: ["building-you-the-brand-course", "freelance-copywriting", "build-a-portfolio-website"],
    relatedCourseSlugs: ["ai-automation-foundations"],
    materials: [
      {
        id: "m-positioning-worksheet",
        label: "Positioning Worksheet",
        kind: "worksheet",
        description: "A guided worksheet to draft your one-sentence position.",
      },
      {
        id: "m-proof-portfolio-template",
        label: "Proof Portfolio Page Template",
        kind: "template",
        description: "A simple template for laying out 3–5 pieces of proof work.",
      },
      {
        id: "m-30-day-plan",
        label: "30-Day Sharing Plan",
        kind: "checklist",
        description: "A day-by-day checklist for your first month of consistent sharing.",
      },
    ],
    proofProject: {
      title: "Publish Your Proof Page",
      description:
        "Publish one positioning statement and one proof piece (a portfolio page, post, or writeup) that shows real work, not just claims.",
      deliverables: [
        "One-sentence positioning statement",
        "One published proof piece",
        "A 30-day sharing plan",
      ],
    },
    modules: [
      {
        id: "mod-1",
        slug: "find-your-position",
        title: "Find Your Position",
        summary: "Define what you actually want to be known for — before you try to look impressive.",
        lessons: [
          {
            id: "l-1-1",
            slug: "why-capability-first",
            title: "Why Personal Brand Needs Capability First",
            kind: "text",
            durationMinutes: 8,
            body:
              "A personal brand without capability underneath it collapses the moment someone asks a follow-up question. This lesson reframes 'personal brand' as the visible layer on top of real, demonstrable work — not a replacement for it.\n\nThe order matters: build something real first, then let the brand describe it honestly. Everything in this course follows that order.",
          },
          {
            id: "l-1-2",
            slug: "define-your-position",
            title: "Define What You Want to Be Known For",
            kind: "activity",
            durationMinutes: 20,
            body:
              "Use the Positioning Worksheet to answer three questions: What do you already do better than most people around you? Who needs that? What's the one sentence you'd want a stranger to repeat about you after a 30-second conversation?\n\nWrite a single-sentence position statement. It should be specific enough that it excludes most people.",
            resources: [
              {
                id: "r-positioning",
                label: "Positioning Worksheet",
                kind: "worksheet",
                description: "Open this alongside the lesson to draft your statement.",
              },
            ],
          },
          {
            id: "l-1-3",
            slug: "positioning-quiz",
            title: "Quiz: Positioning Basics",
            kind: "quiz",
            durationMinutes: 5,
            quiz: {
              id: "q-positioning",
              title: "Positioning Basics",
              questions: [
                {
                  id: "q1",
                  question: "What should come before building a personal brand?",
                  options: [
                    "A large social following",
                    "Real, demonstrable capability",
                    "A professional logo",
                    "A paid ad budget",
                  ],
                  correctIndex: 1,
                },
                {
                  id: "q2",
                  question: "A strong position statement is usually:",
                  options: [
                    "Broad, so it appeals to everyone",
                    "Specific enough to exclude most people",
                    "Focused on your job title only",
                    "Kept private until you're 'ready'",
                  ],
                  correctIndex: 1,
                },
              ],
            },
          },
        ],
      },
      {
        id: "mod-2",
        slug: "build-your-proof",
        title: "Build Your Proof",
        summary: "Turn past work into visible evidence people can actually check.",
        lessons: [
          {
            id: "l-2-1",
            slug: "what-counts-as-proof",
            title: "What Counts as Proof",
            kind: "text",
            durationMinutes: 7,
            body:
              "A certificate says you attended. Proof shows you can do the thing. Proof includes: a finished project, a documented result, a testimonial tied to a specific outcome, or a before/after.\n\nThis lesson gives you a checklist for evaluating whether something you've already made counts as proof — and how to present it if it's not polished yet.",
          },
          {
            id: "l-2-2",
            slug: "turn-work-into-proof",
            title: "Turn Past Work Into Proof Pieces",
            kind: "activity",
            durationMinutes: 25,
            body:
              "List three pieces of past work, however small. For each, write: the problem, what you did, and what changed. This three-part structure is what turns a plain description into proof.",
          },
          {
            id: "l-2-3",
            slug: "draft-proof-portfolio",
            title: "Assignment: Draft Your Proof Portfolio Page",
            kind: "assignment",
            durationMinutes: 30,
            assignment: {
              id: "a-proof-portfolio",
              title: "Draft Your Proof Portfolio Page",
              instructions:
                "Using the Proof Portfolio Page Template, lay out your position statement and 2–3 proof pieces from the previous lesson. It doesn't need to be published yet — just drafted.",
              deliverable: "A drafted portfolio page with position statement + 2–3 proof pieces.",
            },
            resources: [
              {
                id: "r-proof-template",
                label: "Proof Portfolio Page Template",
                kind: "template",
              },
            ],
          },
        ],
      },
      {
        id: "mod-3",
        slug: "build-your-system",
        title: "Build Your System",
        summary: "Design a sharing cadence you can actually sustain for 30 days.",
        lessons: [
          {
            id: "l-3-1",
            slug: "sustainable-cadence",
            title: "Designing a Sustainable Sharing Cadence",
            kind: "text",
            durationMinutes: 8,
            body:
              "Most people quit sharing their work because they set an unsustainable pace. This lesson covers how to pick a cadence (weekly beats daily for almost everyone starting out) and what to share when you feel like you have 'nothing to show.'",
          },
          {
            id: "l-3-2",
            slug: "first-30-day-plan",
            title: "Your First 30-Day Plan",
            kind: "activity",
            durationMinutes: 20,
            body: "Use the 30-Day Sharing Plan to schedule four weekly shares, each tied to one proof piece or lesson learned.",
            resources: [{ id: "r-30-day", label: "30-Day Sharing Plan", kind: "checklist" }],
          },
          {
            id: "l-3-3",
            slug: "turn-into-impact-move",
            title: "Turn This Into an Impact Move",
            kind: "text",
            durationMinutes: 5,
            body:
              "You now have a position, a proof portfolio draft, and a 30-day plan. The next step is publishing your proof page and running the plan for real — that's an Impact Move. Use the button on the course page to start one.",
          },
        ],
      },
    ],
  },
  {
    id: "c-ai-automation-foundations",
    slug: "ai-automation-foundations",
    title: "AI Automation Foundations",
    shortDescription: "Build your first real automation and learn to spot where AI fits in a workflow.",
    category: "AI",
    coverGradient: "from-blue to-ink",
    coverImage: "/course-covers/ai-automation.webp",
    instructor: "Innergency Labs",
    instructorTitle: "Impact Academia",
    builds: "The ability to map a manual process and build a working automation that removes it.",
    whoItsFor: "Anyone doing repeated manual work who wants to remove it with simple tools, no coding required.",
    whatYoullBeAbleToDo: [
      "Map a manual process into automatable steps",
      "Build a trigger-based automation using no-code tools",
      "Add an AI step into a workflow (summarizing, drafting, or classifying)",
      "Test and monitor an automation so it keeps working",
    ],
    requirements: ["A laptop", "A free account on a no-code automation tool (guided in Module 2)"],
    durationLabel: "~5 hours",
    level: "beginner",
    access: "free",
    visibility: "public",
    statusFlag: "published",
    price: "Free",
    tracks: ["ai", "technology", "productivity", "leverage"],
    increaseAreas: ["capacity", "wealth", "leverage"],
    featured: true,
    certificateAvailable: true,
    isInnergencyClass: true,
    origin: "academy",
    relatedItemSlugs: ["ai-automation", "no-code-tools"],
    relatedCourseSlugs: ["building-you-the-brand"],
    materials: [
      {
        id: "m-process-map-template",
        label: "Process Mapping Template",
        kind: "template",
        description: "Break a manual task into discrete, automatable steps.",
      },
      {
        id: "m-tool-comparison",
        label: "No-Code Tool Comparison Sheet",
        kind: "checklist",
        description: "Quick comparison of Zapier, Make, and native app automations.",
      },
      {
        id: "m-pitch-script",
        label: "Client Pitch Script",
        kind: "template",
        description: "A short script for offering an automation build as a paid service.",
      },
    ],
    proofProject: {
      title: "Ship One Working Automation",
      description:
        "Build and run one automation end-to-end that removes a real, repeated task — yours or someone else's.",
      deliverables: [
        "A documented process map (before)",
        "A working automation (screenshot or recording)",
        "A short note on time saved",
      ],
    },
    modules: [
      {
        id: "mod-1",
        slug: "thinking-in-workflows",
        title: "Thinking in Workflows",
        summary: "Learn to see manual work as a sequence of steps that can be automated.",
        lessons: [
          {
            id: "l-1-1",
            slug: "what-automation-actually-is",
            title: "What Automation Actually Is",
            kind: "text",
            durationMinutes: 8,
            body:
              "Automation is just: when X happens, do Y, without a human doing it manually. This lesson breaks that down into triggers, actions, and conditions — the three building blocks behind every automation tool.",
          },
          {
            id: "l-1-2",
            slug: "map-a-manual-process",
            title: "Map One Manual Process",
            kind: "activity",
            durationMinutes: 20,
            body:
              "Pick one task you do repeatedly (a weekly report, replying to a common question, organizing files). Use the Process Mapping Template to break it into steps and mark which steps are mechanical versus judgment-based.",
            resources: [{ id: "r-process-map", label: "Process Mapping Template", kind: "template" }],
          },
          {
            id: "l-1-3",
            slug: "automation-basics-quiz",
            title: "Quiz: Automation Basics",
            kind: "quiz",
            durationMinutes: 5,
            quiz: {
              id: "q-automation-basics",
              title: "Automation Basics",
              questions: [
                {
                  id: "q1",
                  question: "The three building blocks of automation are:",
                  options: [
                    "Triggers, actions, conditions",
                    "Emails, spreadsheets, forms",
                    "Servers, databases, APIs",
                    "Templates, themes, plugins",
                  ],
                  correctIndex: 0,
                },
                {
                  id: "q2",
                  question: "Which kind of step is hardest to fully automate?",
                  options: ["A mechanical, repetitive step", "A judgment-based decision step", "A copy-paste step", "A file-renaming step"],
                  correctIndex: 1,
                },
              ],
            },
          },
        ],
      },
      {
        id: "mod-2",
        slug: "build-your-first-automation",
        title: "Building Your First Automation",
        summary: "Wire up a real trigger-to-action automation, then add an AI step.",
        lessons: [
          {
            id: "l-2-1",
            slug: "choosing-your-first-tool",
            title: "Choosing Your First Tool",
            kind: "text",
            durationMinutes: 7,
            body:
              "Zapier and Make both work well for beginners. This lesson compares them on price, learning curve, and the kinds of automations each is best at, so you can pick one instead of getting stuck comparing tools forever.",
            resources: [{ id: "r-tool-comp", label: "No-Code Tool Comparison Sheet", kind: "checklist" }],
          },
          {
            id: "l-2-2",
            slug: "build-trigger-action",
            title: "Build a Trigger → Action Automation",
            kind: "activity",
            durationMinutes: 30,
            body:
              "Using the process you mapped in Module 1, build the simplest possible version: one trigger, one action. Example: 'When a form is submitted, add a row to a spreadsheet.' Get this working before adding complexity.",
          },
          {
            id: "l-2-3",
            slug: "adding-ai-to-workflow",
            title: "Adding AI Into the Workflow",
            kind: "text",
            durationMinutes: 12,
            body:
              "Once your basic automation works, add one AI-powered step — summarizing an inbound message, drafting a reply, or classifying an item into a category. This lesson covers how to write a reliable prompt for a step that runs unattended.",
          },
        ],
      },
      {
        id: "mod-3",
        slug: "test-monitor-sell",
        title: "Testing, Monitoring and Selling It",
        summary: "Make sure it keeps working, then decide whether to offer it as a service.",
        lessons: [
          {
            id: "l-3-1",
            slug: "testing-and-monitoring",
            title: "Testing and Monitoring Your Automation",
            kind: "text",
            durationMinutes: 8,
            body:
              "An automation that silently breaks is worse than no automation. This lesson covers simple monitoring: error notifications, weekly spot-checks, and a rollback plan.",
          },
          {
            id: "l-3-2",
            slug: "ship-one-automation",
            title: "Assignment: Ship One Working Automation",
            kind: "assignment",
            durationMinutes: 45,
            assignment: {
              id: "a-ship-automation",
              title: "Ship One Working Automation",
              instructions:
                "Finish and run your automation on a real, live task for at least one full cycle. Document the before state, the automation itself, and the time saved.",
              deliverable: "A documented, working automation plus a before/after time comparison.",
            },
          },
          {
            id: "l-3-3",
            slug: "turn-into-impact-move-ai",
            title: "Turn This Into an Impact Move",
            kind: "text",
            durationMinutes: 5,
            body:
              "You now have a working automation and a proof of time saved. Consider whether to offer the same build as a paid service to a real business — that's the next Impact Move. Use the Client Pitch Script to make the offer.",
            resources: [{ id: "r-pitch", label: "Client Pitch Script", kind: "template" }],
          },
        ],
      },
    ],
  },
  {
    id: "c-excel-dashboards",
    slug: "excel-dashboards-for-beginners",
    title: "Excel Dashboards for Beginners",
    shortDescription: "Turn raw spreadsheets into dashboards that make decisions easier.",
    category: "Digital Skills",
    coverGradient: "from-blue-dim to-blue",
    coverImage: "/course-covers/excel-dashboards.webp",
    instructor: "Innergency Labs",
    instructorTitle: "Impact Academia",
    builds: "The ability to clean raw data and present it as a clear, decision-ready dashboard.",
    whoItsFor: "Anyone who works with spreadsheets and wants to present data more clearly.",
    whatYoullBeAbleToDo: ["Clean a messy dataset", "Build pivot tables", "Design a one-page dashboard with charts and filters"],
    requirements: ["Excel or Google Sheets", "A sample or real dataset"],
    durationLabel: "~2.5 hours",
    level: "beginner",
    access: "free",
    visibility: "public",
    statusFlag: "published",
    price: "Free",
    tracks: ["career", "productivity", "technology"],
    increaseAreas: ["capacity", "wealth"],
    origin: "academy",
    isInnergencyClass: true,
    materials: [
      { id: "m-sample-dataset", label: "Sample Sales Dataset", kind: "dataset", description: "Practice dataset for the course." },
      { id: "m-dashboard-checklist", label: "Dashboard Design Checklist", kind: "checklist" },
    ],
    proofProject: {
      title: "Build One Working Dashboard",
      description: "Turn the sample dataset (or your own) into a one-page dashboard with at least two charts and one filter.",
      deliverables: ["A cleaned dataset", "A one-page dashboard", "One summary insight written in plain language"],
    },
    modules: [
      {
        id: "mod-1",
        slug: "clean-your-data",
        title: "Clean Your Data",
        summary: "Get raw, messy data ready to work with.",
        lessons: [
          {
            id: "l-1-1",
            slug: "cleaning-basics",
            title: "Cleaning Basics",
            kind: "text",
            durationMinutes: 10,
            body: "Removing duplicates, fixing inconsistent categories, and separating raw data from your working view.",
          },
          {
            id: "l-1-2",
            slug: "pivot-tables",
            title: "Pivot Tables",
            kind: "activity",
            durationMinutes: 25,
            body: "Build your first pivot table on the sample dataset to summarize sales by region and month.",
            resources: [{ id: "r-sample", label: "Sample Sales Dataset", kind: "dataset" }],
          },
        ],
      },
      {
        id: "mod-2",
        slug: "design-the-dashboard",
        title: "Design the Dashboard",
        summary: "Turn your summary tables into a clear one-page view.",
        lessons: [
          {
            id: "l-2-1",
            slug: "chart-design",
            title: "Chart Design",
            kind: "text",
            durationMinutes: 10,
            body: "Picking the right chart type and removing clutter so the number that matters is obvious at a glance.",
          },
          {
            id: "l-2-2",
            slug: "assemble-dashboard",
            title: "Assignment: Assemble Your Dashboard",
            kind: "assignment",
            durationMinutes: 40,
            assignment: {
              id: "a-dashboard",
              title: "Assemble Your Dashboard",
              instructions: "Combine your pivot tables and charts into a single-page dashboard with one filter control.",
              deliverable: "A one-page dashboard file.",
            },
            resources: [{ id: "r-checklist", label: "Dashboard Design Checklist", kind: "checklist" }],
          },
        ],
      },
    ],
  },
  {
    id: "c-video-editing",
    slug: "video-editing-for-creators",
    title: "Video Editing for Creators",
    shortDescription: "A well-regarded external course on short-form video editing.",
    category: "Digital Skills",
    coverGradient: "from-pink-dim to-pink",
    coverImage: "/course-covers/video-editing.webp",
    instructor: "External Provider",
    builds: "Practical short-form video editing skills for marketing and social content.",
    whoItsFor: "Beginners who want to edit marketing or social video professionally.",
    whatYoullBeAbleToDo: ["Cut and pace short-form video", "Add captions and text overlays", "Export correctly for each platform"],
    durationLabel: "~6 hours",
    level: "beginner",
    access: "student",
    visibility: "public",
    statusFlag: "published",
    price: "$49",
    tracks: ["career", "business"],
    increaseAreas: ["wealth", "capacity"],
    origin: "external",
    externalProvider: "Sample External Provider",
    externalUrl: "https://example.com/video-editing-course",
    externalCost: "$49",
    externalDuration: "~6 hours",
    whyWeRecommend:
      "One of the most practical, non-fluffy editing courses we've found — it moves quickly into real footage instead of lingering on theory.",
    materials: [],
    modules: [],
    proofProject: {
      title: "Produce 3 Finished Videos",
      description: "Edit three finished short-form videos for a real or practice brand.",
      deliverables: ["3 finished, exported short-form videos"],
    },
  },
  ...COMING_SOON_COURSES,
];

export const COURSES: Course[] = COURSE_RECORDS.map((course) => ({
  ...course,
  learningAreas: learningAreasForCourse(course.slug),
}));

export function getCourseBySlug(slug: string) {
  return COURSES.find((c) => c.slug === slug);
}

export function totalLessons(course: Course) {
  return course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
}
