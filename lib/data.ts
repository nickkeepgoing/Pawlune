import 'server-only';
import { cache } from 'react';
import { dedupeCheckins, type Checkin } from '@/lib/engine';
import { createClient } from '@/lib/supabase/server';
import { ANIMALS, defaultAnimal, type Animal } from '@/components/AnimalAvatar';

export interface Profile {
  id: string;
  display_name: string | null;
  consent_version: string | null;
  consented_at: string | null;
  age_confirmed_20plus: boolean;
  is_demo: boolean;
  username: string | null;
  avatar_path: string | null;
  avatar_animal: string | null;
  is_shelter: boolean;
  seeking_pet: boolean;
  shelter_id: string | null;
}

export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  photo_path: string | null;
  adopted_on: string | null;
  is_current: boolean;
  past_period: string | null;
  past_feeling: number | null;
  past_tags: string[];
  memory_note: string | null;
}

export interface Who5Row { id: string; taken_on: string; items: number[]; raw: number; pct: number; created_at: string }

/** Current user + profile + current pet. Cached per request. */
export const getState = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, profile: null, pet: null } as const;
  const [{ data: profile }, { data: pet }] = await Promise.all([
    supabase.from('profiles').select('id, display_name, consent_version, consented_at, age_confirmed_20plus, is_demo, username, avatar_path, avatar_animal, is_shelter, seeking_pet, shelter_id').eq('id', user.id).maybeSingle(),
    supabase.from('pets').select('*').eq('user_id', user.id).eq('is_current', true).order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ]);
  return { supabase, user, profile: profile as Profile | null, pet: pet as Pet | null } as const;
});

/** Engine input. Never selects `note` (docs/DATABASE.md). */
export async function loadCheckins(): Promise<Checkin[]> {
  const { supabase, user } = await getState();
  if (!user) return [];
  const { data, error } = await supabase.from('checkins').select('checkin_date, mood, activities, created_at').eq('user_id', user.id).order('checkin_date');
  if (error) throw error;
  return dedupeCheckins((data ?? []).map((r) => ({ date: r.checkin_date as string, mood: r.mood as number, activities: r.activities as string[], created_at: r.created_at as string })));
}

export async function loadWho5(): Promise<Who5Row[]> {
  const { supabase, user } = await getState();
  if (!user) return [];
  const { data, error } = await supabase.from('who5_entries').select('id, taken_on, items, raw, pct, created_at').eq('user_id', user.id).order('taken_on').order('created_at');
  if (error) throw error;
  return (data ?? []) as Who5Row[];
}

export async function signedPhotoUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const { supabase } = await getState();
  const { data } = await supabase.storage.from('pet-photos').createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}

/** Avatar for the header/profile: signed URL of the uploaded photo, else an animal (chosen or stable default). */
export async function avatarFor(profile: Profile | null, uid: string) {
  const animal: Animal = (ANIMALS as readonly string[]).includes(profile?.avatar_animal ?? '') ? (profile!.avatar_animal as Animal) : defaultAnimal(uid);
  return { url: await signedPhotoUrl(profile?.avatar_path ?? null), animal };
}
