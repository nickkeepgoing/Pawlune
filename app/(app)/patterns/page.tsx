import Link from 'next/link';
import { requireStage } from '@/lib/guard';
import { loadCheckins } from '@/lib/data';
import { allPatterns, sortPatterns } from '@/lib/engine';
import { PatternCard } from '@/components/PatternCard';

export default async function PatternsPage() {
  await requireStage('ready');
  const checkins = await loadCheckins();
  const ps = sortPatterns(Object.values(allPatterns(checkins)));
  const anyReady = ps.some((p) => p.status !== 'insufficient');
  return (
    <div className="wide space-y-4 py-2">
      <div>
        <h1 className="text-2xl font-bold">รูปแบบของคุณกับน้อง</h1>
        <p className="text-bark">เทียบคะแนนอารมณ์เฉลี่ย ระหว่างวันที่มีกับไม่มีแต่ละกิจกรรม จากข้อมูล <span className="num">{checkins.length}</span> วัน</p>
        <Link href="/patterns/info" className="mt-1 inline-block text-sm font-semibold text-jade underline underline-offset-4">คำนวณยังไง และทำไมไม่บอกว่าอะไรเป็นสาเหตุ</Link>
      </div>
      {!anyReady && (
        <p className="rounded-[var(--radius-card)] bg-paper p-4">บันทึกต่ออีกไม่กี่วัน แล้วเราจะเริ่มเห็นรูปแบบของคุณกับน้อง</p>
      )}
      <div className="grid gap-4 md:grid-cols-2 md:items-start">{ps.map((p) => (<PatternCard key={p.activity} p={p} />))}</div>
    </div>
  );
}
