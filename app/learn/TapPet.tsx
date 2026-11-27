'use client';
import { useState } from 'react';
import { CatMakham, DogTuaDaeng } from '@/components/Pets';

// Tap/hover → small hop + one heart floats up.
export function TapPet({ kind, tired = false, className = 'h-28 w-28' }: { kind: 'dog' | 'cat'; tired?: boolean; className?: string }) {
  const [n, setN] = useState(0);
  const [comforted, setComforted] = useState(false);
  const go = () => { setN((x) => x + 1); if (tired) setComforted(true); };
  return (
    <button type="button" onClick={go} onMouseEnter={go} className="relative shrink-0 rounded-full"
      aria-label={kind === 'dog' ? 'แตะถั่วแดง' : 'แตะมะขาม'}>
      <span key={n} className="block" style={{ animation: n ? 'hop .5s ease-out' : undefined }}>
        {kind === 'dog' ? <DogTuaDaeng className={className} /> : <CatMakham className={className} tired={tired && !comforted} />}
      </span>
      {n > 0 && (
        <svg key={`h${n}`} viewBox="0 0 24 24" className="pointer-events-none absolute left-1/2 top-0 h-6 w-6 -translate-x-1/2 text-honey" style={{ animation: 'floatUp 1s ease-out forwards' }} fill="currentColor" aria-hidden>
          <path d="M12 21s-7.5-4.6-9.5-9.2C1 8.4 3.2 5 6.6 5c2 0 3.5 1.1 5.4 3 1.9-1.9 3.4-3 5.4-3 3.4 0 5.6 3.4 4.1 6.8C19.5 16.4 12 21 12 21Z" />
        </svg>
      )}
    </button>
  );
}
