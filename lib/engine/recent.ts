import type { Checkin } from './checkins';
import { addDays } from './dates';

/** Mood for each of the last n calendar days ending at asOf (null = not logged). For the home mood line. */
export function recentMoods(checkins: Checkin[], asOf: string, n = 7): { date: string; mood: number | null }[] {
  const byDate = new Map(checkins.map((c) => [c.date, c.mood]));
  const out: { date: string; mood: number | null }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = addDays(asOf, -i);
    out.push({ date: d, mood: byDate.get(d) ?? null });
  }
  return out;
}
