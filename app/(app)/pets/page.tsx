import { requireStage } from "@/lib/guard";
import { petPhotoUrl } from "@/lib/data";
import { todayInBangkok } from "@/lib/time";
import { daysBetween } from "@/lib/engine";
import { deletePastPet, savePastPet } from "@/app/actions";
import type { PetRow } from "@/lib/database.types";
import { Cat, Dog } from "@/components/PetArt";

const SPECIES = { dog: "หมา", cat: "แมว", other: "อื่นๆ" } as const;

function MemoryForm({ p }: { p?: PetRow }) {
  return (
    <form action={savePastPet} className="space-y-3">
      {p && <input type="hidden" name="id" value={p.id} />}
      <label className="block"><span className="mb-1 block text-sm font-medium">ชื่อ</span>
        <input name="name" required maxLength={40} defaultValue={p?.name} className="field" /></label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block"><span className="mb-1 block text-sm font-medium">ชนิด</span>
          <select name="species" defaultValue={p?.species ?? "dog"} className="field">
            {Object.entries(SPECIES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select></label>
        <label className="block"><span className="mb-1 block text-sm font-medium">ช่วงเวลา</span>
          <input name="past_period" maxLength={40} defaultValue={p?.past_period ?? ""} placeholder="เช่น 2018–2023" className="field" /></label>
      </div>
      <label className="block"><span className="mb-1 block text-sm font-medium">ความรู้สึกเมื่อนึกถึง (1–5)</span>
        <select name="past_feeling" defaultValue={p?.past_feeling ?? ""} className="field">
          <option value="">ไม่ระบุ</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
        </select></label>
      <label className="block"><span className="mb-1 block text-sm font-medium">คำที่นึกถึง (คั่นด้วย ,)</span>
        <input name="past_tags" maxLength={200} defaultValue={p?.past_tags.join(", ")} placeholder="อุ่นใจ, ผูกพัน" className="field" /></label>
      <label className="block"><span className="mb-1 block text-sm font-medium">บันทึกความทรงจำ</span>
        <textarea name="memory_note" maxLength={500} rows={3} defaultValue={p?.memory_note ?? ""} className="field" /></label>
      <button className="btn btn-primary w-full">{p ? "บันทึกการแก้ไข" : "เพิ่มความทรงจำ"}</button>
    </form>
  );
}

export default async function PetsPage() {
  const { supabase, user, pet } = await requireStage("ready");
  const [photo, { data: past }] = await Promise.all([
    petPhotoUrl(supabase, pet.photo_path),
    supabase.from("pets").select("*").eq("user_id", user.id).eq("is_current", false).order("created_at"),
  ]);
  const since = pet.adopted_on ? daysBetween(pet.adopted_on, todayInBangkok()) : null;
  return (
    <div className="space-y-5 pt-2">
      <h1 className="text-2xl font-semibold">น้องของฉัน</h1>
      <section className="paper flex items-center gap-4 p-5">
        <div className="size-24 shrink-0 overflow-hidden rounded-[1.6rem] bg-sage-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {photo ? <img src={photo} alt={`รูปของ${pet.name}`} className="size-full object-cover" /> : pet.species === "cat" ? <Cat size={96} /> : <Dog size={96} />}
        </div>
        <div>
          <p className="text-xl font-semibold">{pet.name}</p>
          <p className="text-bark">{SPECIES[pet.species]}</p>
          {since !== null && since >= 0 && <p className="mt-1">อยู่ด้วยกันมา <span className="num text-xl font-semibold">{since}</span> วัน</p>}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">ความทรงจำ</h2>
        <p className="text-sm text-bark">ข้อมูลส่วนนี้เป็นความทรงจำ ไม่นำไปคำนวณรูปแบบ</p>
        <ul className="mt-3 space-y-3">
          {(past ?? []).map((p) => (
            <li key={p.id} className="paper p-5">
              <p className="text-lg font-semibold">{p.name} <span className="text-sm font-normal text-bark">· {SPECIES[p.species]}{p.past_period ? ` · ${p.past_period}` : ""}</span></p>
              {p.past_feeling && <p className="text-sm text-bark">ความรู้สึกเมื่อนึกถึง <span className="num font-semibold text-cocoa">{p.past_feeling}</span>/5</p>}
              {p.past_tags.length > 0 && <p className="mt-2 flex flex-wrap gap-1.5">{p.past_tags.map((t) => <span key={t} className="rounded-full bg-cream px-2.5 py-0.5 text-sm">{t}</span>)}</p>}
              {p.memory_note && <p className="mt-2 whitespace-pre-line">{p.memory_note}</p>}
              <div className="mt-3 flex gap-2">
                <details className="flex-1"><summary className="btn btn-ghost min-h-11 cursor-pointer list-none text-sm">แก้ไข</summary><div className="mt-3"><MemoryForm p={p} /></div></details>
                <form action={deletePastPet}><input type="hidden" name="id" value={p.id} /><button className="btn min-h-11 text-sm text-bark underline underline-offset-4">ลบ</button></form>
              </div>
            </li>
          ))}
        </ul>
        <details className="paper mt-3 p-5">
          <summary className="flex min-h-11 cursor-pointer list-none items-center font-medium text-jade-deep">＋ เพิ่มความทรงจำของน้องที่เคยเลี้ยง</summary>
          <div className="mt-3"><MemoryForm /></div>
        </details>
      </section>
    </div>
  );
}
