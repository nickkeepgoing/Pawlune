'use client';
import { useRef, useState, useTransition, type ChangeEvent, type FormEvent } from 'react';
import { resizeImage } from '@/lib/image';
import { addAnimal } from './actions';

const SELECTS: [string, string, [string, string][]][] = [
  ['species', 'ชนิด', [['cat', 'แมว'], ['dog', 'หมา']]],
  ['sex', 'เพศ', [['', 'ไม่ระบุ'], ['m', 'ตัวผู้'], ['f', 'ตัวเมีย']]],
  ['age_group', 'ช่วงวัย', [['young', 'อายุน้อย'], ['adult', 'โตเต็มวัย'], ['senior', 'สูงวัย']]],
  ['size', 'ขนาด', [['small', 'เล็ก'], ['medium', 'กลาง'], ['large', 'ใหญ่']]],
  ['energy', 'พลังงาน', [['calm', 'นิ่ง ชอบพัก'], ['medium', 'ปานกลาง'], ['active', 'พลังเยอะ']]],
  ['personality', 'นิสัย', [['cuddly', 'ขี้อ้อน'], ['independent', 'ชอบอยู่เงียบๆ']]],
  ['ok_with_cats', 'กับแมวตัวอื่น', [['unknown', 'ยังไม่ทราบ'], ['yes', 'อยู่ด้วยกันได้'], ['no', 'ไม่เข้ากัน']]],
  ['ok_with_dogs', 'กับหมา', [['unknown', 'ยังไม่ทราบ'], ['yes', 'อยู่ด้วยกันได้'], ['no', 'ไม่เข้ากัน']]],
];
const CHECKS: [string, string][] = [['vaccinated', 'ฉีดวัคซีนแล้ว'], ['neutered', 'ทำหมันแล้ว'], ['indoor_ok', 'เคยชินกับการอยู่ในบ้าน'], ['needs_fence', 'ต้องมีรั้วรอบ']];

export function AddAnimalForm() {
  const [photo, setPhoto] = useState<{ blob: Blob; url: string } | null>(null);
  const [message, setMessage] = useState<{ error?: string; ok?: string }>({});
  const [pending, start] = useTransition();
  const form = useRef<HTMLFormElement>(null);

  async function choose(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage({});
    try {
      const blob = await resizeImage(file, 1200); // small enough to send, and drops most metadata
      if (photo) URL.revokeObjectURL(photo.url);
      setPhoto({ blob, url: URL.createObjectURL(blob) });
    } catch {
      setMessage({ error: 'เปิดรูปนี้ไม่ได้ ลองรูปอื่น' });
    }
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!photo) { setMessage({ error: 'เลือกรูปของน้องก่อน' }); return; }
    const data = new FormData(e.currentTarget);
    data.set('photo', new File([photo.blob], 'animal.jpg', { type: 'image/jpeg' }));
    setMessage({});
    start(async () => {
      const res = await addAnimal(data);
      if ('error' in res) { setMessage(res); return; }
      setMessage(res);
      form.current?.reset();
      URL.revokeObjectURL(photo.url);
      setPhoto(null);
    });
  }

  return (
    <details className="rounded-3xl bg-paper p-4 ring-1 ring-bark/10">
      <summary className="flex min-h-11 cursor-pointer items-center font-bold text-jade">เพิ่มสัตว์เข้าศูนย์</summary>
      <form ref={form} method="post" onSubmit={submit} className="mt-3 grid gap-4 md:grid-cols-[14rem_1fr]">
        <label className="relative grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-bark/35 bg-cream text-center text-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {photo ? <img src={photo.url} alt="ตัวอย่างรูปที่เลือก" className="h-full w-full object-cover" /> : <span className="p-3 font-semibold text-bark">แตะเพื่อเลือกรูปน้อง</span>}
          <input type="file" accept="image/*" onChange={choose} className="sr-only" />
        </label>

        <div className="space-y-3">
          <label className="block"><span className="text-sm font-semibold">ชื่อน้อง</span><input name="name" required maxLength={40} className="field mt-1" /></label>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {SELECTS.map(([name, label, options]) => (
              <label key={name} className="block"><span className="text-sm">{label}</span>
                <select name={name} className="field mt-1">{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
              </label>
            ))}
          </div>
          <label className="block"><span className="text-sm">อยู่ลำพังได้กี่ชั่วโมงต่อวัน</span><input name="max_hours_alone" type="number" min={0} max={24} className="field mt-1" /></label>
          <div className="flex flex-wrap gap-x-5">
            {CHECKS.map(([name, label]) => (
              <label key={name} className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" name={name} className="h-5 w-5 accent-[#4E6E58]" />{label}</label>
            ))}
          </div>
          <label className="block"><span className="text-sm">เรื่องของน้อง</span><textarea name="story" maxLength={400} rows={2} className="field mt-1" /></label>
          <label className="block"><span className="text-sm">เรื่องสุขภาพที่ศูนย์รู้</span><textarea name="health_notes" maxLength={400} rows={2} className="field mt-1" /></label>
          {message.error && <p role="alert" className="card card-warn font-semibold">{message.error}</p>}
          {message.ok && <p role="status" className="card font-semibold">{message.ok}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={pending} aria-busy={pending}>{pending ? 'กำลังอัปโหลด…' : 'บันทึกและแสดงในรายชื่อ'}</button>
        </div>
      </form>
    </details>
  );
}
