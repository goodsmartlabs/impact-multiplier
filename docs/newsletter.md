# ImpactFools Newsletter Engine

Two editions a week, published at **07:00 Africa/Juba (05:00 UTC)**:

| Edition | Day | What it contains |
| --- | --- | --- |
| **What’s Hot 🔥** | Monday | 1 The Big Picture · 2 What’s Hot This Week (5–7 discoveries) · 3 Opportunity Match by goal · 4 Turn Discovery Into Action |
| **Your Weekend Top 3 🎯** | Friday | “Stop collecting opportunities. Start building something.”, FIND MY TOP 3, example plans, featured verified opportunities |

The newsletter replaced *The Impact Brief*. Old `/pulse/brief…` links redirect to `/newsletter…`.

## Where people find it

- Main navigation: **Newsletter** (desktop and mobile bottom bar), plus a *Newsletter* section in the content menu
- Homepage: the *Monday: discover. Friday: build.* section with both current editions, **DISCOVER WHAT’S HOT**, **FIND MY TOP 3** and the subscribe form
- `/newsletter`: the hub, with current editions (always shown with their real dates), standards, subscription and the archive
- `/newsletter/[slug]`: one edition, e.g. `/newsletter/whats-hot-2026-11-16`
- `/newsletter/top-3`: the FIND MY TOP 3 wizard (no account needed; `?goals=earn,brand` pre-fills goals)
- `/newsletter/my-plan`: the dashboard, with MY TOP 3, MY WEEKEND PLAN, SAVED OPPORTUNITIES, MY PROGRESS and NEXT RECOMMENDATIONS
- Nudges on course pages (`/academy/[slug]`), Impact Pulse detail pages and My Impact
- `/newsletter/verify` and `/newsletter/manage` (token links from emails)

## How an edition is made

1. **Discover.** Research agents and editors add items to Impact Pulse (`/api/pulse/ingest`, `/admin`). Agent submissions always start as `pending_review` / `unverified`.
2. **Evaluate** (`src/lib/newsletter/compose.ts` → `evaluateCandidate`). An item qualifies only if all of these hold:
   - it is published
   - it is **verified** by an editor
   - it has an **https source link**
   - its source was re-checked within **14 days**
   - it is still live on the issue date

   Demo and unverified content is always rejected. Items published within 10 days are labelled *New this week*; the rest are labelled *Ongoing* (evergreen).
3. **Match.** Each discovery is linked to ImpactFools courses, challenges and paths through `src/lib/newsletter/resources.ts`. That file only resolves courses that exist and are published, and labels every resource as free, paid (with its price), student access or external.
4. **Draft.** The draft is assembled deterministically from those records. No text is generated, so nothing can be invented. Every candidate and its verdict are stored in the issue’s research log with timestamps. External links get a HEAD/GET check, and failures are shown to the editor.
5. **Approve.** The draft is held for an editor unless auto-publish is on.
6. **Publish.** Publishing happens on schedule. The previous issue of the same edition is archived.
7. **Send.** Emails go to confirmed subscribers who chose that edition.

What’s Hot **will not publish with fewer than 5 qualifying discoveries**. When that happens, the issue is marked *Blocked*, the failure is logged, and the previous edition stays live with its real date. The site never relabels an old edition as new: if this week’s isn’t out, it says “Previous edition — this week’s isn’t out yet”.

## Schedule

`vercel.json` runs `GET /api/cron/newsletter` daily at `0 5 * * *` UTC, with `Authorization: Bearer $CRON_SECRET`. Each run does the following:

- **Sunday and Thursday:** prepare Monday’s and Friday’s drafts, so editors have a day to review them.
- **Monday and Friday from 07:00 Juba:** publish the approved issue.
  - If no draft exists, or the draft was blocked, research runs again first.
  - If the issue is still awaiting approval, nothing is published and the run is logged.
- **Catch-up:** an issue approved after 07:00 publishes on the next run, or immediately from the admin page.
- **Email resume:** email batches that ran out of time are resumed.

Duplicate protection:

- Issues are unique per `(kind, issue_date)`.
- Publishing is a compare-and-set from `scheduled` to `published`.
- Every recipient is claimed in `newsletter_sends` (primary key `issue_id, subscriber_id`) before sending.
- Each send carries an `Idempotency-Key`.

