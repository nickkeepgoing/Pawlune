// The 14-day trial drawn as a walk of paw prints. Filled paws = days passed; the cat sits on today.
// Wide screens: one wavy line. Phones: two rows that snake back (days 1–7, then 8–14), so paws stay big.
const N = 14;
const PAW = 'M0 5.5a5 4.2 0 1 0 0.01 0Zm-6.4-5.2a2.1 2.7 0 1 0 0.01 0Zm12.8 0a2.1 2.7 0 1 0 0.01 0ZM-3 -5a2 2.6 0 1 0 .01 0Zm6 0a2 2.6 0 1 0 .01 0Z';

type Pt = { x: number; y: number; rot: number };
type Layout = { W: number; H: number; pt: (i: number) => Pt; labels: [number, string, 'start' | 'middle' | 'end'][]; labelY: number };
const wide: Layout = { W: 700, H: 150, pt: (i: number): Pt => ({ x: 30 + (i * 640) / 13, y: 92 + Math.sin(i * 0.9) * 22 + (i % 2 ? 6 : -6), rot: 90 + (i % 2 ? 18 : -18) }),
  labels: [[0, 'วันรับน้อง', 'start'], [6, 'วันที่ 7', 'middle'], [13, 'วันตัดสินใจ', 'end']], labelY: 146 };
const snake: Layout = { W: 340, H: 262, pt: (i: number): Pt => {
  const row = i < 7 ? 0 : 1, k = row ? 13 - i : i;
  return { x: 28 + k * 47, y: (row ? 200 : 96) + (k % 2 ? 6 : -6), rot: (row ? 270 : 90) + (k % 2 ? 16 : -16) };
}, labels: [[0, 'วันรับน้อง', 'start'], [13, 'วันตัดสินใจ', 'start']], labelY: 0 };

function Path({ L, day, className, label }: { L: Layout; day: number; className: string; label: string }) {
  const pts = Array.from({ length: N }, (_, i) => L.pt(i));
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
  const here = pts[Math.max(0, day - 1)];
  return (
    <svg viewBox={`0 0 ${L.W} ${L.H}`} className={className} role="img" aria-label={label}>
      <path d={line} fill="none" stroke="#C4AC86" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => {
        const done = i < day;
        return (
          // CSS animation sets `transform`, so it lives on an inner group to keep the SVG position.
          <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.rot}) scale(1.35)`}>
            <g style={done ? { animation: `pop .35s ease-out ${i * 0.05}s both`, transformBox: 'fill-box', transformOrigin: 'center' } : undefined}>
              <path d={PAW} fill={done ? '#4E6E58' : '#D9CBB3'} opacity={done ? 1 : 0.7} />
            </g>
          </g>
        );
      })}
      {L.labels.map(([i, t, anchor]) => {
        const p = pts[i];
        const y = L.labelY || p.y + 44;
        return <text key={t} x={anchor === 'end' ? p.x + 14 : p.x - 14} y={y} textAnchor={anchor} fontSize="15" fill="#6B4F3A">{t}</text>;
      })}
      {day > 0 && (
        <g transform={`translate(${here.x - 22} ${here.y - 72})`}><g className="path-cat">
          <path d="M8 22 6 4l12 9ZM36 22 38 4 26 13Z" fill="#EFE2C8" stroke="#C4AC86" strokeWidth="2" strokeLinejoin="round" />
          <ellipse cx="22" cy="28" rx="18" ry="16" fill="#EFE2C8" stroke="#C4AC86" strokeWidth="2" />
          <ellipse cx="15" cy="27" rx="2.4" ry="3" fill="#3E2D22" /><ellipse cx="29" cy="27" rx="2.4" ry="3" fill="#3E2D22" />
          <path d="M20 33h4l-2 2Z" fill="#D98F7A" />
          <path d="M22 44v8" stroke="#C4AC86" strokeWidth="2" />
        </g></g>
      )}
    </svg>
  );
}

export function PawPath({ day, label }: { day: number; label?: string }) {
  const d = Math.max(0, Math.min(N, day));
  const l = label ?? `ทดลองเลี้ยงวันที่ ${d} จาก ${N}`;
  return (
    <>
      <Path L={snake} day={d} label={l} className="w-full sm:hidden" />
      <Path L={wide} day={d} label={l} className="hidden w-full sm:block" />
    </>
  );
}
