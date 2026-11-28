'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getState } from '@/lib/data';
import { loadPrefs, type Animal } from '@/lib/trialData';
import { matchAnimal } from '@/lib/engine';

const pick = (v: FormDataEntryValue | null, ok: string[]) => (v && ok.includes(String(v)) ? String(v) : null);

export async function savePrefs(form: FormData): Promise<{ error: string } | void> {
  const { supabase, user } = await getState();
  if (!user) redirect('/');
  const list = (k: string, ok: string[]) => form.getAll(k).map(String).filter((x) => ok.includes(x));
  const num = (k: string, max: number) => { const n = Number(form.get(k)); return Number.isFinite(n) && n >= 0 && n <= max ? Math.round(n) : null; };
  const species = list('species', ['dog', 'cat']);
  if (!species.length) return { error: 'เลือกก่อนว่าอยากได้แมว หมา หรือทั้งสองอย่าง' };
  const { error } = await supabase.from('adopt_preferences').upsert({
    user_id: user.id,
    species,
    allergies: list('allergies', ['dog', 'cat']),
    size: pick(form.get('size'), ['small', 'medium', 'large', 'any']),
    age_group: pick(form.get('age_group'), ['young', 'adult', 'senior', 'any']),
    energy: pick(form.get('energy'), ['calm', 'medium', 'active', 'any']),
    personality: pick(form.get('personality'), ['cuddly', 'independent', 'any']),
    housing: pick(form.get('housing'), ['condo', 'house']),
    has_fence: form.get('has_fence') === 'on',
    hours_alone: num('hours_alone', 24),
    budget_month: num('budget_month', 1000000),
    family_agrees: form.get('family_agrees') === 'on',
    experience: String(form.get('experience') ?? '').trim().slice(0, 300) || null,
    indoor_only: form.get('indoor_only') === 'on',
    window_screens: form.get('window_screens') === 'on',
    has_carrier: form.get('has_carrier') === 'on',
    allergy_checked: form.get('allergy_checked') === 'on',
    existing_pets: list('existing_pets', ['cat', 'dog', 'other']),
    updated_at: new Date().toISOString(),
  });
  if (error) {
    // Never move on silently: a swallowed error here looked like a button that did nothing.
    console.error('[savePrefs]', error.code, error.message);
    return { error: 'บันทึกคำตอบไม่สำเร็จ คำตอบของคุณยังอยู่บนหน้านี้ ลองกดอีกครั้ง ถ้ายังไม่ได้ให้แจ้งผู้ดูแลระบบ' };
  }
  revalidatePath('/adopt');
  redirect('/adopt?saved=1');
}

const AGREE = ['ready', 'share', 'costs', 'emergency', 'transport', 'return_ok'] as const;

export async function applyForTrial(form: FormData) {
  const { supabase, user } = await getState();
  if (!user) redirect('/');
  const animalId = String(form.get('animal_id') ?? '');
  const returnPlan = String(form.get('return_plan') ?? '').trim().slice(0, 300);
  const contact = String(form.get('emergency_contact') ?? '').trim().slice(0, 100);
  if (AGREE.some((k) => form.get(k) !== 'on') || !returnPlan || !contact) redirect(`/adopt/${animalId}?need=1#apply`);

  // Re-check on the server: animal must be available and must not be excluded by the safety rules.
  const [{ data: animal }, prefs] = await Promise.all([
    supabase.from('shelter_animals').select('*').eq('id', animalId).eq('status', 'available').maybeSingle(),
    loadPrefs(),
  ]);
  if (!animal || !prefs) redirect('/adopt');
  if (matchAnimal(prefs, animal as Animal).excluded) redirect(`/adopt/${animalId}`);
  if (!prefs.family_agrees || !prefs.allergy_checked) redirect(`/adopt/${animalId}?need=home#apply`);

  const { data: open } = await supabase.from('trials').select('id').eq('user_id', user.id).in('status', ['applied', 'active', 'return_requested']).limit(1);
  if (open?.length) redirect('/trial');
  const now = new Date().toISOString();
  const { error } = await supabase.from('trials').insert({ user_id: user.id, animal_id: animalId, status: 'applied', share_consent_at: now, agreed_at: now, return_plan: returnPlan, emergency_contact: contact });
  if (error) {
    console.error('[applyForTrial]', error.code, error.message);
    redirect(`/adopt/${animalId}?need=save#apply`);
  }
  revalidatePath('/', 'layout');
  redirect('/trial');
}
