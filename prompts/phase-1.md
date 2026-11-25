# Phase 1 — Engine (no UI)

Read: CLAUDE.md, docs/ENGINE.md, tools/reference_engine.py, fixtures/*.

Tasks
1. Port `tools/reference_engine.py` to `lib/engine/` as pure TS: `activities.ts`, `round.ts`, `checkins.ts`
   (dedupe + validation), `summary.ts`, `pattern.ts`, `weekly.ts`, `who5.ts`, `lowMood.ts`, `copy.ts`
   (Thai card sentences — exact templates from ENGINE.md), `index.ts`.
2. No `Date.now()` inside the engine; every function takes `asOf`.
3. Tests in `lib/engine/__tests__/` load `fixtures/checkins-basic.json`, `who5-cases.json`, `low-mood.json`,
   `demo-seed.json` and deep-compare with `fixtures/expected.json` (basic, who5, low_mood_case, demo).
4. Add copy tests: the walk card in basic must render
   `ใน 8 วันที่มี "พาน้องเดิน" คะแนนอารมณ์เฉลี่ย 4.38 สูงกว่า 8 วันที่ไม่มี (2.63) อยู่ 1.8 คะแนน`
   and no generated string may contain: ทำให้, ช่วยเพิ่ม, รักษา, บำบัด, ซึมเศร้า.

Done when
- All engine tests green; `npm run test:ref` up to date.
- If any TS result differs from expected.json, fix TS — never edit expected.json by hand.
