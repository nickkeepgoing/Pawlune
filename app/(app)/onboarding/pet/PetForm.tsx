'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { resizeImage } from '@/lib/image';
import { createPet } from '../actions';

export function PetForm({ uid }: { uid: string }) {
  const router = useRouter();
  const [species, setSpecies] = useState('dog');
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError(null);
    const form = new FormData(e.currentTarget);
    let photo_path: string | null = null;
    try {
      if (file) {
        const blob = await resizeImage(file, 1024);
        photo_path = `${uid}/${crypto.randomUUID()}.jpg`;
        const { error: upErr } = await createClient().storage.from('pet-photos').upload(photo_path, blob, { contentType: 'image/jpeg' });
        if (upErr) throw upErr;
      }
    } catch {
      setBusy(false); setError('อัปโหลดรูปไม่สำเร็จ ลองรูปอื่น หรือข้ามไปก่อนได้'); return;
    }
    const res = await createPet({ name: String(form.get('name') ?? ''), species, adopted_on: String(form.get('adopted_on') || '') || null, photo_path });
    if (res.error) { setBusy(false); setError(res.error); return; }
    router.push('/checkin');
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-5">
      <label className="block"><span className="font-semibold">ชื่อน้อง</span><input name="name" required maxLength={40} className="field mt-1" placeholder="เช่น ถั่วแดง" /></label>
      <fieldset>
        <legend className="font-semibold">น้องเป็น</legend>
        <div className="mt-2 flex gap-2">
          {[['dog', 'หมา'], ['cat', 'แมว'], ['other', 'อื่นๆ']].map(([v, l]) => (
            <button type="button" key={v} className="chip" aria-pressed={species === v} onClick={() => setSpecies(v)}>{l}</button>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="font-semibold">รูปน้อง</span> <span className="text-sm text-bark">(ไม่บังคับ เห็นได้คนเดียว)</span>
        <input type="file" accept="image/*" className="mt-2 block w-full text-sm file:mr-3 file:min-h-11 file:rounded-full file:border-0 file:bg-sage file:px-4 file:font-semibold file:text-cocoa"
          onChange={(e) => { const f = e.target.files?.[0] ?? null; setFile(f); setPreview(f ? URL.createObjectURL(f) : null); }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {preview && <img src={preview} alt="ตัวอย่างรูปน้อง" className="mt-3 h-40 w-40 rounded-[var(--radius-card)] object-cover" />}
      </label>
      <label className="block"><span className="font-semibold">รับน้องมาเมื่อไหร่</span> <span className="text-sm text-bark">(ไม่บังคับ)</span><input type="date" name="adopted_on" className="field mt-1" /></label>
      {error && <p className="text-sm font-semibold" role="alert">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-primary w-full">{busy ? 'กำลังบันทึก…' : 'ไปบันทึกวันแรก'}</button>
    </form>
  );
}
