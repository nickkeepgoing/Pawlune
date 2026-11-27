import Link from 'next/link';
import { requireStage } from '@/lib/guard';
import { loadCheckins, loadWho5 } from '@/lib/data';
import { todayInBangkok } from '@/lib/time';
import { st5Score, weeklyTimeline, who5Due } from '@/lib/engine';
import { loadSt5 } from '@/lib/trialData';
import { thaiDate } from '@/lib/format';
import { PointLine } from '@/components/Charts';
import { GentleCard } from '@/components/GentleCard';

export default async function WellbeingPage({ searchParams }: { searchParams: Promise<{ result?: string; st5?: string }> }) {
  await requireStage('ready');
  const sp = await searchParams;
  const today = todayInBangkok();
  const [who5, checkins, st5] = await Promise.all([loadWho5(), loadCheckins(), loadSt5()]);
  const st5Result = sp.st5 ? st5.find((x) => x.id === sp.st5) ?? null : null;
  const st5Level = st5Result ? st5Score(st5Result.items) : null;
  const weeks = weeklyTimeline(checkins);
  const idx = sp.result ? who5.findIndex((w) => w.id === sp.result) : -1;
  const result = idx >= 0 ? who5[idx] : null;
  const prev = idx > 0 ? who5[idx - 1] : null;
  const due = who5Due(who5.at(-1)?.taken_on ?? null, today);

  return (
    <div className="wide space-y-5 py-2">
      <h1 className="text-2xl font-bold">สุขภาวะทางใจ</h1>

      {result && (
        <section className="page rounded-[var(--radius-card)] border border-bark/20 p-5" role="status">
          <p className="text-bark">ผลครั้งนี้</p>
          <p className="mt-1 text-xl font-bold">คะแนนสุขภาวะทางใจ <span className="num text-3xl">{result.pct}</span>/100</p>
          {prev && <p className="mt-1">{result.pct > prev.pct ? 'สูงขึ้น' : result.pct < prev.pct ? 'ต่ำลง' : 'เท่าเดิม'}จากครั้งก่อน (<span className="num">{prev.pct}</span>)</p>}
        </section>
      )}
      {result && result.raw < 12 && <GentleCard today={today} />}
      {st5Result && st5Level && (
        <section className="page rounded-[var(--radius-card)] border border-bark/20 p-5" role="status">
          <p className="text-bark">ผล ST-5 ครั้งนี้</p>
          <p className="mt-1 text-xl font-bold">คะแนน <span className="num text-3xl">{st5Result.raw}</span>/15 · {st5Level.level}</p>
          <p className="mt-1 text-xs text-bark">เกณฑ์ของกรมสุขภาพจิต: 0–4 น้อย · 5–7 ปานกลาง · 8–9 มาก · 10–15 มากที่สุด</p>
        </section>
      )}
      {st5Level?.gentle_card && <GentleCard today={today} />}

      {due && !result && (
        <Link href="/wellbeing/take" className="btn btn-primary w-full">ตอบ WHO-5 (5 คำถาม)</Link>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
      <section className="rounded-[var(--radius-card)] bg-paper p-4">
        <h2 className="font-semibold">คะแนนสุขภาวะทางใจ ทุก 2 สัปดาห์</h2>
        {who5.length ? <PointLine label="คะแนน WHO-5" min={0} max={100} points={who5.map((w) => ({ x: thaiDate(w.taken_on, false), y: w.pct }))} />
          : <p className="mt-1 text-bark">ยังไม่มีคำตอบ ตอบครั้งแรกได้เลย ใช้เวลาไม่ถึงนาที</p>}
      </section>

      <section className="rounded-[var(--radius-card)] bg-paper p-4">
        <div className="flex items-baseline justify-between gap-2"><h2 className="font-semibold">ความเครียด ST-5 (0–15)</h2><Link href="/wellbeing/st5" className="text-sm font-semibold text-jade underline underline-offset-4">ทำแบบประเมิน</Link></div>
        {st5.length ? <PointLine label="คะแนน ST-5" min={0} max={15} points={st5.map((x) => ({ x: thaiDate(x.taken_on, false), y: x.raw }))} />
          : <p className="mt-1 text-bark">ยังไม่มีคำตอบ 5 ข้อ ไม่ถึงนาที</p>}
      </section>

      <section className="rounded-[var(--radius-card)] bg-paper p-4">
        <h2 className="font-semibold">อารมณ์เฉลี่ยรายสัปดาห์</h2>
        {weeks.length ? <PointLine label="อารมณ์เฉลี่ยรายสัปดาห์" min={1} max={5} points={weeks.map((w) => ({ x: `ส.${w.week}`, y: w.mean_mood }))} />
          : <p className="mt-1 text-bark">เริ่มบันทึกรายวัน แล้วกราฟจะขึ้นที่นี่</p>}
        <p className="mt-2 text-xs text-bark">ส.1 = สัปดาห์ที่ 1 นับ 7 วันจากวันแรกที่บันทึก</p>
      </section>
      </div>
      <p className="text-xs text-bark">ข้อมูลบันทึกด้วยตนเอง ไม่ใช่การประเมินหรือวินิจฉัยทางคลินิก</p>
    </div>
  );
}
