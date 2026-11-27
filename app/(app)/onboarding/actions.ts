'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getState } from '@/lib/data';
import { createAdminClient } from '@/lib/supabase/admin';

export async function giveConsent(form: FormData) {
  if (form.get('agree') !== 'on') redirect('/onboarding/consent?need=1');
  const { supabase, user } = await getState();
  if (!user) redirect('/');
  const { error } = await supabase.from('profiles').update({ consent_version: 'v2', consented_at: new Date().toISOString() }).eq('id', user.id);
  if (error) throw error;
  revalidatePath('/', 'layout');
  redirect('/onboarding/age');
}

export async function confirmAge(form: FormData) {
  const { supabase, user } = await getState();
  if (!user) redirect('/');
  if (form.get('answer') === 'yes') {
    const { error } = await supabase.from('profiles').update({ age_confirmed_20plus: true }).eq('id', user.id);
    if (error) throw error;
    revalidatePath('/', 'layout');
    redirect('/onboarding/pet');
  }
  // Under 20: keep nothing. Remove the account (profile + consent cascade) and sign out.
  await supabase.auth.signOut();
  try { await createAdminClient().auth.admin.deleteUser(user.id); } catch { /* service key missing in dev: account stays but has no data */ }
  redirect('/bye');
}

export async function startSeeking() {
  const { supabase, user } = await getState();
  if (!user) redirect('/');
  await supabase.from('profiles').update({ seeking_pet: true }).eq('id', user.id);
  revalidatePath('/', 'layout');
  redirect('/adopt');
}

export async function createPet(input: { name: string; species: string; adopted_on: string | null; photo_path: string | null }) {
  const { supabase, user } = await getState();
  if (!user) return { error: 'กรุณาเข้าสู่ระบบใหม่' };
  const name = input.name.trim();
  if (!name || name.length > 40) return { error: 'ใส่ชื่อน้อง 1–40 ตัวอักษร' };
  if (!['dog', 'cat', 'other'].includes(input.species)) return { error: 'เลือกชนิดของน้อง' };
  if (input.photo_path && !input.photo_path.startsWith(`${user.id}/`)) return { error: 'รูปไม่ถูกต้อง' };
  const { error } = await supabase.from('pets').insert({
    user_id: user.id, name, species: input.species, adopted_on: input.adopted_on || null, photo_path: input.photo_path, is_current: true,
  });
  if (error) return { error: 'บันทึกข้อมูลน้องไม่สำเร็จ ลองใหม่อีกครั้ง' };
  revalidatePath('/', 'layout');
  return { ok: true };
}
