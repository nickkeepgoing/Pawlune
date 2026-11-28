'use client';
import dynamic from 'next/dynamic';
import { useRef } from 'react';

/** Client boundary for the 3D toys, plus a button so a keyboard can set them hopping too. */
const ToyScene = dynamic(() => import('./ToyScene'), { ssr: false });

export function ToyBox() {
  const hopAll = useRef<() => void>(() => {});
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-paper via-sage/25 to-honey/30 ring-1 ring-inset ring-bark/10">
      <ToyScene hopAllRef={hopAll} className="h-[24rem] w-full md:h-80" />
      <div className="flex justify-center pb-5">
        <button type="button" onClick={() => hopAll.current()} className="btn btn-ghost border-jade bg-paper/70 text-jade">
          ให้ของเล่นเด้ง
        </button>
      </div>
    </div>
  );
}
