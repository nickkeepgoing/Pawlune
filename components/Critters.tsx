// Small original animal drawings used across the app: coat-coloured faces for shelter animals,
// a paw print, and a cat that peeks over the top edge of a card. All decorative (aria-hidden) unless labelled.

export type Coat = { base: string; patch: string; line: string; pattern: 'plain' | 'tabby' | 'calico' | 'tux' };

const CAT_COATS: Coat[] = [
  { base: '#F2C79B', patch: '#E39B62', line: '#B9774A', pattern: 'tabby' },   // ส้ม
  { base: '#4A3B33', patch: '#2E241F', line: '#2E241F', pattern: 'plain' },   // ดำ
  { base: '#FBF3E6', patch: '#E0A36E', line: '#CDB79A', pattern: 'calico' },  // สามสี
  { base: '#D9D3CB', patch: '#A69C91', line: '#8E847A', pattern: 'tabby' },   // สีเทา
  { base: '#3E3430', patch: '#FBF3E6', line: '#2E241F', pattern: 'tux' },     // วัวขาวดำ
  { base: '#EFE2C8', patch: '#D9C3A0', line: '#C4AC86', pattern: 'plain' },   // ครีม
];
const DOG_COATS: Coat[] = [
  { base: '#B07D57', patch: '#E9D3B6', line: '#6B4F3A', pattern: 'plain' },
  { base: '#E8D2A8', patch: '#C99A5B', line: '#9A7446', pattern: 'plain' },
  { base: '#4A3B33', patch: '#C99A5B', line: '#2E241F', pattern: 'plain' },
];

/** Same animal → same coat everywhere (hash of a stable id or name). */
export function coatFor(key: string, species: 'cat' | 'dog'): Coat {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const list = species === 'cat' ? CAT_COATS : DOG_COATS;
  return list[h % list.length];
}

export function CatFace({ coat, className = 'h-16 w-16', label }: { coat: Coat; className?: string; label?: string }) {
  const eye = coat.base === '#4A3B33' || coat.base === '#3E3430' ? '#E9C46A' : '#3E2D22';
  return (
    <svg viewBox="0 0 80 80" className={`critter ${className}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <g className="critter-ears">
        <path d="M14 34 12 8l20 14Z" fill={coat.base} stroke={coat.line} strokeWidth="2" strokeLinejoin="round" />
        <path d="M66 34 68 8 48 22Z" fill={coat.pattern === 'calico' ? coat.patch : coat.base} stroke={coat.line} strokeWidth="2" strokeLinejoin="round" />
        <path d="M17 24l-1-9 8 6ZM63 24l1-9-8 6Z" fill="#E7B9A3" />
      </g>
      <ellipse cx="40" cy="44" rx="28" ry="25" fill={coat.base} stroke={coat.line} strokeWidth="2" />
      {coat.pattern === 'tabby' && <g stroke={coat.patch} strokeWidth="3" strokeLinecap="round"><path d="M40 21v8M33 22l2 6M47 22l-2 6" /></g>}
      {coat.pattern === 'calico' && <><path d="M44 20c12 0 22 8 24 20-8 2-18-4-24-20Z" fill={coat.patch} /><path d="M14 52c4-8 12-8 14 0-4 6-10 6-14 0Z" fill="#4A3B33" opacity=".8" /></>}
      {coat.pattern === 'tux' && <path d="M24 54c4-10 28-10 32 0 0 8-8 14-16 14s-16-6-16-14Z" fill={coat.patch} />}
      <g className="critter-eyes">
        <ellipse cx="30" cy="42" rx="3.4" ry="4.4" fill={eye} /><ellipse cx="50" cy="42" rx="3.4" ry="4.4" fill={eye} />
        <circle cx="31" cy="40.6" r="1.1" fill="#fff" /><circle cx="51" cy="40.6" r="1.1" fill="#fff" />
      </g>
      <path d="M37 50h6l-3 3Z" fill="#D98F7A" />
      <path d="M40 53c-1 3-5 3-6 1M40 53c1 3 5 3 6 1" stroke={coat.pattern === 'tux' ? '#6B4F3A' : '#3E2D22'} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="24" cy="52" r="3.5" fill="#E7A9A0" opacity=".45" /><circle cx="56" cy="52" r="3.5" fill="#E7A9A0" opacity=".45" />
    </svg>
  );
}

export function DogFace({ coat, className = 'h-16 w-16', label }: { coat: Coat; className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={`critter ${className}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <g className="critter-ears">
        <path d="M16 22c-10 4-12 24-3 30 7-6 9-20 3-30Z" fill={coat.line} />
        <path d="M64 22c10 4 12 24 3 30-7-6-9-20-3-30Z" fill={coat.line} />
      </g>
      <circle cx="40" cy="40" r="26" fill={coat.base} />
      <ellipse cx="40" cy="52" rx="14" ry="10" fill={coat.patch} />
      <g className="critter-eyes"><circle cx="31" cy="38" r="3.4" fill="#3E2D22" /><circle cx="49" cy="38" r="3.4" fill="#3E2D22" /><circle cx="32" cy="36.8" r="1.1" fill="#fff" /><circle cx="50" cy="36.8" r="1.1" fill="#fff" /></g>
      <ellipse cx="40" cy="48" rx="4.6" ry="3.4" fill="#3E2D22" />
      <path d="M36 54c2 2 6 2 8 0" stroke="#3E2D22" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M38 56c0 5 4 5 4 0" fill="#E58F86" />
    </svg>
  );
}

export function AnimalFace({ id, species, className, label }: { id: string; species: 'cat' | 'dog'; className?: string; label?: string }) {
  const coat = coatFor(id, species);
  return species === 'cat' ? <CatFace coat={coat} className={className} label={label} /> : <DogFace coat={coat} className={className} label={label} />;
}

export function PawPrint({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <ellipse cx="12" cy="16" rx="5.2" ry="4.4" /><ellipse cx="5.6" cy="10.4" rx="2.2" ry="2.8" /><ellipse cx="18.4" cy="10.4" rx="2.2" ry="2.8" />
      <ellipse cx="9.2" cy="5.8" rx="2.1" ry="2.7" /><ellipse cx="14.8" cy="5.8" rx="2.1" ry="2.7" />
    </svg>
  );
}

/** A cream cat peeking over the top edge of the parent (parent needs `relative`). */
export function PeekCat({ className = 'right-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 44" className={`peek pointer-events-none absolute -top-[40px] h-11 w-[90px] ${className}`} aria-hidden>
      <path d="M22 30 20 6l16 12ZM68 30 70 6 54 18Z" fill="#EFE2C8" stroke="#C4AC86" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 44c0-18 14-28 31-28s31 10 31 28Z" fill="#EFE2C8" stroke="#C4AC86" strokeWidth="2" />
      <g className="peek-eyes"><ellipse cx="35" cy="32" rx="3" ry="3.8" fill="#3E2D22" /><ellipse cx="55" cy="32" rx="3" ry="3.8" fill="#3E2D22" /></g>
      <path d="M42.5 38h5l-2.5 2.5Z" fill="#D98F7A" />
      <ellipse cx="18" cy="42" rx="7" ry="4" fill="#EFE2C8" stroke="#C4AC86" strokeWidth="2" /><ellipse cx="72" cy="42" rx="7" ry="4" fill="#EFE2C8" stroke="#C4AC86" strokeWidth="2" />
    </svg>
  );
}
