# DATABASE.md

Apply migrations in order: `0001_init.sql` → `0003_username_avatar.sql` → `0004_trial.sql` → `0005_cat_first.sql` → `0006_grants.sql`. The final migration grants PostgREST table privileges; RLS policies remain the authorization boundary.

| Table | Purpose | Notes |
|---|---|---|
| profiles | consent, age confirmation, demo flag, username/avatar, adopter/shelter role | row created by sign-up trigger; sensitive role flags are protected |
| pets | current and past pets | `is_current=false` rows are memories; engine ignores them |
| checkins | one daily mood/activity record per user | upsert on `(user_id, checkin_date)`; activities restricted to the fixed list |
| who5_entries | WHO-5 answers | `raw` and `pct` are generated columns and must match engine output |
| st5_entries | ST-5 answers | owner-only RLS |
| adopt_preferences | adoption preferences and household readiness | owner-only RLS; shared with a shelter only after the user applies |
| shelters, shelter_animals | shelter and available-animal listings | signed-in reads; writes are service-role only |
| trials, trial_feedback | trial application, status, decision and user feedback | applicant reads own trial; staff access is shelter-scoped; state changes use the server-only admin layer |

Rules:
- Dates are Asia/Bangkok calendar dates computed on the server, never the client clock.
- Engine reads select only `checkin_date, mood, activities, created_at` from check-ins. Do not select `note` for engine calculations or send it to AI.
- Never expose an adopter's WHO-5, ST-5, mood, or private check-ins to shelter staff. Shelter access is limited to the consented readiness and feedback used by the trial workflow.
- Delete all data through the server-side service-role flow: remove storage objects under `{uid}/`, then delete the auth user so related rows cascade.
- Demo users seeded from `fixtures/demo-seed.json` have `profiles.is_demo = true`.
