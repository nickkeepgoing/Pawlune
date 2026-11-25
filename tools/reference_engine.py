"""
Reference engine for Paw Diary.
This is the SOURCE OF TRUTH for every number the app shows.
The TypeScript engine in lib/engine must produce identical results on fixtures/.

Run:  python3 tools/reference_engine.py            -> prints results, writes fixtures/expected.json
      python3 tools/reference_engine.py --check    -> exits 1 if expected.json is out of date
"""
import json, sys, math
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FIX = ROOT / "fixtures"

# ---- constants (product rules, NOT statistical guarantees) ----
MIN_DAYS_PER_GROUP = 7        # below this in either group -> "insufficient"
STRONG_DAYS_PER_GROUP = 14    # both groups >= this -> "more_data"
COOCCUR_FLAG = 0.70           # activity appears with another on >=70% of its days -> flag
WHO5_DUE_DAYS = 14            # WHO-5 asks about the last 2 weeks
WHO5_GENTLE_RAW_BELOW = 12    # Thai WHO-5 primary-care cut-off (<12). Used ONLY for a gentle card, never a diagnosis.
LOW_MOOD_MAX = 2              # mood <= 2 counts as a low day
LOW_MOOD_STREAK = 5           # 5 low days in a row -> gentle card

ACTIVITIES = {
    # joy side
    "walk":       {"th": "พาน้องเดิน",            "kind": "joy"},
    "play":       {"th": "เล่นกับน้อง",            "kind": "joy"},
    "cuddle":     {"th": "นอนกอด/อยู่ใกล้น้อง",     "kind": "joy"},
    "groom":      {"th": "อาบน้ำ/แปรงขน",          "kind": "joy"},
    "train":      {"th": "ฝึกน้อง",                "kind": "joy"},
    # burden side (research: pet care also has practical/emotional burden)
    "pet_sick":   {"th": "น้องป่วย/พาไปหาหมอ",     "kind": "burden"},
    "night_wake": {"th": "ตื่นกลางคืนเพราะน้อง",    "kind": "burden"},
    "pet_cost":   {"th": "มีค่าใช้จ่ายเรื่องน้อง",    "kind": "burden"},
}


def round_half_up(x: float, d: int) -> float:
    m = 10 ** d
    return math.floor(x * m + 0.5 + 1e-9) / m


def dedupe_checkins(rows):
    """One check-in per date. If a date repeats, the row with the latest created_at wins."""
    by_date = {}
    for r in rows:
        k = r["date"]
        if k not in by_date or r["created_at"] >= by_date[k]["created_at"]:
            by_date[k] = r
    out = sorted(by_date.values(), key=lambda r: r["date"])
    for r in out:
        if not (isinstance(r["mood"], int) and 1 <= r["mood"] <= 5):
            raise ValueError(f"mood must be int 1..5 on {r['date']}")
        for a in r["activities"]:
            if a not in ACTIVITIES:
                raise ValueError(f"unknown activity {a} on {r['date']}")
    return out


def mean(xs):
    return sum(xs) / len(xs) if xs else None


def summary(checkins, as_of: str):
    moods = [c["mood"] for c in checkins]
    dates = {c["date"] for c in checkins}
    # current streak: consecutive days ending at as_of (or as_of-1 if today not logged yet)
    d = date.fromisoformat(as_of)
    if as_of not in dates:
        d -= timedelta(days=1)
    streak = 0
    while d.isoformat() in dates:
        streak += 1
        d -= timedelta(days=1)
    return {
        "days_logged": len(checkins),
        "mean_mood": round_half_up(mean(moods), 2) if moods else None,
        "streak": streak,
    }


def pattern(checkins, act):
    with_m = [c["mood"] for c in checkins if act in c["activities"]]
    without_m = [c["mood"] for c in checkins if act not in c["activities"]]
    n_w, n_wo = len(with_m), len(without_m)
    res = {
        "activity": act,
        "label_th": ACTIVITIES[act]["th"],
        "kind": ACTIVITIES[act]["kind"],
        "n_with": n_w,
        "n_without": n_wo,
    }
    if min(n_w, n_wo) < MIN_DAYS_PER_GROUP:
        res["status"] = "insufficient"
        res["need_more_with"] = max(0, MIN_DAYS_PER_GROUP - n_w)
        res["need_more_without"] = max(0, MIN_DAYS_PER_GROUP - n_wo)
    else:
        mw, mwo = mean(with_m), mean(without_m)
        res["status"] = "more_data" if min(n_w, n_wo) >= STRONG_DAYS_PER_GROUP else "preliminary"
        res["mean_with"] = round_half_up(mw, 2)
        res["mean_without"] = round_half_up(mwo, 2)
        res["diff"] = round_half_up(mw - mwo, 2)
        res["diff_display"] = round_half_up(abs(mw - mwo), 1)
        res["direction"] = "higher" if mw > mwo else ("lower" if mw < mwo else "same")
    # co-occurrence honesty flag
    flags = []
    if n_w:
        for other in ACTIVITIES:
            if other == act:
                continue
            both = sum(1 for c in checkins if act in c["activities"] and other in c["activities"])
            share = both / n_w
            if share >= COOCCUR_FLAG:
                flags.append({"with": other, "share": round_half_up(share, 2)})
    res["often_together"] = flags
    return res


