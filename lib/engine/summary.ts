import type { Checkin } from "./checkins";
import { addDays, mean, roundHalfUp } from "./round";

export interface Summary { days_logged: number; mean_mood: number | null; streak: number }

export function summary(checkins: Checkin[], asOf: string): Summary {
  const dates = new Set(checkins.map((c) => c.date));
  let d = dates.has(asOf) ? asOf : addDays(asOf, -1);
  let streak = 0;
  while (dates.has(d)) { streak++; d = addDays(d, -1); }
  const m = mean(checkins.map((c) => c.mood));
  return { days_logged: checkins.length, mean_mood: m === null ? null : roundHalfUp(m, 2), streak };
}

/** Last 7 calendar days ending at asOf; null where not logged. For the home sparkline. */
export function last7(checkins: Checkin[], asOf: string): { date: string; mood: number | null }[] {
  const byDate = new Map(checkins.map((c) => [c.date, c.mood]));
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(asOf, i - 6);
    return { date, mood: byDate.get(date) ?? null };
  });
}
