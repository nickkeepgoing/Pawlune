// Five original mood faces (custom SVG, not emoji). mood 1..5
const MOUTHS = ['M8 17c1.5-2.5 6.5-2.5 8 0', 'M8.5 16.5c1.5-1.2 5.5-1.2 7 0', 'M8.5 16h7', 'M8.5 15.2c1.5 1.4 5.5 1.4 7 0', 'M8 14.5c1.5 3 6.5 3 8 0'];

export function MoodFace({ mood, className = 'h-10 w-10' }: { mood: number; className?: string }) {
  const brows = mood === 1 ? <path d="M7 8.5l3 1M17 8.5l-3 1" /> : null;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="9.5" />
      {brows}
      {mood === 5 ? (<><path d="M8 10.5c.6-1 1.6-1 2.2 0" /><path d="M13.8 10.5c.6-1 1.6-1 2.2 0" /></>) : (<><circle cx="9" cy="10.6" r=".9" fill="currentColor" /><circle cx="15" cy="10.6" r=".9" fill="currentColor" /></>)}
      <path d={MOUTHS[mood - 1]} />
    </svg>
  );
}
