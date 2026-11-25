# Phase 3 — Onboarding, check-in, home

Read: CLAUDE.md, docs/USER_FLOW.md (Flows 1–2), docs/SAFETY_PRIVACY.md (Consent), docs/DESIGN_BRIEF.md.

Tasks
1. `/onboarding/consent`: text from SAFETY_PRIVACY, unticked checkbox, saves `consent_version='v1'`, `consented_at`.
2. `/onboarding/age`: "ฉันอายุ 20 ปีขึ้นไป" yes/no. No → friendly stop screen, nothing else stored.
3. `/onboarding/pet`: name, dog/cat/other, photo (upload to `pet-photos/{uid}/…`, resize client-side ≤ 1024 px), adopted_on optional.
4. `/checkin`: pet photo card, 5 mood faces, joy chips, burden chips, collapsible note (≤500 chars), save = upsert on
   `(user_id, checkin_date)` where the date comes from `todayInBangkok()` on the server. Target ≤10 s for a returning user.
5. `/home`: greeting with pet name, today's status (checked-in or CTA), streak and 7-day mood line from the engine,
   "WHO-5 ถึงเวลาแล้ว" banner when `who5Due`, days since adoption if known.

Done when
- Sign-up → first saved check-in in under 60 s on a 375 px phone.
- Checking in twice today updates one row; home numbers equal engine output.
