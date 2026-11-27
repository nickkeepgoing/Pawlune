'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const TrialScene = dynamic(() => import('./TrialScene'), { ssr: false });

const DAYS = 14;

/**
 * What the visitor sees first: the fourteen days themselves, draggable.
 *
 * Scrubbing the track moves the photograph, the line of copy and the 3D light together,
 * so the hero demonstrates the product's one idea instead of describing it. Nothing here
 * animates unprompted — every movement answers the person's drag or arrow key.
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

export function HeroTrial({ ctaHref, ctaText }: { ctaHref: string; ctaText: string }) {
  const [day, setDay] = useState(1);
  // The 3D reads this without re-rendering React on every frame of a drag.
  const dayRef = useRef(1);

  const set = (next: number) => {
    const clamped = Math.max(1, Math.min(DAYS, next));
    dayRef.current = clamped;
    setDay(clamped);
  };

  const beat = beatFor(day);

  return (
    <section className="relative overflow-hidden bg-[#2A211B] text-[#F3E7D6]">
      <TrialScene dayRef={dayRef} className="absolute inset-x-0 bottom-0 top-auto h-[62%] opacity-90" />

      <div className="relative mx-auto w-full max-w-md px-5 pb-10 pt-12 md:max-w-3xl md:px-8 md:pb-14 md:pt-20 lg:max-w-6xl">
        <div className="lg:grid lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div>
            <h1 className="text-balance text-[2.4rem] font-bold leading-[1.08] md:text-[3.2rem] lg:text-[3.6rem]">
              สิบสี่วันที่บอกได้ว่าบ้านนี้ใช่สำหรับน้องไหม
            </h1>
            <p className="mt-6 max-w-[52ch] text-[#CDB8A0] md:text-lg">
              ทดลองเลี้ยงภายใต้การดูแลของศูนย์ มีคนคอยบอกว่าอะไรปกติ แล้วค่อยตัดสินใจ
              ถ้าไม่ไหว น้องกลับไปหาบ้านที่เหมาะกว่าได้โดยไม่มีใครผิด
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href={ctaHref}
                className="inline-flex min-h-12 items-center rounded-full bg-[#E8B877] px-8 text-lg font-semibold text-[#2A211B] transition-transform active:scale-[.97]"
              >
                {ctaText}
              </Link>
              <p className="text-sm text-[#A08F7C]">ช่วงนำร่อง แมวในกรุงเทพฯ และปริมณฑล</p>
            </div>
          </div>

          {/* The photograph answers the scrub. */}
          <div className="relative mt-10 aspect-[5/4] overflow-hidden rounded-[1.25rem] lg:mt-0">
            {BEATS.map((b) => (
              <Image
                key={b.photo}
                src={b.photo}
                alt={b.alt}
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                priority={b === BEATS[0]}
                className={`object-cover transition-opacity duration-500 ${b === beat ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>
        </div>

        {/* The scrubber. Large numeral as the visual anchor, not a decorative accent. */}
        <div className="mt-12 md:mt-16">
          <div className="flex items-end justify-between gap-6">
            <p className="flex items-baseline gap-3">
              <span className="num text-[4.5rem] font-semibold leading-[0.8] text-[#E8B877] md:text-[6rem]">{day}</span>
              <span className="pb-1 text-lg text-[#CDB8A0]">วันที่</span>
            </p>
            <p className="max-w-[40ch] pb-2 text-right text-sm text-[#CDB8A0] md:text-base">{beat.line}</p>
          </div>

          <label className="mt-5 block">
            <span className="sr-only">เลื่อนดูวันที่ 1 ถึง 14 ของการทดลองเลี้ยง</span>
            <input
              type="range"
              min={1}
              max={DAYS}
              step={1}
              value={day}
              onChange={(e) => set(Number(e.target.value))}
              className="day-scrub w-full"
            />
          </label>

          <div className="mt-2 flex justify-between text-xs text-[#8C7B6A]">
            <span>รับน้องกลับบ้าน</span>
            <span>วันตัดสินใจ</span>
          </div>
        </div>
      </div>
    </section>
  );
}
