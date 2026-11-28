import Link from 'next/link';
import type { ReactNode } from 'react';
import type { PrefsRow } from '@/lib/trialData';
import { CatFace, DogFace, coatFor } from '@/components/Critters';
import { savePrefs } from './actions';
import { PrefsShell } from './PrefsShell';
import { NumberField } from './NumberField';

type Option = [value: string, label: string, icon?: ReactNode];

const Tick = () => (
  <span aria-hidden className="tile-mark">
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
  </span>
);

/** One question answered with large tiles. The tick shows the choice without relying on colour. */
function Choices({ name, question, hint, type, opts, checked, cols = 'sm:grid-cols-2' }: {
  name: string; question: string; hint?: string; type: 'radio' | 'checkbox'; opts: Option[]; checked: string[]; cols?: string;
}) {
  return (
    <fieldset>
      <legend className="text-lg font-bold">{question}</legend>
      <p className="mb-2 text-base text-bark">{hint ?? (type === 'checkbox' ? 'เลือกได้มากกว่าหนึ่งข้อ' : 'เลือกหนึ่งข้อ')}</p>
      <div className={`grid gap-3 ${cols}`}>
        {opts.map(([v, label, icon]) => (
          <label key={v} className="tile">
            <input type={type} name={name} value={v} defaultChecked={checked.includes(v)} className="sr-only" />
            {icon}
            <span className="min-w-0 flex-1">{label}</span>
            <Tick />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** A yes/no statement as a whole-row button. */
function Confirm({ name, children, checked }: { name: string; children: ReactNode; checked?: boolean }) {
  return (
    <label className="tile">
      <input type="checkbox" name={name} defaultChecked={checked} className="sr-only" />
      <Tick />
      <span className="min-w-0 flex-1 font-normal">{children}</span>
    </label>
  );
}

const PARTS = ['ชนิดและอาการแพ้', 'บ้านของคุณ', 'น้องที่มองหา', 'ครอบครัวและงบ'];

function Part({ n, note, children }: { n: number; note: string; children: ReactNode }) {
  return (
    <section id={`part-${n}`} aria-labelledby={`part-${n}-title`} className="scroll-mt-24 overflow-hidden rounded-3xl bg-paper shadow-[0_26px_44px_-32px_var(--c-shadow)] ring-1 ring-bark/10">
      <header className="flex items-center gap-4 bg-sage/30 px-5 py-4 md:px-7">
        <span className="num grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-jade text-xl font-bold text-cream">{n}</span>
        <div>
          <h2 id={`part-${n}-title`} className="text-xl font-bold md:text-2xl">{PARTS[n - 1]}</h2>
          <p className="text-base text-bark">{note}</p>
        </div>
      </header>
      <div className="space-y-7 p-5 md:p-7">{children}</div>
    </section>
  );
}

export function PrefsForm({ prefs }: { prefs: PrefsRow | null }) {
  const p = prefs;
  const one = (v: string | null | undefined) => [v ?? 'any'];
  const none = (list: string[] | undefined) => (p && !list?.length ? ['none'] : list ?? []);

  const aside = (
    <div className="relative overflow-hidden rounded-3xl bg-jade p-6 text-cream shadow-[0_30px_50px_-30px_var(--c-shadow)]">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cream/10" />
      <h1 className="relative text-2xl font-bold leading-snug text-balance">เช็กความพร้อมก่อนหาเพื่อน</h1>
      <p className="relative mt-2 text-base">กรอกครบในหน้าเดียว แล้วกดปุ่มครั้งเดียว</p>
      <nav aria-label="ส่วนของแบบฟอร์ม" className="relative mt-4">
        <ol className="space-y-2">
          {PARTS.map((title, i) => (
            <li key={title}>
              <a href={`#part-${i + 1}`} className="flex min-h-12 items-center gap-3 rounded-2xl bg-cream/10 px-3 text-base font-semibold hover:bg-cream/20">
                <span className="num grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream text-jade">{i + 1}</span>
                {title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      {p && <Link href="/adopt" className="relative mt-3 inline-flex min-h-11 items-center text-base font-semibold underline underline-offset-4">ไม่แก้ กลับไปรายชื่อ</Link>}
    </div>
  );

  return (
    <div className="wide py-3 text-lg">
      <PrefsShell action={savePrefs} aside={aside}>
        <p className="rounded-2xl bg-honey/20 px-5 py-4 text-base">
          เราจับคู่ด้วยกฎที่เปิดให้ดูทุกข้อ (ไม่ใช่ AI) ข้อเรื่องความปลอดภัย เช่น อาการแพ้ หรือสัตว์เดิมที่ไม่เข้ากัน จะตัดตัวที่ไม่เหมาะออกให้เลย
          ช่วงนำร่องเริ่มที่แมวในกรุงเทพฯ และปริมณฑล ยังเลือกหมาได้
        </p>

        <Part n={1} note="ใช้ตัดตัวที่ไม่ปลอดภัยออกให้">
          <Choices name="species" question="อยากได้สัตว์อะไร" type="checkbox" checked={p?.species ?? ['cat']}
            opts={[['cat', 'แมว', <CatFace key="c" coat={coatFor('มะขาม', 'cat')} className="h-14 w-14 shrink-0" />], ['dog', 'หมา', <DogFace key="d" coat={coatFor('ถั่วแดง', 'dog')} className="h-14 w-14 shrink-0" />]]} />
          <Choices name="allergies" question="คนในบ้านแพ้อะไรไหม" type="checkbox" cols="sm:grid-cols-3" checked={none(p?.allergies)}
            opts={[['none', 'ไม่มีใครแพ้'], ['cat', 'แพ้แมว'], ['dog', 'แพ้หมา']]} />
          <div>
            <Confirm name="allergy_checked" checked={p?.allergy_checked}>ถามทุกคนในบ้านเรื่องอาการแพ้แล้ว</Confirm>
            <p className="mt-2 text-base text-bark">ถ้าไม่แน่ใจ ลองไปอยู่ใกล้สัตว์ที่ศูนย์สักพัก หรือปรึกษาแพทย์ก่อน</p>
          </div>
          <Choices name="existing_pets" question="ที่บ้านมีสัตว์อยู่แล้วไหม" type="checkbox" checked={none(p?.existing_pets)}
            opts={[['none', 'ไม่มี'], ['cat', 'มีแมว'], ['dog', 'มีหมา'], ['other', 'มีสัตว์อื่น']]} />
        </Part>

        <Part n={2} note="บ้านและการดูแลในแต่ละวัน">
          <Choices name="housing" question="ที่อยู่ของคุณ" type="radio" checked={[p?.housing ?? 'condo']}
            opts={[['condo', 'คอนโด หรือหอพัก'], ['house', 'บ้าน']]} />
          <fieldset>
            <legend className="text-lg font-bold">ข้อไหนจริงสำหรับบ้านคุณ</legend>
            <p className="mb-2 text-base text-bark">แตะทุกข้อที่ทำได้แล้ว</p>
            <div className="grid gap-3">
              <Confirm name="indoor_only" checked={p?.indoor_only ?? true}>จะเลี้ยงแมวในบ้าน ไม่ปล่อยออกนอกบ้าน</Confirm>
              <Confirm name="window_screens" checked={p?.window_screens}>หน้าต่างและระเบียงติดมุ้งลวดหรือตาข่ายกันตกแล้ว</Confirm>
              <Confirm name="has_carrier" checked={p?.has_carrier}>มีกล่องใส่สัตว์ (ตะกร้าแข็งปิดล็อกได้) สำหรับรับน้อง</Confirm>
              <Confirm name="has_fence" checked={p?.has_fence}>มีพื้นที่รั้วรอบขอบชิด (สำหรับหมา)</Confirm>
            </div>
          </fieldset>
          <NumberField name="hours_alone" label="ไม่อยู่บ้านวันละกี่ชั่วโมง" unit="ชั่วโมง" defaultValue={p?.hours_alone} max={24} />
        </Part>

        <Part n={3} note="ข้อไหนไม่ซีเรียส ปล่อยไว้ที่ไม่จำกัดได้">
          <Choices name="size" question="ขนาด" type="radio" cols="grid-cols-2 xl:grid-cols-4" checked={one(p?.size)}
            opts={[['any', 'ไม่จำกัด'], ['small', 'เล็ก'], ['medium', 'กลาง'], ['large', 'ใหญ่']]} />
          <Choices name="age_group" question="อายุ" type="radio" cols="grid-cols-2 xl:grid-cols-4" checked={one(p?.age_group)}
            opts={[['any', 'ไม่จำกัด'], ['young', 'อายุน้อย'], ['adult', 'โตเต็มวัย'], ['senior', 'สูงวัย']]} />
          <Choices name="energy" question="พลังงาน" type="radio" cols="grid-cols-2 xl:grid-cols-4" checked={one(p?.energy)}
            opts={[['any', 'ไม่จำกัด'], ['calm', 'นิ่ง ชอบพัก'], ['medium', 'ปานกลาง'], ['active', 'พลังเยอะ']]} />
          <Choices name="personality" question="นิสัย" type="radio" cols="sm:grid-cols-3" checked={one(p?.personality)}
            opts={[['any', 'ไม่จำกัด'], ['cuddly', 'ขี้อ้อน'], ['independent', 'ชอบอยู่เงียบๆ']]} />
        </Part>

        <Part n={4} note="คนในบ้านและค่าใช้จ่าย">
          <Confirm name="family_agrees" checked={p?.family_agrees}>ทุกคนในบ้านเห็นด้วยแล้ว (รวมเจ้าของห้องหรือนิติบุคคล ถ้าเช่าอยู่)</Confirm>
          <div>
            <NumberField name="budget_month" label="งบที่ตั้งไว้ต่อเดือน" unit="บาท" defaultValue={p?.budget_month} step={500} presets={[1000, 2000, 3000, 5000]} />
            <p className="mt-2 text-base text-bark">ค่าอาหารและขนมอย่างเดียวประมาณ 1,000–3,000 บาทต่อเดือน (ไทยรัฐ, 2568) ยังไม่รวมค่าหมอ</p>
          </div>
          <label className="block">
            <span className="text-lg font-bold">เคยเลี้ยงสัตว์อะไร รู้สึกยังไง</span> <span className="text-base text-bark">(ไม่บังคับ)</span>
            <textarea name="experience" maxLength={300} rows={3} defaultValue={p?.experience ?? ''} className="field mt-2 text-lg" />
          </label>
        </Part>
      </PrefsShell>
    </div>
  );
}
