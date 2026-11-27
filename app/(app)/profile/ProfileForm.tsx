'use client';
import { useRouter } from 'next/navigation';
import { useActionState, useRef, useState } from 'react';
import { ANIMALS, ANIMAL_TH, AnimalAvatar, Avatar, type Animal } from '@/components/AnimalAvatar';
import { SubmitButton } from '@/components/SubmitButton';
import { createClient } from '@/lib/supabase/client';
import { resizeImage } from '@/lib/image';
import { USERNAME_HINT } from '@/lib/username';
import { saveProfile, setAvatarAnimal, setAvatarPhoto, type ProfileState } from './actions';

type Props = { uid: string; avatarUrl: string | null; animal: Animal; hasPhoto: boolean; displayName: string; username: string; email: string; google: boolean };

export function ProfileForm({ uid, avatarUrl, animal, hasPhoto, displayName, username, email, google }: Props) {
  const router = useRouter();
  const [state, action] = useActionState<ProfileState, FormData>(saveProfile, {});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  async function upload(f: File | undefined) {
    if (!f) return;
    setBusy(true); setErr(null);
    try {
      const blob = await resizeImage(f, 512);
      const path = `${uid}/avatar-${crypto.randomUUID()}.jpg`;
      const { error } = await createClient().storage.from('pet-photos').upload(path, blob, { contentType: 'image/jpeg' });
      if (error) throw error;
      const res = await setAvatarPhoto(path);
      if (res.error) throw new Error(res.error);
      router.refresh();
    } catch { setErr('อัปโหลดรูปไม่สำเร็จ ลองรูปอื่น'); }
    setBusy(false);
  }

  return (
    <div className="space-y-6 py-2">
      <h1 className="text-2xl font-bold">โปรไฟล์ของฉัน</h1>

      <section className="page flex flex-col items-center rounded-[var(--radius-sheet)] border border-bark/20 p-6 text-center">
        <Avatar url={avatarUrl} animal={animal} className="h-28 w-28" />
        <p className="mt-3 text-lg font-bold">{displayName || username || 'ไม่มีชื่อ'}</p>
        {username && <p className="text-sm text-bark">@{username}</p>}
        <input ref={input} type="file" accept="image/*" className="sr-only" aria-label="เลือกรูปโปรไฟล์" onChange={(e) => upload(e.target.files?.[0])} />
        <button onClick={() => input.current?.click()} disabled={busy} className="btn btn-primary mt-4">{busy ? 'กำลังอัปโหลด…' : hasPhoto ? 'เปลี่ยนรูปโปรไฟล์' : 'ใส่รูปโปรไฟล์'}</button>
        {err && <p className="mt-2 text-sm font-semibold" role="alert">{err}</p>}
        <p className="mt-2 text-xs text-bark">รูปโปรไฟล์เห็นได้คนเดียว</p>
      </section>

      <section className="card card-quiet">
        <h2 className="font-semibold">{hasPhoto ? 'หรือใช้รูปสัตว์แทน' : 'เลือกรูปสัตว์'}</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {ANIMALS.map((a) => (
            <form key={a} action={setAvatarAnimal}>
              <input type="hidden" name="animal" value={a} />
              <button aria-pressed={!hasPhoto && a === animal} className={`flex w-full flex-col items-center gap-1 rounded-[var(--radius-card)] border-2 p-2 text-sm ${!hasPhoto && a === animal ? 'border-jade bg-sage/40' : 'border-transparent'}`}>
                <AnimalAvatar animal={a} className="h-14 w-14" />{ANIMAL_TH[a]}
              </button>
            </form>
          ))}
        </div>
      </section>

      <form action={action} className="card card-quiet space-y-3">
        <label className="block"><span className="font-semibold">ชื่อที่ให้แอปเรียก</span><input name="display_name" defaultValue={displayName} maxLength={40} className="field mt-1" /></label>
        <label className="block"><span className="font-semibold">ชื่อผู้ใช้</span> {google && !username && <span className="text-sm text-bark">(ตั้งไว้ จะใช้ล็อกอินด้วยรหัสผ่านได้ภายหลัง)</span>}
          <input name="username" defaultValue={username} autoCapitalize="none" spellCheck={false} className="field mt-1" />
          <span className="mt-1 block text-xs text-bark">{USERNAME_HINT}</span></label>
        <p className="text-sm text-bark">อีเมล: {email} {google && '· เข้าสู่ระบบด้วย Google'}</p>
        {state.error && <p className="text-sm font-semibold" role="alert">{state.error}</p>}
        {state.info && <p className="text-sm" role="status">{state.info}</p>}
        <SubmitButton>บันทึกโปรไฟล์</SubmitButton>
      </form>
    </div>
  );
}
