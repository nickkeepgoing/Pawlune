'use client';
import { useEffect, useRef, useState } from 'react';

const SAYS = ['เหมียว', 'อยู่ด้วยกันนะ', 'ลูบหัวอีกได้', 'ขอนอนตักหน่อย', 'พร้อมกลับบ้านแล้ว'];

/**
 * มะขาม, the Pawlune cat. Eyes follow the pointer, tap for a purr bubble and hearts.
 * Pure SVG + CSS; motion turns off under prefers-reduced-motion (globals.css).
 */
export function Mascot({ className = 'h-56 w-56', say = true }: { className?: string; say?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [taps, setTaps] = useState(0);
  const [bubble, setBubble] = useState<string | null>(null);

  useEffect(() => {
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.42);
        const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260);
        setLook({ x: (dx / d) * 3.2 * k, y: (dy / d) * 2.6 * k });
      });
    };
    window.addEventListener('pointermove', move);
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);

  const tap = () => {
    setTaps((n) => n + 1);
    if (say) { setBubble(SAYS[taps % SAYS.length]); window.setTimeout(() => setBubble(null), 1600); }
  };

  return (
    <button type="button" onClick={tap} className="mascot relative inline-block rounded-[40%] focus-visible:outline-offset-4" aria-label="แตะมะขาม">
      {bubble && (
        <span key={taps} className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-paper px-3 py-1 text-sm font-semibold text-cocoa shadow-[0_6px_16px_-8px_rgba(62,45,34,.5)]" style={{ animation: 'pop .3s ease-out' }} role="status">{bubble}</span>
      )}
      {taps > 0 && [0, 1, 2].map((i) => (
        <svg key={`${taps}-${i}`} viewBox="0 0 24 24" className="pointer-events-none absolute top-[22%] h-5 w-5 text-[#E39B8A]" style={{ left: `${36 + i * 14}%`, animation: `floatUp ${0.9 + i * 0.2}s ease-out forwards` }} fill="currentColor" aria-hidden>
          <path d="M12 21s-7.5-4.6-9.5-9.2C1 8.4 3.2 5 6.6 5c2 0 3.5 1.1 5.4 3 1.9-1.9 3.4-3 5.4-3 3.4 0 5.6 3.4 4.1 6.8C19.5 16.4 12 21 12 21Z" />
        </svg>
      ))}
      <svg ref={ref} viewBox="0 0 200 200" className={className} aria-hidden>
        {/* tail */}
        <g style={{ transformOrigin: '150px 168px', animation: 'sway 3s ease-in-out infinite' }}>
          <path d="M146 168c34 4 44-30 26-48" stroke="#D9C3A0" strokeWidth="13" strokeLinecap="round" fill="none" />
          <path d="M146 168c34 4 44-30 26-48" stroke="#EFE2C8" strokeWidth="8" strokeLinecap="round" fill="none" />
        </g>
        <g style={{ transformOrigin: '100px 150px', animation: 'breathe 4s ease-in-out infinite' }}>
          {/* body */}
          <path d="M52 186c-6-46 14-76 48-76s54 30 48 76Z" fill="#EFE2C8" stroke="#C4AC86" strokeWidth="3" />
          <path d="M80 186c-2-26 6-40 20-40s22 14 20 40Z" fill="#FBF7EF" />
          <ellipse cx="78" cy="186" rx="15" ry="8" fill="#EFE2C8" stroke="#C4AC86" strokeWidth="3" />
          <ellipse cx="122" cy="186" rx="15" ry="8" fill="#EFE2C8" stroke="#C4AC86" strokeWidth="3" />
          {/* head */}
          <g className="mascot-head">
            <path className="mascot-ear-l" d="M56 70 50 22l38 24Z" fill="#EFE2C8" stroke="#C4AC86" strokeWidth="3" strokeLinejoin="round" />
            <path className="mascot-ear-r" d="M144 70 150 22l-38 24Z" fill="#EFE2C8" stroke="#C4AC86" strokeWidth="3" strokeLinejoin="round" />
            <path d="M60 50l-3-16 14 10ZM140 50l3-16-14 10Z" fill="#E7B9A3" />
            <ellipse cx="100" cy="80" rx="52" ry="46" fill="#EFE2C8" stroke="#C4AC86" strokeWidth="3" />
            <g stroke="#D9C3A0" strokeWidth="4" strokeLinecap="round"><path d="M100 36v12M88 38l3 9M112 38l-3 9" /></g>
            <g style={{ transformOrigin: '100px 78px', animation: 'blink 5s infinite' }}>
              <ellipse cx="80" cy="78" rx="9" ry="11" fill="#3E2D22" /><ellipse cx="120" cy="78" rx="9" ry="11" fill="#3E2D22" />
              <g style={{ transform: `translate(${look.x}px, ${look.y}px)`, transition: 'transform .12s ease-out' }}>
                <circle cx="82" cy="74" r="3.4" fill="#fff" /><circle cx="122" cy="74" r="3.4" fill="#fff" />
                <circle cx="78" cy="82" r="1.5" fill="#fff" opacity=".7" /><circle cx="118" cy="82" r="1.5" fill="#fff" opacity=".7" />
              </g>
            </g>
            <ellipse cx="66" cy="96" rx="9" ry="6" fill="#E7A9A0" opacity=".5" /><ellipse cx="134" cy="96" rx="9" ry="6" fill="#E7A9A0" opacity=".5" />
            <path d="M94 92h12l-6 6Z" fill="#D98F7A" />
            <path d="M100 98c-2 6-9 6-11 2M100 98c2 6 9 6 11 2" stroke="#3E2D22" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <g stroke="#B9A27E" strokeWidth="2" strokeLinecap="round"><path d="M58 92l-22-4M58 99l-22 2M142 92l22-4M142 99l22 2" /></g>
          </g>
          {/* collar */}
          <path d="M66 122c22 10 46 10 68 0" stroke="#4E6E58" strokeWidth="8" fill="none" strokeLinecap="round" />
          <circle cx="100" cy="133" r="6" fill="#C99A5B" stroke="#9A7446" strokeWidth="2" />
        </g>
      </svg>
    </button>
  );
}
