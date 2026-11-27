-- Pawlune — username login + profile avatar
alter table public.profiles
  add column if not exists username text unique check (username ~ '^[a-z0-9_.]{3,20}$'),
  add column if not exists avatar_path text,
  add column if not exists avatar_animal text check (avatar_animal in ('dog','cat','rabbit','hamster','bird','turtle'));

-- Profile row on sign-up now also stores the username chosen at registration (lower-case). Google users pick one later.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare u text := lower(nullif(new.raw_user_meta_data ->> 'username', ''));
begin
  insert into public.profiles (id, display_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', u, split_part(new.email, '@', 1)),
    case when u ~ '^[a-z0-9_.]{3,20}$' and not exists (select 1 from public.profiles where username = u) then u else null end
  );
  return new;
end; $$;

-- Lets a signed-in user check a username without reading other people's rows (RLS stays owner-only).
create or replace function public.username_available(u text)
returns boolean language sql security definer set search_path = public stable as $$
  select not exists (select 1 from public.profiles where username = lower(u));
$$;
revoke all on function public.username_available(text) from public;
grant execute on function public.username_available(text) to authenticated;
