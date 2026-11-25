# SAFETY & PRIVACY

## Help sheet ("ต้องการคนรับฟัง")
- Button visible on every signed-in screen (top-right or floating). Opens a bottom sheet:
  - Title: "อยากคุยกับใครสักคนไหม"
  - Body: "ถ้ารู้สึกหนักใจ คุณไม่ต้องรับมือคนเดียว"
  - Primary: "โทรสายด่วนสุขภาพจิต 1323" → `tel:1323`
  - Secondary: "ถ้ามีอันตรายเร่งด่วน โทร 1669" → `tel:1669`
  - Line: "แอปนี้ไม่ใช่บริการทางการแพทย์ และไม่ได้ประเมินอาการ"
- TEAM TODO before demo: re-confirm both numbers on official sites (EVIDENCE.md #6).
- No AI, no logging of who opened the sheet.

## Gentle cards (never gate anything)
- Trigger: WHO-5 raw < 12, or 5 low-mood days in a row (ENGINE.md).
- Copy: "ช่วงนี้ดูเหมือนจะเป็นช่วงที่ไม่ง่าย ถ้าอยากคุยกับใครสักคน กดตรงนี้ได้เลย" + button → help sheet. Dismissible.
- Never: "คุณอาจเป็น…", risk levels, colors like red alarm, scores in the card.

## Consent (PDPA — well-being data is sensitive)
1. Data consent screen before the first save (checkbox, not pre-ticked). Store `consent_version`, `consented_at`.
   Text explains: what we store (pet info, daily mood, activities, notes, WHO-5), why (to show your own patterns),
   who sees it (only you), how to delete (Settings → ลบข้อมูลทั้งหมด).
2. Age confirm: "ฉันอายุ 20 ปีขึ้นไป" (MVP audience). Under 20 → friendly stop screen, no data stored.
   TEAM TODO: confirm minors' consent rules with a teacher/adviser before any teen version.
3. Export consent: separate dialog each time a PDF is generated; user picks sections (pet, mood chart, WHO-5, patterns).

## Data handling
- RLS: every row `user_id = auth.uid()`. Storage bucket `pet-photos` private, path `{uid}/...`, signed URLs.
- Delete all: removes check-ins, WHO-5, pets, photos, profile, then auth user (server route with service role).
- Notes never leave the database except in the user's own PDF (if they tick it). Notes are never sent to AI.
- AI summary (optional) receives only engine output numbers + activity labels.
- PDF footer: "ข้อมูลบันทึกด้วยตนเอง ไม่ใช่การประเมินหรือวินิจฉัยทางคลินิก"
