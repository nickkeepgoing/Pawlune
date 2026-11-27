import type { Checkin } from './checkins';
import { addDays } from './dates';
import { mean, roundHalfUp } from './round';

export interface Summary { days_logged: number; mean_mood: number | null; streak: number }

export function summary(checkins: Checkin[], asOf: string): Summary {
  const moods = checkins.map((c) => c.mood);
  const dates = new Set(checkins.map((c) => c.date));
  let d = dates.has(asOf) ? asOf : addDays(asOf, -1);
  let streak = 0;
  while (dates.has(d)) { streak += 1; d = addDays(d, -1); }
  const m = mean(moods);
  return { days_logged: checkins.length, mean_mood: m === null ? null : roundHalfUp(m, 2), streak };
}
