import { MOOD_LABELS } from "./MoodFace";

/** 7-day mood line. Gaps where not logged. Values come from the engine (last7). */
export function MoodSparkline({ days }: { days: { date: string; mood: number | null }[] }) {
  const W = 280, H = 90, px = (i: number) => 14 + i * ((W - 28) / 6), py = (m: number) => H - 14 - ((m - 1) / 4) * (H - 28);
  const segs: string[] = [];
  let cur = "";
  days.forEach((d, i) => {
    if (d.mood === null) { if (cur) segs.push(cur); cur = ""; return; }
    cur += `${cur ? "L" : "M"}${px(i)},${py(d.mood)}`;
  });
  if (cur) segs.push(cur);
  const desc = days.map((d) => `${d.date.slice(5)}: ${d.mood ? MOOD_LABELS[d.mood - 1] : "ไม่ได้บันทึก"}`).join(", ");
  return (
    <svg role="img" aria-label={`อารมณ์ 7 วันล่าสุด — ${desc}`} viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[1, 3, 5].map((m) => <line key={m} x1="8" x2={W - 8} y1={py(m)} y2={py(m)} stroke="#E2D6C1" strokeDasharray="3 4" />)}
      {segs.map((d, i) => <path key={i} d={d} fill="none" stroke="#4E6E58" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />)}
      {days.map((d, i) => d.mood === null
        ? <circle key={i} cx={px(i)} cy={H - 14} r="2.5" fill="#CDBFA6" />
        : <circle key={i} cx={px(i)} cy={py(d.mood)} r="4.5" fill="#FBF7EF" stroke="#4E6E58" strokeWidth="2.5" />)}
    </svg>
  );
}

/** With vs without bars. Text + n under each bar (never color alone — colorblind-safe). */
export function TwoBar({ meanWith, meanWithout, nWith, nWithout }: { meanWith: number; meanWithout: number; nWith: number; nWithout: number }) {
  const bar = (v: number, color: string, label: string, n: number) => (
    <div className="flex items-center gap-3">
      <div className="w-24 shrink-0 text-xs text-bark">{label}<br /><span className="num">n = {n}</span> วัน</div>
      <div className="relative h-6 flex-1 rounded-full bg-cream" aria-hidden>
        <div className="h-6 rounded-full" style={{ width: `${(v / 5) * 100}%`, background: color }} />
      </div>
      <span className="num w-10 text-right font-semibold">{v.toFixed(2)}</span>
    </div>
  );
  return (
    <div className="space-y-2" role="group" aria-label="เปรียบเทียบคะแนนอารมณ์เฉลี่ย">
      {bar(meanWith, "#A9C3A0", "วันที่มี", nWith)}
      {bar(meanWithout, "#B89C84", "วันที่ไม่มี", nWithout)}
    </div>
  );
}

/** WHO-5 pct points (0–100) + weekly mean mood. No colored "danger zones". */
export function WellbeingChart({ who5, weekly, startDate }: {
  who5: { taken_on: string; pct: number }[];
  weekly: { week: number; n: number; mean_mood: number }[];
  startDate: string | null;
}) {
  const W = 320, H = 170, L = 30, R = 30, T = 12, B = 26;
  const days = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / 864e5;
  const first = [startDate, who5[0]?.taken_on].filter(Boolean).sort()[0] as string | undefined;
  const lastW = weekly.length ? weekly[weekly.length - 1].week * 7 : 7;
  const span = Math.max(lastW, first && who5.length ? days(first, who5[who5.length - 1].taken_on) + 1 : 7, 7);
  const x = (d: number) => L + (d / span) * (W - L - R);
  const yP = (p: number) => T + (1 - p / 100) * (H - T - B);
  const yM = (m: number) => T + (1 - (m - 1) / 4) * (H - T - B);
  const pts = first ? who5.map((w) => [x(days(first, w.taken_on)), yP(w.pct)] as const) : [];
  const wStart = startDate && first ? days(first, startDate) : 0;
  return (
    <svg role="img" viewBox={`0 0 ${W} ${H}`} className="w-full"
      aria-label={`คะแนนสุขภาวะทางใจ: ${who5.map((w) => `${w.taken_on} ${w.pct}/100`).join(", ") || "ยังไม่มี"}. อารมณ์เฉลี่ยรายสัปดาห์: ${weekly.map((w) => `สัปดาห์ ${w.week} ${w.mean_mood}`).join(", ") || "ยังไม่มี"}`}>
      {[0, 50, 100].map((p) => (
        <g key={p}><line x1={L} x2={W - R} y1={yP(p)} y2={yP(p)} stroke="#E2D6C1" strokeDasharray="3 4" />
          <text x={L - 6} y={yP(p) + 4} textAnchor="end" fontSize="10" fill="#6B4F3A" className="num">{p}</text></g>
      ))}
      {[1, 5].map((m) => <text key={m} x={W - R + 6} y={yM(m) + 4} fontSize="10" fill="#6B4F3A" className="num">{m}</text>)}
      {weekly.map((w) => {
        const x0 = x(wStart + (w.week - 1) * 7) + 2, x1 = x(wStart + w.week * 7) - 2;
        return <rect key={w.week} x={x0} width={Math.max(2, x1 - x0)} y={yM(w.mean_mood)} height={H - B - yM(w.mean_mood)} rx="4" fill="#DFE8D8" />;
      })}
      {pts.length > 1 && <path d={pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join("")} fill="none" stroke="#4E6E58" strokeWidth="2.5" />}
      {pts.map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r="5" fill="#FBF7EF" stroke="#4E6E58" strokeWidth="2.5" />
        <text x={p[0]} y={p[1] - 9} textAnchor="middle" fontSize="11" fontWeight="600" fill="#3E2D22" className="num">{who5[i].pct}</text></g>)}
      <text x={L} y={H - 8} fontSize="10" fill="#6B4F3A">ซ้าย: คะแนนสุขภาวะทางใจ (0–100) · ขวา: อารมณ์เฉลี่ยรายสัปดาห์ (1–5)</text>
    </svg>
  );
}
