# ENGINE.md — rules every number must follow

Source of truth: `tools/reference_engine.py`. TS port lives in `lib/engine/` (pure functions, no I/O, no Date.now()
inside — pass `asOf` in). Tests in `lib/engine/__tests__/` load `fixtures/*.json` and compare to `fixtures/expected.json`.

## Data
- `Checkin { date: 'YYYY-MM-DD' (Asia/Bangkok), mood: 1..5 int, activities: ActivityId[], note?: string, created_at }`
- One check-in per date. If several rows share a date, the latest `created_at` wins (`dedupeCheckins`).
- Unknown activity id or mood outside 1..5 → throw.

## Activities (fixed list for MVP)
| id | Thai label | kind |
|----|-----------|------|
| walk | พาน้องเดิน | joy |
| play | เล่นกับน้อง | joy |
| cuddle | นอนกอด/อยู่ใกล้น้อง | joy |
| groom | อาบน้ำ/แปรงขน | joy |
| train | ฝึกน้อง | joy |
| pet_sick | น้องป่วย/พาไปหาหมอ | burden |
| night_wake | ตื่นกลางคืนเพราะน้อง | burden |
| pet_cost | มีค่าใช้จ่ายเรื่องน้อง | burden |

## Rounding
`roundHalfUp(x, d) = Math.floor(x * 10^d + 0.5 + 1e-9) / 10^d`. Means and diffs: 2 decimals. `diff_display`: |diff| to 1 decimal.

## Summary
- `days_logged`, `mean_mood` (2 dp), `streak` = consecutive logged days ending at `asOf`
  (or at `asOf − 1` if `asOf` is not logged yet).

## Personal Pattern (per activity A)
- `with` = days containing A; `without` = all other logged days.
- `min(n_with, n_without) < 7` → `status: insufficient`, plus `need_more_with/without`.
- `7 ≤ min < 14` → `preliminary`; `min ≥ 14` → `more_data`.
- When not insufficient: `mean_with`, `mean_without`, `diff = mean_with − mean_without` (2 dp), `diff_display`, `direction`.
- `often_together`: any other activity present on ≥ 70% of A's days → `{with, share}`.
- 7 and 14 are **product thresholds, not statistical significance**. Say so in the UI info sheet.

### Card copy (Thai, exact templates)
- insufficient: `"{label}" — ข้อมูลยังไม่พอ ต้องมีวันที่ทำอีก {need_more_with} วัน และวันที่ไม่ได้ทำอีก {need_more_without} วัน` (omit a part when 0)
- preliminary/more_data, higher: `ใน {n_with} วันที่มี "{label}" คะแนนอารมณ์เฉลี่ย {mean_with} สูงกว่า {n_without} วันที่ไม่มี ({mean_without}) อยู่ {diff_display} คะแนน`
  (means printed with 2 decimals, e.g. 4.00; diff_display with 1 decimal)
- lower: same with `ต่ำกว่า`. same: `…เท่ากัน`.
- Status chip: preliminary = `แนวโน้มเบื้องต้น`, more_data = `แนวโน้มจากข้อมูล {min} วันขึ้นไป`.
- Limitation line (every non-insufficient card): `เป็นความสัมพันธ์ในข้อมูลของคุณ ยังบอกไม่ได้ว่าอะไรเป็นสาเหตุ`
- often_together line: `วันที่มี "{label}" มักมี "{other}" ด้วย ({share×100}% ของวัน) จึงแยกผลสองอย่างนี้ออกจากกันไม่ได้`

## Weekly timeline
Week 1 = the first 7 days counted from the first logged date (not ISO weeks). Each week: `n`, `mean_mood`.

## WHO-5
- 5 answers, each int 0..5 (5 = ตลอดเวลา … 0 = ไม่มีเลย, per validated Thai text). Else throw.
- `raw = sum` (0–25), `pct = raw × 4` (0–100). Display label: "คะแนนสุขภาวะทางใจ {pct}/100".
- Due when never taken or `asOf − last_taken ≥ 14` days.
- `gentle_card = raw < 12` (Thai primary-care cut-off, EVIDENCE.md #4) — only shows a soft invitation card. Never a label.
- A daily check-in never changes WHO-5 values.

## Low-mood nudge
Count consecutive days ending at `asOf` with mood ≤ 2. `≥ 5` → gentle card. The help button is visible regardless.

## Verified expected values (fixtures/checkins-basic.json, asOf 2026-11-16)
- summary: 16 days, mean 3.50, streak 16 (2026-11-16 dedupes to mood 3)
- walk: preliminary, 8 vs 8 days, 4.38 vs 2.63, diff 1.75 → display 1.8
- play: insufficient (2 days), need 5 more; often_together walk 100%
- weekly: W1 3.57 (n7), W2 3.29 (n7), W3 4.00 (n2)
- WHO-5: [5,4,4,3,4] → 20 / 80; [3,3,2,2,2] → 12 / 48, no card; [3,2,2,2,2] → 11 / 44, card
- low-mood fixture → 5 days, card
Hand-check: walk days moods 4,5,4,4,5,4,4,5 = 35/8 = 4.375; others 3,2,3,2,3,3,2,3 = 21/8 = 2.625.
