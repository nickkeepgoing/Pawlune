'use client';
import { useEffect, useState } from 'react';
import { openHelp } from './HelpButton';

// Gentle nudge (WHO-5 raw < 12 or 5 low days in a row). Never gates anything; dismissible per day.
export function GentleCard({ today }: { today: string }) {
  const key = `paw.gentle.dismissed.${today}`;
  const [hidden, setHidden] = useState(true);
  useEffect(() => { try { setHidden(localStorage.getItem(key) === '1'); } catch { setHidden(false); } }, [key]);
  if (hidden) return null;
  return (
    <div className="rounded-[var(--radius-card)] border-[1.5px] border-sage bg-paper p-4">
      <p>ช่วงนี้ดูเหมือนจะเป็นช่วงที่ไม่ง่าย ถ้าอยากคุยกับใครสักคน กดตรงนี้ได้เลย</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={openHelp}>อยากคุยกับใครสักคน</button>
        <button className="btn text-bark" onClick={() => { try { localStorage.setItem(key, '1'); } catch {} setHidden(true); }}>ไว้ก่อน</button>
      </div>
    </div>
  );
}
