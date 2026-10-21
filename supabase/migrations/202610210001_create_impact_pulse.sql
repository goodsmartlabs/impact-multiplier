-- Impact Pulse: editorial updates, engagement events and The Impact Brief newsletter.
-- All access goes through the Next.js server with the service-role key; the
-- public (anon/authenticated) roles get no direct table access.

create table if not exists public.pulse_updates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  title text not null check (char_length(title) between 8 and 160),
  category text not null check (category in ('trending', 'jobs', 'skills', 'learning', 'money', 'opportunities', 'ai', 'industry')),
  summary text not null check (char_length(summary) between 30 and 600),
  signal jsonb not null,                       -- { what, why, who, how, next }
  source_name text not null,
  source_url text check (source_url is null or source_url ~ '^https?://'),
  published_at date not null default current_date,
  last_verified_at date,
  deadline date,
  expires_at date,
  tags text[] not null default '{}',
  skills text[] not null default '{}',
  audience text[] not null default '{}',
  location text,
  eligibility text,
  job jsonb,                                   -- { company, location, remote, employmentType }
  cta jsonb not null,                          -- { label, href }
  related_course_slugs text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'pending_review', 'published', 'expired', 'archived', 'rejected')),
  featured boolean not null default false,
  verification text not null default 'unverified' check (verification in ('verified', 'unverified', 'demo')),
  size text not null default 'standard' check (size in ('feature', 'standard', 'compact')),
  submitted_by text not null default 'editor', -- 'editor' or an agent id (trend-scout, job-spy, …)
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A record can only be marked verified when it says where and when it was checked.
  constraint pulse_verified_has_source check (verification <> 'verified' or (source_url is not null and last_verified_at is not null))
);

create index if not exists pulse_updates_status_published_idx on public.pulse_updates (status, published_at desc);
create index if not exists pulse_updates_category_idx on public.pulse_updates (category);
create index if not exists pulse_updates_submitted_by_idx on public.pulse_updates (submitted_by, created_at desc);

create table if not exists public.pulse_events (
  id bigint generated always as identity primary key,
  update_id text not null,                     -- pulse_updates.id or a demo id; no personal data stored
  event_type text not null check (event_type in ('view', 'save', 'cta_click', 'source_click')),
  created_at timestamptz not null default now()
);

create index if not exists pulse_events_update_type_idx on public.pulse_events (update_id, event_type);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) between 5 and 254),
  name text check (name is null or char_length(name) <= 120),
  interests text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  unsubscribe_token text not null unique,
  source text,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index if not exists newsletter_subscribers_status_idx on public.newsletter_subscribers (status, created_at desc);

create table if not exists public.newsletter_editions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 4 and 160),
  intro text not null default '',
  sections jsonb not null,                     -- { whatsHot, skillWorthBuilding, opportunities, learnSomething, moneyMove, powerMove }
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  demo boolean not null default false,
  published_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists newsletter_editions_status_idx on public.newsletter_editions (status, published_at desc);

alter table public.pulse_updates enable row level security;
alter table public.pulse_events enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_editions enable row level security;

revoke all on table public.pulse_updates, public.pulse_events, public.newsletter_subscribers, public.newsletter_editions from anon, authenticated;
grant all on table public.pulse_updates, public.pulse_events, public.newsletter_subscribers, public.newsletter_editions to service_role;
