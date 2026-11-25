import type { Checkin } from "./checkins";
import { daysBetween, mean, roundHalfUp } from "./round";

/** Week 1 = first 7 days from the first logged date (not ISO weeks). Input must be deduped + sorted. */
export function weeklyTimeline(checkins: Checkin[]) {
  if (!checkins.length) return [];
  const start = checkins[0].date;
  const buckets = new Map<number, number[]>();
  for (const c of checkins) {
    const w = Math.floor(daysBetween(start, c.date) / 7) + 1;
    buckets.set(w, [...(buckets.get(w) ?? []), c.mood]);
  }
  return [...buckets.entries()].sort((a, b) => a[0] - b[0])
    .map(([week, v]) => ({ week, n: v.length, mean_mood: roundHalfUp(mean(v)!, 2) }));
}
