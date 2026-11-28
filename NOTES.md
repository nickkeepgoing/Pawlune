# NOTES.md — decisions where the docs were ambiguous (chose the safer option)

- Status chip `more_data` reads "แนวโน้มจากข้อมูล 14 วันขึ้นไป" (the threshold), not the actual group size, so it never looks like a bigger claim.
- PDF export uses the browser's print-to-PDF (LOW_QUOTA_PLAN cut #2): Thai renders with the page font, no PDF library needed.
- Under-20 answer deletes the just-created account (consent included) and signs out → "nothing stored". Needs the service-role key on the server.
- Pattern copy for `insufficient` with only one side missing: "ต้องมีวันที่ไม่ได้ทำอีก N วัน".
- Landing hero card is computed by the engine from fixtures/demo-seed.json and labelled "ตัวอย่างจากข้อมูลจำลอง".
- Copy contains "รักษา" once (landing: "เราไม่บอกว่าสัตว์รักษาใจ") and "บำบัด" once (/learn: "เลี้ยงสัตว์ ไม่เท่ากับ สัตว์บำบัด"), both verbatim from DESIGN_BRIEF and both negations. Pattern/AI/PDF text is checked against the banned list.
- Added from 06_REVIEW: "เหมือนครั้งก่อน" shortcut on check-in, "สัปดาห์นี้กับน้อง" counts on home while patterns need 7 days, selected chips show a jade border + check icon (sage fill alone is 1.6:1).
- AI weekly summary (optional): only engine numbers are sent; output is dropped if it contains a banned word or any number not present in the input.
- Demo seed shifts all dates so the last seeded day is yesterday; pattern numbers are unchanged by a uniform shift (script verifies against expected.json).
- Pinned Next.js 15 (middleware.ts). If create-next-app gives you Next 16, keep package.json as is.
- Added F11–F13 (team request 26 Nov): /learn/therapy, memories section in report (off by default), private photo album. Needs migration `0002_photos.sql`.
- Album photos are stored flat as `{uid}/p-<uuid>.jpg` so delete-all (lists `{uid}/`) removes them too.
- Consent text now mentions album photos and memories; consent_version bumped to 'v2' for new users.
- /learn/therapy avoids the word "ซึมเศร้า" (rule 3) and says "ผู้ป่วยจิตเวช" instead.
- Login by username: the server looks up the email with the service role, then signs in by email. Wrong username and wrong password give the same message. Forgot-password always answers the same.
- Passwords: minimum 8 characters (set the same in Supabase → Authentication → Policies if you want it enforced there too).
- Default avatar = one of 6 original animal faces chosen from the user id (stable). Picking an animal removes the uploaded photo.
- Bottom nav: หน้าแรก · บันทึก · อัลบั้ม · รูปแบบ · สุขภาวะ. Settings moved to the gear icon in the header.

## Pivot 26 Nov (evening): main feature = ทดลองรับเลี้ยง 14 วัน
- Album removed (migration 0004 drops `photos`; 0002 deleted). AI summary and PDF removed; report = image only.
- Wording: "ทดลองรับเลี้ยงเพื่อนจากศูนย์", never "สัตว์บำบัด" for shelter animals (they are not trained therapy animals).
- Tests: WHO-5 + ST-5 only. 2Q/9Q not included: 9Q asks about self-harm and needs clinical follow-up the app cannot provide.
- ST-5 instruction line is our wording of the published 2–4 week time frame; items/options/cut-offs verbatim.
- Matching is rules, not a black box: allergy, species and fence needs exclude; other fields add a ✓ reason or a ! caution.
- Shelter sees: name/username, readiness answers, trial feedback. Never mood, notes, WHO-5, ST-5. Consent checkbox on apply.
- Baseline tests count if taken from 14 days before start up to day 3; "after" = taken on/after day 14.
- Return: trial pet becomes a memory (pets.is_current=false, past_period "ทดลองเลี้ยง …"), profile.seeking_pet=true, animal back to available. Who the animal goes to next is the shelter's decision.
- Shelter animals in the demo are fictional and labelled; the real BKK shelter is shown only as a sourced contact card.
- Demo account: has 60 days of logs for Patterns plus a trial that started 13 days ago (today = day 14). Shelter staff demo login: username `shelter`.
- `is_shelter` / `is_demo` can only be changed with the service role (trigger in 0004). To make a real staff account: run `update profiles set is_shelter = true where username = '...'` in the SQL editor.

## Hosting region
Supabase is in ap-northeast-2 (Seoul), so `vercel.json` pins server functions to `icn1`. If the database ever moves, move this with it.

## Help button
"ต้องการคนรับฟัง" is a floating button on every signed-in screen (CLAUDE.md rule 4), bottom right. On phones the
check-in save button leaves room beside it; any new bottom-anchored control must do the same.
