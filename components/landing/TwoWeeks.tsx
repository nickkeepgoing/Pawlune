'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/**
 * The first fortnight as three chapters a visitor picks between.
 *
 * Each chapter answers the same three questions, so the difference between them is the
 * thing that stands out. Advice repeats app/(app)/trial/CatCare.tsx — change them together.
 */
const CHAPTERS = [
  {
    when: 'วันที่ 1–3', title: 'น้องซ่อนตัว', photo: '/photos/hiding.jpg', alt: 'แมวแอบอยู่ใต้โต๊ะในบ้านใหม่',
    cat: 'ซ่อน นอนเยอะ หรือกินน้อย เป็นเรื่องปกติ', you: 'ให้อยู่ห้องเงียบหนึ่งห้อง ยังไม่ต้องเร่ง', app: 'บอกว่าอาการไหนต้องรีบพาไปหาหมอ',
  },
  {
    when: 'วันที่ 4–7', title: 'น้องเริ่มสำรวจ', photo: '/photos/bowl.jpg', alt: 'แมวนั่งอยู่ข้างชามอาหาร',
    cat: 'เริ่มออกมากินและเดินดูรอบๆ', you: 'เปิดห้องเพิ่มทีละห้อง เล่นด้วยไม้ตกแมว', app: 'ให้บันทึกอารมณ์และกิจกรรมวันละสิบวินาที',
  },
  {
    when: 'วันที่ 8–14', title: 'ถึงเวลาตัดสินใจ', photo: '/photos/settled.jpg', alt: 'ลูกแมวนอนบนโซฟาข้างโคมไฟ',
    cat: 'ส่วนใหญ่ปรับตัวราว 1–2 สัปดาห์ บางตัวนานกว่า', you: 'ดูว่าชีวิตของคุณกับน้องไปด้วยกันได้ไหม', app: 'วันที่ 14 สรุปก่อนกับหลัง แล้วให้คุณเลือก',
  },
] as const;

const SECONDS = 6;

/** Hiding, looking around, home: one picture per stop. */
const ChapterIcon = ({ k }: { k: number }) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {k === 0 && <><path d="M3 20v-6a9 9 0 0 1 18 0v6" /><path d="M8 15h.01M16 15h.01M2 20h20" /></>}
    {k === 1 && <><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></>}
    {k === 2 && <><path d="M4 11 12 4l8 7v9H4Z" /><path d="M12 17s-3-1.8-3-3.6a1.6 1.6 0 0 1 3-.9 1.6 1.6 0 0 1 3 .9c0 1.8-3 3.6-3 3.6Z" /></>}
  </svg>
);

export function TwoWeeks() {
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      setPlaying(true);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      if (at === CHAPTERS.length - 1) setPlaying(false);
      else setAt(at + 1);
    }, SECONDS * 1000);
    return () => window.clearTimeout(id);
  }, [playing, at]);

  const choose = (i: number) => { started.current = true; setPlaying(false); setAt(i); };
  const c = CHAPTERS[at];

  return (
    <div ref={ref} className="mx-auto w-full max-w-md px-5 md:max-w-3xl md:px-8 lg:max-w-4xl">
      <div role="tablist" aria-label="ช่วงเวลาของสองสัปดาห์แรก" className="relative grid grid-cols-3">
        {/* The path between the first and last stop; it fills up to the one chosen. */}
        <span aria-hidden className="absolute left-[16.66%] right-[16.66%] top-7 h-1.5 -translate-y-1/2 rounded-full bg-bark/15">
          <span className="block h-full rounded-full bg-jade transition-all duration-500" style={{ width: `${(at / (CHAPTERS.length - 1)) * 100}%` }} />
        </span>
        {CHAPTERS.map((x, i) => (
          <button key={x.when} type="button" role="tab" aria-selected={i === at} onClick={() => choose(i)}
            className="group relative flex flex-col items-center gap-1.5 px-1 text-center">
            <span className={`grid h-14 w-14 place-items-center rounded-full border-4 border-paper transition-all duration-300 ${
              i === at ? 'scale-110 bg-jade text-cream shadow-[0_12px_20px_-10px_var(--c-shadow)]' : i < at ? 'bg-[color-mix(in_srgb,var(--color-jade)_70%,var(--color-paper))] text-cream' : 'bg-cream text-bark ring-1 ring-bark/20 group-hover:bg-sage/40'
            }`}>
              <ChapterIcon k={i} />
            </span>
            <span className={`text-sm md:text-base ${i === at ? 'font-bold' : 'font-semibold text-bark'}`}>{x.title}</span>
            <span className="num text-xs text-bark">{x.when}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" className="relative mt-5 grid overflow-hidden gap-4 rounded-[1.5rem] bg-cream p-4 shadow-[0_26px_46px_-30px_var(--c-shadow)] ring-1 ring-bark/10 md:grid-cols-2 md:items-center md:p-5">
        {playing && <span key={`bar-${at}`} aria-hidden className="chapter-fill absolute left-0 top-0 h-1 bg-jade/60" style={{ animationDuration: `${SECONDS}s` }} />}
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl md:aspect-[4/3]">
          {CHAPTERS.map((x) => (
            <Image key={x.photo} src={x.photo} alt={x === c ? x.alt : ''} fill sizes="(min-width: 768px) 28rem, 100vw"
              className={`object-cover transition-opacity duration-300 ${x === c ? 'opacity-100' : 'opacity-0'}`} />
          ))}
        </div>
        <div key={`text-${at}`} className="rise-in space-y-2.5">
          {([['น้องเป็นยังไง', c.cat, 'bg-honey/25'], ['คุณทำอะไร', c.you, 'bg-sage/40'], ['แอปช่วยอะไร', c.app, 'bg-paper']] as const).map(([k, v, tone]) => (
            <div key={k} className={`rounded-xl p-3 ${tone}`}>
              <p className="text-xs font-bold text-jade">{k}</p>
              <p className="text-sm md:text-base">{v}</p>
            </div>
          ))}
          <button type="button" className="btn btn-quiet text-sm" onClick={() => { started.current = true; if (!playing && at === CHAPTERS.length - 1) setAt(0); setPlaying(!playing); }}>
            {playing ? 'หยุดเล่นอัตโนมัติ' : 'เล่นให้ดูทีละช่วง'}
          </button>
        </div>
      </div>
    </div>
  );
}
