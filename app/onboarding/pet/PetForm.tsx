"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { savePet } from "@/app/actions";

/** Resize to ≤1024 px on the client before upload. */
async function resize(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1024 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((ok, no) => c.toBlob((b) => (b ? ok(b) : no(new Error("resize"))), "image/jpeg", 0.85));
}

export default function PetForm({ uid }: { uid: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [path, setPath] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("กำลังอัปโหลดรูป…");
    try {
      const blob = await resize(file);
      setPreview(URL.createObjectURL(blob));
      const p = `${uid}/${crypto.randomUUID()}.jpg`;
      const { error } = await createClient().storage.from("pet-photos").upload(p, blob, { contentType: "image/jpeg" });
      if (error) throw error;
      setPath(p); setStatus("อัปโหลดรูปแล้ว");
    } catch { setStatus("อัปโหลดรูปไม่สำเร็จ ข้ามไปก่อนได้"); }
  }

  return (
    <form action={savePet} className="mt-6 space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium">รูปน้อง (ไม่บังคับ)</span>
        <span className="paper flex cursor-pointer items-center gap-4 p-3 focus-within:outline-3 focus-within:outline-jade">
          <span className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream text-bark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {preview ? <img src={preview} alt="รูปน้องที่เลือก" className="size-full object-cover" /> : "＋"}
          </span>
          <span className="text-sm text-bark">{status ?? "แตะเพื่อเลือกรูป"}</span>
          <input type="file" accept="image/*" onChange={onPhoto} className="sr-only" />
        </span>
      </label>
      <input type="hidden" name="photo_path" value={path} />
      <label className="block"><span className="mb-1 block text-sm font-medium">ชื่อน้อง</span>
        <input name="name" required maxLength={40} className="field" autoComplete="off" /></label>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">น้องเป็น</legend>
        <div className="flex gap-2">
          {[["dog", "หมา"], ["cat", "แมว"], ["other", "อื่นๆ"]].map(([v, l], i) => (
            <label key={v} className="flex-1">
              <input type="radio" name="species" value={v} defaultChecked={i === 0} className="peer sr-only" />
              <span className="flex min-h-12 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-bark/40 peer-checked:border-jade peer-checked:bg-sage peer-focus-visible:outline-3 peer-focus-visible:outline-jade">{l}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block"><span className="mb-1 block text-sm font-medium">วันที่รับน้องมา (ไม่บังคับ)</span>
        <input name="adopted_on" type="date" className="field" /></label>
      <button className="btn btn-primary w-full" disabled={status === "กำลังอัปโหลดรูป…"}>บันทึกและเริ่มบันทึกวันแรก</button>
    </form>
  );
}
