import Link from "next/link";
import { requireStage } from "@/lib/guard";
import { deleteAllData, signOut, updateDisplayName } from "@/app/actions";

export default async function SettingsPage({ searchParams }: PageProps<"/settings">) {
  const { profile, user } = await requireStage("ready");
  const { saved, error } = await searchParams;
  return (
    <div className="space-y-5 pt-2">
      <h1 className="text-2xl font-semibold">ตั้งค่า</h1>
      <section className="paper p-5">
        <form action={updateDisplayName} className="space-y-3">
          <label className="block"><span className="mb-1 block font-semibold">ชื่อที่ให้เราเรียก</span>
            <input name="display_name" maxLength={40} defaultValue={profile.display_name ?? ""} className="field" /></label>
          {saved && <p role="status" className="text-sm">บันทึกแล้ว</p>}
          <button className="btn btn-ghost">บันทึกชื่อ</button>
        </form>
        <p className="mt-3 text-sm text-bark">บัญชี: {user.email}</p>
      </section>

      <section className="paper p-5">
        <h2 className="font-semibold">รายงานของฉัน</h2>
        <p className="mt-1 text-sm text-bark">สร้างไฟล์ PDF ที่คุณเลือกเองว่าจะใส่อะไร เก็บไว้หรือนำไปคุยกับผู้เชี่ยวชาญได้ตามที่คุณต้องการ</p>
        <Link href="/report" className="btn btn-primary mt-3">สร้างรายงาน</Link>
      </section>

      <section className="paper p-5">
        <h2 className="font-semibold">เกี่ยวกับ</h2>
        <Link href="/learn" className="mt-1 inline-flex min-h-11 items-center text-jade-deep underline underline-offset-4">สัตว์เลี้ยงกับใจ งานวิจัยว่ายังไง</Link>
        <form action={signOut}><button className="btn btn-ghost mt-2 w-full">ออกจากระบบ</button></form>
      </section>

      <section className="paper border-[1.5px] border-bark/40 p-5">
        <h2 className="font-semibold">ลบข้อมูลทั้งหมด</h2>
        <p className="mt-1 text-sm text-bark">ลบบันทึกรายวัน คำตอบ WHO-5 ข้อมูลน้อง รูป และบัญชีของคุณอย่างถาวร กู้คืนไม่ได้</p>
        <form action={deleteAllData} className="mt-3 space-y-3">
          <label className="block"><span className="mb-1 block text-sm">พิมพ์คำว่า <strong>ลบ</strong> เพื่อยืนยัน</span>
            <input name="confirm" required pattern="ลบ" autoComplete="off" className="field" /></label>
          {error === "confirm" && <p role="alert" className="text-sm">ต้องพิมพ์คำว่า &quot;ลบ&quot; ให้ตรง</p>}
          <button className="btn w-full bg-cocoa text-cream hover:bg-black">ลบข้อมูลทั้งหมดถาวร</button>
        </form>
      </section>
    </div>
  );
}
