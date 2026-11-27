import { PROBLEMS } from '@/lib/trialData';
import { MOOD_LABELS } from '@/lib/format';

export function FeedbackFields({ optionalFeeling = false }: { optionalFeeling?: boolean }) {
  return (
    <>
      <fieldset>
        <legend className="font-semibold">อยู่กับน้องแล้วรู้สึกยังไง{optionalFeeling && <span className="text-sm font-normal text-bark"> (ไม่บังคับ)</span>}</legend>
        <div className="mt-2 grid grid-cols-5 gap-1">
          {[1, 2, 3, 4, 5].map((v) => (
            <label key={v} className="flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-card)] border-2 border-transparent text-xs has-[:checked]:border-jade has-[:checked]:bg-sage">
              <input type="radio" name="feeling" value={v} required={!optionalFeeling} className="sr-only" /><span className="num text-lg font-semibold">{v}</span>{MOOD_LABELS[v - 1]}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="font-semibold">มีเรื่องไหนที่ยากบ้าง <span className="text-sm font-normal text-bark">เลือกได้หลายข้อ</span></legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PROBLEMS.map(([k, l]) => (
            <label key={k} className="chip cursor-pointer has-[:checked]:border-2 has-[:checked]:border-bark has-[:checked]:bg-[#E6DCCB]"><input type="checkbox" name="problems" value={k} className="sr-only" />{l}</label>
          ))}
        </div>
      </fieldset>
      <label className="block"><span className="font-semibold">อยากบอกศูนย์เพิ่มไหม</span> <span className="text-sm text-bark">(ศูนย์จะเห็นข้อความนี้)</span>
        <textarea name="note" maxLength={500} rows={3} className="field mt-1" placeholder="เช่น น้องชอบนอนข้างเตียง กลัวเสียงฟ้าร้อง" /></label>
    </>
  );
}
