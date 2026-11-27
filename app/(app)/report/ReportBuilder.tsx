'use client';
import { useRef, useState } from 'react';
import { renderReportImage } from '@/lib/reportImage';

export interface ReportData {
  name: string; created: string; pet: string; range: string; daysLogged: number; meanMood: number | null;
  weeks: { week: number; n: number; mean_mood: number }[];
  who5: { date: string; pct: number }[];
  st5: { date: string; raw: number; level: string }[];
  trial: string[];
  patterns: { label: string; sentence: string; chip: string; extra: string[] }[];
  limitation: string;
  memories: { name: string; species: string; period: string; feeling: number | null; tags: string[]; note: string }[];
  notes: { date: string; note: string }[];
}

const SECTIONS = [
  { id: 'pet', label: 'ข้อมูลน้อง' },
  { id: 'mood', label: 'อารมณ์รายสัปดาห์' },
  { id: 'who5', label: 'คะแนนสุขภาวะทางใจ (WHO-5)' },
  { id: 'st5', label: 'ความเครียด (ST-5)' },
  { id: 'trial', label: 'การทดลองเลี้ยง' },
  { id: 'patterns', label: 'รูปแบบ' },
  { id: 'memories', label: 'สัตว์ที่เคยเลี้ยง (ความทรงจำ)' },
  { id: 'notes', label: 'โน้ต' },
] as const;
type Sec = (typeof SECTIONS)[number]['id'];

