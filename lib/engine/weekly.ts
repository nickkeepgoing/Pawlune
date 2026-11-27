import type { Checkin } from './checkins';
import { daysBetween } from './dates';
import { mean, roundHalfUp } from './round';

export interface WeekPoint { week: number; n: number; mean_mood: number }

/** Week 1 = first 7 days counted from the first logged date (not ISO weeks). */
export function weeklyTimeline(checkins: Checkin[]): WeekPoint[] {
  if (!checkins.length) return [];
  const start = checkins[0].date;
  const buckets = new Map<number, number[]>();
  for (const c of checkins) {
    const w = Math.floor(daysBetween(start, c.date) / 7) + 1;
    if (!buckets.has(w)) buckets.set(w, []);
    buckets.get(w)!.push(c.mood);
  }
  return [...buckets.entries()].sort((a, b) => a[0] - b[0])
    .map(([week, v]) => ({ week, n: v.length, mean_mood: roundHalfUp(mean(v)!, 2) }));
}
