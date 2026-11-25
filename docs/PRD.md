# PRD — Paw Diary (MVP)

## Problem
Many people believe pets make them feel better, but research results are mixed: a review of 54 studies classed
the impact of pet ownership on owners' mental health as positive (17), mixed (19), none (13) and negative (5)
(see EVIDENCE.md #1). Pet care also has burdens — sick pets, broken sleep, costs (EVIDENCE.md #3).
Owners have no simple way to notice, in their own life, which parts of pet life go together with better or worse days.

## Target user (MVP)
Students and working adults aged 20+ who live with a dog or cat and want to look after their own well-being.
Not patients. Not a clinical tool.

## Positioning vs generic mood trackers (e.g. Daylio)
Generic trackers already correlate mood with user-defined activities (EVIDENCE.md #5). We differ by being
pet-specific and honest:
1. **Both sides of pet life** — joy activities AND burden activities are first-class (walk/play vs pet_sick/night_wake/pet_cost).
2. **WHO-5 every 14 days** — a validated 2-week well-being scale next to the daily 1–5 mood.
3. **Pet timeline** — current pet since adoption + optional past pets ("ความทรงจำ", never mixed into stats).
4. **Honesty by design** — both group sizes, "ข้อมูลยังไม่พอ", "มักเกิดคู่กับ…" flags, no causal words.
5. **Report the user owns** — a non-clinical PDF the user may bring to a psychologist themselves.
6. **Thai-first + help button always visible.**

## Features (MVP scope)
| # | Feature | Must / Nice |
|---|---------|-------------|
| F0 | Landing page, Google + email login | Must |
| F1 | Consent (data) + age 20+ confirm + pet profile (name, species, photo, adopted_on optional) | Must |
| F2 | Daily check-in: mood 1–5 + activities (joy + burden) + optional note, ≤10 seconds | Must |
| F3 | Home: today status, streak, 7-day mood line, WHO-5 due banner | Must |
| F4 | Personal Pattern cards per activity (engine) | Must |
| F5 | WHO-5 every 14 days + well-being timeline (pct over time) | Must |
| F6 | Help sheet: always-visible button, 1323, gentle cards | Must |
| F7 | Settings: export PDF (separate consent), delete all data, sign out | Must |
| F8 | Past pets ("ความทรงจำ") one screen, optional | Nice |
| F9 | AI weekly summary from engine numbers only | Nice (last) |
| F10 | Learn page: pets & mind — what research says (mixed), pet ownership ≠ animal-assisted therapy | Nice |

## Out of scope
Sending data to clinicians, chat/therapy bot, AI reading notes, pet emotion from photos, social features,
notifications beyond the in-app banner, teens under 20.

## Success criteria for the hackathon
- A new user can sign up → consent → add pet → first check-in in under 60 seconds.
- Engine output matches fixtures/expected.json (CI green).
- Demo flow in docs/PITCH.md runs end-to-end without errors on a phone.
- Pre-hackathon validation: 5 pet owners tried check-in; record how many seconds it took and whether they want Patterns.
