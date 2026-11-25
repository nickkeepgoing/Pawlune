// Original characters (DESIGN_BRIEF): round dog "ถั่วแดง" with a sage collar, cream cat "มะขาม".
// Class names hook into CSS animations on /learn; elsewhere they render static.
type P = { size?: number; className?: string; mood?: "idle" | "tired" };

export function Dog({ size = 140, className = "" }: P) {
  return (
    <svg role="img" aria-label="น้องหมาถั่วแดง" width={size} height={size} viewBox="0 0 160 160" className={className}>
      <ellipse cx="80" cy="146" rx="46" ry="6" fill="#3E2D22" opacity=".1" />
      <g className="pet-tail" style={{ transformOrigin: "122px 112px" }}>
        <path d="M120 112c14-4 20-16 18-26" stroke="#9A6B4A" strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      <g className="pet-breathe" style={{ transformOrigin: "80px 140px" }}>
        <ellipse cx="80" cy="112" rx="44" ry="32" fill="#B9825B" />
        <ellipse cx="80" cy="122" rx="24" ry="17" fill="#F2E2CC" />
        <rect x="52" y="128" width="16" height="16" rx="8" fill="#9A6B4A" />
        <rect x="92" y="128" width="16" height="16" rx="8" fill="#9A6B4A" />
        <path d="M50 86q30 12 60 0" stroke="#4E6E58" strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx="80" cy="96" r="5" fill="#C99A5B" />
        <circle cx="80" cy="58" r="34" fill="#B9825B" />
        <path d="M50 42c-12 4-14 24-6 34 6-6 10-18 8-34z" fill="#7E5639" />
        <path d="M110 42c12 4 14 24 6 34-6-6-10-18-8-34z" fill="#7E5639" />
        <ellipse cx="80" cy="70" rx="17" ry="13" fill="#F2E2CC" />
        <g className="pet-blink" style={{ transformOrigin: "80px 54px" }}>
          <circle cx="67" cy="54" r="4" fill="#3E2D22" /><circle cx="93" cy="54" r="4" fill="#3E2D22" />
        </g>
        <ellipse cx="80" cy="64" rx="5.5" ry="4" fill="#3E2D22" />
        <path d="M74 72q6 5 12 0" stroke="#3E2D22" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function Cat({ size = 140, className = "", mood = "idle" }: P) {
  const tired = mood === "tired";
  return (
    <svg role="img" aria-label={tired ? "น้องแมวมะขามดูเหนื่อย" : "น้องแมวมะขาม"} width={size} height={size} viewBox="0 0 160 160" className={className}>
      <ellipse cx="80" cy="146" rx="40" ry="6" fill="#3E2D22" opacity=".1" />
      <g className="pet-sway" style={{ transformOrigin: "112px 132px" }}>
        <path d="M112 132c22 0 30-20 20-34" stroke="#E4CFA8" strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      <g className="pet-breathe" style={{ transformOrigin: "80px 140px" }}>
        <path d="M46 142c-4-40 10-62 34-62s38 22 34 62z" fill="#F0E0C2" />
        <ellipse cx="80" cy="124" rx="16" ry="14" fill="#FBF4E6" />
        <path d="M50 46l4-28 20 18zM110 46l-4-28-20 18z" fill="#E4CFA8" />
        <path d="M55 40l2-14 10 9zM105 40l-2-14-10 9z" fill="#E9B8A0" />
        <circle cx="80" cy="60" r="32" fill="#F0E0C2" />
        <path d="M70 32q10-6 20 0" stroke="#D8BC8E" strokeWidth="4" fill="none" strokeLinecap="round" />
        <g className="pet-blink" style={{ transformOrigin: "80px 58px" }}>
          {tired ? (
            <path d="M62 58q5 3 10 0M88 58q5 3 10 0" stroke="#3E2D22" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          ) : (
            <><ellipse cx="67" cy="58" rx="4" ry="5" fill="#3E2D22" /><ellipse cx="93" cy="58" rx="4" ry="5" fill="#3E2D22" /></>
          )}
        </g>
        <path d="M76 68h8l-4 4z" fill="#C9826B" />
        <path d={tired ? "M74 78q6-3 12 0" : "M73 75q3.5 3 7 0q3.5 3 7 0"} stroke="#3E2D22" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M50 66h-12M50 71l-11 3M110 66h12M110 71l11 3" stroke="#B59A78" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
