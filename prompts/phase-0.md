# Phase 0 — Project setup

Read: CLAUDE.md, README.md, docs/DESIGN_BRIEF.md.

Tasks
1. Create a Next.js app (App Router, TypeScript, Tailwind, ESLint) in this folder without deleting existing files.
2. Add `@supabase/supabase-js`, `@supabase/ssr`, `vitest`. Scripts: `test` (vitest run), `test:ref`
   (`python3 tools/reference_engine.py --check`).
3. Supabase clients: `lib/supabase/server.ts`, `lib/supabase/client.ts`, middleware that refreshes the session.
4. Fonts per DESIGN_BRIEF (Anuphan for Thai + one distinct Latin/number face) via `next/font`.
   Use the frontend-design skill to set design tokens (colors, type scale, radius, spacing) in Tailwind config.
5. `lib/time.ts`: `todayInBangkok(): string` (YYYY-MM-DD, server side) — the only source of "today".
6. Placeholder pages for every route in docs/USER_FLOW.md (title only) so navigation works.

Done when
- `npm run build` passes, `npm run test` runs (0 tests is fine), `npm run test:ref` prints "up to date".
- `.env.local` is git-ignored; no secret is imported in a client component.
