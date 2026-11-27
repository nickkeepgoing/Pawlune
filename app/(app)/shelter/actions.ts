'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getState } from '@/lib/data';
import { createAdminClient } from '@/lib/supabase/admin';
import { confirmReturn, declineTrial, startTrial } from '@/lib/trialAdmin';

/** Staff may act only on trials for animals of their own shelter. */
async function staffFor(trialId: string) {
  const { profile, user } = await getState();
  if (!profile?.is_shelter || !profile.shelter_id || !user) redirect('/home');
  const admin = createAdminClient();
  const { data: t } = await admin.from('trials').select('id, animal_id').eq('id', trialId).maybeSingle();
  if (!t) redirect('/shelter');
  const { data: a } = await admin.from('shelter_animals').select('shelter_id').eq('id', t.animal_id).maybeSingle();
  if (a?.shelter_id !== profile.shelter_id) redirect('/shelter');
  return { admin, staffId: user.id };
}

const CHECKS = ['c_identity', 'c_home', 'c_history', 'c_agreement'] as const;

export async function approve(form: FormData) {
  const id = String(form.get('id'));
  const { admin, staffId } = await staffFor(id);
  if (CHECKS.some((k) => form.get(k) !== 'on')) redirect(`/shelter?check=${id}#t-${id}`);
  await admin.from('trials').update({ approved_at: new Date().toISOString(), approved_by: staffId }).eq('id', id).eq('status', 'applied');
  await startTrial(id);
  revalidatePath('/shelter');
}
export async function decline(form: FormData) { const id = String(form.get('id')); await staffFor(id); await declineTrial(id); revalidatePath('/shelter'); }
export async function received(form: FormData) { const id = String(form.get('id')); await staffFor(id); await confirmReturn(id); revalidatePath('/shelter'); }
