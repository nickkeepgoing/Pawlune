'use client';
import { useState } from 'react';

// Defaults come from the sourced figures on this page; the user changes them to their own.
export function Budget() {
  const [food, setFood] = useState(1500);
  const [flea, setFlea] = useState(320);
  const [visits, setVisits] = useState(2);
  const [months, setMonths] = useState(3);
  const yearlyVet = 420 + 240 + 170 * 2 + visits * 150; // combo + rabies vaccine, deworm twice, consult fee per visit
  const monthly = food + flea;
  const firstYear = monthly * 12 + yearlyVet;
  const emergency = monthly * months;
  const f = (n: number) => n.toLocaleString('th-TH');
  const Num = ({ label, v, set, step = 100, hint }: { label: string; v: number; set: (n: number) => void; step?: number; hint?: string }) => (
    <label className="block"><span className="text-sm">{label}</span>
      <input type="number" min={0} step={step} value={v} onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))} className="field mt-1" />
      {hint && <span className="mt-0.5 block text-xs text-bark">{hint}</span>}</label>
  );
  return (
    <section className="rounded-[var(--radius-card)] bg-paper p-5">
      <h2 className="text-lg font-bold">คำนวณงบของคุณ</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Num label="อาหาร+ขนม /เดือน" v={food} set={setFood} hint="1,000–3,000" />
        <Num label="ยาเห็บหมัด /เดือน" v={flea} set={setFlea} step={10} hint="เริ่ม 320" />
        <Num label="พาไปหาหมอ /ปี (ครั้ง)" v={visits} set={setVisits} step={1} hint="ค่าตรวจ 150/ครั้ง" />
        <Num label="เงินสำรองกี่เดือน" v={months} set={setMonths} step={1} hint="แนะนำ 3–6" />
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-cream p-2"><dt className="text-xs text-bark">ต่อเดือน</dt><dd className="num text-lg font-semibold">{f(monthly)}</dd></div>
        <div className="rounded-lg bg-cream p-2"><dt className="text-xs text-bark">ปีแรก</dt><dd className="num text-lg font-semibold">{f(firstYear)}</dd></div>
        <div className="rounded-lg bg-cream p-2"><dt className="text-xs text-bark">เงินสำรอง</dt><dd className="num text-lg font-semibold">{f(emergency)}</dd></div>
      </dl>
      <p className="mt-2 text-xs text-bark">หน่วยเป็นบาท · ปีแรกรวมวัคซีนรวม 420 พิษสุนัขบ้า 240 ถ่ายพยาธิ 2 ครั้ง และค่าตรวจ ยังไม่รวมค่ารักษาเมื่อป่วยและอุปกรณ์</p>
    </section>
  );
}
