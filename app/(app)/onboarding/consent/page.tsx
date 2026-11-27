import { OnboardingSteps } from '@/components/OnboardingSteps';
import { requireStage } from '@/lib/guard';
import { SubmitButton } from '@/components/SubmitButton';
import { giveConsent } from '../actions';

export default async function ConsentPage({ searchParams }: { searchParams: Promise<{ need?: string }> }) {
  await requireStage('consent');
  const sp = await searchParams;
  return (
    <section className="py-4">
      <OnboardingSteps current={1} />
      <h1 className="mt-1 text-2xl font-bold">ก่อนเริ่ม ขอเล่าเรื่องข้อมูลของคุณ</h1>
      <div className="page mt-5 space-y-3 rounded-[var(--radius-card)] border border-bark/20 p-5">
        <p><b>เราเก็บอะไร:</b> ข้อมูลน้อง (ชื่อ ชนิด รูป) อารมณ์รายวัน กิจกรรมที่ทำกับน้อง โน้ต รูปในอัลบั้ม ความทรงจำของสัตว์ที่เคยเลี้ยง และคำตอบแบบวัด WHO-5</p>
        <p><b>เก็บไปทำไม:</b> เพื่อแสดงรูปแบบในข้อมูลของคุณเอง</p>
        <p><b>ใครเห็น:</b> คุณคนเดียว โน้ตและรูปของคุณไม่ถูกส่งให้ AI</p>
        <p><b>ลบยังไง:</b> ตั้งค่า → ลบข้อมูลทั้งหมด ลบทุกอย่างทันที</p>
        <p className="text-sm text-bark">อารมณ์และสุขภาวะทางใจเป็นข้อมูลอ่อนไหวตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล เราจึงขอความยินยอมก่อนบันทึก</p>
      </div>
      <form action={giveConsent} className="mt-5 space-y-4">
        <label className="flex min-h-11 items-start gap-3">
          <input type="checkbox" name="agree" className="mt-1 h-5 w-5 accent-[#4E6E58]" />
          <span>ฉันยินยอมให้ Pawlune เก็บข้อมูลข้างต้นเพื่อแสดงรูปแบบของฉันเอง</span>
        </label>
        {sp.need && <p className="text-sm font-semibold" role="alert">ติ๊กยินยอมก่อนไปต่อ</p>}
        <SubmitButton>ยินยอมและไปต่อ</SubmitButton>
      </form>
    </section>
  );
}
