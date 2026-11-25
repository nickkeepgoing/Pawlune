"use client";
import { useRef, useState } from "react";
import type { Summary } from "@/lib/engine/summary";
import { Logo } from "@/components/AppHeader";

type Props = {
  today: string;
  pet: { name: string; species: string; adopted_on: string | null };
  summary: Summary;
  weekly: { week: number; n: number; mean_mood: number }[];
  who5: { taken_on: string; pct: number }[];
  patterns: { sentence: string; chip: string | null; together: string[] }[];
  limitation: string;
  notes: { date: string; note: string }[];
};
const SECTIONS = [["pet", "ข้อมูลน้อง"], ["mood", "กราฟอารมณ์รายสัปดาห์"], ["who5", "คะแนนสุขภาวะทางใจ (WHO-5)"], ["patterns", "รูปแบบ"], ["notes", "บันทึกสั้นๆ รายวัน"]] as const;
type Key = (typeof SECTIONS)[number][0];
const SPECIES: Record<string, string> = { dog: "หมา", cat: "แมว", other: "อื่นๆ" };

export default function ReportBuilder(p: Props) {
  const [on, setOn] = useState<Record<Key, boolean>>({ pet: true, mood: true, who5: true, patterns: true, notes: false });
  const dlg = useRef<HTMLDialogElement>(null);
  const [agree, setAgree] = useState(false);
  const picked = SECTIONS.filter(([k]) => on[k]);

  return (
    <div className="space-y-5 pt-2">
      <div className="no-print space-y-4">
        <h1 className="text-2xl font-semibold">สร้างรายงาน</h1>
        <p className="text-bark">เลือกสิ่งที่จะใส่ในรายงาน ไฟล์นี้สร้างในเครื่องของคุณ เราไม่ได้ส่งไปที่ไหน</p>
        <fieldset className="paper space-y-1 p-5">
          <legend className="sr-only">ส่วนของรายงาน</legend>
          {SECTIONS.map(([k, l]) => (
            <label key={k} className="flex min-h-11 cursor-pointer items-center gap-3">
              <input type="checkbox" checked={on[k]} onChange={(e) => setOn({ ...on, [k]: e.target.checked })} className="size-5 accent-jade" />
              {l}{k === "notes" && <span className="text-sm text-bark">(ปิดไว้ก่อน เพราะเป็นข้อความส่วนตัว)</span>}
            </label>
          ))}
        </fieldset>
        <button disabled={!picked.length} onClick={() => { setAgree(false); dlg.current?.showModal(); }} className="btn btn-primary w-full">สร้าง PDF</button>
        <h2 className="pt-2 font-semibold">ตัวอย่าง</h2>
      </div>

      <dialog ref={dlg} aria-labelledby="exp-title" className="no-print m-auto w-[min(92vw,28rem)] rounded-[1.25rem] bg-paper p-6 text-cocoa backdrop:bg-cocoa/40">
        <h2 id="exp-title" className="text-lg font-semibold">ยืนยันการสร้างไฟล์</h2>
        <p className="mt-2 text-bark">ไฟล์จะมีข้อมูลต่อไปนี้ของคุณ:</p>
        <ul className="mt-1 list-disc pl-5">{picked.map(([k, l]) => <li key={k}>{l}</li>)}</ul>
        <p className="mt-2 text-sm text-bark">เมื่อบันทึกไฟล์แล้ว ใครที่ได้ไฟล์ไปจะเห็นข้อมูลนี้ได้ โปรดเก็บไว้อย่างระมัดระวัง</p>
        <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 size-5 accent-jade" />
          <span>ฉันยินยอมให้สร้างไฟล์ที่มีข้อมูลข้างต้น</span>
        </label>
        <p className="mt-2 text-xs text-bark">ในหน้าต่างพิมพ์ ให้เลือก &quot;บันทึกเป็น PDF&quot;</p>
        <div className="mt-4 flex gap-2">
          <button disabled={!agree} onClick={() => { dlg.current?.close(); setTimeout(() => window.print(), 50); }} className="btn btn-primary flex-1">สร้าง PDF</button>
          <button onClick={() => dlg.current?.close()} className="btn btn-ghost">ยกเลิก</button>
        </div>
      </dialog>

      <article className="paper space-y-5 p-6 print:p-0">
        <header className="flex items-start justify-between border-b border-line pb-3">
          <div><Logo /><p className="mt-1 text-sm text-bark">รายงานส่วนตัว · สร้างเมื่อ {p.today}</p></div>
        </header>
        {on.pet && (
          <section><h3 className="font-semibold">ข้อมูลน้อง</h3>
            <p>{p.pet.name} · {SPECIES[p.pet.species]}{p.pet.adopted_on ? ` · รับมาเลี้ยงเมื่อ ${p.pet.adopted_on}` : ""}</p></section>
        )}
        {on.mood && (
          <section><h3 className="font-semibold">อารมณ์วันนี้ (1–5) เฉลี่ยรายสัปดาห์</h3>
            <p className="text-sm text-bark">บันทึก {p.summary.days_logged} วัน · เฉลี่ยรวม {p.summary.mean_mood?.toFixed(2) ?? "–"}</p>
            {p.weekly.length ? (
              <table className="mt-2 w-full text-sm"><thead><tr className="text-left text-bark"><th className="py-1">สัปดาห์</th><th>จำนวนวัน</th><th>เฉลี่ย</th><th className="w-1/2" /></tr></thead>
                <tbody>{p.weekly.map((w) => (
                  <tr key={w.week} className="border-t border-line"><td className="num py-1">{w.week}</td><td className="num">{w.n}</td><td className="num">{w.mean_mood.toFixed(2)}</td>
                    <td><div className="h-3 rounded-full bg-sage print:border print:border-jade" style={{ width: `${(w.mean_mood / 5) * 100}%` }} /></td></tr>))}</tbody></table>
            ) : <p className="text-sm">ยังไม่มีข้อมูล</p>}
          </section>
        )}
        {on.who5 && (
          <section><h3 className="font-semibold">คะแนนสุขภาวะทางใจ (WHO-5)</h3>
            {p.who5.length ? <ul className="text-sm">{p.who5.map((w, i) => <li key={i}>{w.taken_on}: <span className="num font-semibold">{w.pct}/100</span></li>)}</ul> : <p className="text-sm">ยังไม่มีข้อมูล</p>}
          </section>
        )}
        {on.patterns && (
          <section><h3 className="font-semibold">รูปแบบ</h3>
            {p.patterns.length ? <ul className="space-y-2 text-sm">{p.patterns.map((x) => (
              <li key={x.sentence}>{x.sentence}{x.chip && <span className="text-bark"> ({x.chip})</span>}{x.together.map((t) => <span key={t} className="block text-bark">{t}</span>)}</li>))}</ul>
              : <p className="text-sm">ข้อมูลยังไม่พอสำหรับรูปแบบ</p>}
            <p className="mt-2 text-xs text-bark">{p.limitation}</p>
          </section>
        )}
        {on.notes && (
          <section><h3 className="font-semibold">บันทึกสั้นๆ รายวัน</h3>
            {p.notes.length ? <ul className="space-y-1 text-sm">{p.notes.map((n) => <li key={n.date}><span className="num text-bark">{n.date}</span> — {n.note}</li>)}</ul> : <p className="text-sm">ไม่มีบันทึก</p>}
          </section>
        )}
        <footer className="border-t border-line pt-3 text-sm text-bark">ข้อมูลบันทึกด้วยตนเอง ไม่ใช่การประเมินหรือวินิจฉัยทางคลินิก</footer>
      </article>
    </div>
  );
}
