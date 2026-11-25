# Phase 5 — Help, report, settings, pets & memories

Read: CLAUDE.md, docs/SAFETY_PRIVACY.md (all), docs/USER_FLOW.md (Flows 5–7).

Tasks
1. Global "ต้องการคนรับฟัง" button + help sheet (exact copy, `tel:` links). No AI, no logging.
2. Gentle card component (WHO-5 raw < 12, or `lowMoodStreak` ≥ 5) → opens help sheet; dismissible per day.
3. `/report`: user ticks sections (pet info, mood chart, WHO-5 timeline, patterns, notes-off by default) → export consent
   dialog → PDF generated in the browser (e.g. @react-pdf/renderer) with Thai font embedded and the footer from SAFETY_PRIVACY.
   Only engine numbers and copy; no interpretation.
4. `/settings`: display name, export, "ลบข้อมูลทั้งหมด" (type "ลบ" to confirm → server route with service role deletes photos
   then the auth user), sign out.
5. `/pets`: current pet (days since adoption) + "ความทรงจำ" past pets CRUD with the note "ไม่นำไปคำนวณรูปแบบ".

Done when
- Help button visible on every signed-in route (check each route in USER_FLOW).
- Delete-all leaves zero rows and zero photos for that user; signing in again starts onboarding.
- PDF renders Thai correctly and contains no word from the banned list in CLAUDE.md rule 2–3.
