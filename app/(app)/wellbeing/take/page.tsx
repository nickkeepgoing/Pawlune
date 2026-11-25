import { requireStage } from "@/lib/guard";
import { loadWho5Text } from "@/lib/who5Content";
import { saveWho5 } from "@/app/actions";

export default async function Who5Take({ searchParams }: PageProps<"/wellbeing/take">) {
  await requireStage("ready");
  const { text, isThai } = loadWho5Text();
  const { error } = await searchParams;
  return (
    <div className="space-y-4 pt-2">
      {!isThai && (
        <p role="note" className="rounded-xl border-[1.5px] border-dashed border-bark bg-paper p-3 text-sm">
          กำลังรอข้อความฉบับภาษาไทยที่ผ่านการตรวจสอบ ตอนนี้จึงแสดงแบบสอบถามฉบับภาษาอังกฤษของ WHO
        </p>
      )}
      <h1 className="text-2xl font-semibold">คะแนนสุขภาวะทางใจ (WHO-5)</h1>
      <p className="text-bark">5 คำถามเกี่ยวกับ 2 สัปดาห์ที่ผ่านมา ใช้เวลาไม่ถึงนาที</p>
      <p className="paper p-4" lang={isThai ? "th" : "en"}>{text.instruction}</p>
      {error && <p role="alert" className="rounded-xl bg-paper p-3">กรุณาตอบให้ครบทั้ง 5 ข้อ</p>}
      <form action={saveWho5} className="space-y-4">
        {text.items.map((item, i) => (
          <fieldset key={i} className="paper p-5">
            <legend className="sr-only">ข้อ {i + 1}</legend>
            <p className="font-medium" lang={isThai ? "th" : "en"}><span className="num mr-2 text-jade">{i + 1}.</span>{item}</p>
            <div className="mt-3 grid gap-2">
              {text.options.map((o) => (
                <label key={o.value} className="block">
                  <input type="radio" name={`q${i}`} value={o.value} required className="peer sr-only" />
                  <span lang={isThai ? "th" : "en"} className="flex min-h-11 cursor-pointer items-center rounded-xl border-[1.5px] border-line px-4 text-sm peer-checked:border-jade peer-checked:bg-sage peer-checked:font-semibold peer-focus-visible:outline-3 peer-focus-visible:outline-jade">{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <button className="btn btn-primary w-full">ส่งคำตอบ</button>
      </form>
      {text._source && <p className="text-xs text-bark">{text._source}</p>}
    </div>
  );
}
