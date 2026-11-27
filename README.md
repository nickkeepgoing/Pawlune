# Pawlune — Claude Code kit (ToBeIT'70, Healthy Living)

## Before anything: 5 team TODOs (do these first, they decide whether we can win)
1. **Check the hackathon rules**: is code written before 28 Nov allowed? If not, use this kit only as a plan and
   build everything onsite (the docs/prompts are still valid).
2. **WHO-5 Thai text** → `content/who5-th.json` (see content/who5-th.TODO.md). Never AI-translated.
3. ~~**Confirm hotlines**~~ DONE 2026-11-26 — 1323 and 1669 both still in service (docs/EVIDENCE.md #6).
4. **5 real pet owners** try the check-in (paper or prototype). Record: seconds taken, would they check in daily,
   do they want to see Patterns. Only real numbers go into the pitch.
5. **Supabase project + Google OAuth** ready; copy `.env.example` → `.env.local`.

## Code status
All phases (0–6) are implemented. Engine verified against fixtures. Not yet built with real packages — see `handoff/08_CODE_STATUS.md`.
Run: `npm install` → `cp .env.example .env.local` → `npm run test:engine && npm run build` → `npm run dev`.

## How to use with Claude Code
1. Unzip into an empty folder, `git init`, open Claude Code there.
2. Install the design skill: `/plugin install frontend-design@claude-plugins-official`
3. For each phase, paste the matching file from `prompts/` (phase-0 → phase-6), one phase per session.
   Claude reads CLAUDE.md automatically; each prompt names the docs it needs.
4. After every phase: `npm run test && npm run build`, try it on a phone, commit.

**Teammate taking over?** Start at `handoff/00_START_HERE.md` (Thai: work plan, step-by-step account/key setup, feature review, colors).

**Low on Claude usage?** Read docs/LOW_QUOTA_PLAN.md first — it says what humans do, what Claude does, and what to cut.

## Files
| Path | What |
|---|---|
| CLAUDE.md | hard rules Claude Code must follow |
| docs/PRD.md | scope, positioning vs Daylio, success criteria |
| docs/USER_FLOW.md | flows (Mermaid) + screen → route → phase |
| docs/ENGINE.md | every formula, rounding, Thai card templates, verified numbers |
| docs/SAFETY_PRIVACY.md | help sheet, gentle cards, consent, delete-all |
| docs/DATABASE.md + supabase/migrations/0001_init.sql | schema with RLS |
| docs/DESIGN_BRIEF.md | look, components, copy tone, landing |
| docs/PITCH.md | pitch, demo script with real engine numbers, judge Q&A |
| docs/EVIDENCE.md | sources (checked) and what NOT to say |
| fixtures/ + tools/reference_engine.py | test data + source-of-truth engine (`python3 tools/reference_engine.py --check`) |
| tools/make_demo_seed.py | regenerates the labelled demo account data |
| content/ | WHO-5 text files |

## Honest assessment (read before committing)
Strong: clear Healthy Living fit (mental well-being), feasible in 2 days, honest-data story judges rarely see,
evidence-backed problem framing.
Weak: the core "mood × activity correlation" already exists in Daylio; the value grows over weeks, so the
demo relies on simulated data; real-user validation is thin. Our win depends on (a) the pet-specific joy + burden
angle, (b) the honesty moments in the demo, (c) real numbers from the 5 testers.
