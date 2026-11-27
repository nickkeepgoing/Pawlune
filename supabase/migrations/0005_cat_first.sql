-- Pawlune — cat-first MVP, readiness & safety agreement, shelter scoping. Run after 0004.
-- Every new column has a default, so existing rows stay valid. Dogs stay supported.

-- 1) Readiness the adopter declares (used by rule-based matching and shown to the shelter)
alter table public.adopt_preferences
  add column if not exists indoor_only boolean not null default true,           -- will keep a cat indoors
  add column if not exists window_screens boolean not null default false,       -- windows/balcony netted
  add column if not exists existing_pets text[] not null default '{}'           -- cat / dog / other
    check (existing_pets <@ array['cat','dog','other']::text[]),
  add column if not exists allergy_checked boolean not null default false,      -- everyone at home checked for allergy
  add column if not exists has_carrier boolean not null default false;

-- 2) What the shelter discloses about each animal (known history, never a guarantee)
alter table public.shelter_animals
  add column if not exists indoor_ok boolean not null default true,             -- used to indoor life
  add column if not exists ok_with_cats text not null default 'unknown' check (ok_with_cats in ('yes','no','unknown')),
  add column if not exists ok_with_dogs text not null default 'unknown' check (ok_with_dogs in ('yes','no','unknown')),
  add column if not exists vaccinated boolean,
  add column if not exists neutered boolean,
  add column if not exists health_notes text check (char_length(health_notes) <= 400),
  add column if not exists behavior_notes text check (char_length(behavior_notes) <= 400);

-- 3) Agreement made before a trial, and who at the shelter approved it
alter table public.trials
  add column if not exists agreed_at timestamptz,                               -- costs, emergency care, responsibility, safe return
  add column if not exists return_plan text check (char_length(return_plan) <= 300),
  add column if not exists emergency_contact text check (char_length(emergency_contact) <= 100),
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references auth.users (id) on delete set null;

-- Only available animals can be requested, and only with the agreement signed.
drop policy if exists "apply" on public.trials;
create policy "apply" on public.trials for insert with check (
  user_id = auth.uid() and status = 'applied' and agreed_at is not null
  and exists (select 1 from public.shelter_animals a where a.id = animal_id and a.status = 'available')
);

-- 4) Feedback: add-only, and only for your own trial. 'concern' = report a problem at any time.
alter table public.trial_feedback alter column feeling drop not null;   -- a concern may skip the feeling scale
alter table public.trial_feedback drop constraint if exists trial_feedback_kind_check;
alter table public.trial_feedback add constraint trial_feedback_kind_check check (kind in ('day14','monthly','concern'));
drop policy if exists "own feedback" on public.trial_feedback;
create policy "read own feedback" on public.trial_feedback for select using (user_id = auth.uid());
create policy "add own feedback" on public.trial_feedback for insert with check (
  user_id = auth.uid() and exists (select 1 from public.trials t where t.id = trial_id and t.user_id = auth.uid())
);

-- 5) Shelter staff belong to one shelter and only see that shelter's requests.
alter table public.profiles add column if not exists shelter_id uuid references public.shelters (id) on delete set null;

create or replace function public.protect_profile_flags()
returns trigger language plpgsql as $$
begin
  if (new.is_shelter is distinct from old.is_shelter
      or new.is_demo is distinct from old.is_demo
      or new.shelter_id is distinct from old.shelter_id)
     and current_user in ('authenticated', 'anon') then  -- app users; SQL editor and service role are allowed
    raise exception 'not allowed';
  end if;
  return new;
end; $$;

-- Existing shelter staff: set their shelter once in the SQL editor, e.g.
-- update public.profiles set shelter_id = '<shelter uuid>' where username = 'shelter';
