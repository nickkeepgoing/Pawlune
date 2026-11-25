export const MOOD_LABELS = ["แย่มาก", "ไม่ค่อยดี", "เฉยๆ", "ดี", "ดีมาก"] as const;

// Custom faces (not emoji). Mouth curvature goes from down to up; cheeks appear on good days.
const MOUTHS = ["M11 23c2.5-3.5 7.5-3.5 10 0", "M11.5 22c2.5-1.8 6.5-1.8 9 0", "M12 21.5h8", "M11.5 20.5c2.5 2 6.5 2 9 0", "M10.5 19.5c2.5 4.5 8.5 4.5 11 0"];

export default function MoodFace({ mood, size = 40 }: { mood: number; size?: number }) {
  const i = mood - 1;
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill={mood >= 4 ? "#A9C3A0" : mood === 3 ? "#E7DCC8" : "#D9C8B4"} stroke="#3E2D22" strokeWidth="1.4" />
      {mood === 1 ? (
        <path d="M10 12.5l3 1.5M22 12.5l-3 1.5" stroke="#3E2D22" strokeWidth="1.6" strokeLinecap="round" />
      ) : mood === 5 ? (
        <path d="M10 13.5c1-1.5 3-1.5 4 0M18 13.5c1-1.5 3-1.5 4 0" stroke="#3E2D22" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      ) : (
        <g fill="#3E2D22"><circle cx="12" cy="13.5" r="1.5" /><circle cx="20" cy="13.5" r="1.5" /></g>
      )}
      {mood >= 4 && <g fill="#C99A5B" opacity=".55"><circle cx="8.5" cy="18" r="2" /><circle cx="23.5" cy="18" r="2" /></g>}
      <path d={MOUTHS[i]} stroke="#3E2D22" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
