-- Pawlune — photos for shelter animals. Run after 0006.
-- The bucket is public to read (these are adoption listings). Nothing but the server
-- (service role, after checking the staff member's shelter) can write to it, so no
-- storage policies are added.

alter table public.shelter_animals
  add column if not exists photo_url text check (char_length(photo_url) <= 500);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('animal-photos', 'animal-photos', true, 2097152, array['image/jpeg'])
on conflict (id) do nothing;
