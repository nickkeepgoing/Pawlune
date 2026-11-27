import { WHO5_DUE_DAYS, WHO5_GENTLE_RAW_BELOW } from './activities';
import { daysBetween } from './dates';

export interface Who5Score { raw: number; pct: number; gentle_card: boolean }

export function who5Score(items: unknown): Who5Score {
  if (!Array.isArray(items) || items.length !== 5 || !items.every((i) => Number.isInteger(i) && i >= 0 && i <= 5)) {
    throw new Error('WHO-5 needs exactly 5 integer answers in 0..5');
  }
  const raw = (items as number[]).reduce((a, b) => a + b, 0);
  return { raw, pct: raw * 4, gentle_card: raw < WHO5_GENTLE_RAW_BELOW };
}

export function who5Due(lastTaken: string | null, today: string): boolean {
  if (lastTaken === null) return true;
  return daysBetween(lastTaken, today) >= WHO5_DUE_DAYS;
}
