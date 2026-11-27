import { OnboardingSteps } from '@/components/OnboardingSteps';
import { requireStage } from '@/lib/guard';
import { SubmitButton } from '@/components/SubmitButton';
import { confirmAge } from '../actions';

export default async function AgePage({ searchParams }: { searchParams: Promise<{ need?: string }> }) {
  await requireStage('age');
  const sp = await searchParams;
  return (
    <section className="py-4">
      <OnboardingSteps current={2} />
      <h1 className="mt-1 text-2xl font-bold">ตอนนี้ Pawlune เปิดให้ผู้ที่อายุ 20 ปีขึ้นไป</h1>
      <p className="mt-2 text-bark">เราไม่เก็บวันเกิดของคุณ แค่ขอให้ยืนยัน</p>

      {sp.need && <p className="mt-4 text-sm font-semibold" role="alert">ยังไม่ได้รับคำตอบ กดปุ่มใดปุ่มหนึ่งอีกครั้ง</p>}

      {/* Two separate forms, each carrying its answer in a hidden field.
          A submit button's own name/value is not something we want to depend on here:
          if it ever failed to arrive the action could not tell the two answers apart. */}
      <div className="mt-6 space-y-3">
        <form action={confirmAge}>
          <input type="hidden" name="answer" value="yes" />
          <SubmitButton pendingText="กำลังไปต่อ…">ฉันอายุ 20 ปีขึ้นไป</SubmitButton>
        </form>
        <form action={confirmAge}>
          <input type="hidden" name="answer" value="no" />
          <SubmitButton className="btn btn-ghost w-full" pendingText="กำลังออก…">ยังไม่ถึง 20 ปี</SubmitButton>
        </form>
      </div>

      <p className="mt-4 text-sm text-bark">ถ้ายังไม่ถึง 20 ปี เราจะลบบัญชีและข้อมูลทั้งหมดทันที</p>
    </section>
  );
}
