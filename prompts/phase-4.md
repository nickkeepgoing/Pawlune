# Phase 4 — Personal Patterns, WHO-5, timeline

Read: CLAUDE.md, docs/ENGINE.md (all), docs/USER_FLOW.md (Flows 3–4), content/who5-th.json (or who5-en.json), docs/DESIGN_BRIEF.md.

Tasks
1. `/patterns`: one card per activity from `pattern()`; copy from `lib/engine/copy.ts` only; two-bar comparison with
   n under each bar; status chip; limitation line; often-together line; insufficient cards show "อีก N วัน" meter.
   Sort as in USER_FLOW. Joy and burden cards in the same list, burden chips neutral color.
2. `/patterns/info`: how it is computed in plain Thai, why 7/14 days are product thresholds, why we never say "ทำให้".
3. `/wellbeing/take`: WHO-5 from `content/who5-th.json`; if missing use who5-en.json + visible banner
   "กำลังรอข้อความฉบับภาษาไทยที่ผ่านการตรวจสอบ". All 5 required. Save items; read back DB `raw/pct` and assert equal to engine.
4. `/wellbeing`: WHO-5 pct points over time + weekly mean mood (engine `weeklyTimeline`). Result screen compares to last entry
   in words ("สูงขึ้น/ต่ำลง/เท่าเดิม จากครั้งก่อน"), never labels. raw < 12 → gentle card (Phase 5 component; stub now).

Done when
- Seed the basic fixture into a test account: walk card text equals the Phase 1 copy test; play shows "อีก 5 วัน".
- WHO-5 [3,2,2,2,2] shows 44/100 and the gentle card stub; [3,3,2,2,2] shows 48/100 and no card.
