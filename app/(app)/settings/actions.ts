'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getState } from '@/lib/data';
import { createAdminClient } from '@/lib/supabase/admin';

export async function updateName(form: FormData) {
  const { supabase, user } = await getState();
  if (!user) redirect('/');
  await supabase.from('profiles').update({ display_name: String(form.get('name') ?? '').trim().slice(0, 40) || null }).eq('id', user.id);
  revalidatePath('/', 'layout');
}

/** Delete everything: photos under {uid}/, then the auth user (cascades every table). Server only, service role. */
export async function deleteAll(form: FormData) {
  if (String(form.get('confirm') ?? '').trim() !== 'ลบ') redirect('/settings?confirm=1');
  const { supabase, user } = await getState();
  if (!user) redirect('/');
  const admin = createAdminClient();
  const { data: files } = await admin.storage.from('pet-photos').list(user.id, { limit: 1000 });
  if (files?.length) await admin.storage.from('pet-photos').remove(files.map((f) => `${user.id}/${f.name}`));
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) redirect('/settings?failed=1');
  await supabase.auth.signOut();
  redirect('/?deleted=1');
}
