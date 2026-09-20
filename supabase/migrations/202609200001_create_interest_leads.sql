create table if not exists public.interest_leads (
  id uuid primary key default gen_random_uuid(),
  learner_name text not null check (char_length(learner_name) between 2 and 120),
  contact text not null check (char_length(contact) between 5 and 200),
  learning_goal text not null check (char_length(learning_goal) between 10 and 3000),
  current_skill_level text check (current_skill_level in ('Just starting', 'Some experience', 'Confident', 'Not sure yet')),
  course_slugs text[] not null default '{}',
  source_page text,
  status text not null default 'NEW' check (status in ('NEW', 'CONTACTED', 'CONVERSATION', 'ENROLLED', 'CLOSED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists interest_leads_status_created_at_idx on public.interest_leads (status, created_at desc);
alter table public.interest_leads enable row level security;
revoke all on table public.interest_leads from anon, authenticated;
grant all on table public.interest_leads to service_role;
