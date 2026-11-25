import { ACTIVITIES, ACTIVITY_IDS, COOCCUR_FLAG, MIN_DAYS_PER_GROUP, STRONG_DAYS_PER_GROUP, type ActivityId, type ActivityKind } from "./activities";
import type { Checkin } from "./checkins";
import { mean, roundHalfUp } from "./round";

export type PatternStatus = "insufficient" | "preliminary" | "more_data";
export interface Pattern {
  activity: ActivityId;
  label_th: string;
  kind: ActivityKind;
  n_with: number;
  n_without: number;
  status: PatternStatus;
  need_more_with?: number;
  need_more_without?: number;
  mean_with?: number;
  mean_without?: number;
  diff?: number;
  diff_display?: number;
  direction?: "higher" | "lower" | "same";
  often_together: { with: ActivityId; share: number }[];
}

export function pattern(checkins: Checkin[], act: ActivityId): Pattern {
  const withM = checkins.filter((c) => c.activities.includes(act)).map((c) => c.mood);
  const withoutM = checkins.filter((c) => !c.activities.includes(act)).map((c) => c.mood);
  const nW = withM.length, nWo = withoutM.length;
  const res = { activity: act, label_th: ACTIVITIES[act].th, kind: ACTIVITIES[act].kind, n_with: nW, n_without: nWo } as Pattern;
  if (Math.min(nW, nWo) < MIN_DAYS_PER_GROUP) {
    res.status = "insufficient";
    res.need_more_with = Math.max(0, MIN_DAYS_PER_GROUP - nW);
    res.need_more_without = Math.max(0, MIN_DAYS_PER_GROUP - nWo);
  } else {
    const mw = mean(withM)!, mwo = mean(withoutM)!;
    res.status = Math.min(nW, nWo) >= STRONG_DAYS_PER_GROUP ? "more_data" : "preliminary";
    res.mean_with = roundHalfUp(mw, 2);
    res.mean_without = roundHalfUp(mwo, 2);
    res.diff = roundHalfUp(mw - mwo, 2);
    res.diff_display = roundHalfUp(Math.abs(mw - mwo), 1);
    res.direction = mw > mwo ? "higher" : mw < mwo ? "lower" : "same";
  }
  res.often_together = [];
  if (nW) {
    for (const other of ACTIVITY_IDS) {
      if (other === act) continue;
      const both = checkins.filter((c) => c.activities.includes(act) && c.activities.includes(other)).length;
      const share = both / nW;
      if (share >= COOCCUR_FLAG) res.often_together.push({ with: other, share: roundHalfUp(share, 2) });
    }
  }
  return res;
}

export const allPatterns = (checkins: Checkin[]) =>
  Object.fromEntries(ACTIVITY_IDS.map((a) => [a, pattern(checkins, a)])) as Record<ActivityId, Pattern>;

/** USER_FLOW sort: non-insufficient by |diff| desc, then insufficient by fewest days needed. */
export function sortPatterns(ps: Pattern[]): Pattern[] {
  const need = (p: Pattern) => (p.need_more_with ?? 0) + (p.need_more_without ?? 0);
  const ready = ps.filter((p) => p.status !== "insufficient").sort((a, b) => Math.abs(b.diff!) - Math.abs(a.diff!));
  const notYet = ps.filter((p) => p.status === "insufficient").sort((a, b) => need(a) - need(b));
  return [...ready, ...notYet];
}
