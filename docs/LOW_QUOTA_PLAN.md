# LOW_QUOTA_PLAN.md — finishing with little Claude usage left

## Order = value per token. Stop anywhere and you still have a demo.
| Step | What | Who | Est. Claude cost |
|---|---|---|---|
| 1 | Phase 0 setup | **Human** (create-next-app, install packages, paste .env) | 0 |
| 2 | Phase 1 engine + tests | Claude (most important code, must be correct) | medium |
| 3 | SQL migration | **Human** pastes 0001_init.sql into Supabase SQL editor | 0 |
| 4 | Phase 3 check-in + home | Claude | medium |
| 5 | Phase 4 patterns + WHO-5 | Claude | medium |
| 6 | Help sheet + demo seed | Claude (small) | low |
| 7 | Login/landing/settings/PDF/learn page | Claude only if quota left; else simple versions by hand | high |

## Cut list if quota runs out (in this order)
1. AI weekly summary (already optional)
2. PDF → use browser print (`window.print()` + print CSS) instead of a PDF library
3. Past pets screen
4. Learn page animations → static SVG pets
5. Google login → email/password only

## Token-saving habits in Claude Code
- One phase per session, then `/clear`. Long sessions re-read everything and burn usage.
- Use a smaller model for UI/boilerplate phases (`/model`), keep the strongest model for Phase 1 (engine) and bug hunts.
- Give exact file paths in prompts; don't ask Claude to "look around the project".
- Paste only the failing error + file, not the whole log.
- Don't ask for redesign loops; accept the first decent UI and polish by hand.
- Teammates' accounts can each take a phase (same repo, same CLAUDE.md).
