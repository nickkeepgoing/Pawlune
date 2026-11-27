import { requireStage } from '@/lib/guard';
import { loadWho5Text } from '@/lib/who5Text';
import { SubmitButton } from '@/components/SubmitButton';
import { saveWho5 } from '../actions';

export default async function Who5Take({ searchParams }: { searchParams: Promise<{ missing?: string; next?: string }> }) {
  await requireStage('ready');
  const t = loadWho5Text();
  const sp = await searchParams;
  return (
    <div className="space-y-5 py-2">
      <div>
        <h1 className="text-2xl font-bold">คะแนนสุขภาวะทางใจ (WHO-5)</h1>
        <p className="text-bark">5 คำถามเกี่ยวกับ 2 สัปดาห์ที่ผ่านมา ใช้เวลาไม่ถึงนาที</p>
      </div>
      {!t.isThai && (
        <p className="rounded-[var(--radius-card)] border-[1.5px] border-honey bg-paper p-3 text-sm" role="note">กำลังรอข้อความฉบับภาษาไทยที่ผ่านการตรวจสอบ ตอนนี้จึงแสดงฉบับภาษาอังกฤษขององค์การอนามัยโลก</p>
      )}
      <p className="font-semibold" lang={t.isThai ? 'th' : 'en'}>{t.instruction}</p>
      <form action={saveWho5} className="space-y-5">
        {sp.next === '/trial' && <input type="hidden" name="next" value="/trial" />}
        {t.items.map((item, i) => (
          <fieldset key={i} className="rounded-[var(--radius-card)] bg-paper p-4">
            <legend className="sr-only">ข้อ {i + 1}</legend>
            <p className="font-semibold" lang={t.isThai ? 'th' : 'en'}><span className="num mr-2 text-bark">{i + 1}.</span>{item}</p>
            <div className="mt-3 grid gap-1.5">
              {t.options.map((o) => (
                <label key={o.value} className="flex min-h-11 items-center gap-3 rounded-lg px-2 has-[:checked]:bg-sage">
                  <input type="radio" name={`q${i}`} value={o.value} required className="h-5 w-5 accent-[#4E6E58]" />
                  <span lang={t.isThai ? 'th' : 'en'}>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {sp.missing && <p className="font-semibold" role="alert">ตอบให้ครบทั้ง 5 ข้อ</p>}
        <SubmitButton>บันทึกคำตอบ</SubmitButton>
      </form>
      <p className="text-xs text-bark">{t._source}</p>
    </div>
  );
}
