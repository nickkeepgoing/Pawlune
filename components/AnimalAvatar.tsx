// Six original animal faces used as the default profile picture (until the user uploads a photo).
export const ANIMALS = ['dog', 'cat', 'rabbit', 'hamster', 'bird', 'turtle'] as const;
export type Animal = (typeof ANIMALS)[number];
export const ANIMAL_TH: Record<Animal, string> = { dog: 'หมา', cat: 'แมว', rabbit: 'กระต่าย', hamster: 'แฮมสเตอร์', bird: 'นก', turtle: 'เต่า' };
const BG: Record<Animal, string> = { dog: '#E9D3B6', cat: '#EFE2C8', rabbit: '#E6DCCB', hamster: '#F0D9B0', bird: '#CFE0C9', turtle: '#D8E4CF' };

/** Stable default animal per user id, so the picture does not change between visits. */
export function defaultAnimal(uid: string): Animal {
  let h = 0;
  for (const ch of uid) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ANIMALS[h % ANIMALS.length];
}

const eyes = (y = 52, dx = 11) => (<><circle cx={50 - dx} cy={y} r="3.4" fill="#3E2D22" /><circle cx={50 + dx} cy={y} r="3.4" fill="#3E2D22" /></>);
const smile = (y = 62) => <path d={`M45 ${y}c2 3 8 3 10 0`} stroke="#3E2D22" strokeWidth="2.2" fill="none" strokeLinecap="round" />;

const FACES: Record<Animal, React.ReactNode> = {
  dog: (<><path d="M24 34c-9 4-10 22-3 27 6-6 8-17 3-27ZM76 34c9 4 10 22 3 27-6-6-8-17-3-27Z" fill="#6B4F3A" /><circle cx="50" cy="54" r="24" fill="#B07D57" /><ellipse cx="50" cy="63" rx="12" ry="9" fill="#E9D3B6" />{eyes(50)}<ellipse cx="50" cy="59" rx="4" ry="3" fill="#3E2D22" />{smile(65)}</>),
  cat: (<><path d="M29 40 27 20l15 11ZM71 40 73 20 58 31Z" fill="#EFE2C8" stroke="#D9C3A0" strokeWidth="2" strokeLinejoin="round" /><circle cx="50" cy="54" r="24" fill="#EFE2C8" stroke="#D9C3A0" strokeWidth="2" />{eyes(52)}<path d="M47 59h6l-3 3Z" fill="#C98F7A" />{smile(63)}<path d="M30 60l-9-2M30 63l-9 1M70 60l9-2M70 63l9 1" stroke="#B9A27E" strokeWidth="1.3" strokeLinecap="round" /></>),
  rabbit: (<><ellipse cx="40" cy="22" rx="6" ry="17" fill="#FBF7EF" stroke="#D9C3A0" strokeWidth="2" /><ellipse cx="60" cy="22" rx="6" ry="17" fill="#FBF7EF" stroke="#D9C3A0" strokeWidth="2" /><ellipse cx="40" cy="22" rx="2.5" ry="11" fill="#E7B9A3" /><ellipse cx="60" cy="22" rx="2.5" ry="11" fill="#E7B9A3" /><circle cx="50" cy="56" r="23" fill="#FBF7EF" stroke="#D9C3A0" strokeWidth="2" />{eyes(54, 10)}<path d="M47 60h6l-3 3Z" fill="#E7B9A3" />{smile(64)}</>),
  hamster: (<><circle cx="30" cy="36" r="8" fill="#C99A5B" /><circle cx="70" cy="36" r="8" fill="#C99A5B" /><circle cx="50" cy="56" r="25" fill="#C99A5B" /><ellipse cx="50" cy="64" rx="17" ry="13" fill="#FBF7EF" />{eyes(52, 12)}<circle cx="50" cy="60" r="2.6" fill="#C98F7A" />{smile(64)}<circle cx="34" cy="62" r="4" fill="#E7B9A3" opacity=".7" /><circle cx="66" cy="62" r="4" fill="#E7B9A3" opacity=".7" /></>),
  bird: (<><path d="M50 26c-4-6 2-10 6-6" stroke="#4E6E58" strokeWidth="3" fill="none" strokeLinecap="round" /><circle cx="50" cy="54" r="24" fill="#A9C3A0" /><ellipse cx="50" cy="62" rx="14" ry="12" fill="#FBF7EF" />{eyes(48, 10)}<path d="M44 55h12l-6 7Z" fill="#C99A5B" /></>),
  turtle: (<><circle cx="50" cy="54" r="24" fill="#9DB88F" /><path d="M36 40c8-6 20-6 28 0" stroke="#4E6E58" strokeWidth="3" fill="none" strokeLinecap="round" />{eyes(53, 10)}{smile(63)}<circle cx="34" cy="61" r="3.5" fill="#E7B9A3" opacity=".6" /><circle cx="66" cy="61" r="3.5" fill="#E7B9A3" opacity=".6" /></>),
};

export function AnimalAvatar({ animal, className = 'h-10 w-10' }: { animal: Animal; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={`รูปโปรไฟล์${ANIMAL_TH[animal]}`}>
      <circle cx="50" cy="50" r="50" fill={BG[animal]} />
      {FACES[animal]}
    </svg>
  );
}

/** Profile picture: uploaded photo if any, otherwise the chosen (or default) animal. */
export function Avatar({ url, animal, className = 'h-10 w-10', alt = 'รูปโปรไฟล์' }: { url: string | null; animal: Animal; className?: string; alt?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  if (url) return <img src={url} alt={alt} className={`${className} rounded-full object-cover`} />;
  return <AnimalAvatar animal={animal} className={className} />;
}
