-- Pawlune — initial schema. Every table is owner-only via RLS.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  consent_version text,
  consented_at timestamptz,
  age_confirmed_20plus boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  species text not null check (species in ('dog', 'cat', 'other')),
  photo_path text,
  adopted_on date,
  is_current boolean not null default true,
  -- past pets ("ความทรงจำ"): never used by the engine
  past_period text check (char_length(past_period) <= 40),
  past_feeling smallint check (past_feeling between 1 and 5),
  past_tags text[] not null default '{}',
  memory_note text check (char_length(memory_note) <= 500),
  created_at timestamptz not null default now()
);

create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  pet_id uuid references public.pets (id) on delete set null,
  checkin_date date not null,
  mood smallint not null check (mood between 1 and 5),
  activities text[] not null default '{}'
    check (activities <@ array['walk','play','cuddle','groom','train','pet_sick','night_wake','pet_cost']::text[]),
  note text check (char_length(note) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, checkin_date)
);

create table public.who5_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  taken_on date not null,
  items smallint[] not null
    check (array_length(items, 1) = 5 and 0 <= all (items) and 5 >= all (items)),
  raw smallint generated always as (items[1] + items[2] + items[3] + items[4] + items[5]) stored,
  pct smallint generated always as ((items[1] + items[2] + items[3] + items[4] + items[5]) * 4) stored,
  created_at timestamptz not null default now()
);

create index on public.checkins (user_id, checkin_date);
create index on public.who5_entries (user_id, taken_on);

alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.checkins enable row level security;
alter table public.who5_entries enable row level security;

create policy "own profile" on public.profiles for all
  using (id = auth.uid()) with check (id = auth.uid());
create policy "own pets" on public.pets for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own checkins" on public.checkins for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own who5" on public.who5_entries for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- profile row on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)));
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- private photo bucket: objects live under {uid}/...
insert into storage.buckets (id, name, public) values ('pet-photos', 'pet-photos', false)
  on conflict (id) do nothing;

create policy "own pet photos read" on storage.objects for select
  using (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own pet photos write" on storage.objects for insert
  with check (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own pet photos update" on storage.objects for update
  using (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own pet photos delete" on storage.objects for delete
  using (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = auth.uid()::text);
