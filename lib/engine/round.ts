export function roundHalfUp(x: number, d: number): number {
  const m = 10 ** d;
  return Math.floor(x * m + 0.5 + 1e-9) / m;
}

export const mean = (xs: number[]): number | null =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;

// Calendar-date helpers on 'YYYY-MM-DD' strings (UTC math, no clock reads).
const DAY = 86_400_000;
export const toDay = (iso: string) => Date.parse(iso + "T00:00:00Z") / DAY;
export const fromDay = (n: number) => new Date(n * DAY).toISOString().slice(0, 10);
export const addDays = (iso: string, n: number) => fromDay(toDay(iso) + n);
export const daysBetween = (from: string, to: string) => toDay(to) - toDay(from);
