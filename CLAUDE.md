# CLAUDE.md — Pawlune

Read this file fully before every task. Then read the doc named in the current prompt.

## What we are building
A Thai-first web app for pet owners (dog/cat) to check in daily (mood 1–5 + what they did with their pet),
take the WHO-5 well-being questionnaire every 14 days, and see **Personal Patterns**: which pet activities —
including the burdens of pet care — tend to go together with their better or worse days.
Hackathon: ToBeIT'70, theme Healthy Living. MVP must be demo-ready in 2 days.

## Stack (do not change)
- Next.js (App Router, TypeScript) + Tailwind CSS, deployed on Vercel
- Supabase: Auth (Google + email/password), Postgres with RLS, Storage (private bucket `pet-photos`), `@supabase/ssr`
- Vitest for the engine
- Optional AI (weekly summary only, Phase 6): provider set by env vars, called from a server route

## Positioning (Nov 2026)
Tagline "More Than Adoption. A Better Bond." Problem: the Adoption Compatibility Gap (information, readiness, adjustment, follow-up). MVP = cats in Bangkok and surroundings, dogs still supported. Matching is rule-based, never call it AI. Never claim reduced return rates (no pilot data), never say 14 days guarantees compatibility, never position as mental-health treatment. Animal welfare counts as much as human wellbeing. See docs/AUDIT_2026-11.md.

## Responsive
Pages inside (app) are narrow (40rem) by default; add class `wide` to a page root to use the full shell width and lay it out with grids. Bottom nav below lg, TopNav in the header from lg.

## HARD RULES (breaking any of these = the task is not done)
1. **The engine does all math.** All numbers come from `lib/engine/*` (pure TS, no I/O). It must match
   `fixtures/expected.json` exactly. `tools/reference_engine.py` is the source of truth. AI never computes or invents numbers.
2. **Never claim cause.** UI copy says "ไปด้วยกันกับ" / "ในวันที่…คะแนนเฉลี่ยสูงกว่า". Never "ทำให้", "ช่วยเพิ่ม", "รักษา", "บำบัด".
   Exception: /learn and /learn/therapy may use "บำบัด" only to describe the professional service (animal-assisted therapy), never about the app or the user's own pet.
   Every Pattern card shows `n_with` AND `n_without`, its status, and the limitation line from docs/ENGINE.md.
3. **No diagnosis.** Never show "ซึมเศร้า", "โรค", "ผิดปกติ", risk levels, or clinical interpretation. Words to use:
   "คะแนนสุขภาวะทางใจ" (WHO-5), "อารมณ์วันนี้" (daily mood).
4. **Help is always reachable.** A "ต้องการคนรับฟัง" button is visible on every signed-in screen and opens the help sheet
   (docs/SAFETY_PRIVACY.md). Gentle cards are extra nudges; they never gate the button. No AI in the help flow.
5. **WHO-5 text is not ours to write.** Use the validated Thai version text placed by the team in
   `content/who5-th.json`. If that file is missing, show the official English items and a visible TODO banner.
   Never let Claude or any AI translate WHO-5.
6. **Privacy (Thai PDPA — mood/well-being = sensitive data).** Explicit consent before any data is stored; separate
   consent for PDF export; RLS on every table; photos in a private bucket; "ลบข้อมูลทั้งหมด" deletes everything.
   Never send notes or raw check-ins to AI. No analytics/tracking scripts.
7. **MVP audience is 20+** (age of majority). Onboarding asks the user to confirm. No birthdate stored.
8. **Demo data is labelled.** Any account seeded from `fixtures/demo-seed.json` shows a persistent "ข้อมูลจำลอง" badge.
9. **Secrets server-only.** Service role key and AI key never reach the browser.
10. **Thai first.** All UI copy in Thai; code, comments and commits in English.
11. **Design:** use the `frontend-design` skill. Follow docs/DESIGN_BRIEF.md. Mobile-first (375 px), accessible
    (contrast AA, focus states, 44 px tap targets).
12. **Follow docs/USER_FLOW.md** screen by screen. Do not invent screens or features not in docs/PRD.md.

## Working style
- One phase per session. Finish the phase's "Done when" checklist before stopping.
- Run `npm run test` (engine) and `npm run build` before saying a phase is done.
- If a doc is ambiguous, choose the safer option and write it in `NOTES.md`.
