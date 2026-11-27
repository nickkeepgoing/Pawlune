// ST-5 แบบประเมินความเครียด (กรมสุขภาพจิต): 5 items × 0..3, total 0..15.
export const ST5_LEVELS = [
  { max: 4, label: 'เครียดน้อย' },
  { max: 7, label: 'เครียดปานกลาง' },
  { max: 9, label: 'เครียดมาก' },
  { max: 15, label: 'เครียดมากที่สุด' },
] as const;
export const ST5_GENTLE_RAW_AT_LEAST = 8;

export interface St5Score { raw: number; level: string; gentle_card: boolean }

export function st5Score(items: unknown): St5Score {
  if (!Array.isArray(items) || items.length !== 5 || !items.every((i) => Number.isInteger(i) && i >= 0 && i <= 3)) {
    throw new Error('ST-5 needs exactly 5 integer answers in 0..3');
  }
  const raw = (items as number[]).reduce((a, b) => a + b, 0);
  return { raw, level: ST5_LEVELS.find((l) => raw <= l.max)!.label, gentle_card: raw >= ST5_GENTLE_RAW_AT_LEAST };
}
