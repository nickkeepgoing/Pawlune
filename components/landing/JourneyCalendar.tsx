'use client';
import { useState } from 'react';

/**
 * The adoption journey laid out as a calendar a visitor can tap through.
 *
 * The advice per period repeats the cat guidance the trial screen shows
 * (app/(app)/trial/CatCare.tsx, sources in docs/EVIDENCE.md #20–30). Change them together.
 */
type Phase = {
  key: string;
  when: string;
  title: string;
  points: string[];
  warn?: string;
  tone: string;
};

const PHASES: Record<'before' | 'rest' | 'open' | 'live' | 'decide' | 'after', Phase> = {
  before: {
    key: 'before', when: 'ก่อนวันรับน้อง', title: 'เช็กความพร้อมของบ้าน', tone: 'bg-cream',
    points: ['ตอบเรื่องบ้าน เวลา งบ อาการแพ้ และสัตว์เดิม', 'ดูน้องที่เข้ากัน พร้อมเหตุผลทุกข้อ', 'ส่งคำขอ แล้วรอศูนย์อนุมัติ'],
  },
  rest: {
    key: 'rest', when: 'วันที่ 1–3', title: 'ให้น้องอยู่ห้องเดียวก่อน', tone: 'bg-honey/30',
    points: ['ซ่อนตัว นอนเยอะ หรือกินน้อย เป็นเรื่องปกติของแมวที่ย้ายบ้าน', 'จัดห้องเงียบ มีที่ซ่อน น้ำ อาหาร และกระบะทราย', 'ใช้อาหารแบบเดียวกับที่ศูนย์ให้'],
    warn: 'ไม่กินอาหารเกิน 24 ชั่วโมง ให้พาไปหาหมอทันที',
  },
  open: {
    key: 'open', when: 'วันที่ 4–7', title: 'ค่อยๆ เปิดพื้นที่', tone: 'bg-sage/45',
    points: ['น้องกิน ใช้กระบะ และออกมาหาเองแล้ว จึงเปิดห้องเพิ่มทีละห้อง', 'มีสัตว์เดิม ให้ดมกลิ่นกันก่อนเจอตัว', 'เล่นด้วยไม้ตกแมว ไม่ใช้มือเล่น'],
  },
  live: {
    key: 'live', when: 'วันที่ 8–13', title: 'ใช้ชีวิตจริงด้วยกัน', tone: 'bg-jade/20',
    points: ['แมวส่วนใหญ่ปรับตัวราว 1–2 สัปดาห์ บางตัวนานกว่านั้น', 'สังเกตว่าเวลาอยู่บ้าน เสียง และค่าใช้จ่าย ไปกันได้ไหม', 'จดเรื่องที่กังวลไว้คุยกับศูนย์'],
  },
  decide: {
    key: 'decide', when: 'วันที่ 14', title: 'วันตัดสินใจ', tone: 'bg-jade text-cream',
    points: ['ดูบันทึกของตัวเอง และแบบวัดก่อนกับหลัง', 'เลือกรับเป็นครอบครัว คืนให้ศูนย์ หรือยังไม่แน่ใจ', '14 วันไม่ได้รับประกันว่าจะเข้ากันได้'],
  },
  after: {
    key: 'after', when: 'หลังจากนั้น', title: 'ดูแลกันต่อ', tone: 'bg-cream',
    points: ['รับเลี้ยงแล้ว ส่งความเป็นอยู่ของน้องให้ศูนย์ทุก 30 วัน', 'มีปัญหาเมื่อไรก็แจ้งศูนย์ได้', 'ถ้าคืน น้องกลับไปหาบ้านที่เหมาะกว่า'],
  },
};

type Pick = 'before' | 'after' | number;
const phaseOfDay = (d: number): Phase => (d <= 3 ? PHASES.rest : d <= 7 ? PHASES.open : d <= 13 ? PHASES.live : PHASES.decide);
const phaseOf = (p: Pick) => (typeof p === 'number' ? phaseOfDay(p) : PHASES[p]);
const ORDER: Pick[] = ['before', ...Array.from({ length: 14 }, (_, i) => i + 1), 'after'];

const GOALS: [Pick, string, string][] = [
  ['before', 'ตัดสินใจโดยมีข้อมูล', 'รู้ว่าพร้อมแค่ไหนก่อนพาน้องกลับบ้าน'],
  [1, 'ช่วงปรับตัวมีคนช่วย', 'สองสัปดาห์แรกไม่ต้องเดาเอาเอง'],
  ['after', 'เลี้ยงกันได้ยาว', 'รู้ว่าเมื่อไรต้องขอความช่วยเหลือ'],
];

