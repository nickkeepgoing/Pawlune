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

const one = (v: FormDataEntryValue | null, ok: string[]) => (v && ok.includes(String(v)) ? String(v) : null);

/** Adds an animal to the signed-in staff member's own shelter, with its photo. */
export async function addAnimal(form: FormData): Promise<{ error: string } | { ok: string }> {
  const { profile, user } = await getState();
  if (!profile?.is_shelter || !profile.shelter_id || !user) return { error: 'บัญชีนี้เพิ่มสัตว์ไม่ได้' };

  const name = String(form.get('name') ?? '').trim();
  const species = one(form.get('species'), ['cat', 'dog']);
  const photo = form.get('photo');
  if (!name || name.length > 40) return { error: 'ใส่ชื่อน้อง 1–40 ตัวอักษร' };
  if (!species) return { error: 'เลือกว่าเป็นแมวหรือหมา' };
  if (!(photo instanceof File) || photo.type !== 'image/jpeg' || photo.size > 1_000_000) return { error: 'เลือกรูปของน้องอีกครั้ง' };
  const hours = Number(form.get('max_hours_alone'));
  const text = (k: string) => String(form.get(k) ?? '').trim().slice(0, 400) || null;

  const admin = createAdminClient();
  const { data: shelter } = await admin.from('shelters').select('is_demo').eq('id', profile.shelter_id).maybeSingle();
  const path = `${profile.shelter_id}/${crypto.randomUUID()}.jpg`;
  const bucket = admin.storage.from('animal-photos');
  const { error: uploadError } = await bucket.upload(path, photo, { contentType: 'image/jpeg' });
  if (uploadError) {
    console.error('[addAnimal] upload', uploadError.message);
    return { error: 'อัปโหลดรูปไม่สำเร็จ ผู้ดูแลระบบอาจยังไม่ได้รัน 0007_animal_photos.sql' };
  }

  const { error } = await admin.from('shelter_animals').insert({
    shelter_id: profile.shelter_id,
    name,
    species,
    sex: one(form.get('sex'), ['m', 'f']),
    age_group: one(form.get('age_group'), ['young', 'adult', 'senior']),
    size: one(form.get('size'), ['small', 'medium', 'large']),
    energy: one(form.get('energy'), ['calm', 'medium', 'active']),
    personality: one(form.get('personality'), ['cuddly', 'independent']),
    max_hours_alone: form.get('max_hours_alone') && hours >= 0 && hours <= 24 ? Math.round(hours) : null,
    ok_with_cats: one(form.get('ok_with_cats'), ['yes', 'no', 'unknown']) ?? 'unknown',
    ok_with_dogs: one(form.get('ok_with_dogs'), ['yes', 'no', 'unknown']) ?? 'unknown',
    indoor_ok: form.get('indoor_ok') === 'on',
    needs_fence: form.get('needs_fence') === 'on',
    vaccinated: form.get('vaccinated') === 'on',
    neutered: form.get('neutered') === 'on',
    story: text('story'),
    health_notes: text('health_notes'),
    status: 'available',
    photo_url: bucket.getPublicUrl(path).data.publicUrl,
    is_demo: shelter?.is_demo ?? false, // anything under a demo shelter stays labelled as demo data
  });
  if (error) {
    await bucket.remove([path]);
    console.error('[addAnimal] insert', error.code, error.message);
    return { error: 'บันทึกข้อมูลไม่สำเร็จ ผู้ดูแลระบบอาจยังไม่ได้รัน 0007_animal_photos.sql' };
  }
  revalidatePath('/shelter');
  revalidatePath('/adopt');
  return { ok: `เพิ่ม${name}แล้ว คนที่เข้ากันจะเห็นในหน้ารายชื่อ` };
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
