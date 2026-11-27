// Transparent rule-based matching between what the user wants and a shelter animal.
// Allergy and housing safety rules EXCLUDE; everything else adds a reason (never a hidden score).
export interface Prefs {
  species: string[]; allergies: string[];
  size: string | null; age_group: string | null; energy: string | null; personality: string | null;
  housing: string | null; has_fence: boolean; hours_alone: number | null;
  // Cat-first readiness (optional so older rows and fixtures still work)
  indoor_only?: boolean; window_screens?: boolean; existing_pets?: string[];
}
export interface AnimalLite {
  species: 'dog' | 'cat'; size: string | null; age_group: string | null; energy: string | null; personality: string | null;
  needs_fence: boolean; max_hours_alone: number | null;
  indoor_ok?: boolean; ok_with_cats?: 'yes' | 'no' | 'unknown'; ok_with_dogs?: 'yes' | 'no' | 'unknown';
}
export interface Match { excluded: boolean; exclude_reason: string | null; fits: string[]; cautions: string[]; score: number }

const TH: Record<'size' | 'age_group' | 'energy' | 'personality', Record<string, string>> = {
  size: { small: 'ตัวเล็ก', medium: 'ตัวกลาง', large: 'ตัวใหญ่' },
  age_group: { young: 'อายุน้อย', adult: 'โตเต็มวัย', senior: 'สูงวัย' },
  energy: { calm: 'นิ่ง ชอบพัก', medium: 'พลังงานปานกลาง', active: 'พลังเยอะ' },
  personality: { cuddly: 'ขี้อ้อน', independent: 'ชอบอยู่เงียบๆ' },
};
const SPECIES_TH = { dog: 'หมา', cat: 'แมว' } as const;

export function matchAnimal(p: Prefs, a: AnimalLite): Match {
  const m: Match = { excluded: false, exclude_reason: null, fits: [], cautions: [], score: 0 };
  if (p.allergies.includes(a.species)) return { ...m, excluded: true, exclude_reason: `คุณแพ้${SPECIES_TH[a.species]}` };
  if (p.species.length && !p.species.includes(a.species)) return { ...m, excluded: true, exclude_reason: `คุณเลือกเฉพาะ${p.species.map((s) => SPECIES_TH[s as 'dog' | 'cat']).join('/')}` };
  if (a.needs_fence && !p.has_fence) return { ...m, excluded: true, exclude_reason: 'น้องต้องการพื้นที่มีรั้วรอบ' };
  // Animals already at home: the shelter's known history decides. "no" excludes; "unknown" is a caution, never a guess.
  const home = p.existing_pets ?? [];
  for (const [kind, ok] of [['cat', a.ok_with_cats], ['dog', a.ok_with_dogs]] as const) {
    if (!home.includes(kind)) continue;
    if (ok === 'no') return { ...m, excluded: true, exclude_reason: `ศูนย์ระบุว่าน้องไม่เข้ากับ${SPECIES_TH[kind]} และที่บ้านมี${SPECIES_TH[kind]}อยู่แล้ว` };
    if (ok === 'yes') { m.fits.push(`ศูนย์เคยเห็นน้องอยู่กับ${SPECIES_TH[kind]}ได้`); m.score += 1; }
    else m.cautions.push(`ยังไม่รู้ว่าน้องเข้ากับ${SPECIES_TH[kind]}ไหม แยกห้องก่อนแล้วค่อยๆ แนะนำตัว`);
  }

  const want = (field: 'size' | 'age_group' | 'energy' | 'personality') => {
    const v = p[field], have = a[field];
    if (!v || v === 'any' || !have) return;
    if (v === have) { m.fits.push(`${TH[field][have]}ตามที่คุณอยากได้`); m.score += 1; }
    else m.cautions.push(`น้อง${TH[field][have]} (คุณเลือก${TH[field][v]})`);
  };
  want('size'); want('age_group'); want('energy'); want('personality');

  if (a.max_hours_alone !== null && p.hours_alone !== null) {
    if (p.hours_alone <= a.max_hours_alone) { m.fits.push(`อยู่ลำพังได้ถึง ${a.max_hours_alone} ชม. ต่อวัน`); m.score += 1; }
    else m.cautions.push(`น้องอยู่ลำพังได้ไม่เกิน ${a.max_hours_alone} ชม. แต่คุณไม่อยู่บ้าน ${p.hours_alone} ชม.`);
  }
  if (p.housing === 'condo' && a.species === 'dog' && a.size === 'large') m.cautions.push('หมาตัวใหญ่ในคอนโด ตรวจกฎของอาคารก่อน');
  if (a.species === 'cat') {
    if (p.indoor_only !== false && a.indoor_ok === false) m.cautions.push('น้องเคยชินกับการออกนอกบ้าน ต้องใช้เวลาปรับเป็นแมวในบ้าน');
    if (p.indoor_only !== false && a.indoor_ok !== false) { m.fits.push('อยู่ในบ้านได้ ตรงกับที่คุณจะเลี้ยงในบ้าน'); m.score += 1; }
    if (p.window_screens === false) m.cautions.push('ติดมุ้งลวดหรือตาข่ายที่หน้าต่างและระเบียงก่อนรับแมว');
  }
  return m;
}

export function rankMatches<T extends AnimalLite>(p: Prefs, animals: T[]): (T & { match: Match })[] {
  return animals.map((a) => ({ ...a, match: matchAnimal(p, a) }))
    .filter((x) => !x.match.excluded)
    .sort((x, y) => y.match.score - x.match.score || x.match.cautions.length - y.match.cautions.length
      || Number(y.species === 'cat') - Number(x.species === 'cat'));  // cat-first MVP: cats lead on ties
}
