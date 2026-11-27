import { requireStage } from '@/lib/guard';
import { confirmAge } from '../actions';

export default async function AgePage() {
  await requireStage('age');
  return (
    <section className="py-4">
      <p className="text-sm text-bark">ขั้นที่ 2 จาก 3</p>
      <h1 className="mt-1 text-2xl font-bold">ตอนนี้ Pawlune เปิดให้ผู้ที่อายุ 20 ปีขึ้นไป</h1>
      <p className="mt-2 text-bark">เราไม่เก็บวันเกิดของคุณ แค่ขอให้ยืนยัน</p>
      <form action={confirmAge} className="mt-6 space-y-3">
        <button name="answer" value="yes" className="btn btn-primary w-full">ฉันอายุ 20 ปีขึ้นไป</button>
        <button name="answer" value="no" className="btn btn-ghost w-full">ยังไม่ถึง 20 ปี</button>
      </form>
    </section>
  );
}
