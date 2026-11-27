# Pawlune — Copilot instructions

## Project shape

Pawlune is a Thai-first Next.js App Router app for pet well-being and a 14-day foster-to-adopt trial with shelters. Cats are the MVP focus; dogs remain supported. The main journey is preference entry and rule-based matching (`/adopt`), a trial request with explicit data-sharing consent, shelter approval, day-one WHO-5/ST-5, daily check-ins, a day-14 decision, and monthly feedback after adoption. `handoff/08_CODE_STATUS.md` describes the implemented trial flow; use `docs/PRD.md` and `docs/USER_FLOW.md` for product constraints and the existing check-in/well-being flows.

Signed-in routes are grouped in `app/(app)/`. `lib/guard.ts` and `lib/data.ts` resolve the user and onboarding state; the shared layout supplies navigation, the always-visible help button, and the demo badge. Mutations live in route-specific `actions.ts` files. `lib/trialData.ts` loads trial, shelter, and feedback data. `lib/trialAdmin.ts` performs privileged trial state changes on the server after checking the relevant user or shelter authorization. Supabase schema and RLS are in `supabase/migrations/`; apply migrations in the sequence documented by `handoff/08_CODE_STATUS.md`.

Pure calculations live in `lib/engine/`. `match.ts` performs transparent, rule-based matching and returns fit reasons and cautions; allergy and safety constraints can exclude a match. The TS engine is checked against fixtures, with `tools/reference_engine.py` as the calculation reference. Keep Bangkok dates in the server-side date helpers and pass dates into pure engine functions.

## Commands

- `npm run dev` — start Next.js locally.
- `npm run build` — production build; `npm run start` serves it.
- `npm test` — run the Vitest suite.
- `npx vitest run lib/engine/__tests__/trial.test.ts` — run the trial/matching/ST-5 test file.
- `npx vitest run lib/engine/__tests__/engine.test.ts -t "test name"` — run one matching engine test.
- `npm run test:engine` — run the fixture-based engine checker.
- `npm run typecheck` — run TypeScript without emitting files.
- `npm run test:ref` — check the Python reference engine; requires Python 3.
- `npm run seed:demo` — seed demo and shelter accounts; requires the local environment variables.

## Product and data constraints

- Keep matching rule-based, explainable, and non-guaranteeing. Never describe it as AI or claim it guarantees compatibility or reduces returns. Preserve allergy/safety exclusions and show fit reasons and cautions.
- The trial applicant explicitly consents before sharing readiness and feedback with the shelter. Shelter staff must only see data authorized for their shelter; do not expose the user's well-being scores or private check-ins to shelters. Keep trial state changes behind `lib/trialAdmin.ts` and its authorization checks.
- Well-being scores are self-reported, non-clinical information. Do not diagnose, use risk labels, or claim cause or treatment. Keep the help button reachable throughout signed-in screens; follow `docs/SAFETY_PRIVACY.md`.
- Use the team-approved questionnaire text from `content/` verbatim. Never generate or translate WHO-5 or ST-5 wording with AI. Preserve the English fallback and visible TODO when validated Thai WHO-5 text is unavailable.
- Require consent before storing sensitive well-being data; retain RLS on every table and keep service-role credentials server-only. Never add analytics/tracking or send private notes/raw check-ins to AI.
- Keep onboarding at 20+ without collecting birthdates. Demo data must remain clearly marked with the persistent “ข้อมูลจำลอง” badge.
- Follow `CLAUDE.md`, `docs/PRD.md`, `docs/SAFETY_PRIVACY.md`, and the feature-specific handoff/docs. If route docs conflict with the implemented trial flow, check `handoff/08_CODE_STATUS.md` and the relevant route/action and migration before changing behavior.
- User-facing copy is Thai; code, comments, and commits are English.

## UI conventions

Follow `docs/DESIGN_BRIEF.md`: calm, warm, and private, with the established cream/sage/jade/bark palette and no neon or gradient text. The signed-in shell is narrow by default; add `wide` to a page root for full-width grid layouts. Keep controls keyboard-accessible, maintain visible focus and AA contrast, and respect reduced-motion preferences.
