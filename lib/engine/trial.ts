import { addDays, daysBetween } from './dates';
import { mean, roundHalfUp } from './round';
import type { Checkin } from './checkins';

export const TRIAL_DAYS = 14;
export const MONTHLY_DAYS = 30;

/** Day number of the trial (day 1 = start date). */
export function trialDay(start: string, today: string): number { return daysBetween(start, today) + 1; }
export function trialEnd(start: string): string { return addDays(start, TRIAL_DAYS - 1); }
export function decisionOpen(start: string, today: string): boolean { return trialDay(start, today) >= TRIAL_DAYS; }

export function monthlyDue(lastFeedbackOn: string, today: string): boolean { return daysBetween(lastFeedbackOn, today) >= MONTHLY_DAYS; }

export const BASELINE_GRACE_DAYS = 2;

/** "Before" = latest score from 14 days before the start up to day 3 of the trial. "After" = latest taken on/after the last trial day. */
export function beforeAfter<T extends { taken_on: string }>(rows: T[], start: string): { before: T | null; after: T | null } {
  const end = trialEnd(start);
  const sorted = [...rows].sort((a, b) => (a.taken_on < b.taken_on ? -1 : 1));
  const latestBaseline = addDays(start, BASELINE_GRACE_DAYS);
  const before = sorted.filter((r) => r.taken_on <= latestBaseline && daysBetween(r.taken_on, start) <= TRIAL_DAYS).at(-1) ?? null;
  const after = sorted.filter((r) => r.taken_on >= end).at(-1) ?? null;
  return { before, after };
}

/** Mood during the trial window vs the same number of days before it (descriptive only). */
export function trialMood(checkins: Checkin[], start: string) {
  const end = trialEnd(start);
  const pre0 = addDays(start, -TRIAL_DAYS);
  const inT = checkins.filter((c) => c.date >= start && c.date <= end).map((c) => c.mood);
  const pre = checkins.filter((c) => c.date >= pre0 && c.date < start).map((c) => c.mood);
  const r = (xs: number[]) => (xs.length ? roundHalfUp(mean(xs)!, 2) : null);
  return { during: { n: inT.length, mean: r(inT) }, before: { n: pre.length, mean: r(pre) } };
}