Every action, including failures, is recorded in `newsletter_runs` and shown in the admin run log.

Vercel Hobby plans run cron jobs once a day and may fire any time within the scheduled hour. On Hobby, an edition can therefore go out up to about 59 minutes after 07:00.

## FIND MY TOP 3

Five questions: goals (multi-select), level, weekend time, resources (multi-select), and what success means.

The engine (`src/lib/newsletter/top3.ts`) scores the project catalogue in `projects.ts`.

**Exclusions.** A project is excluded if any of these apply:

- it needs more time than the person has
- it needs equipment they don’t have (“device” means a laptop *or* a phone)
- it matches none of their goals
- they have already completed it

**Ranking.** Remaining projects are ranked by goal, level and success fit, plus resources they already have. The engine returns three projects from different areas.

**Each recommendation includes:**

- what to work on
- why it fits
- what you could gain (never guaranteed earnings)
- a Friday / Saturday / Sunday plan that grows with the time available
- Start Here links, labelled free or paid
- one measurable deliverable

Paid status never affects ranking.

Answers and plans are stored in the browser (`impactfools-weekend-plan`), because there are no accounts. They are never sent to the server, emailed or exported.

## Subscriptions

- `POST /api/newsletter/subscribe` takes email, optional name, editions, goals, and **consent (required)**. New addresses are stored as `pending` with `consent_at`. A confirmation email is sent, and the response is identical for new and existing addresses.
- `/newsletter/verify?token=…` asks the person to click **Confirm**. Confirmation is a POST, so email link scanners can’t confirm on someone’s behalf. Confirming sets the subscriber to `active` and `verified_at`.
- Only `active` subscribers with `verified_at` set are emailed.
- Each email contains:
  - a manage link (`/newsletter/manage?token=…`) to change editions or goals, unsubscribe or resubscribe
  - one-click unsubscribe (`List-Unsubscribe` + `List-Unsubscribe-Post`, `POST /api/newsletter/unsubscribe`)
  - for Friday, a personalised link to FIND MY TOP 3 pre-filled with the subscriber’s goals

## Rulo Social

`GET /api/social/newsletter?edition=monday|friday` (or `?slug=…`) with `Authorization: Bearer $RULO_SOCIAL_TOKEN`.

It returns the latest **published** edition as `impactfools.newsletter.social/v1`:

- **Monday:** discoveries with source links, insights, audience segments, CTAs and campaign angles.
- **Friday:** featured opportunities, goal-based examples, practical actions, newsletter links and campaign angles.

The payload contains no subscriber data and no personal Top 3 results.

## Admin (`/admin/newsletter`)

The admin area provides:

- configuration status
- next issues, with **Prepare now / Re-run research**
- **Run the scheduler now**
- the issues list and the run log

Each issue page shows:

- validation errors
- the research log and link checks
- a preview
- a JSON editor, re-validated on save
- the actions **Approve** (publishes at 07:00, or immediately if that time has passed), **Publish early**, **Withdraw approval**, **Unpublish**, and **Send / resend emails**

## Setup checklist

1. Apply `supabase/migrations/202611130001_newsletter_engine.sql`, after the Impact Pulse migration.
2. Set these Vercel environment variables:

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEY` | Database (already used by Impact Pulse) |
| `CRON_SECRET` (16+ chars) | Authorises the daily Vercel cron |
| `NEWSLETTER_AUTO_PUBLISH` | `true` to auto-approve valid drafts; anything else = editorial approval mode (default) |
| `RESEND_API_KEY`, `NEWSLETTER_FROM_EMAIL` | Email delivery (sender must be on a domain verified in Resend), e.g. `ImpactFools <newsletter@your-domain>` |
| `NEWSLETTER_REPLY_TO` | Optional reply-to address |
| `NEWSLETTER_SEND_EMAIL` | `false` to publish to the web without emailing |
| `RULO_SOCIAL_TOKEN` (24+ chars) | Rulo Social export |
| `NEXT_PUBLIC_SITE_URL` | Absolute links in emails (defaults to `https://impactfools.innergency.com`) |

3. Verify enough Impact Pulse records (with sources checked in the last 14 days) for What’s Hot to qualify.

Local development: `PULSE_STORE=file npm run dev` stores everything in `.data/` (gitignored).
