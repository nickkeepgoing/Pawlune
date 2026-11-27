// Pawlune logo: a paw print whose main pad is a crescent moon (paw + lune).
// The moon stands for the nights and days of the 14-day trial: a bond that grows over time.
const MOON = 'M16.21 27.44A19 19 0 1 0 47.79 27.44A16 16 0 1 1 16.21 27.44Z';

export function LogoMark({ className = 'h-7 w-7', moon = '#4E6E58', toes = '#C99A5B', title }: { className?: string; moon?: string; toes?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <path d={MOON} fill={moon} transform="rotate(-14 32 40)" />
      <g fill={toes}>
        <ellipse cx="14" cy="21" rx="4.8" ry="5.8" transform="rotate(-28 14 21)" />
        <ellipse cx="24.5" cy="11.5" rx="4.8" ry="6" transform="rotate(-10 24.5 11.5)" />
        <ellipse cx="38" cy="10.5" rx="4.8" ry="6" transform="rotate(8 38 10.5)" />
        <ellipse cx="49" cy="18.5" rx="4.8" ry="5.8" transform="rotate(26 49 18.5)" />
      </g>
    </svg>
  );
}

/** Mark + wordmark. Use inside a link; the visible text is the accessible name. */
export function Logo({ className = '', size = 'h-7 w-7' }: { className?: string; size?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={size} />
      <span className="font-[family-name:var(--font-num)] text-[1.15em] font-bold tracking-[-0.01em] text-cocoa">Pawlune</span>
    </span>
  );
}
