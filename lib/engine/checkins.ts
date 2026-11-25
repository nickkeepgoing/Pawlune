import { isActivityId, type ActivityId } from "./activities";

export interface CheckinInput {
  date: string; // YYYY-MM-DD, Asia/Bangkok
  mood: number;
  activities: string[];
  created_at: string;
  note?: string;
}
export interface Checkin extends CheckinInput {
  activities: ActivityId[];
}

/** One check-in per date; latest created_at wins. Throws on invalid mood/activity. */
export function dedupeCheckins(rows: CheckinInput[]): Checkin[] {
  const byDate = new Map<string, CheckinInput>();
  for (const r of rows) {
    const cur = byDate.get(r.date);
    if (!cur || r.created_at >= cur.created_at) byDate.set(r.date, r);
  }
  const out = [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  for (const r of out) {
    if (!Number.isInteger(r.mood) || r.mood < 1 || r.mood > 5) throw new Error(`mood must be int 1..5 on ${r.date}`);
    for (const a of r.activities) if (!isActivityId(a)) throw new Error(`unknown activity ${a} on ${r.date}`);
  }
  return out as Checkin[];
}
