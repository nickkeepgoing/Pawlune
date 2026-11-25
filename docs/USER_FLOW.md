# USER_FLOW.md — screens, routes, phases

## Flow 0 — Landing + auth (Phase 2)
```mermaid
flowchart LR
  L01[/ Landing/] -->|เริ่มใช้งาน| A01[/login: Google or email/]
  A01 -->|first time| O01
  A01 -->|returning| H01[/home/]
```

## Flow 1 — Onboarding (Phase 3)
```mermaid
flowchart LR
  O01[/onboarding/consent: data consent/] --> O02[/onboarding/age: ฉันอายุ 20 ปีขึ้นไป/]
  O02 -->|no| X01[Friendly stop, nothing stored]
  O02 -->|yes| O03[/onboarding/pet: name, dog/cat, photo, adopted_on optional/]
  O03 --> C01[/checkin: first check-in/]
```

## Flow 2 — Daily check-in (Phase 3)
```mermaid
flowchart LR
  H01[/home/] --> C01[/checkin/]
  C01 -->|mood 1-5 + activities + note?| S[(save: upsert by date)]
  S --> H01
  H01 -->|WHO-5 due banner| W02
```
Check-in screen order: pet photo card → mood (5 faces) → "วันนี้กับน้อง" joy chips → "ภาระวันนี้" burden chips → note (collapsed) → บันทึก.
Editing today again overwrites today (upsert).

## Flow 3 — Personal Patterns (Phase 4)
```mermaid
flowchart LR
  H01 --> P01[/patterns: one card per activity/]
  P01 --> P02[/patterns/info: how we compute, why not cause, 7/14 days/]
```
Sort: non-insufficient cards first (by |diff| desc), then insufficient (by fewest days needed).

## Flow 4 — WHO-5 + timeline (Phase 4)
```mermaid
flowchart LR
  W01[/wellbeing: pct timeline + mood weekly/] --> W02[/wellbeing/take: 5 questions/]
  W02 --> W03[Result: คะแนนสุขภาวะทางใจ N/100 + compare to last]
  W03 -->|raw < 12| G[Gentle card -> Help sheet]
```

## Flow 5 — Help (Phase 5, global)
Floating "ต้องการคนรับฟัง" on every signed-in screen → help sheet (SAFETY_PRIVACY.md). Gentle cards also open it.

## Flow 6 — Report + settings (Phase 5)
```mermaid
flowchart LR
  ST[/settings/] --> R01[/report: pick sections/] --> R02[Export consent dialog] --> R03[PDF download]
  ST --> D01[ลบข้อมูลทั้งหมด: type ลบ to confirm] --> L01
  ST --> OUT[ออกจากระบบ] --> L01
```

## Flow 7 — Pets & memories (Phase 5, nice)
`/pets`: current pet card (since adoption: N days) + "ความทรงจำ" list of past pets (name, species, period, feeling 1–5, tags, memory note). Copy: "ข้อมูลส่วนนี้เป็นความทรงจำ ไม่นำไปคำนวณรูปแบบ".

## Screen → route → phase
| Screen | Route | Phase |
|---|---|---|
| Landing | `/` | 2 |
| Login | `/login`, `/auth/callback` | 2 |
| Consent / Age / Pet | `/onboarding/consent`, `/onboarding/age`, `/onboarding/pet` | 3 |
| Home | `/home` | 3 |
| Check-in | `/checkin` | 3 |
| Patterns + info | `/patterns`, `/patterns/info` | 4 |
| Well-being timeline + WHO-5 | `/wellbeing`, `/wellbeing/take` | 4 |
| Help sheet | global component | 5 |
| Pets & memories | `/pets` | 5 |
| Report | `/report` | 5 |
| Settings | `/settings` | 5 |
| Learn | `/learn` | 6 |
| AI weekly summary | card on `/home` | 6 (optional) |