// PDF = browser print to PDF (docs/LOW_QUOTA_PLAN.md cut #2). Thai renders with the page font. Separate consent each time.
export function ReportBuilder({ data }: { data: ReportData }) {
  const [on, setOn] = useState<Record<Sec, boolean>>({ pet: true, mood: true, who5: true, st5: true, trial: true, patterns: true, memories: false, notes: false });
  const dlg = useRef<HTMLDialogElement>(null);
  const [agree, setAgree] = useState(false);
  const [img, setImg] = useState<{ url: string; blob: Blob } | null>(null);
  const [busy, setBusy] = useState(false);

  function ask() { setAgree(false); dlg.current?.showModal(); }

  async function exportNow() {
    dlg.current?.close();
    setBusy(true);
    try {
      const blob = await renderReportImage(data, on);
      if (img) URL.revokeObjectURL(img.url);
      setImg({ blob, url: URL.createObjectURL(blob) });
    } finally { setBusy(false); }
  }

  async function share() {
    if (!img) return;
    const file = new File([img.blob], 'paw-diary-report.png', { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
    if (nav.canShare?.({ files: [file] })) { try { await nav.share({ files: [file], title: 'Pawlune report' }); } catch { /* cancelled */ } }
  }

  return (
    <div className="space-y-5 py-2">
      <div className="no-print space-y-4">
        <h1 className="text-2xl font-bold">รายงานของฉัน</h1>
        <p className="text-bark">เลือกส่วนที่อยากใส่ แล้วบันทึกเป็นรูปภาพไว้เก็บเอง หรือนำไปให้นักจิตวิทยาหรือผู้เชี่ยวชาญดูเองได้ แอปไม่ได้ส่งข้อมูลให้ใคร</p>
        {/* Two groups, not one list: the private sections are a different decision from
            the rest, so they sit apart instead of carrying a parenthesis. */}
        <fieldset className="card card-quiet space-y-1">
          <legend className="mb-2 font-semibold">ส่วนที่ใส่ในรายงาน</legend>
          {SECTIONS.filter((s) => s.id !== 'notes' && s.id !== 'memories').map((s) => (
            <label key={s.id} className="flex min-h-11 items-center gap-3">
              <input type="checkbox" checked={on[s.id]} onChange={(e) => setOn({ ...on, [s.id]: e.target.checked })} className="h-5 w-5 accent-[#4E6E58]" />
              {s.label}
            </label>
          ))}
        </fieldset>

        <fieldset className="card card-warn space-y-1">
          <legend className="mb-1 font-semibold">ส่วนที่เป็นเรื่องส่วนตัว</legend>
          <p className="mb-2 text-sm text-bark">ปิดไว้ให้ก่อน เปิดเฉพาะตอนที่ตั้งใจจะให้ใครอ่านจริงๆ</p>
          {SECTIONS.filter((s) => s.id === 'notes' || s.id === 'memories').map((s) => (
            <label key={s.id} className="flex min-h-11 items-center gap-3">
              <input type="checkbox" checked={on[s.id]} onChange={(e) => setOn({ ...on, [s.id]: e.target.checked })} className="h-5 w-5 accent-[#4E6E58]" />
              {s.label}
            </label>
          ))}
        </fieldset>
        <p className="text-sm text-bark">ตัวอย่างรายงานอยู่ด้านล่าง เปลี่ยนตามที่เลือกทันที</p>
        <button className="btn btn-primary w-full" onClick={ask} disabled={busy}>{busy ? 'กำลังทำรูป…' : 'บันทึกรายงานเป็นรูปภาพ'}</button>
        {img && (
          <div className="card card-quiet space-y-2" role="status">
            <p className="font-semibold">รูปรายงานพร้อมแล้ว</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="ตัวอย่างรูปรายงาน" className="max-h-80 w-full rounded-lg border border-bark/20 object-contain object-top" />
            <div className="grid grid-cols-2 gap-2">
              <a href={img.url} download="paw-diary-report.png" className="btn btn-primary">ดาวน์โหลดรูป</a>
              <button className="btn btn-ghost" onClick={share}>แชร์ / ส่งต่อ</button>
            </div>
            <p className="text-xs text-bark">ถ้ากดดาวน์โหลดบนมือถือไม่ได้ ให้กดค้างที่รูปแล้วเลือกบันทึกรูป</p>
          </div>
        )}
      </div>

      <dialog ref={dlg} className="no-print m-auto max-w-sm rounded-[var(--radius-sheet)] bg-paper p-6 text-cocoa backdrop:bg-cocoa/40" aria-labelledby="exp-title">
        <h2 id="exp-title" className="text-lg font-bold">ยืนยันการส่งออกข้อมูล</h2>
        <p className="mt-2 text-sm">รูปภาพจะมีข้อมูลที่คุณเลือก ({SECTIONS.filter((s) => on[s.id]).map((s) => s.label).join(', ') || 'ยังไม่ได้เลือก'}) เมื่อบันทึกไฟล์แล้ว ไฟล์จะอยู่นอกแอป ใครที่ได้ไฟล์ไปจะอ่านได้</p>
        <label className="mt-4 flex items-start gap-3"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-5 w-5 accent-[#4E6E58]" /><span className="text-sm">ฉันยินยอมให้ส่งออกข้อมูลเหล่านี้เป็นไฟล์</span></label>
        <div className="mt-5 flex gap-2">
          <button className="btn btn-primary flex-1" disabled={!agree} onClick={exportNow}>ทำรูปภาพ</button>
          <button className="btn text-bark" onClick={() => dlg.current?.close()}>ยกเลิก</button>
        </div>
      </dialog>

      {/* Printable report (also previewed on screen) */}
      <article className="page space-y-5 rounded-[var(--radius-card)] border border-bark/20 p-5 text-sm print:border-0 print:p-0">
        <header>
          <p className="text-lg font-bold">Pawlune — รายงานบันทึกส่วนตัว</p>
          <p className="text-bark">{data.name && `${data.name} · `}ทำเมื่อ {data.created} · ช่วงข้อมูล {data.range}</p>
        </header>
        {on.pet && <section><h3 className="font-semibold">ข้อมูลน้อง</h3><p>{data.pet}</p></section>}
        {on.mood && (
          <section>
            <h3 className="font-semibold">อารมณ์รายสัปดาห์ (1–5)</h3>
            <p>บันทึกทั้งหมด {data.daysLogged} วัน{data.meanMood !== null && ` · อารมณ์เฉลี่ย ${data.meanMood.toFixed(2)}`}</p>
            <table className="mt-1 w-full text-left"><thead><tr className="text-bark"><th className="font-normal">สัปดาห์</th><th className="font-normal">จำนวนวัน</th><th className="font-normal">เฉลี่ย</th></tr></thead>
              <tbody>{data.weeks.map((w) => (<tr key={w.week}><td>{w.week}</td><td>{w.n}</td><td>{w.mean_mood.toFixed(2)}</td></tr>))}</tbody></table>
          </section>
        )}
        {on.who5 && (
          <section>
            <h3 className="font-semibold">คะแนนสุขภาวะทางใจ (WHO-5, 0–100)</h3>
            {data.who5.length ? <ul>{data.who5.map((w, i) => (<li key={i}>{w.date}: {w.pct}/100</li>))}</ul> : <p>ยังไม่มีคำตอบ</p>}
          </section>
        )}
        {on.st5 && (
          <section>
            <h3 className="font-semibold">ความเครียด (ST-5, 0–15)</h3>
            {data.st5.length ? <ul>{data.st5.map((s, i) => (<li key={i}>{s.date}: {s.raw}/15 {s.level}</li>))}</ul> : <p>ยังไม่มีคำตอบ</p>}
          </section>
        )}
        {on.trial && data.trial.length > 0 && (
          <section>
            <h3 className="font-semibold">การทดลองเลี้ยง</h3>
            {data.trial.map((t, i) => <p key={i}>{t}</p>)}
          </section>
        )}
        {on.patterns && (
          <section>
            <h3 className="font-semibold">รูปแบบ</h3>
            {data.patterns.length ? data.patterns.map((p) => (
              <div key={p.label} className="mt-2"><p>{p.sentence} <span className="text-bark">({p.chip})</span></p>{p.extra.map((e) => <p key={e} className="text-bark">{e}</p>)}</div>
            )) : <p>ข้อมูลยังไม่พอสำหรับรูปแบบ</p>}
            <p className="mt-2 text-bark">{data.limitation}</p>
          </section>
        )}
        {on.memories && (
          <section>
            <h3 className="font-semibold">สัตว์ที่เคยเลี้ยง (บันทึกโดยผู้ใช้)</h3>
            {data.memories.length ? (
              <table className="mt-1 w-full text-left">
                <thead><tr className="text-bark"><th className="font-normal">ชื่อ</th><th className="font-normal">ช่วงเวลา</th><th className="font-normal">ความรู้สึกเมื่อนึกถึง</th></tr></thead>
                <tbody>{data.memories.map((m, i) => (
                  <tr key={i} className="align-top"><td>{m.name} ({m.species})</td><td>{m.period || '-'}</td>
                    <td>{m.feeling ? `${m.feeling}/5` : '-'}{m.tags.length > 0 && <div className="text-bark">{m.tags.join(', ')}</div>}{m.note && <div>{m.note}</div>}</td></tr>
                ))}</tbody>
              </table>
            ) : <p>ไม่มีบันทึก</p>}
            <p className="mt-1 text-bark">ข้อมูลส่วนนี้ไม่ได้นำไปคำนวณรูปแบบ</p>
          </section>
        )}
        {on.notes && (
          <section>
            <h3 className="font-semibold">โน้ต</h3>
            {data.notes.length ? <ul>{data.notes.map((n, i) => (<li key={i}><span className="text-bark">{n.date}:</span> {n.note}</li>))}</ul> : <p>ไม่มีโน้ต</p>}
          </section>
        )}
        <footer className="border-t border-bark/20 pt-3 text-xs text-bark">ข้อมูลบันทึกด้วยตนเอง ไม่ใช่การประเมินหรือวินิจฉัยทางคลินิก</footer>
      </article>
    </div>
  );
}
