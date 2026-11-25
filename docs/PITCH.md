# PITCH.md

## One line
"สัตว์เลี้ยงอาจเป็นส่วนหนึ่งของวันที่ดีขึ้น แต่เราเคยสังเกตจริงๆ ไหมว่ากิจกรรมไหนไปด้วยกันกับวันที่เรารู้สึกดี?"

## 3-minute structure
1. Problem (30 s): people believe pets help the mind, but research is split (EVIDENCE #1: 17 / 19 / 13 / 5 of 54).
   Pet care also has burdens (EVIDENCE #3). Owners have no simple way to see their own picture.
2. Product (30 s): 10-second check-in with joy AND burden chips, WHO-5 every 14 days, Personal Patterns, report you own.
3. Demo (60 s): below.
4. Honesty + safety (30 s): no causal words, both group sizes shown, "ยังบอกไม่ได้ว่าอะไรเป็นสาเหตุ",
   help button always on, PDPA consent, delete-all.
5. Why us / next (30 s): validation results from our 5 testers (fill in real numbers only), next: teen version with guardian consent.

## Demo script (account seeded from fixtures/demo-seed.json — badge "ข้อมูลจำลอง" visible)
Numbers below are engine output (fixtures/expected.json → demo). Re-check after any seed change.
1. Patterns: "ใน 36 วันที่มี "พาน้องเดิน" คะแนนอารมณ์เฉลี่ย 3.61 สูงกว่า 24 วันที่ไม่มี (2.92) อยู่ 0.7 คะแนน"
2. Honesty moment A: "เล่นกับน้อง" shows lower (3.11 vs 3.43) BUT the card says it happens with "พาน้องเดิน" on 72% of days
   → "ระบบไม่สรุปมั่ว มันบอกว่าแยกสองอย่างนี้ไม่ได้"
3. Honesty moment B: "อาบน้ำ/แปรงขน" shows +0.31 — yet our simulator gave grooming NO effect.
   → "นี่คือเหตุผลที่เราไม่เคยพูดว่า 'ทำให้' ตัวเลขแบบนี้เกิดจากความบังเอิญได้"
4. Burden: "ตื่นกลางคืนเพราะน้อง" — preliminary, 8 vs 52 days, lower by 0.7.
5. Live: a judge does a check-in on the phone → home updates, streak +1.
6. Report: generate PDF → show footer "ไม่ใช่การประเมินทางคลินิก".

## Judge Q&A
- ต่างจาก Daylio ยังไง? → Daylio is a general mood diary (and it does correlate activities — we checked).
  We are pet-specific: joy AND burden of pet care, WHO-5 validated 2-week scale, pet timeline, non-clinical report, Thai, help always on.
- พิสูจน์ได้ไหมว่าสัตว์ช่วย? → No, and we say so in-app. We show patterns in your own data with sample sizes.
- ทำไม 7 วัน? → A product threshold so cards don't appear from 2–3 days. Not statistical proof; the info page says so.
- ข้อมูลอ่อนไหว? → Explicit consent, RLS, private photos, notes never sent to AI, delete-all.
- ถ้าผู้ใช้ไม่ไหว? → Help button on every screen, 1323; gentle cards never gate it; no AI in that flow.
- ทำไมไม่ทำสำหรับวัยรุ่น? → Consent for minors needs guardians; MVP is 20+, teen version next.
- โมเดลธุรกิจ? → (optional) free core; partnerships with pet clinics/shelters for adopter well-being programs — say "idea", not "plan".
