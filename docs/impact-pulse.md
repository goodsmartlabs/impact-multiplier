# Impact Pulse

Impact Pulse is the ImpactFools homepage and central discovery experience:
**What's happening. What's valuable. What's next for you.**

Every update answers five questions — **WHAT? WHY? WHO? HOW? NEXT?** — so readers move from
DISCOVER → UNDERSTAND → LEARN → ACT → MULTIPLY.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Impact Pulse homepage: hero + search, featured story, filterable feed, Impact Radar, Impact Brief signup, then the existing ImpactFools brand/services sections |
| `/pulse` | Full feed with search, filters and “Load more” |
| `/pulse/category/[category]` | Category pages (trending, jobs, skills, learning, money, opportunities, ai, industry) |
| `/pulse/[slug]` | Article page: Impact Signal, skills, Academy courses, CTA, save, source, JSON-LD `Article` |
| `/pulse/radar` | Impact Radar preferences + explained recommendations |
| `/pulse/brief`, `/pulse/brief/[slug]` | The Impact Brief archive and editions |
| `/pulse/brief/manage?token=…` | Subscriber preferences and unsubscribe (token link, no login) |
| `/pulse/standards` | Editorial standards, labels, expiry rules and agent policy |
| `/cart` | Impact Cart, now with the Opportunity tracker (Saved → … → Closed) |
| `/admin` | Protected editorial dashboard (overview, updates, review queue, Impact Brief, subscribers) |
| `POST /api/pulse/ingest` | Agent ingestion (bearer token) |
| `POST /api/newsletter/subscribe`, `POST /api/newsletter/manage` | Subscriptions |
| `POST /api/pulse/events` | Anonymous engagement counts |
| `GET /api/pulse/updates` | Live updates (used by site search) |

## Setup

1. **Database** — apply `supabase/migrations/202610210001_create_impact_pulse.sql` to the
   ImpactFools Supabase project (tables: `pulse_updates`, `pulse_events`,
   `newsletter_subscribers`, `newsletter_editions`; RLS on, service role only).
2. **Environment variables** (Vercel → Project → Settings → Environment Variables):

| Variable | Required for | Notes |
| --- | --- | --- |
| `SUPABASE_URL` | Publishing, subscriptions, metrics | Already used by `/api/course-interest` |
| `SUPABASE_SECRET_KEY` | Same | Service-role key. Server only — never `NEXT_PUBLIC_` |
| `ADMIN_PASSWORD` | `/admin` | Long, unique password |
| `ADMIN_SESSION_SECRET` | `/admin` | Random string, 32+ characters (signs the session cookie) |
| `PULSE_INGEST_TOKEN` | Agent ingestion | Random string, 24+ characters |
| `PULSE_HIDE_DEMO` | Optional | `true` hides demonstration content once real updates exist |

Without the database variables the site stays fully browsable with demonstration content;
subscriptions return a clear “being connected” message and the admin shows what is missing.

### Local development

```bash
PULSE_STORE=file ADMIN_PASSWORD=dev-password ADMIN_SESSION_SECRET=$(openssl rand -hex 32) \
PULSE_INGEST_TOKEN=$(openssl rand -hex 24) npm run dev
```

`PULSE_STORE=file` stores data in `.data/pulse-dev.json` (git-ignored). It is refused in production.

## Content model

`src/lib/pulse/types.ts` — `PulseUpdate` holds title, category, summary, the Impact Signal
(`what/why/who/how/next`), source name + URL, publication / last-verified / deadline / expiry
dates, tags, skills, audience, location, eligibility, job details, CTA + destination, related
Academy course slugs, status (`draft | pending_review | published | expired | archived | rejected`),
featured flag, verification (`verified | unverified | demo`), card size and `submittedBy`.

Rules enforced in code (`src/lib/pulse/feed.ts`, `validate.ts`):

- Only `published` items that are not past their expiry or (for jobs/opportunities) deadline are shown.
- “Verified” requires a source URL and a last-verified date (also a DB constraint).
- Unverified deadlines are shown as “listed deadline — confirm with the source”.
- Expired item pages stay readable but state that the opportunity has closed and hide the CTA.

## Agent ingestion

The pipeline is ready; **no agent is running automatically**. Registered agents
(`src/lib/pulse/agents.ts`): Trend Scout, Skill Scout, Job Spy, Opportunity Scout, Course Scout,
Impact Editor — each limited to its categories.

```http
POST /api/pulse/ingest
Authorization: Bearer <PULSE_INGEST_TOKEN>
Content-Type: application/json

{
  "agent": "job-spy",
  "updates": [{
    "title": "…", "category": "jobs", "summary": "…",
    "signal": { "what": "…", "why": "…", "who": "…", "how": "…", "next": "…" },
    "sourceName": "…", "sourceUrl": "https://…", "publishedAt": "2026-10-21",
    "deadline": "2026-12-15", "skills": ["Excel"], "audience": ["Graduates"],
    "location": "Remote", "eligibility": "…",
    "job": { "company": "…", "remote": "remote", "employmentType": "Contract" },
    "cta": { "label": "Apply now", "href": "https://…" },
    "relatedCourseSlugs": ["excel-dashboards-for-beginners"]
  }]
}
```

Up to 50 records per call. Every accepted record is stored as `pending_review` and `unverified`
(only the Impact Editor may propose `verified`). Editors approve, edit or reject in `/admin/submissions`.

## Personalisation (Impact Radar)

`src/lib/pulse/radar.ts` — a transparent rule-based recommender (`ruleBasedRecommender`) behind a
`Recommender` interface, so an AI-assisted recommender can be added later without changing the UI.
Every recommendation lists the reasons it appears. Preferences are stored in the browser
(`impactfools-radar`) because ImpactFools has no user accounts yet.

## The Impact Brief

Sections: What’s Hot (3), Skill Worth Building (1), Opportunities Worth Exploring (5),
Learn Something (1), Money Move (1), Your Power Move (1). Editors draft an edition from live,
non-demo updates, edit it and publish to the web archive.

**Email delivery is not connected.** `src/lib/server/pulse/email.ts` is the integration point
(e.g. Resend or Postmark); until then nothing is emailed and the UI says so. When delivery is
added, switch to double opt-in before sending. Subscribers can export as CSV from `/admin/subscribers`.

## Demonstration content

`src/lib/pulse/seed.ts` ships evergreen explainers and format previews labelled **Demo**:
no live vacancies, no real deadlines, no invented events, not indexed as news. Set
`PULSE_HIDE_DEMO=true` once verified content is flowing.
