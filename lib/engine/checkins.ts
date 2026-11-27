import { isActivityId, type ActivityId } from './activities';

export interface Checkin {
  date: string; // YYYY-MM-DD, Asia/Bangkok calendar date
  mood: number; // 1..5
  activities: ActivityId[];
  note?: string;
  created_at: string;
}

/** One check-in per date; the latest created_at wins. Validates mood and activity ids. */
export function dedupeCheckins(rows: { date: string; mood: number; activities: string[]; created_at: string; note?: string }[]): Checkin[] {
  const byDate = new Map<string, (typeof rows)[number]>();
  for (const r of rows) {
    const prev = byDate.get(r.date);
    if (!prev || r.created_at >= prev.created_at) byDate.set(r.date, r);
  }
  const out = [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  for (const r of out) {
    if (!Number.isInteger(r.mood) || r.mood < 1 || r.mood > 5) throw new Error(`mood must be int 1..5 on ${r.date}`);
    for (const a of r.activities) if (!isActivityId(a)) throw new Error(`unknown activity ${a} on ${r.date}`);
  }
  return out as Checkin[];
}
