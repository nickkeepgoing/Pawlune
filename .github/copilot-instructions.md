# Paw Diary — Copilot instructions

## Project shape

Paw Diary is a Thai-first Next.js App Router app for daily pet-related mood check-ins, WHO-5 well-being entries, and personal activity patterns. The UI lives in `app/` and shared UI in `components/`. Signed-in screens are grouped under `app/(app)/`; their layout uses `lib/guard.ts` to require a completed onboarding state and provides the shared header and navigation.

Server actions in `app/actions.ts` handle writes and re-check the user's session and onboarding stage. `lib/data.ts` contains server-only database loaders; `lib/supabase/` separates server, browser, and admin clients. Supabase is the persistence layer, with the schema and row-level security policies in `supabase/migrations/`. Private pages must remain request-specific; `lib/guard.ts` uses `connection()` to prevent private data from being prerendered or cached.

All product metrics belong to the pure TypeScript functions in `lib/engine/`. The app loads data through `lib/data.ts`, passes it to the engine, and renders its results. The engine is checked against `fixtures/expected.json`; `tools/reference_engine.py` is the calculation source of truth. `lib/time.ts` is the server-side source of the Asia/Bangkok calendar date. Optional weekly AI summaries may receive aggregated engine output only; the AI must never calculate, alter, or invent metrics.

## Commands

- `npm run dev` — start the local Next.js development server.
- `npm run build` — production build; `npm run start` serves that build.
- `npm run lint` — run ESLint.
- `npm run test` — run the Vitest suite.
- `npx vitest run lib/engine/__tests__/engine.test.ts` — run the engine test file.
- `npx vitest run lib/engine/__tests__/engine.test.ts -t "test name"` — run a matching test by name.
- `npm run test:ref` — check the Python reference engine against the expected fixtures.
- `npm run seed:demo` — seed demo data; requires the local environment configured for the demo account.

## Product and data invariants

- Follow `docs/PRD.md` and `docs/USER_FLOW.md`; keep screens and behaviors within their documented scope. For ambiguous decisions, choose the safer option and record it in `NOTES.md`.
- Read `docs/ENGINE.md` before changing metric calculations or Pattern copy. Preserve the reference fixtures exactly; pass dates into pure engine functions rather than reading the current time inside them.
- Describe patterns as associations, never causes. Use wording such as “ไปด้วยกันกับ” and “ในวันที่…คะแนนเฉลี่ยสูงกว่า”; never imply that an activity treats, fixes, or causes a mood change. Every Pattern card must show both `n_with` and `n_without`, its status, and the limitation line: `เป็นความสัมพันธ์ในข้อมูลของคุณ ยังบอกไม่ได้ว่าอะไรเป็นสาเหตุ`.
- Do not diagnose or clinically interpret results. Use “อารมณ์วันนี้” for daily mood and “คะแนนสุขภาวะทางใจ” for WHO-5; avoid diagnostic or risk labels.
- Keep “ต้องการคนรับฟัง” reachable on every signed-in screen. Follow `docs/SAFETY_PRIVACY.md`; gentle cards do not gate help, and the help flow must not use AI.
- Use the validated Thai WHO-5 items in `content/who5-th.json` verbatim. If that file is absent, use the official English items and show a visible TODO; do not generate or translate the questionnaire.
- Mood and well-being data are sensitive. Require explicit consent before storing data and separate consent for each PDF export. Keep RLS on every table, pet photos in the private `pet-photos` bucket, and service-role/AI credentials server-only. Never send notes or raw check-ins to AI, and do not add analytics or tracking.
- Do not store a birthdate; onboarding only confirms the user is 20 or older. Accounts seeded from `fixtures/demo-seed.json` must retain the visible “ข้อมูลจำลอง” badge.
- Keep user-facing copy in Thai and code, comments, and commits in English.

## UI conventions

Follow `docs/DESIGN_BRIEF.md` and use the `frontend-design` skill when available. Keep the interface calm, warm, mobile-first (375 px), and accessible: AA contrast, visible focus, and 44 px tap targets. Preserve the custom keyboard-accessible mood faces, neutral burden-activity styling, honest Pattern cards, and persistent demo badge. Respect reduced-motion preferences for animations.

## Phase workflow

Work on one phase at a time and use that phase's documented “Done when” checklist. Before calling a phase complete, run `npm run test` and `npm run build`.
