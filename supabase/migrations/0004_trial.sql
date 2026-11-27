-- Pawlune — foster-to-adopt trial, ST-5, shelters. Run after 0001 and 0003.
drop table if exists public.photos;               -- album feature removed

alter table public.profiles
  add column if not exists is_shelter boolean not null default false,   -- shelter staff (set by admin only)
  add column if not exists seeking_pet boolean not null default false;  -- no pet yet, looking for one

-- ST-5 stress test (กรมสุขภาพจิต): 5 items, each 0..3
create table public.st5_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  taken_on date not null,
  items smallint[] not null check (array_length(items, 1) = 5 and 0 <= all (items) and 3 >= all (items)),
  raw smallint generated always as (items[1] + items[2] + items[3] + items[4] + items[5]) stored,
  created_at timestamptz not null default now()
);
create index on public.st5_entries (user_id, taken_on);
alter table public.st5_entries enable row level security;
create policy "own st5" on public.st5_entries for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- What the user is looking for (one row per user)
create table public.adopt_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  species text[] not null default '{}',          -- dog / cat
  allergies text[] not null default '{}',        -- dog / cat
  size text,                                     -- small / medium / large / any
  age_group text,                                -- young / adult / senior / any
  energy text,                                   -- calm / medium / active / any
  personality text,                              -- cuddly / independent / any
  housing text,                                  -- condo / house
  has_fence boolean not null default false,
  hours_alone smallint check (hours_alone between 0 and 24),
  budget_month integer check (budget_month >= 0),
  family_agrees boolean not null default false,
  experience text check (char_length(experience) <= 300),
  updated_at timestamptz not null default now()
);
alter table public.adopt_preferences enable row level security;
create policy "own prefs" on public.adopt_preferences for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Shelters and their animals: readable by any signed-in user; written by service role only.
create table public.shelters (
  id uuid primary key default gen_random_uuid(),
  name text not null, area text, phone text, url text,
  is_demo boolean not null default false
);
create table public.shelter_animals (
  id uuid primary key default gen_random_uuid(),
  shelter_id uuid not null references public.shelters (id) on delete cascade,
  name text not null,
  species text not null check (species in ('dog','cat')),
  sex text check (sex in ('m','f')),
  age_group text check (age_group in ('young','adult','senior')),
  size text check (size in ('small','medium','large')),
  energy text check (energy in ('calm','medium','active')),
  personality text check (personality in ('cuddly','independent')),
  needs_fence boolean not null default false,
  max_hours_alone smallint,
  good_with text[] not null default '{}',
  story text,
  status text not null default 'available' check (status in ('available','on_trial','adopted')),
  is_demo boolean not null default false
);
alter table public.shelters enable row level security;
alter table public.shelter_animals enable row level security;
create policy "read shelters" on public.shelters for select to authenticated using (true);
create policy "read animals" on public.shelter_animals for select to authenticated using (true);

-- A foster-to-adopt trial. The shelter (service role) approves, starts and closes it.
create table public.trials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  animal_id uuid not null references public.shelter_animals (id) on delete cascade,
  status text not null default 'applied' check (status in ('applied','active','adopted','return_requested','returned','declined')),
  share_consent_at timestamptz not null,
  applied_at timestamptz not null default now(),
  start_date date,
  decided_at timestamptz,
  pet_id uuid references public.pets (id) on delete set null
);
create index on public.trials (user_id, applied_at desc);
alter table public.trials enable row level security;
create policy "read own trials" on public.trials for select using (user_id = auth.uid());
create policy "apply" on public.trials for insert with check (user_id = auth.uid() and status = 'applied');

-- Feedback the user writes about living with the animal (shared with the shelter; never mood/WHO-5/ST-5 scores)
create table public.trial_feedback (
  id uuid primary key default gen_random_uuid(),
  trial_id uuid not null references public.trials (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('day14','monthly')),
  feeling smallint not null check (feeling between 1 and 5),
  decision text check (decision in ('adopt','return','unsure')),
  problems text[] not null default '{}',
  note text check (char_length(note) <= 500),
  created_at timestamptz not null default now()
);
alter table public.trial_feedback enable row level security;
create policy "own feedback" on public.trial_feedback for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Users may update their own profile, but never make themselves shelter staff or a demo account.
create or replace function public.protect_profile_flags()
returns trigger language plpgsql as $$
begin
  if (new.is_shelter is distinct from old.is_shelter or new.is_demo is distinct from old.is_demo)
     and current_user in ('authenticated', 'anon') then  -- app users; SQL editor and service role are allowed
    raise exception 'not allowed';
  end if;
  return new;
end; $$;
drop trigger if exists protect_profile_flags on public.profiles;
create trigger protect_profile_flags before update on public.profiles
  for each row execute function public.protect_profile_flags();
