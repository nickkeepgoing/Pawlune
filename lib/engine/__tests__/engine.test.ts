import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ACTIVITY_IDS, BANNED_WORDS, allPatterns, cardSentence, dedupeCheckins, lowMoodStreak, oftenTogetherLines,
  statusChip, LIMITATION_LINE, summary, weeklyTimeline, who5Due, who5Score,
} from "..";

const fx = (name: string) => JSON.parse(readFileSync(join(__dirname, "../../../fixtures", name), "utf-8"));
const expected = fx("expected.json");

describe("engine matches fixtures/expected.json", () => {
  it("basic", () => {
    const d = fx("checkins-basic.json");
    const cs = dedupeCheckins(d.checkins);
    expect({
      as_of: d.as_of, summary: summary(cs, d.as_of), patterns: allPatterns(cs),
      weekly: weeklyTimeline(cs), low_mood: lowMoodStreak(cs, d.as_of),
    }).toStrictEqual(expected.basic);
  });

  it("who5", () => {
    const d = fx("who5-cases.json");
    const scores = d.score_cases.map((c: { id: string; items: number[] }) => {
      try { return { id: c.id, result: who5Score(c.items) }; } catch { return { id: c.id, error: "invalid" }; }
    });
    const due = d.due_cases.map((c: { id: string; last_taken: string | null; today: string }) => ({ id: c.id, due: who5Due(c.last_taken, c.today) }));
    expect({ scores, due }).toStrictEqual(expected.who5);
  });

  it("low mood", () => {
    const d = fx("low-mood.json");
    expect(lowMoodStreak(dedupeCheckins(d.checkins), d.as_of)).toStrictEqual(expected.low_mood_case);
  });

  it("demo", () => {
    const d = fx("demo-seed.json");
    const cs = dedupeCheckins(d.checkins);
    expect({
      summary: summary(cs, d.as_of), patterns: allPatterns(cs),
      who5: d.who5.map((w: { taken_on: string; items: number[] }) => ({ taken_on: w.taken_on, ...who5Score(w.items) })),
    }).toStrictEqual(expected.demo);
  });

  it("rejects bad input", () => {
    expect(() => dedupeCheckins([{ date: "2026-01-01", mood: 6, activities: [], created_at: "x" }])).toThrow();
    expect(() => dedupeCheckins([{ date: "2026-01-01", mood: 3, activities: ["nap"], created_at: "x" }])).toThrow();
  });
});

describe("copy", () => {
  const basic = allPatterns(dedupeCheckins(fx("checkins-basic.json").checkins));
  const demo = allPatterns(dedupeCheckins(fx("demo-seed.json").checkins));

  it("walk card (basic)", () => {
    expect(cardSentence(basic.walk)).toBe(
      'ใน 8 วันที่มี "พาน้องเดิน" คะแนนอารมณ์เฉลี่ย 4.38 สูงกว่า 8 วันที่ไม่มี (2.63) อยู่ 1.8 คะแนน');
  });

  it("insufficient card (basic play)", () => {
    expect(cardSentence(basic.play)).toBe('"เล่นกับน้อง" — ข้อมูลยังไม่พอ ต้องมีวันที่ทำอีก 5 วัน');
  });

  it("demo pitch numbers", () => {
    expect(cardSentence(demo.walk)).toBe(
      'ใน 36 วันที่มี "พาน้องเดิน" คะแนนอารมณ์เฉลี่ย 3.61 สูงกว่า 24 วันที่ไม่มี (2.92) อยู่ 0.7 คะแนน');
    expect(oftenTogetherLines(demo.play)[0]).toContain("72%");
  });

  it("no banned word in any generated string", () => {
    for (const ps of [basic, demo]) for (const a of ACTIVITY_IDS) {
      const all = [cardSentence(ps[a]), statusChip(ps[a]) ?? "", LIMITATION_LINE, ...oftenTogetherLines(ps[a])].join("\n");
      for (const w of BANNED_WORDS) expect(all).not.toContain(w);
    }
  });
});
