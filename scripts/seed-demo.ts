/**
 * Creates (or refreshes) the labelled demo account from fixtures/demo-seed.json.
 *   npm run seed:demo                 -> dates shifted so the last seeded day = yesterday (Bangkok), so a live check-in today adds +1 streak
 *   npm run seed:demo -- --no-shift   -> original fixture dates
 * Env (.env.local): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, optional DEMO_EMAIL, DEMO_PASSWORD.
 * Shifting every date by the same number of days does not change any Pattern number.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { createClient } from '@supabase/supabase-js';
import { addDays, allPatterns, daysBetween, dedupeCheckins } from '../lib/engine';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local'); process.exit(1); }
const email = process.env.DEMO_EMAIL || 'demo@pawlune.app';
const password = process.env.DEMO_PASSWORD || 'pawdiary-demo-2026';
const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

type Seed = {
  as_of: string; pet: { name: string; species: string; adopted_on: string };
  past_pets: { name: string; species: string; period: string; feeling: number; tags: string[]; memory_note: string }[];
  checkins: { date: string; mood: number; activities: string[]; created_at: string }[];
  who5: { taken_on: string; items: number[] }[];
};
const seed: Seed = JSON.parse(readFileSync(join(process.cwd(), 'fixtures/demo-seed.json'), 'utf8'));
const expected = JSON.parse(readFileSync(join(process.cwd(), 'fixtures/expected.json'), 'utf8')).demo;

const yesterday = addDays(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date()), -1);
const lastSeed = seed.checkins.map((c) => c.date).sort().at(-1)!;
const shift = process.argv.includes('--no-shift') ? 0 : daysBetween(lastSeed, yesterday);
const sh = (d: string) => addDays(d, shift);

async function main() {
  // Refresh = delete the old demo user (cascades every row) and recreate.
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const old = list?.users.find((u) => u.email === email);
  if (old) await admin.auth.admin.deleteUser(old.id);
  const { data: created, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: 'บัญชีสาธิต', username: 'demo' } });
  if (error || !created.user) throw error ?? new Error('createUser failed');
  const uid = created.user.id;

  await must(admin.from('profiles').upsert({ id: uid, display_name: 'บัญชีสาธิต', username: 'demo', avatar_animal: 'dog', consent_version: 'v2', consented_at: new Date().toISOString(), age_confirmed_20plus: true, is_demo: true }));
  const { data: pet, error: petErr } = await admin.from('pets').insert({ user_id: uid, name: seed.pet.name, species: seed.pet.species, adopted_on: seed.pet.adopted_on, is_current: true }).select('id').single();
  if (petErr) throw petErr;
  await must(admin.from('pets').insert(seed.past_pets.map((p) => ({ user_id: uid, name: p.name, species: p.species, is_current: false, past_period: p.period, past_feeling: p.feeling, past_tags: p.tags, memory_note: p.memory_note || null }))));
  await must(admin.from('checkins').insert(seed.checkins.map((c) => ({ user_id: uid, pet_id: pet.id, checkin_date: sh(c.date), mood: c.mood, activities: c.activities, created_at: new Date(new Date(c.created_at).getTime() + shift * 86400000).toISOString() }))));
  await must(admin.from('who5_entries').insert(seed.who5.map((w) => ({ user_id: uid, taken_on: sh(w.taken_on), items: w.items }))));

  // ---- Trial demo: shelter, animals, shelter staff account, active trial at day 14 for the demo user ----
  const T = JSON.parse(readFileSync(join(process.cwd(), 'fixtures/demo-trial.json'), 'utf8'));
  await admin.from('shelters').delete().eq('is_demo', true); // cascades demo animals and their trials
  const { data: shelter } = await admin.from('shelters').insert({ ...T.shelter, is_demo: true }).select('id').single();
  for (const a of T.animals) {
    const { for_demo_user, ...row } = a;
    const { data: an } = await admin.from('shelter_animals').insert({ ...row, shelter_id: shelter!.id, is_demo: true, status: for_demo_user ? 'on_trial' : 'available' }).select('id').single();
    if (for_demo_user) {
      const start = addDays(yesterday, 1 - T.trial_days_ago); // today = day 14
      await must(admin.from('trials').insert({ user_id: uid, animal_id: an!.id, status: 'active', share_consent_at: new Date().toISOString(), agreed_at: new Date().toISOString(), approved_at: new Date().toISOString(), return_plan: 'ขับรถพาไปส่งที่ศูนย์เองภายใน 1 วัน ใช้กล่องใส่สัตว์ใบเดิม', emergency_contact: 'พี่สาว (ข้อมูลจำลอง) 08x-xxx-xxxx', start_date: start, pet_id: pet.id }));
      await must(admin.from('st5_entries').insert({ user_id: uid, taken_on: start, items: T.st5_baseline }));
      console.log(`Trial: ${a.name} started ${start} (day 14 today)`);
    }
  }
  await must(admin.from('adopt_preferences').upsert({ user_id: uid, ...T.prefs }));

  const staffEmail = process.env.SHELTER_EMAIL || 'shelter@pawlune.app';
  const oldStaff = list?.users.find((u: { email?: string }) => u.email === staffEmail);
  if (oldStaff) await admin.auth.admin.deleteUser(oldStaff.id);
  const { data: staff } = await admin.auth.admin.createUser({ email: staffEmail, password, email_confirm: true, user_metadata: { full_name: 'เจ้าหน้าที่ศูนย์ (สาธิต)', username: 'shelter' } });
  await must(admin.from('profiles').upsert({ id: staff!.user!.id, display_name: 'เจ้าหน้าที่ศูนย์ (สาธิต)', username: 'shelter', consent_version: 'v2', consented_at: new Date().toISOString(), age_confirmed_20plus: true, is_demo: true, is_shelter: true, shelter_id: shelter!.id, avatar_animal: 'cat' }));
  console.log(`Shelter staff: username shelter / same password`);

  // Verify: patterns computed from what is now in the DB must equal expected.json (demo numbers in docs/PITCH.md).
  const { data: rows } = await admin.from('checkins').select('checkin_date, mood, activities, created_at').eq('user_id', uid);
  const got = allPatterns(dedupeCheckins((rows ?? []).map((r) => ({ date: r.checkin_date, mood: r.mood, activities: r.activities, created_at: r.created_at }))));
  const ok = isDeepStrictEqual(JSON.parse(JSON.stringify(got)), expected.patterns);
  console.log(`Demo account ready: username demo (or ${email}) / ${password}`);
  console.log(`Dates shifted by ${shift} days (last seeded day ${sh(lastSeed)}).`);
  console.log(ok ? 'PASS patterns match fixtures/expected.json (demo)' : 'FAIL patterns differ from expected.json — do not demo until fixed');
  process.exit(ok ? 0 : 1);
}

async function must(p: PromiseLike<{ error: unknown }>) { const { error } = await p; if (error) throw error; }

main().catch((e) => { console.error(e); process.exit(1); });
