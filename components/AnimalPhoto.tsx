import Image from 'next/image';
import { AnimalFace } from '@/components/Critters';

/** Stock pictures for the fictional demo animals (public/photos/CREDITS.md). */
const DEMO: Record<string, string> = {
  'ส้มจี๊ด': 'somjeed', 'มะตูม': 'matoom', 'งาดำ': 'ngadam', 'ปุยฝ้าย': 'puifai',
  'ถั่วแดง': 'thuadaeng', 'ข้าวตัง': 'khaotang', 'มะลิ': 'mali', 'โอวัลติน': 'ovaltine',
};

type Shown = { name: string; species: 'dog' | 'cat'; is_demo?: boolean; photo_url?: string | null };

/**
 * The shelter's own photo if it uploaded one; for demo animals a stock picture marked as
 * an illustration, so nobody takes it for the animal itself; otherwise a drawn face.
 */
export function AnimalPhoto({ animal, className = '', sizes = '(min-width: 768px) 33vw, 100vw', priority = false }: {
  animal: Shown; className?: string; sizes?: string; priority?: boolean;
}) {
  const demo = !animal.photo_url && animal.is_demo ? DEMO[animal.name] : undefined;
  const src = animal.photo_url || (demo ? `/photos/animals/${demo}.jpg` : null);
  return (
    <div className={`shimmer relative overflow-hidden ${className}`}>
      {src ? (
        <Image src={src} alt={demo ? `ภาพประกอบของ${animal.name}` : `รูปของ${animal.name}`} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div className="grid h-full place-items-center"><AnimalFace id={animal.name} species={animal.species} className="h-2/3 w-2/3" /></div>
      )}
      {demo && <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] text-white">ภาพประกอบ</span>}
    </div>
  );
}