export function JourneyCalendar() {
  const [pick, setPick] = useState<Pick>(1);
  const phase = phaseOf(pick);
  const at = ORDER.indexOf(pick);
  const ring = 'ring-[3px] ring-cocoa ring-offset-2 ring-offset-paper';

  const wide = (p: 'before' | 'after', label: string) => (
    <button type="button" aria-pressed={pick === p} onClick={() => setPick(p)}
      className={`flex min-h-11 w-full items-center justify-center rounded-xl border border-dashed border-bark/35 bg-cream text-sm font-semibold ${pick === p ? ring : 'hover:bg-sage/25'}`}>
      {label}
    </button>
  );

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {GOALS.map(([target, title, body]) => {
          const on = phaseOf(target).key === phase.key;
          return (
            <button key={title} type="button" aria-pressed={on} onClick={() => setPick(target)}
              className={`rounded-2xl border p-4 text-left transition-all ${on ? '-translate-y-1 border-jade bg-sage/35 shadow-[0_18px_28px_-20px_var(--c-shadow)]' : 'border-bark/15 bg-paper hover:-translate-y-0.5'}`}>
              <span className="block font-bold">{title}</span>
              <span className="mt-1 block text-sm text-bark">{body}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1.05fr_1fr] md:items-start">
        {/* A wall calendar: two sheets behind it and two binder rings give it weight. */}
        <div className="relative">
          <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-[1.5rem] bg-sage/35" />
          <div aria-hidden className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[1.5rem] bg-honey/25" />
          <div className="relative overflow-hidden rounded-[1.5rem] bg-paper shadow-[0_28px_44px_-26px_var(--c-shadow)] ring-1 ring-bark/10">
            <div className="flex items-center justify-between bg-jade px-4 py-3 text-cream">
              <span aria-hidden className="h-3 w-3 rounded-full bg-cream/80" />
              <p className="font-bold">ปฏิทิน 14 วัน (ตัวอย่างสำหรับแมว)</p>
              <span aria-hidden className="h-3 w-3 rounded-full bg-cream/80" />
            </div>
            <div className="space-y-3 p-3 lg:p-4">
              {wide('before', 'ก่อนวันรับน้อง')}
              <div className="grid grid-cols-7 gap-1.5">
                {ORDER.filter((d): d is number => typeof d === 'number').map((d) => (
                  <button key={d} type="button" aria-pressed={pick === d} aria-label={`วันที่ ${d} ${phaseOfDay(d).title}`} onClick={() => setPick(d)}
                    className={`num flex h-11 items-center justify-center rounded-lg text-base font-bold transition-transform ${phaseOfDay(d).tone} ${pick === d ? `${ring} scale-105` : 'hover:scale-105'}`}>
                    {d}
                  </button>
                ))}
              </div>
              {wide('after', 'หลังจากนั้น')}
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-bark">
                {[PHASES.rest, PHASES.open, PHASES.live, PHASES.decide].map((p) => (
                  <li key={p.key} className="flex items-center gap-1.5"><span aria-hidden className={`h-3 w-3 rounded ${p.tone}`} />{p.when}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-paper p-5 shadow-[0_24px_40px_-28px_var(--c-shadow)] ring-1 ring-bark/10">
          <div key={phase.key} className="rise-in" aria-live="polite">
            <p className="text-sm font-semibold text-jade">{typeof pick === 'number' ? `วันที่ ${pick}` : phase.when}</p>
            <h3 className="text-xl font-bold">{phase.title}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {phase.points.map((t, i) => (
                <li key={t} className="flex items-start gap-3">
                  <span aria-hidden className="num grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sage/50 text-sm font-bold">{i + 1}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            {phase.warn && <p className="mt-4 rounded-xl border-l-4 border-honey bg-honey/20 p-3 text-sm font-semibold">{phase.warn}</p>}
          </div>
          <div className="mt-5 flex justify-between gap-3">
            <button type="button" className="btn btn-ghost" disabled={at === 0} onClick={() => setPick(ORDER[at - 1])}>ก่อนหน้า</button>
            <button type="button" className="btn btn-primary" disabled={at === ORDER.length - 1} onClick={() => setPick(ORDER[at + 1])}>ถัดไป</button>
          </div>
        </div>
      </div>
    </div>
  );
}
