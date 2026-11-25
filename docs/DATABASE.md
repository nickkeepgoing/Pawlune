# DATABASE.md

Schema: `supabase/migrations/0001_init.sql` (run it in the Supabase SQL editor or `supabase db push`).

| Table | Purpose | Notes |
|---|---|---|
| profiles | consent + age confirm + demo flag | created by trigger on sign-up |
| pets | current pet and past pets | `is_current=false` rows are memories; engine ignores them |
| checkins | one per user per date | upsert on `(user_id, checkin_date)`; activities restricted to the 8 ids |
| who5_entries | WHO-5 answers | `raw` and `pct` are generated columns — must equal engine output |

Rules
- Dates are Asia/Bangkok calendar dates computed on the server, never the client clock.
- Reads for the engine: `select checkin_date, mood, activities, created_at from checkins where user_id = auth.uid()`.
  Do not select `note` for engine or AI.
- Delete all data: server route using the service role → delete storage objects under `{uid}/`, then
  `auth.admin.deleteUser(uid)` (cascades every table).
- Demo account: seed from `fixtures/demo-seed.json` with `profiles.is_demo = true` (script in Phase 6).
