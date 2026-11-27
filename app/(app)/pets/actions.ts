'use server';
import { revalidatePath } from 'next/cache';
import { getState } from '@/lib/data';

export async function addMemory(form: FormData) {
  const { supabase, user } = await getState();
  if (!user) return;
  const name = String(form.get('name') ?? '').trim().slice(0, 40);
  if (!name) return;
  const species = ['dog', 'cat', 'other'].includes(String(form.get('species'))) ? String(form.get('species')) : 'other';
  const feeling = Number(form.get('feeling'));
  const tags = String(form.get('tags') ?? '').split(',').map((t) => t.trim()).filter(Boolean).slice(0, 5);
  await supabase.from('pets').insert({
    user_id: user.id, name, species, is_current: false,
    past_period: String(form.get('period') ?? '').trim().slice(0, 40) || null,
    past_feeling: feeling >= 1 && feeling <= 5 ? feeling : null,
    past_tags: tags,
    memory_note: String(form.get('note') ?? '').trim().slice(0, 500) || null,
  });
  revalidatePath('/pets');
}

export async function deleteMemory(form: FormData) {
  const { supabase, user } = await getState();
  if (!user) return;
  await supabase.from('pets').delete().eq('id', String(form.get('id'))).eq('user_id', user.id).eq('is_current', false);
  revalidatePath('/pets');
}
