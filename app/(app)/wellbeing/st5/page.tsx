import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { requireStage } from '@/lib/guard';
import { SubmitButton } from '@/components/SubmitButton';
import { saveSt5 } from '../actions';

// Items and options verbatim from the Department of Mental Health ST-5 (see content/st5-th.json _source).
// The instruction line is the app's wording of the published 2–4 week time frame.
export default async function St5Take({ searchParams }: { searchParams: Promise<{ missing?: string; next?: string }> }) {
  await requireStage('ready');
  const sp = await searchParams;
  const t = JSON.parse(readFileSync(join(process.cwd(), 'content', 'st5-th.json'), 'utf8')) as { _source: string; instruction: string; items: string[]; options: { value: number; label: string }[] };
  return (
    <div className="space-y-5 py-2">
      <div>
        <h1 className="text-2xl font-bold">แบบประเมินความเครียด (ST-5)</h1>
        <p className="text-bark">5 ข้อ ของกรมสุขภาพจิต ใช้เวลาไม่ถึงนาที</p>
      </div>
      <p className="font-semibold">{t.instruction}</p>
      <form action={saveSt5} className="space-y-5">
        {sp.next === '/trial' && <input type="hidden" name="next" value="/trial" />}
        {t.items.map((item, i) => (
          <fieldset key={i} className="rounded-[var(--radius-card)] bg-paper p-4">
            <legend className="sr-only">ข้อ {i + 1}</legend>
            <p className="font-semibold"><span className="num mr-2 text-bark">{i + 1}.</span>{item}</p>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {t.options.map((o) => (
                <label key={o.value} className="flex min-h-11 items-center gap-3 rounded-lg px-2 has-[:checked]:bg-sage">
                  <input type="radio" name={`q${i}`} value={o.value} required className="h-5 w-5 accent-[#4E6E58]" />{o.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {sp.missing && <p className="font-semibold" role="alert">ตอบให้ครบทั้ง 5 ข้อ</p>}
        <SubmitButton>บันทึกคำตอบ</SubmitButton>
      </form>
      <p className="text-xs text-bark">{t._source.split(' — ')[0]} · แบบประเมินเบื้องต้น ไม่ใช่การวินิจฉัย</p>
    </div>
  );
}
