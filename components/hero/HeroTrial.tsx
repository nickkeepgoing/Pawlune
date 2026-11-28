'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const TrialScene = dynamic(() => import('./TrialScene'), { ssr: false });

const DAYS = 14;

/**
 * An illustration of the fourteen days, draggable, inside the landing page's
 * "experience" section. The section supplies the heading, so this renders none.
 *
 * Scrubbing the track moves the photograph, the line of copy and the 3D markers together.
 * It plays through once when first seen, can be paused, and stops as soon as it is touched.
 * It exists only on the landing page: it is not a
 * screen in the app, and the copy around it must not say it is.
 */

type Beat = { until: number; photo: string; alt: string; line: string };

// Ranges, not one entry per day: the fortnight has three moods, and pretending we have
// fourteen distinct things to say would be padding.
const BEATS: Beat[] = [
  {
    until: 4,
    photo: '/photos/hiding.jpg',
    alt: 'แมวแอบอยู่ใต้โต๊ะในบ้านใหม่',
    line: 'น้องยังไม่ออกมา กินน้อย ซ่อนทั้งวัน แอปบอกว่าช่วงนี้ปกติ และอะไรที่ไม่ปกติ',
  },
  {
    until: 10,
    photo: '/photos/bowl.jpg',
    alt: 'แมวนั่งอยู่ข้างชามอาหาร',
    line: 'เริ่มกินเอง เริ่มเดินสำรวจ คุณบันทึกวันละสิบวินาที ศูนย์เห็นว่าน้องเป็นยังไง',
  },
  {
    until: DAYS,
    photo: '/photos/settled.jpg',
    alt: 'ลูกแมวนอนบนโซฟาข้างโคมไฟ',
    line: 'ถึงวันตัดสินใจ คุณมีบันทึกสิบสี่วันของตัวเองไว้ดู ไม่ใช่แค่ความรู้สึกชั่วข้ามคืน',
  },
];

const beatFor = (day: number) => BEATS.find((b) => day <= b.until) ?? BEATS[BEATS.length - 1];

export function HeroTrial() {
  const [day, setDay] = useState(1);
  // The 3D reads this without re-rendering React on every frame of a drag.
  const dayRef = useRef(1);

  const set = (next: number) => {
    const clamped = Math.max(1, Math.min(DAYS, next));
    dayRef.current = clamped;
    setDay(clamped);
  };

  const beat = beatFor(day);

  // Play the fortnight once when it comes into view, so it explains itself without a drag.
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      setPlaying(true);
    }, { threshold: 0.55 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      if (dayRef.current >= DAYS) { setPlaying(false); return; }
      set(dayRef.current + 1);
    }, 650);
    return () => window.clearInterval(id);
  }, [playing]);

  const toggle = () => {
    started.current = true;
    if (!playing && dayRef.current >= DAYS) set(1);
    setPlaying(!playing);
  };

  return (
    <section ref={rootRef} className="relative">
      <div className="mx-auto w-full max-w-md px-5 md:max-w-3xl md:px-8 lg:max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          {/* The photograph answers the scrub. */}
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] shadow-[0_26px_50px_-24px_var(--c-shadow)]">
            {BEATS.map((b) => (
              <Image
                key={b.photo}
                src={b.photo}
                alt={b === beat ? b.alt : ''}
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className={`object-cover transition-all duration-700 ${b === beat ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}
              />
            ))}
          </div>

          {/* The numeral is the visual anchor, with the day's line under it. */}
          <div>
            <p className="flex items-baseline gap-3">
              <span className="num text-[4.5rem] font-semibold leading-[0.8] text-jade md:text-[6rem]">{day}</span>
              <span className="pb-1 text-lg text-bark">วันที่</span>
            </p>
            <p className="mt-5 min-h-[5.5rem] max-w-[40ch] text-bark md:text-lg">{beat.line}</p>
            <button type="button" onClick={toggle} className="btn btn-ghost mt-2 border-jade text-jade">
              {playing ? 'หยุด' : day >= DAYS ? 'เล่นอีกครั้ง' : 'เล่นให้ดู'}
            </button>
          </div>
        </div>

        <div className="mt-8 md:mt-10">
          {/* Its own row, so no day marker hides behind the photograph. */}
          <TrialScene dayRef={dayRef} className="h-32 w-full md:h-44" />

          <label className="block">
            <span className="sr-only">เลื่อนดูวันที่ 1 ถึง 14 ของการทดลองเลี้ยง</span>
            <input
              type="range"
              min={1}
              max={DAYS}
              step={1}
              value={day}
              onChange={(e) => { started.current = true; setPlaying(false); set(Number(e.target.value)); }}
              className="day-scrub w-full"
              style={{ '--p': `${((day - 1) / (DAYS - 1)) * 100}%` } as CSSProperties}
            />
          </label>

          <div className="mt-2 flex justify-between text-xs text-bark">
            <span>รับน้องกลับบ้าน</span>
            <span>วันตัดสินใจ</span>
          </div>
        </div>
      </div>
    </section>
  );
}
