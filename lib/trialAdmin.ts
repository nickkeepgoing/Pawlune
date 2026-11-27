import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { todayInBangkok } from '@/lib/time';
import { thaiDate } from '@/lib/format';

// State changes of a trial. Called only after the caller has checked who is allowed (owner or shelter staff).
export async function startTrial(trialId: string) {
  const admin = createAdminClient();
  const { data: t } = await admin.from('trials').select('id, user_id, animal_id, status').eq('id', trialId).single();
  if (!t || t.status !== 'applied') return;
  const { data: a } = await admin.from('shelter_animals').select('name, species').eq('id', t.animal_id).single();
  await admin.from('pets').update({ is_current: false }).eq('user_id', t.user_id).eq('is_current', true);
  const { data: pet } = await admin.from('pets').insert({ user_id: t.user_id, name: a!.name, species: a!.species, adopted_on: todayInBangkok(), is_current: true }).select('id').single();
  await admin.from('trials').update({ status: 'active', start_date: todayInBangkok(), pet_id: pet!.id }).eq('id', trialId);
  await admin.from('shelter_animals').update({ status: 'on_trial' }).eq('id', t.animal_id);
  await admin.from('profiles').update({ seeking_pet: false }).eq('id', t.user_id);
}

export async function declineTrial(trialId: string) {
  await createAdminClient().from('trials').update({ status: 'declined', decided_at: new Date().toISOString() }).eq('id', trialId).eq('status', 'applied');
}

export async function decide(trialId: string, decision: 'adopt' | 'return') {
  const admin = createAdminClient();
  const { data: t } = await admin.from('trials').select('animal_id').eq('id', trialId).single();
  if (!t) return;
  await admin.from('trials').update({ status: decision === 'adopt' ? 'adopted' : 'return_requested', decided_at: new Date().toISOString() }).eq('id', trialId);
  if (decision === 'adopt') await admin.from('shelter_animals').update({ status: 'adopted' }).eq('id', t.animal_id);
}

/** Shelter confirms the animal is back. The trial pet becomes a memory; the user can look for a new friend. */
export async function confirmReturn(trialId: string) {
  const admin = createAdminClient();
  const { data: t } = await admin.from('trials').select('user_id, animal_id, pet_id, start_date, status').eq('id', trialId).single();
  if (!t || t.status !== 'return_requested') return;
  await admin.from('trials').update({ status: 'returned' }).eq('id', trialId);
  await admin.from('shelter_animals').update({ status: 'available' }).eq('id', t.animal_id);
  if (t.pet_id) await admin.from('pets').update({ is_current: false, past_period: `ทดลองเลี้ยง ${t.start_date ? thaiDate(t.start_date) : ''} – ${thaiDate(todayInBangkok())}` }).eq('id', t.pet_id);
  await admin.from('profiles').update({ seeking_pet: true }).eq('id', t.user_id);
}
