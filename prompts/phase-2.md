# Phase 2 — Database, auth, landing

Read: CLAUDE.md, docs/DATABASE.md, supabase/migrations/0001_init.sql, docs/USER_FLOW.md (Flow 0), docs/DESIGN_BRIEF.md (Landing).

Tasks
1. Apply the migration (tell me the exact steps if you cannot run it). Generate TS types for the tables.
2. Auth: Google OAuth + email/password sign-up/sign-in at `/login`, `/auth/callback`. Thai error messages.
3. Routing guard: signed-out → `/`; signed-in without consent → `/onboarding/consent`; without age confirm → `/onboarding/age`;
   without a current pet → `/onboarding/pet`; else `/home`.
4. Landing page `/` with the frontend-design skill, exactly the sections in DESIGN_BRIEF. No fake testimonials or numbers.

Done when
- New Google user and new email user both reach `/onboarding/consent`.
- With two test accounts, account B cannot read A's rows (try a direct Supabase query from B's session).
