// Two ORIGINAL characters drawn for Pawlune (DESIGN_BRIEF): "ถั่วแดง" a round dog with a sage collar, "มะขาม" a cream cat.
// Idle motion is CSS only; prefers-reduced-motion disables it in globals.css.
type P = { className?: string; still?: boolean; tired?: boolean };

export function DogTuaDaeng({ className = 'h-28 w-28', still }: P) {
  const a = (v: string) => (still ? undefined : v);
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="ถั่วแดง หมากลมสีน้ำตาลใส่ปลอกคอสีเขียว">
      <g style={{ transformOrigin: '86px 78px', animation: a('wag 1.2s ease-in-out infinite') }}>
        <path d="M86 78c10-4 16-14 14-22" stroke="#6B4F3A" strokeWidth="7" strokeLinecap="round" fill="none" />
      </g>
      <g style={{ transformOrigin: '60px 80px', animation: a('breathe 3.5s ease-in-out infinite') }}>
        <ellipse cx="60" cy="84" rx="30" ry="24" fill="#B07D57" />
        <ellipse cx="60" cy="92" rx="16" ry="12" fill="#E9D3B6" />
        <circle cx="60" cy="50" r="27" fill="#B07D57" />
        <path d="M36 38c-10 4-12 22-4 28 6-6 8-18 4-28Z" fill="#6B4F3A" />
        <path d="M84 38c10 4 12 22 4 28-6-6-8-18-4-28Z" fill="#6B4F3A" />
        <ellipse cx="60" cy="60" rx="14" ry="10" fill="#E9D3B6" />
        <g style={{ transformOrigin: '60px 48px', animation: a('blink 4s infinite') }}>
          <circle cx="50" cy="48" r="3.4" fill="#3E2D22" /><circle cx="70" cy="48" r="3.4" fill="#3E2D22" />
        </g>
        <ellipse cx="60" cy="57" rx="4.5" ry="3.2" fill="#3E2D22" />
        <path d="M56 63c2 2 6 2 8 0" stroke="#3E2D22" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M38 72c14 6 30 6 44 0" stroke="#4E6E58" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="60" cy="78" r="3.5" fill="#C99A5B" />
      </g>
    </svg>
  );
}

export function CatMakham({ className = 'h-28 w-28', still, tired }: P) {
  const a = (v: string) => (still ? undefined : v);
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={tired ? 'มะขาม แมวสีครีมกำลังเหนื่อย' : 'มะขาม แมวสีครีม'}>
      <g style={{ transformOrigin: '34px 96px', animation: a('sway 2.8s ease-in-out infinite') }}>
        <path d="M34 96c-16 0-22-14-14-26" stroke="#D9C3A0" strokeWidth="7" strokeLinecap="round" fill="none" />
      </g>
      <g style={{ transformOrigin: '62px 84px', animation: a('breathe 4s ease-in-out infinite') }}>
        <ellipse cx="62" cy="88" rx="26" ry="20" fill="#EFE2C8" stroke="#D9C3A0" strokeWidth="2" />
        <circle cx="62" cy="54" r="24" fill="#EFE2C8" stroke="#D9C3A0" strokeWidth="2" />
        <path d="M42 40 40 20l16 12Z" fill="#EFE2C8" stroke="#D9C3A0" strokeWidth="2" strokeLinejoin="round" />
        <path d="M82 40 84 20 68 32Z" fill="#EFE2C8" stroke="#D9C3A0" strokeWidth="2" strokeLinejoin="round" />
        <path d="M45 30l-1-6 6 4ZM79 30l1-6-6 4Z" fill="#E7B9A3" />
        {tired ? (
          <g stroke="#3E2D22" strokeWidth="2.2" strokeLinecap="round"><path d="M48 54h7" /><path d="M69 54h7" /></g>
        ) : (
          <g style={{ transformOrigin: '62px 53px', animation: a('blink 5s infinite') }}>
            <ellipse cx="52" cy="53" rx="3" ry="3.8" fill="#3E2D22" /><ellipse cx="72" cy="53" rx="3" ry="3.8" fill="#3E2D22" />
          </g>
        )}
        <path d="M59 60h6l-3 3Z" fill="#C98F7A" />
        <path d="M62 63c-1 3-5 3-6 1M62 63c1 3 5 3 6 1" stroke="#3E2D22" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <g stroke="#B9A27E" strokeWidth="1.2" strokeLinecap="round"><path d="M44 60l-10-2M44 63l-10 1M80 60l10-2M80 63l10 1" /></g>
      </g>
    </svg>
  );
}
