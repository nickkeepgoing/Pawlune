'use client';
import { useRef } from 'react';

/** A number with large − and + buttons and optional one-tap amounts, so nobody has to type. */
export function NumberField({ name, label, unit, defaultValue, min = 0, max, step = 1, presets }: {
  name: string; label: string; unit: string; defaultValue: number | null | undefined;
  min?: number; max?: number; step?: number; presets?: number[];
}) {
  const ref = useRef<HTMLInputElement>(null);
  const set = (v: number) => {
    if (ref.current) ref.current.value = String(Math.min(max ?? v, Math.max(min, v)));
  };
  const nudge = (d: number) => set((Number(ref.current?.value) || 0) + d);
  const round = 'grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 border-jade/40 bg-paper text-3xl font-bold leading-none text-jade active:scale-95';
  const id = `field-${name}`;

  return (
    <div>
      <label htmlFor={id} className="block text-lg font-bold">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <button type="button" className={round} onClick={() => nudge(-step)} aria-label={`ลด ${label}`}>−</button>
        <input ref={ref} id={id} name={name} type="number" inputMode="numeric" min={min} max={max} step={1} defaultValue={defaultValue ?? ''} placeholder="0"
          className="field num h-14 w-full min-w-0 max-w-40 text-center text-2xl font-bold" />
        <button type="button" className={round} onClick={() => nudge(step)} aria-label={`เพิ่ม ${label}`}>+</button>
        <span className="text-base text-bark">{unit}</span>
      </div>
      {presets && (
        <div className="mt-2 flex flex-wrap gap-2">
          {presets.map((v) => (
            <button key={v} type="button" onClick={() => set(v)} className="min-h-12 rounded-full border-2 border-bark/20 bg-paper px-4 text-base font-semibold hover:border-jade/60">
              <span className="num">{v.toLocaleString('th-TH')}</span> {unit}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
