-- ImpactFools newsletter engine: Monday "What's Hot" and Friday "Weekend Top 3".
-- Server-only access with the service-role key, like the Impact Pulse tables.

-- One row per edition per issue date. The unique (kind, issue_date) key is what
-- makes scheduled preparation idempotent: a cron that fires twice can't create
-- two Monday issues.
create table if not exists public.newsletter_issues (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('whats_hot', 'weekend_top3')),
  issue_date date not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 4 and 200),
  summary text not null default '',
  content jsonb not null,                   -- structured edition (see src/lib/newsletter/types.ts)
  research jsonb not null,                  -- research log: sources, verdicts, timestamps, link checks
  status text not null default 'draft' check (status in ('draft', 'awaiting_approval', 'scheduled', 'published', 'archived', 'failed')),
  approved_by text,
  approved_at timestamptz,
  published_at timestamptz,
  sent_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_issues_kind_date_key unique (kind, issue_date),
  constraint newsletter_issues_weekday check (
    (kind = 'whats_hot' and extract(isodow from issue_date) = 1) or
    (kind = 'weekend_top3' and extract(isodow from issue_date) = 5)
  )
);

create index if not exists newsletter_issues_public_idx on public.newsletter_issues (kind, status, issue_date desc);

-- Every scheduler / admin action, including failures, for the admin run log.
create table if not exists public.newsletter_runs (
  id bigint generated always as identity primary key,
  action text not null check (action in ('prepare', 'publish', 'send', 'schedule')),
  kind text check (kind is null or kind in ('whats_hot', 'weekend_top3')),
  issue_date date,
  issue_id uuid references public.newsletter_issues (id) on delete set null,
  trigger text not null check (trigger in ('cron', 'admin', 'test')),
  outcome text not null check (outcome in ('success', 'skipped', 'failed')),
  message text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists newsletter_runs_created_idx on public.newsletter_runs (created_at desc);

-- One row per (issue, subscriber). Claiming the row before sending is what
-- prevents duplicate emails, even when two sends overlap.
create table if not exists public.newsletter_sends (
  issue_id uuid not null references public.newsletter_issues (id) on delete cascade,
  subscriber_id uuid not null references public.newsletter_subscribers (id) on delete cascade,
  status text not null default 'claimed' check (status in ('claimed', 'sent', 'failed')),
  provider_id text,
  error text,
  created_at timestamptz not null default now(),
  primary key (issue_id, subscriber_id)
);

-- Subscribers: double opt-in, consent record, goals and edition choice.
alter table public.newsletter_subscribers
  add column if not exists consent_at timestamptz,
  add column if not exists verified_at timestamptz,
  add column if not exists verify_token text unique,
  add column if not exists goals text[] not null default '{}',
  add column if not exists editions text[] not null default '{whats_hot,weekend_top3}';

alter table public.newsletter_subscribers drop constraint if exists newsletter_subscribers_status_check;
alter table public.newsletter_subscribers
  add constraint newsletter_subscribers_status_check check (status in ('pending', 'active', 'unsubscribed'));

alter table public.newsletter_issues enable row level security;
alter table public.newsletter_runs enable row level security;
alter table public.newsletter_sends enable row level security;

revoke all on table public.newsletter_issues, public.newsletter_runs, public.newsletter_sends from anon, authenticated;
grant all on table public.newsletter_issues, public.newsletter_runs, public.newsletter_sends to service_role;
