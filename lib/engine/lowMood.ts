import { LOW_MOOD_MAX, LOW_MOOD_STREAK } from './activities';
import type { Checkin } from './checkins';
import { addDays } from './dates';

export function lowMoodStreak(checkins: Checkin[], asOf: string) {
  const byDate = new Map(checkins.map((c) => [c.date, c.mood]));
  let d = asOf, n = 0;
  while (byDate.has(d) && byDate.get(d)! <= LOW_MOOD_MAX) { n += 1; d = addDays(d, -1); }
  return { low_days_in_a_row: n, gentle_card: n >= LOW_MOOD_STREAK };
}
