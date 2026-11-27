import { ACTIVITIES, STRONG_DAYS_PER_GROUP } from './activities';
import type { Pattern } from './pattern';

/** Exact Thai templates from docs/ENGINE.md. The UI must use only these strings for pattern cards. */
export const LIMITATION_LINE = 'เป็นความสัมพันธ์ในข้อมูลของคุณ ยังบอกไม่ได้ว่าอะไรเป็นสาเหตุ';
export const BANNED_WORDS = ['ทำให้', 'ช่วยเพิ่ม', 'รักษา', 'บำบัด', 'ซึมเศร้า'];

const f2 = (x: number) => x.toFixed(2);
const f1 = (x: number) => x.toFixed(1);

export function cardSentence(p: Pattern): string {
  if (p.status === 'insufficient') {
    const parts: string[] = [];
    if (p.need_more_with) parts.push(`วันที่ทำอีก ${p.need_more_with} วัน`);
    if (p.need_more_without) parts.push(`วันที่ไม่ได้ทำอีก ${p.need_more_without} วัน`);
    return `"${p.label_th}" — ข้อมูลยังไม่พอ ต้องมี${parts.join(' และ')}`;
  }
  const head = `ใน ${p.n_with} วันที่มี "${p.label_th}" คะแนนอารมณ์เฉลี่ย ${f2(p.mean_with!)}`;
  if (p.direction === 'same') return `${head} เท่ากันกับ ${p.n_without} วันที่ไม่มี (${f2(p.mean_without!)})`;
  const word = p.direction === 'higher' ? 'สูงกว่า' : 'ต่ำกว่า';
  return `${head} ${word} ${p.n_without} วันที่ไม่มี (${f2(p.mean_without!)}) อยู่ ${f1(p.diff_display!)} คะแนน`;
}

export function statusChip(p: Pattern): string | null {
  if (p.status === 'preliminary') return 'แนวโน้มเบื้องต้น';
  if (p.status === 'more_data') return `แนวโน้มจากข้อมูล ${STRONG_DAYS_PER_GROUP} วันขึ้นไป`;
  return null;
}

export function oftenTogetherLines(p: Pattern): string[] {
  return p.often_together.map(
    (o) => `วันที่มี "${p.label_th}" มักมี "${ACTIVITIES[o.with].th}" ด้วย (${Math.round(o.share * 100)}% ของวัน) จึงแยกผลสองอย่างนี้ออกจากกันไม่ได้`,
  );
}

export function daysNeeded(p: Pattern): number {
  return Math.max(p.need_more_with ?? 0, p.need_more_without ?? 0);
}

export function containsBanned(s: string): string | null {
  return BANNED_WORDS.find((w) => s.includes(w)) ?? null;
}
