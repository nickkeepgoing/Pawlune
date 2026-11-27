'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { st5Score, who5Score } from '@/lib/engine';
import { getState } from '@/lib/data';
import { todayInBangkok } from '@/lib/time';

export async function saveWho5(form: FormData) {
  const { supabase, user } = await getState();
  if (!user) redirect('/');
  const items = [0, 1, 2, 3, 4].map((i) => Number(form.get(`q${i}`)));
  if (items.some((v) => !Number.isInteger(v) || v < 0 || v > 5) || items.some((_, i) => form.get(`q${i}`) === null)) {
    redirect(`/wellbeing/take?missing=1${form.get('next') === '/trial' ? '&next=/trial' : ''}`);
  }
  const engine = who5Score(items);
  const { data, error } = await supabase.from('who5_entries').insert({ user_id: user.id, taken_on: todayInBangkok(), items }).select('id, raw, pct').single();
  if (error) throw error;
  // DB generated columns must equal the engine (docs/DATABASE.md).
  if (data.raw !== engine.raw || data.pct !== engine.pct) throw new Error(`WHO-5 mismatch: db ${data.raw}/${data.pct} vs engine ${engine.raw}/${engine.pct}`);
  revalidatePath('/', 'layout');
  redirect(form.get('next') === '/trial' ? '/trial' : `/wellbeing?result=${data.id}`);
}

export async function saveSt5(form: FormData) {
  const { supabase, user } = await getState();
  if (!user) redirect('/');
  const next = form.get('next') === '/trial' ? '/trial' : null;
  const raw = [0, 1, 2, 3, 4].map((i) => form.get(`q${i}`));
  if (raw.some((v) => v === null)) redirect(`/wellbeing/st5?missing=1${next ? '&next=/trial' : ''}`);
  const items = raw.map(Number);
  const engine = st5Score(items);
  const { data, error } = await supabase.from('st5_entries').insert({ user_id: user.id, taken_on: todayInBangkok(), items }).select('id, raw').single();
  if (error) throw error;
  if (data.raw !== engine.raw) throw new Error(`ST-5 mismatch: db ${data.raw} vs engine ${engine.raw}`);
  revalidatePath('/', 'layout');
  redirect(next ?? `/wellbeing?st5=${data.id}`);
}