def weekly_timeline(checkins):
    """Week 1 = first 7 days counted from the first logged date (not ISO weeks)."""
    if not checkins:
        return []
    start = date.fromisoformat(checkins[0]["date"])
    buckets = {}
    for c in checkins:
        w = (date.fromisoformat(c["date"]) - start).days // 7 + 1
        buckets.setdefault(w, []).append(c["mood"])
    return [{"week": w, "n": len(v), "mean_mood": round_half_up(mean(v), 2)} for w, v in sorted(buckets.items())]


def who5_score(items):
    if not (isinstance(items, list) and len(items) == 5 and all(isinstance(i, int) and 0 <= i <= 5 for i in items)):
        raise ValueError("WHO-5 needs exactly 5 integer answers in 0..5")
    raw = sum(items)
    return {"raw": raw, "pct": raw * 4, "gentle_card": raw < WHO5_GENTLE_RAW_BELOW}


def who5_due(last_taken, today):
    if last_taken is None:
        return True
    return (date.fromisoformat(today) - date.fromisoformat(last_taken)).days >= WHO5_DUE_DAYS


def low_mood_streak(checkins, as_of):
    dates = {c["date"]: c["mood"] for c in checkins}
    d = date.fromisoformat(as_of)
    n = 0
    while d.isoformat() in dates and dates[d.isoformat()] <= LOW_MOOD_MAX:
        n += 1
        d -= timedelta(days=1)
    return {"low_days_in_a_row": n, "gentle_card": n >= LOW_MOOD_STREAK}


def run_basic():
    data = json.loads((FIX / "checkins-basic.json").read_text(encoding="utf-8"))
    cs = dedupe_checkins(data["checkins"])
    return {
        "as_of": data["as_of"],
        "summary": summary(cs, data["as_of"]),
        "patterns": {a: pattern(cs, a) for a in ACTIVITIES},
        "weekly": weekly_timeline(cs),
        "low_mood": low_mood_streak(cs, data["as_of"]),
    }


def run_who5():
    data = json.loads((FIX / "who5-cases.json").read_text(encoding="utf-8"))
    out = {"scores": [], "due": []}
    for case in data["score_cases"]:
        try:
            out["scores"].append({"id": case["id"], "result": who5_score(case["items"])})
        except ValueError as e:
            out["scores"].append({"id": case["id"], "error": "invalid"})
    for case in data["due_cases"]:
        out["due"].append({"id": case["id"], "due": who5_due(case["last_taken"], case["today"])})
    return out


def run_low():
    data = json.loads((FIX / "low-mood.json").read_text(encoding="utf-8"))
    cs = dedupe_checkins(data["checkins"])
    return low_mood_streak(cs, data["as_of"])


def run_demo():
    p = FIX / "demo-seed.json"
    if not p.exists():
        return None
    data = json.loads(p.read_text(encoding="utf-8"))
    cs = dedupe_checkins(data["checkins"])
    return {
        "summary": summary(cs, data["as_of"]),
        "patterns": {a: pattern(cs, a) for a in ACTIVITIES},
        "who5": [dict(taken_on=w["taken_on"], **who5_score(w["items"])) for w in data["who5"]],
    }


if __name__ == "__main__":
    expected = {"basic": run_basic(), "who5": run_who5(), "low_mood_case": run_low(), "demo": run_demo()}
    text = json.dumps(expected, ensure_ascii=False, indent=2)
    target = FIX / "expected.json"
    if "--check" in sys.argv:
        ok = target.exists() and target.read_text(encoding="utf-8") == text + "\n"
        print("expected.json up to date" if ok else "expected.json OUT OF DATE")
        sys.exit(0 if ok else 1)
    target.write_text(text + "\n", encoding="utf-8")
    print(text)
