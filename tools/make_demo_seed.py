"""
Generates fixtures/demo-seed.json: a SIMULATED 60-day account for the stage demo.
It is NOT real user data. The UI must show a "ข้อมูลจำลอง" badge on this account.

Generation rule (say this out loud if a judge asks):
  base mood 3; walk on ~60% of days; on walk days +1 with prob 0.7;
  night_wake on ~15% of days -> -1; groom on ~25% of days -> no effect;
  random noise -1/0/+1; clamp to 1..5. WHO-5 every 14 days, loosely tied to recent mood.
Deterministic (fixed seed) so everyone gets the same file.
"""
import json, random
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
rng = random.Random(20261128)
end = date(2026, 11, 27)
start = end - timedelta(days=59)

checkins, who5 = [], []
d = start
recent = []
while d <= end:
    acts, mood = [], 3
    if rng.random() < 0.60:
        acts.append("walk")
        if rng.random() < 0.70:
            mood += 1
    if rng.random() < 0.30:
        acts.append("play")
    if rng.random() < 0.25:
        acts.append("groom")
    if rng.random() < 0.15:
        acts.append("night_wake")
        mood -= 1
    mood += rng.choice([-1, 0, 0, 1])
    mood = max(1, min(5, mood))
    checkins.append({"date": d.isoformat(), "mood": mood, "activities": acts,
                     "created_at": f"{d.isoformat()}T21:00:00+07:00"})
    recent.append(mood)
    if (d - start).days % 14 == 13:
        avg = sum(recent[-14:]) / len(recent[-14:])
        base = max(0, min(5, round(avg)))
        items = [max(0, min(5, base + rng.choice([-1, 0, 0, 1]))) for _ in range(5)]
        who5.append({"taken_on": d.isoformat(), "items": items})
    d += timedelta(days=1)

out = {"_label": "DEMO — ข้อมูลจำลอง ไม่ใช่ข้อมูลผู้ใช้จริง", "as_of": end.isoformat(),
       "pet": {"name": "ถั่วแดง", "species": "dog", "adopted_on": "2025-06-01"},
       "past_pets": [{"name": "มะขาม", "species": "cat", "period": "2018–2023", "feeling": 4,
                      "tags": ["อุ่นใจ", "ผูกพัน"], "memory_note": ""}],
       "checkins": checkins, "who5": who5}
(ROOT / "fixtures" / "demo-seed.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"{len(checkins)} check-ins, {len(who5)} WHO-5 entries")
