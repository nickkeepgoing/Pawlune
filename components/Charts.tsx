import { thaiDate } from '@/lib/format';

/** 7-day mood line on the home screen. Gaps where a day was not logged. */
export function MoodLine({ points }: { points: { date: string; mood: number | null }[] }) {
  const W = 300, H = 120, pad = 18;
  const x = (i: number) => pad + (i * (W - pad * 2)) / Math.max(1, points.length - 1);
  const y = (m: number) => H - pad - ((m - 1) / 4) * (H - pad * 2);
  const segs: string[] = [];
  let cur = '';
  points.forEach((p, i) => {
    if (p.mood == null) { if (cur) segs.push(cur); cur = ''; return; }
    cur += `${cur ? 'L' : 'M'}${x(i)},${y(p.mood)}`;
  });
  if (cur) segs.push(cur);
  const label = points.map((p) => `${thaiDate(p.date, false)} ${p.mood ?? 'ไม่ได้บันทึก'}`).join(', ');
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} className="w-full" role="img" aria-label={`อารมณ์ 7 วันล่าสุด: ${label}`}>
      {[1, 3, 5].map((m) => (<line key={m} x1={pad} x2={W - pad} y1={y(m)} y2={y(m)} stroke="#6B4F3A" strokeOpacity=".15" />))}
      {segs.map((d, i) => (<path key={i} d={d} fill="none" stroke="#4E6E58" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />))}
      {points.map((p, i) => p.mood == null
        ? <circle key={p.date} cx={x(i)} cy={H - pad} r="3" fill="none" stroke="#6B4F3A" strokeOpacity=".4" />
        : <circle key={p.date} cx={x(i)} cy={y(p.mood)} r="5" fill="#FBF7EF" stroke="#4E6E58" strokeWidth="2.5" />)}
      {points.map((p, i) => (<text key={p.date + 't'} x={x(i)} y={H + 14} textAnchor="middle" fontSize="10" fill="#6B4F3A">{thaiDate(p.date, false).split(' ')[0]}</text>))}
    </svg>
  );
}

/** Generic line over time with labelled points (WHO-5 pct 0–100, or weekly mean 1–5). No "danger zones". */
export function PointLine({ points, min, max, label }: { points: { x: string; y: number }[]; min: number; max: number; label: string }) {
  const W = 300, H = 140, pad = 24;
  if (!points.length) return null;
  const x = (i: number) => (points.length === 1 ? W / 2 : pad + (i * (W - pad * 2)) / (points.length - 1));
  const y = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.y)}`).join('');
  return (
    <svg viewBox={`0 0 ${W} ${H + 16}`} className="w-full" role="img" aria-label={`${label}: ${points.map((p) => `${p.x} ${p.y}`).join(', ')}`}>
      <line x1={pad} x2={W - pad} y1={y(min)} y2={y(min)} stroke="#6B4F3A" strokeOpacity=".2" />
      <path d={d} fill="none" stroke="#4E6E58" strokeWidth="3" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.y)} r="5" fill="#FBF7EF" stroke="#4E6E58" strokeWidth="2.5" />
          <text x={x(i)} y={y(p.y) - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="#3E2D22" className="num">{p.y}</text>
          <text x={x(i)} y={H + 12} textAnchor="middle" fontSize="10" fill="#6B4F3A">{p.x}</text>
        </g>
      ))}
    </svg>
  );
}
