"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { saveCheckin } from "@/app/actions";
import { ACTIVITIES, ACTIVITY_IDS } from "@/lib/engine/activities";
import MoodFace, { MOOD_LABELS } from "@/components/MoodFace";
import { Cat, Dog } from "@/components/PetArt";

function Save() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="btn btn-primary w-full text-lg">{pending ? "กำลังบันทึก…" : "บันทึก"}</button>;
}

const Chip = ({ id, checked, kind }: { id: string; checked: boolean; kind: "joy" | "burden" }) => (
  <label>
    <input type="checkbox" name="activities" value={id} defaultChecked={checked} className="peer sr-only" />
    <span className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border-[1.5px] px-4 text-sm transition peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-jade ${kind === "joy"
      ? "border-bark/30 bg-paper peer-checked:border-jade peer-checked:bg-sage peer-checked:font-semibold"
      : "border-dashed border-bark bg-paper peer-checked:border-solid peer-checked:bg-[#E9DFCF] peer-checked:font-semibold"}`}>
      {ACTIVITIES[id as keyof typeof ACTIVITIES].th}
    </span>
  </label>
);

export default function CheckinForm({ petName, species, photo, dateLabel, existing }: {
  petName: string; species: string; photo: string | null; dateLabel: string;
  existing: { mood: number; activities: string[]; note: string | null } | null;
}) {
  const [mood, setMood] = useState<number | null>(existing?.mood ?? null);
  const acts = new Set(existing?.activities ?? []);
  return (
    <form action={saveCheckin} className="space-y-6">
      {/* Signature element: the user's own pet is the hero */}
      <div className="paper rise relative overflow-hidden">
        <div className="aspect-[4/3] w-full bg-sage-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {photo ? <img src={photo} alt={`รูปของ${petName}`} className="size-full object-cover" />
            : <div className="flex size-full items-end justify-center">{species === "cat" ? <Cat size={180} /> : <Dog size={180} />}</div>}
        </div>
        <div className="flex items-baseline justify-between px-5 py-3">
          <p className="text-lg font-semibold">{petName}</p>
          <p className="text-sm text-bark">{dateLabel}</p>
        </div>
      </div>

      <fieldset className="rise rise-2">
        <legend className="mb-3 text-lg font-semibold">อารมณ์วันนี้</legend>
        <div className="grid grid-cols-5 gap-1">
          {[1, 2, 3, 4, 5].map((m) => (
            <label key={m} className="flex flex-col items-center">
              <input type="radio" name="mood" value={m} required checked={mood === m} onChange={() => setMood(m)} className="peer sr-only" />
              <span className={`flex w-full cursor-pointer flex-col items-center gap-1 rounded-2xl py-2 transition peer-focus-visible:outline-3 peer-focus-visible:outline-jade ${mood === m ? "bg-paper shadow-[var(--shadow-paper)] -translate-y-1" : "opacity-80 hover:opacity-100"}`}>
                <MoodFace mood={m} size={mood === m ? 50 : 44} />
                <span className={`text-xs ${mood === m ? "font-semibold" : "text-bark"}`}>{MOOD_LABELS[m - 1]}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="rise rise-3">
        <legend className="mb-2 font-semibold">วันนี้กับน้อง</legend>
        <div className="flex flex-wrap gap-2">
          {ACTIVITY_IDS.filter((a) => ACTIVITIES[a].kind === "joy").map((a) => <Chip key={a} id={a} kind="joy" checked={acts.has(a)} />)}
        </div>
      </fieldset>

      <fieldset className="rise rise-3">
        <legend className="mb-2 font-semibold">ภาระวันนี้</legend>
        <div className="flex flex-wrap gap-2">
          {ACTIVITY_IDS.filter((a) => ACTIVITIES[a].kind === "burden").map((a) => <Chip key={a} id={a} kind="burden" checked={acts.has(a)} />)}
        </div>
      </fieldset>

      <details className="paper rise rise-4 group" open={!!existing?.note}>
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 font-medium">
          เขียนบันทึกสั้นๆ (ไม่บังคับ)<span aria-hidden className="transition group-open:rotate-45">＋</span>
        </summary>
        <label className="block px-5 pb-5">
          <span className="sr-only">บันทึก</span>
          <textarea name="note" maxLength={500} rows={4} defaultValue={existing?.note ?? ""} className="field ruled leading-[1.9rem]" placeholder="วันนี้เป็นยังไงบ้าง" />
          <span className="mt-1 block text-xs text-bark">ไม่เกิน 500 ตัวอักษร · เห็นได้เฉพาะคุณ</span>
        </label>
      </details>

      <Save />
    </form>
  );
}
