const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

/** '2026-11-26' -> '26 พ.ย. 69' */
export function thaiDate(iso: string, withYear = true): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${TH_MONTHS[m - 1]}${withYear ? ` ${String((y + 543) % 100).padStart(2, '0')}` : ''}`;
}

export const MOOD_LABELS = ['แย่มาก', 'ไม่ค่อยดี', 'เฉยๆ', 'ดี', 'ดีมาก'] as const;
export const SPECIES_TH = { dog: 'หมา', cat: 'แมว', other: 'อื่นๆ' } as const;
