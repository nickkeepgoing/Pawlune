# Phase 6 — Demo account, learn page, optional AI summary, polish, deploy

Read: CLAUDE.md, docs/PITCH.md, docs/EVIDENCE.md, docs/DATABASE.md.

Tasks
1. `scripts/seed-demo.ts` (server, service role): create/refresh a demo user from `fixtures/demo-seed.json`
   (pet, past pet, 60 check-ins, WHO-5), set `profiles.is_demo = true`. Persistent "ข้อมูลจำลอง" badge for that account.
   Verify the Patterns screen shows exactly the demo numbers in PITCH.md.
2. `/learn`: build exactly the "Learn page" section of DESIGN_BRIEF.md — original SVG dog + cat with CSS idle animations,
   tap → hop + heart, 4-card scroll story, reduced-motion support. Facts only from EVIDENCE.md #1–3, each with its link.
3. OPTIONAL (only if 1–2 are done and stable): weekly summary card. Server route sends ONLY engine JSON (no notes,
   no raw check-ins) with a system prompt: use only given numbers, no advice, no medical words, no causal words,
   ≤ 3 sentences Thai. Post-check the output against the banned-word list; on fail show nothing.
   Hidden when AI env vars are empty.
4. Polish: loading/empty/error states in Thai, keyboard focus, 44 px targets, Lighthouse a11y ≥ 90 on /checkin and /patterns.
5. Deploy to Vercel; set Supabase redirect URLs; run the demo script from PITCH.md on a real phone twice.

Done when
- Demo script runs end-to-end twice without errors on the deployed URL.
- `npm run test`, `npm run test:ref`, `npm run build` all green.
