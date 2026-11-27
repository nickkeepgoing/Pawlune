import { SubmitButton } from '@/components/SubmitButton';
import type { PrefsRow } from '@/lib/trialData';
import { savePrefs } from './actions';

function Radio({ name, opts, value }: { name: string; opts: [string, string][]; value: string | null }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {opts.map(([v, l]) => (
        <label key={v} className="chip cursor-pointer has-[:checked]:border-2 has-[:checked]:border-jade has-[:checked]:bg-sage">
          <input type="radio" name={name} value={v} defaultChecked={(value ?? 'any') === v} className="sr-only" />{l}
        </label>
      ))}
    </div>
  );
}
function Check({ name, opts, values }: { name: string; opts: [string, string][]; values: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {opts.map(([v, l]) => (
        <label key={v} className="chip cursor-pointer has-[:checked]:border-2 has-[:checked]:border-jade has-[:checked]:bg-sage">
          <input type="checkbox" name={name} value={v} defaultChecked={values.includes(v)} className="sr-only" />{l}
        </label>
      ))}
    </div>
  );
}

export function PrefsForm({ prefs }: { prefs: PrefsRow | null }) {
  const p = prefs;
  const box = 'card card-quiet';
  const Head = ({ n, title, note }: { n: number; title: string; note?: string }) => (
    <legend className="mb-3 w-full">
      <span className="num text-sm font-semibold text-jade">ส่วนที่ {n} จาก 4</span>
      <span className="block text-lg font-bold">{title}</span>
      {note && <span className="block text-sm font-normal text-bark">{note}</span>}
    </legend>
  );
  return (
    <form action={savePrefs} className="space-y-5 py-2">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold">เช็กความพร้อมก่อนหาเพื่อน</h1>
        <p className="text-bark">ใช้จับคู่กับสัตว์ในศูนย์ด้วยกฎที่เปิดให้ดูทุกข้อ (ไม่ใช่ AI) ข้อที่เกี่ยวกับความปลอดภัย เช่น อาการแพ้ หรือสัตว์เดิมที่ไม่เข้ากัน จะตัดตัวที่ไม่เหมาะออกให้เลย</p>
        <p className="mt-1 text-sm text-bark">ช่วงนำร่องเริ่มที่แมวในกรุงเทพฯ และปริมณฑล ยังเลือกหมาได้</p>
      </div>
      <div className="grid gap-4">
        <fieldset className="card card-warn"><Head n={1} title="ชนิดและอาการแพ้" note="สองข้อนี้ใช้ตัดตัวที่ไม่ปลอดภัยออกให้เลย" />
          <p className="font-semibold">อยากได้</p><Check name="species" opts={[['cat', 'แมว'], ['dog', 'หมา']]} values={p?.species ?? ['cat']} />
          <p className="mt-4 font-semibold">คนในบ้านแพ้อะไรไหม</p><Check name="allergies" opts={[['cat', 'แพ้แมว'], ['dog', 'แพ้หมา']]} values={p?.allergies ?? []} />
          <label className="mt-3 flex min-h-11 items-start gap-3"><input type="checkbox" name="allergy_checked" defaultChecked={p?.allergy_checked} className="mt-1 h-5 w-5 accent-[#4E6E58]" /><span>ถามทุกคนในบ้านเรื่องอาการแพ้แล้ว</span></label>
          <p className="mt-1 text-xs text-bark">ไม่แน่ใจ ลองไปอยู่ใกล้สัตว์ที่ศูนย์สักพัก หรือปรึกษาแพทย์ก่อน</p>
          <p className="mt-4 font-semibold">ที่บ้านมีสัตว์อยู่แล้วไหม</p><Check name="existing_pets" opts={[['cat', 'มีแมว'], ['dog', 'มีหมา'], ['other', 'มีสัตว์อื่น']]} values={p?.existing_pets ?? []} />
        </fieldset>
        <fieldset className={box}><Head n={2} title="บ้านและการเลี้ยงในบ้าน" />
          <p className="font-semibold">ที่อยู่</p><Radio name="housing" value={p?.housing ?? 'condo'} opts={[['condo', 'คอนโด/หอ'], ['house', 'บ้าน']]} />
          <label className="mt-3 flex min-h-11 items-start gap-3"><input type="checkbox" name="indoor_only" defaultChecked={p?.indoor_only ?? true} className="mt-1 h-5 w-5 accent-[#4E6E58]" /><span>จะเลี้ยงแมวในบ้าน ไม่ปล่อยออกนอกบ้าน</span></label>
          <label className="mt-1 flex min-h-11 items-start gap-3"><input type="checkbox" name="window_screens" defaultChecked={p?.window_screens} className="mt-1 h-5 w-5 accent-[#4E6E58]" /><span>หน้าต่างและระเบียงติดมุ้งลวดหรือตาข่ายกันตกแล้ว</span></label>
          <label className="mt-1 flex min-h-11 items-start gap-3"><input type="checkbox" name="has_carrier" defaultChecked={p?.has_carrier} className="mt-1 h-5 w-5 accent-[#4E6E58]" /><span>มีกล่องใส่สัตว์ (ตะกร้าแข็งปิดล็อกได้) สำหรับรับน้อง</span></label>
          <label className="mt-1 flex min-h-11 items-start gap-3"><input type="checkbox" name="has_fence" defaultChecked={p?.has_fence} className="mt-1 h-5 w-5 accent-[#4E6E58]" /><span>มีพื้นที่มีรั้วรอบขอบชิด (สำหรับหมา)</span></label>
          <label className="mt-2 block"><span className="font-semibold">ไม่อยู่บ้านวันละกี่ชั่วโมง</span><input name="hours_alone" type="number" min={0} max={24} defaultValue={p?.hours_alone ?? ''} className="field mt-1" /></label>
        </fieldset>
        <fieldset className={box}><Head n={3} title="ลักษณะที่อยากได้" note="ข้อไหนไม่ซีเรียส เลือกไม่จำกัดได้" />
          <p className="font-semibold">ขนาด</p><Radio name="size" value={p?.size ?? null} opts={[['any', 'ไม่จำกัด'], ['small', 'เล็ก'], ['medium', 'กลาง'], ['large', 'ใหญ่']]} />
          <p className="mt-4 font-semibold">อายุ</p><Radio name="age_group" value={p?.age_group ?? null} opts={[['any', 'ไม่จำกัด'], ['young', 'อายุน้อย'], ['adult', 'โตเต็มวัย'], ['senior', 'สูงวัย']]} />
          <p className="mt-4 font-semibold">พลังงาน</p><Radio name="energy" value={p?.energy ?? null} opts={[['any', 'ไม่จำกัด'], ['calm', 'นิ่ง ชอบพัก'], ['medium', 'ปานกลาง'], ['active', 'พลังเยอะ']]} />
          <p className="mt-4 font-semibold">นิสัย</p><Radio name="personality" value={p?.personality ?? null} opts={[['any', 'ไม่จำกัด'], ['cuddly', 'ขี้อ้อน'], ['independent', 'ชอบอยู่เงียบๆ']]} />
        </fieldset>
        <fieldset className={box}><Head n={4} title="ครอบครัวและค่าใช้จ่าย" />
          <label className="flex min-h-11 items-start gap-3"><input type="checkbox" name="family_agrees" defaultChecked={p?.family_agrees} className="mt-1 h-5 w-5 accent-[#4E6E58]" /><span>ทุกคนในบ้านเห็นด้วยแล้ว (รวมเจ้าของห้องหรือนิติบุคคล ถ้าเช่าอยู่)</span></label>
          <label className="mt-3 block"><span className="font-semibold">งบที่ตั้งไว้ต่อเดือน (บาท)</span><input name="budget_month" type="number" min={0} step={100} defaultValue={p?.budget_month ?? ''} className="field mt-1" />
            <span className="mt-1 block text-xs text-bark">ค่าอาหารและขนมอย่างเดียวประมาณ 1,000–3,000 บาท/เดือน (ไทยรัฐ, 2568) ยังไม่รวมค่าหมอ</span></label>
          <label className="mt-3 block"><span className="font-semibold">เคยเลี้ยงสัตว์อะไร รู้สึกยังไง</span> <span className="text-sm text-bark">(ไม่บังคับ)</span>
            <textarea name="experience" maxLength={300} rows={2} defaultValue={p?.experience ?? ''} className="field mt-1" /></label>
        </fieldset>
      </div>
      <div className="max-w-sm pb-4"><SubmitButton>ดูเพื่อนที่เข้ากับฉัน</SubmitButton></div>
    </form>
  );
}
