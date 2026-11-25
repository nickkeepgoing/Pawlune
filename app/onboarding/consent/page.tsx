import { redirect } from "next/navigation";
import { requireStage } from "@/lib/guard";
import { acceptConsent } from "@/app/actions";
import Steps from "@/components/Steps";

export default async function ConsentPage({ searchParams }: PageProps<"/onboarding/consent">) {
  const { profile } = await requireStage("signedIn");
  if (profile?.consented_at) redirect("/onboarding/age");
  const { error } = await searchParams;
  return (
    <>
      <Steps at={1} />
      <h1 className="text-2xl font-semibold">ก่อนเริ่ม ขอความยินยอมของคุณ</h1>
      <p className="mt-1 text-bark">ข้อมูลอารมณ์และสุขภาวะทางใจเป็นข้อมูลอ่อนไหว เราจึงขอให้คุณอ่านก่อน</p>
      <div className="paper mt-5 space-y-4 p-5">
        <section><h2 className="font-semibold">เราเก็บอะไร</h2>
          <p className="text-bark">ข้อมูลน้อง (ชื่อ ชนิด รูป วันที่รับมาเลี้ยง) อารมณ์ประจำวัน กิจกรรมที่ทำกับน้อง บันทึกสั้นๆ และคำตอบแบบสอบถาม WHO-5</p></section>
        <section><h2 className="font-semibold">เก็บไปทำไม</h2>
          <p className="text-bark">เพื่อแสดงรูปแบบในข้อมูลของคุณเองเท่านั้น</p></section>
        <section><h2 className="font-semibold">ใครเห็นได้</h2>
          <p className="text-bark">เฉพาะคุณ ข้อความบันทึกของคุณไม่ถูกส่งให้ AI หรือบุคคลอื่น</p></section>
        <section><h2 className="font-semibold">ลบได้อย่างไร</h2>
          <p className="text-bark">ไปที่ ตั้งค่า → ลบข้อมูลทั้งหมด ได้ทุกเมื่อ</p></section>
      </div>
      <form action={acceptConsent} className="mt-6">
        <label className="flex min-h-11 cursor-pointer items-start gap-3">
          <input type="checkbox" name="agree" required className="mt-1 size-6 accent-jade" />
          <span>ฉันอ่านแล้ว และยินยอมให้ Paw Diary เก็บข้อมูลข้างต้นเพื่อแสดงรูปแบบให้ฉันดู</span>
        </label>
        {error && <p role="alert" className="mt-2 text-sm">กรุณาติ๊กยินยอมก่อนไปต่อ</p>}
        <button className="btn btn-primary mt-6 w-full">ยินยอมและไปต่อ</button>
      </form>
    </>
  );
}
