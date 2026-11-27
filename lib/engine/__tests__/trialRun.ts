import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAfter, decisionOpen, matchAnimal, st5Score, trialDay, type Prefs, type AnimalLite } from '../index';

/** Returns a list of failure messages (empty = all good). */
export function checkTrialCases(): string[] {
  const f = JSON.parse(readFileSync(join(process.cwd(), 'fixtures/trial-cases.json'), 'utf8'));
  const fail: string[] = [];
  for (const c of f.st5) {
    try {
      const r = st5Score(c.items);
      if (c.error) fail.push(`st5 ${c.items} should throw`);
      else if (r.raw !== c.raw || r.level !== c.level || r.gentle_card !== c.gentle_card) fail.push(`st5 ${c.items} -> ${JSON.stringify(r)}`);
    } catch { if (!c.error) fail.push(`st5 ${c.items} threw`); }
  }
  for (const c of f.trial_day) {
    if (trialDay(c.start, c.today) !== c.day || decisionOpen(c.start, c.today) !== c.decision_open) fail.push(`trial_day ${c.today}`);
  }
  const ba = beforeAfter(f.before_after.rows, f.before_after.start);
  if (ba.before?.taken_on !== f.before_after.before || ba.after?.taken_on !== f.before_after.after) fail.push(`before_after ${JSON.stringify(ba)}`);

  const p: Prefs = { species: ['dog', 'cat'], allergies: ['cat'], size: 'small', age_group: 'any', energy: 'calm', personality: null, housing: 'condo', has_fence: false, hours_alone: 9 };
  const dog: AnimalLite = { species: 'dog', size: 'small', age_group: 'adult', energy: 'calm', personality: 'cuddly', needs_fence: false, max_hours_alone: 8 };
  const m = matchAnimal(p, dog);
  if (m.excluded || m.score !== 2 || m.cautions.length !== 1) fail.push(`match dog ${JSON.stringify(m)}`);
  if (!matchAnimal(p, { ...dog, species: 'cat' }).excluded) fail.push('allergy must exclude');
  if (!matchAnimal(p, { ...dog, needs_fence: true }).excluded) fail.push('fence must exclude');

  // Cat-first rules
  const cp: Prefs = { ...p, allergies: [], species: ['cat'], indoor_only: true, window_screens: false, existing_pets: ['cat'] };
  const cat: AnimalLite = { species: 'cat', size: 'small', age_group: 'adult', energy: 'calm', personality: null, needs_fence: false, max_hours_alone: 10, indoor_ok: true, ok_with_cats: 'unknown' };
  const c1 = matchAnimal(cp, cat);
  if (c1.excluded || !c1.fits.some((x) => x.includes('อยู่ในบ้านได้')) || !c1.cautions.some((x) => x.includes('มุ้งลวด')) || !c1.cautions.some((x) => x.includes('ยังไม่รู้ว่าน้องเข้ากับแมว'))) fail.push(`match cat ${JSON.stringify(c1)}`);
  if (!matchAnimal(cp, { ...cat, ok_with_cats: 'no' }).excluded) fail.push('cat not ok with resident cat must exclude');
  if (!matchAnimal(cp, { ...cat, ok_with_cats: 'yes' }).fits.some((x) => x.includes('อยู่กับแมวได้'))) fail.push('ok_with_cats yes should be a fit');
  if (!matchAnimal({ ...cp, window_screens: true }, { ...cat, indoor_ok: false }).cautions.some((x) => x.includes('ออกนอกบ้าน'))) fail.push('outdoor cat caution');
  if (matchAnimal({ ...cp, existing_pets: [] }, { ...cat, ok_with_cats: 'no' }).excluded) fail.push('no resident cat: must not exclude');
  return fail;
}
