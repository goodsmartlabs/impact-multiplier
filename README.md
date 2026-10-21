# ImpactFools Academia

ImpactFools Academia is a creative hub for opportunity, growth, learning, capability, wealth,
productivity, leverage and influence. It helps people answer: **"What's out there that could
increase me?"**

An Innergency product.

## What's built (V1)

- **Impact Pulse** — the homepage and central discovery experience: an editorial feed of trends,
  jobs & gigs, skills in demand, courses, money moves, opportunities, AI and industry updates,
  each answering What / Why / Who / How / Next; Impact Radar personalisation; The Impact Brief
  newsletter; an Opportunity tracker in the Impact Cart; a protected editorial dashboard
  (`/admin`) and an agent ingestion API. Setup, environment variables and the agent contract are
  in [`docs/impact-pulse.md`](docs/impact-pulse.md).

- **Discovery feed** — a filterable, editorial feed of skills, courses, tools, opportunities,
  grants, mental models, and more (`/`, `/explore`, `/search`).
- **Detail pages** — deep, source-aware pages for every discovery item (`/item/[slug]`), with
  increase-area tagging, requirements, deadlines, and "why this may fit you" personalization.
- **Impact Cart** — a personal shelf of saved possibilities with notes, filters, and a gentle
  nudge (plus a comparison view) once it grows large (`/cart`).
- **ImpactFools Academia** — a real learning platform with courses, modules, lessons,
  quizzes, assignments, materials and proof projects (`/academy`), including a focused lesson
  player with progress tracking (`/academy/[slug]/learn/[lessonSlug]`).
- **Impact Engine** — the Build → Capacity → Value → Proof → Money → Action → Impact → Multiply
  flow that turns discovery and learning into demonstrated, evidence-based impact
  (`/impact-moves`).
- **7-Day Skill Challenge** — pick one of six skills, work through Discover → Learn → Practice →
  Identify → Build → Prove → Multiply, finish with an Impact Check and a drafted service offer
  (`/academy/challenge`, `/academy/challenge/[skill]`, `.../day/[1-7]`, `.../impact`). Content lives
  in `src/lib/skill-challenge/skills/`; completion rules (checklist + deliverable + project links)
  are in `src/lib/skill-challenge/engine.ts` and covered by tests. Sample datasets are fictional and
  regenerated with `node scripts/generate-challenge-data.mjs public/challenge-data`.
- **My Impact** — an evidence-based profile that keeps proven capability separate from intent
  (`/my-impact`).
- **Profile** — progressive, optional personalization that improves discovery over time
  (`/profile`).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Zustand (persisted to `localStorage`) for the Impact Cart, Academy progress, Impact Moves,
  Capacity Guide, 7-Day Skill Challenge progress and profile personalization. There are no user
  accounts yet, so progress is per browser/device.
- Static, structured seed data in `src/lib/data/` — content is kept separate from presentation,
  designed so it can move to a real backend/CMS without reshaping the UI

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # eslint
npm test        # vitest
```

## Chat integration

The global **Chat with Olivia** interface keeps drafts in the visitor's browser. To enable message
delivery, configure `NEXT_PUBLIC_OLIVIA_CHAT_ENDPOINT` with an HTTPS endpoint that accepts:

```json
{ "message": "Visitor question" }
```

The endpoint must return `{ "messageId": "..." }` after successful delivery. Without an endpoint,
the interface explicitly marks the message as not sent rather than simulating a reply.

## Notes on data

Discovery items and opportunities in this build are **sample data**, clearly marked as such where
relevant, with `sourceName`/`sourceUrl`/`lastVerified` fields modeled so real, verified sources can
replace them later. Time-sensitive opportunities (grants, scholarships, fellowships, jobs) compute
their status (`Open` / `Closing Soon` / `Upcoming` / `Expired`) from their deadline.
