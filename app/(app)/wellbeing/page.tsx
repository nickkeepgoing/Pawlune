import Link from "next/link";
import { requireStage } from "@/lib/guard";
import { loadCheckins, loadWho5 } from "@/lib/data";
import { todayInBangkok } from "@/lib/time";
import { weeklyTimeline, who5Compare, who5Due } from "@/lib/engine";
import { WellbeingChart } from "@/components/Charts";
import GentleCard from "@/components/GentleCard";

export default async function WellbeingPage({ searchParams }: PageProps<"/wellbeing">) {
  const { supabase, user } = await requireStage("ready");
  const today = todayInBangkok();
  const [checkins, who5] = await Promise.all([loadCheckins(supabase, user.id), loadWho5(supabase, user.id)]);
  const weekly = weeklyTimeline(checkins);
  const last = who5.at(-1), prev = who5.at(-2);
  const { result } = await searchParams;
  const due = who5Due(last?.taken_on ?? null, today);

  return (
    <div className="space-y-5 pt-2">
      <h1 className="text-2xl font-semibold">สุขภาวะทางใจ</h1>

      {result && last && (
        <section className="paper rise p-6 text-center">
          <p className="text-bark">คะแนนสุขภาวะทางใจ</p>
          <p><span className="num text-5xl font-semibold">{last.pct}</span><span className="num text-xl text-bark">/100</span></p>
          {who5Compare(last.pct, prev?.pct ?? null) && <p className="mt-2 font-medium">{who5Compare(last.pct, prev!.pct)}</p>}
          <p className="mt-2 text-sm text-bark">ขอบคุณที่ใช้เวลากับตัวเอง คำถามชุดนี้จะกลับมาอีกใน 14 วัน</p>
        </section>
      )}
      {result && last?.gentle_card && <GentleCard day={today} />}

      {due && !result && (
        <Link href="/wellbeing/take" className="paper flex items-center justify-between border-l-4 border-honey p-4 hover:bg-cream">
          <span><span className="block font-semibold">WHO-5 ถึงเวลาแล้ว</span><span className="text-sm text-bark">5 คำถามเกี่ยวกับ 2 สัปดาห์ที่ผ่านมา ใช้เวลาไม่ถึงนาที</span></span>
          <span aria-hidden className="text-xl text-jade">→</span>
        </Link>
      )}

      <section className="paper p-5">
        <h2 className="font-semibold">ตลอดช่วงที่บันทึก</h2>
        {who5.length || weekly.length ? (
          <WellbeingChart who5={who5} weekly={weekly} startDate={checkins[0]?.date ?? null} />
        ) : (
          <p className="mt-2 text-bark">ยังไม่มีข้อมูล ตอบ WHO-5 ครั้งแรก หรือบันทึกรายวันต่ออีกสักหน่อย แล้วกราฟจะเริ่มขึ้นที่นี่</p>
        )}
      </section>

      {who5.length > 0 && (
        <section className="paper p-5">
          <h2 className="font-semibold">ประวัติคะแนนสุขภาวะทางใจ</h2>
          <ul className="mt-2 divide-y divide-line">
            {[...who5].reverse().map((w) => (
              <li key={w.taken_on + w.raw} className="flex justify-between py-2">
                <span className="text-bark">{new Date(w.taken_on + "T00:00:00Z").toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</span>
                <span className="num font-semibold">{w.pct}/100</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {weekly.length > 0 && (
        <section className="paper p-5">
          <h2 className="font-semibold">อารมณ์เฉลี่ยรายสัปดาห์</h2>
          <p className="text-xs text-bark">สัปดาห์ที่ 1 นับ 7 วันจากวันแรกที่บันทึก</p>
          <ul className="mt-2 divide-y divide-line">
            {weekly.map((w) => (
              <li key={w.week} className="flex justify-between py-2">
                <span>สัปดาห์ที่ <span className="num">{w.week}</span> <span className="text-sm text-bark">(<span className="num">{w.n}</span> วัน)</span></span>
                <span className="num font-semibold">{w.mean_mood.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
