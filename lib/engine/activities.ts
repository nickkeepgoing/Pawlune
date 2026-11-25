// Fixed MVP activity list (docs/ENGINE.md). Mirrors tools/reference_engine.py.
export const ACTIVITIES = {
  walk: { th: "พาน้องเดิน", kind: "joy" },
  play: { th: "เล่นกับน้อง", kind: "joy" },
  cuddle: { th: "นอนกอด/อยู่ใกล้น้อง", kind: "joy" },
  groom: { th: "อาบน้ำ/แปรงขน", kind: "joy" },
  train: { th: "ฝึกน้อง", kind: "joy" },
  pet_sick: { th: "น้องป่วย/พาไปหาหมอ", kind: "burden" },
  night_wake: { th: "ตื่นกลางคืนเพราะน้อง", kind: "burden" },
  pet_cost: { th: "มีค่าใช้จ่ายเรื่องน้อง", kind: "burden" },
} as const;

export type ActivityId = keyof typeof ACTIVITIES;
export type ActivityKind = "joy" | "burden";
export const ACTIVITY_IDS = Object.keys(ACTIVITIES) as ActivityId[];

export const isActivityId = (x: string): x is ActivityId => x in ACTIVITIES;

// Product thresholds, NOT statistical guarantees.
export const MIN_DAYS_PER_GROUP = 7;
export const STRONG_DAYS_PER_GROUP = 14;
export const COOCCUR_FLAG = 0.7;
export const WHO5_DUE_DAYS = 14;
export const WHO5_GENTLE_RAW_BELOW = 12;
export const LOW_MOOD_MAX = 2;
export const LOW_MOOD_STREAK = 5;
