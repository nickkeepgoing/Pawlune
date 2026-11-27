// Shared engine checks: used by vitest (engine.test.ts) and by `npm run test:engine` (plain tsx, no vitest needed).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ACTIVITY_IDS, allPatterns, cardSentence, containsBanned, dedupeCheckins, lowMoodStreak, oftenTogetherLines, statusChip, summary, weeklyTimeline, who5Due, who5Score } from '../index';

const FIX = join(process.cwd(), 'fixtures');
const load = (f: string) => JSON.parse(readFileSync(join(FIX, f), 'utf8'));

export function computeAll() {
  const basicData = load('checkins-basic.json');
  const cs = dedupeCheckins(basicData.checkins);
  const basic = {
    as_of: basicData.as_of,
    summary: summary(cs, basicData.as_of),
    patterns: allPatterns(cs),
    weekly: weeklyTimeline(cs),
    low_mood: lowMoodStreak(cs, basicData.as_of),
  };
  const w = load('who5-cases.json');
  const who5 = {
    scores: w.score_cases.map((c: { id: string; items: unknown }) => {
      try { return { id: c.id, result: who5Score(c.items) }; } catch { return { id: c.id, error: 'invalid' }; }
    }),
    due: w.due_cases.map((c: { id: string; last_taken: string | null; today: string }) => ({ id: c.id, due: who5Due(c.last_taken, c.today) })),
  };
  const low = load('low-mood.json');
  const low_mood_case = lowMoodStreak(dedupeCheckins(low.checkins), low.as_of);
  const demoData = load('demo-seed.json');
  const dcs = dedupeCheckins(demoData.checkins);
  const demo = {
    summary: summary(dcs, demoData.as_of),
    patterns: allPatterns(dcs),
    who5: demoData.who5.map((x: { taken_on: string; items: number[] }) => ({ taken_on: x.taken_on, ...who5Score(x.items) })),
  };
  return { basic, who5, low_mood_case, demo };
}

export function expected() { return load('expected.json'); }

export function allCopyStrings(): string[] {
  const out: string[] = [];
  const { basic, demo } = computeAll();
  for (const set of [basic.patterns, demo.patterns]) {
    for (const a of ACTIVITY_IDS) {
      const p = set[a];
      out.push(cardSentence(p), ...oftenTogetherLines(p));
      const chip = statusChip(p); if (chip) out.push(chip);
    }
  }
  return out;
}

export const WALK_BASIC = 'ใน 8 วันที่มี "พาน้องเดิน" คะแนนอารมณ์เฉลี่ย 4.38 สูงกว่า 8 วันที่ไม่มี (2.63) อยู่ 1.8 คะแนน';
export { containsBanned };
