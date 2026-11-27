import { requireStage } from '@/lib/guard';
import { PetForm } from './PetForm';
import { SubmitButton } from '@/components/SubmitButton';
import { startSeeking } from '../actions';

export default async function PetPage() {
  const { user } = await requireStage('pet');
  return (
    <section className="py-4">
      <p className="text-sm text-bark">ขั้นที่ 3 จาก 3</p>
      <h1 className="mt-1 text-2xl font-bold">มาทำความรู้จักน้องกัน</h1>
      <form action={startSeeking} className="mt-4 rounded-[var(--radius-card)] border-[1.5px] border-jade bg-paper p-4">
        <p className="font-semibold">ยังไม่มีสัตว์เลี้ยง?</p>
        <p className="text-sm text-bark">ทดลองรับเลี้ยงเพื่อนจากศูนย์ 14 วันก่อนตัดสินใจ</p>
        <SubmitButton className="btn btn-primary mt-3 w-full">หาเพื่อนจากศูนย์</SubmitButton>
      </form>
      <p className="mt-6 font-semibold">มีน้องอยู่แล้ว</p>
      <PetForm uid={user!.id} />
    </section>
  );
}
