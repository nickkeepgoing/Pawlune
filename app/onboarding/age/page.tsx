import { redirect } from "next/navigation";
import { requireStage } from "@/lib/guard";
import { confirmAge, signOut } from "@/app/actions";
import Steps from "@/components/Steps";
import { Cat } from "@/components/PetArt";

export default async function AgePage({ searchParams }: PageProps<"/onboarding/age">) {
  const { profile } = await requireStage("consented");
  if (profile.age_confirmed_20plus) redirect("/onboarding/pet");
  const { stop } = await searchParams;
  if (stop) {
    return (
      <div className="pt-6 text-center">
        <div className="flex justify-center"><Cat size={120} /></div>
        <h1 className="mt-4 text-2xl font-semibold">ขอบคุณที่สนใจนะ</h1>
        <p className="mt-2 text-bark">ตอนนี้ Paw Diary เปิดให้ผู้ที่อายุ 20 ปีขึ้นไปก่อน เราไม่ได้บันทึกข้อมูลอะไรเพิ่มจากคำตอบนี้</p>
        <p className="mt-2 text-bark">ถ้ารู้สึกหนักใจ ปุ่ม &quot;ต้องการคนรับฟัง&quot; ด้านบนยังกดได้เสมอ</p>
        <form action={signOut}><button className="btn btn-ghost mt-6">ออกจากระบบ</button></form>
      </div>
    );
  }
  return (
    <>
      <Steps at={2} />
      <h1 className="text-2xl font-semibold">ยืนยันอายุ</h1>
      <p className="mt-1 text-bark">เราไม่เก็บวันเกิดของคุณ ขอแค่คำยืนยันนี้</p>
      <form action={confirmAge} className="mt-8 space-y-3">
        <p className="paper p-5 text-lg font-medium">ฉันอายุ 20 ปีขึ้นไป</p>
        <button name="answer" value="yes" className="btn btn-primary w-full">ใช่</button>
        <button name="answer" value="no" className="btn btn-ghost w-full">ไม่ใช่</button>
      </form>
    </>
  );
}
