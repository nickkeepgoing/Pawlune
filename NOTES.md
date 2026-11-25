# NOTES.md — decisions and open items

## Built (all phases 0–6 in one session, at the user's request)
Engine (`lib/engine`, 9 tests vs `fixtures/expected.json`), auth, onboarding, check-in, home, patterns (+info),
WHO-5 (+timeline), help sheet, gentle cards, report, settings/delete-all, pets & memories, learn page, demo seed script.

## Decisions (safer option chosen where docs were ambiguous)
- **Next.js 16**: `middleware.ts` is now `proxy.ts`. `cacheComponents` is OFF — every signed-in page reads private
  per-user data, so nothing is cached or prerendered (`connection()` in `lib/guard.ts`).
- **PDF**: browser print (`window.print()` + print CSS) instead of @react-pdf — LOW_QUOTA_PLAN cut #2. Thai renders with
  the page's Anuphan font; the user picks "Save as PDF". Export consent dialog shows every time.
- **Insufficient-card "อีก N วัน"** = the larger of need_more_with / need_more_without.
- **"same" direction copy**: `…คะแนนอารมณ์เฉลี่ย X เท่ากันกับ N วันที่ไม่มี (Y)`.
- **Gentle card on /wellbeing** shows only on the result screen right after a WHO-5 with raw < 12; on /home for
  `lowMoodStreak ≥ 5`. Dismiss is per day (localStorage). Help button is never gated.
- **Age "no"**: friendly stop screen; nothing stored. Consent (already given) stays; user can delete in Settings later.
- **1323 copy**: removed "24 ชั่วโมง" from the landing footer until the team verifies it (EVIDENCE #6).
- **AI weekly summary (Phase 6 optional)**: NOT built. It is optional and hidden without env vars anyway.
- **Database types** are hand-written in `lib/database.types.ts`; regenerate once the Supabase project exists.

## Still needs humans (cannot be done by code)
1. Create Supabase project → run `supabase/migrations/0001_init.sql` in the SQL editor → enable Google provider →
   add redirect URLs `http://localhost:3000/auth/callback` and the Vercel URL `/auth/callback`.
2. Copy `.env.example` → `.env.local` and fill it (service role key stays server-only).
3. `content/who5-th.json` — validated Thai WHO-5 text, typed by the team (never AI). Until then: English + banner.
4. Verify hotlines 1323 / 1669 on official sites.
5. `npm run seed:demo` (needs DEMO_EMAIL / DEMO_PASSWORD in `.env.local`) → check /patterns shows the PITCH.md numbers.
6. Deploy to Vercel, then run the PITCH demo script twice on a real phone; Lighthouse a11y on /checkin and /patterns.
7. RLS check with two accounts (Phase 2 "done when").
