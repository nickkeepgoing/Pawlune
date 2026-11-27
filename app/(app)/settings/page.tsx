import Link from 'next/link';
import { requireStage } from '@/lib/guard';
import { SubmitButton } from '@/components/SubmitButton';
import { signOut } from '@/app/login/actions';
import { ThemeToggle } from '@/components/ThemeToggle';
import { deleteAll, updateName } from './actions';

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ confirm?: string; failed?: string }> }) {
  const { profile, user } = await requireStage('ready');
  const sp = await searchParams;
  return (
    <div className="space-y-6 py-2">
      <h1 className="text-2xl font-bold">ตั้งค่า</h1>

      <section className="card card-quiet">
        <form action={updateName} className="space-y-3">
          <label className="block"><span className="font-semibold">ชื่อที่ให้แอปเรียก</span><input name="name" defaultValue={profile?.display_name ?? ''} maxLength={40} className="field mt-1" /></label>
          <SubmitButton className="btn btn-ghost">บันทึกชื่อ</SubmitButton>
        </form>
        <p className="mt-3 text-sm text-bark">บัญชี: {user!.email}</p>
      </section>

      <section className="card card-quiet flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold">หน้าตาแอป</h2>
          <p className="text-sm text-bark">สลับระหว่างโหมดสว่างกับโหมดมืด</p>
        </div>
        <ThemeToggle />
      </section>

      {/* A settings list, not a stack of identical buttons: each row is a destination,
          so it reads like a list you scan rather than five calls to action. */}
      <section className="overflow-hidden rounded-[var(--radius-card)] border border-bark/15 bg-paper">
        <ul className="divide-y divide-bark/10">
          {[
            ['/profile', 'โปรไฟล์และรูปโปรไฟล์'],
            ['/pets', 'น้องและความทรงจำ'],
            ['/report', 'รายงานของฉัน'],
            ['/learn', 'สัตว์เลี้ยงกับใจ งานวิจัยว่าอย่างไร'],
            ['/learn/care', 'คู่มือเลี้ยงและค่าใช้จ่าย'],
            ...(profile?.is_shelter ? [['/shelter', 'หน้าศูนย์ คำขอทดลองเลี้ยง']] : []),
          ].map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="flex min-h-14 items-center justify-between gap-3 px-4 hover:bg-cream">
                <span>{label}</span>
                <span aria-hidden className="text-bark">›</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[var(--radius-card)] border-[1.5px] border-bark/40 bg-paper p-4">
        <h2 className="font-semibold">ลบข้อมูลทั้งหมด</h2>
        <p className="mt-1 text-sm text-bark">ลบบันทึก คำตอบ WHO-5 ข้อมูลน้อง รูป และบัญชีของคุณทันที กู้คืนไม่ได้</p>
        <form action={deleteAll} className="mt-3 space-y-3">
          <label className="block"><span className="text-sm">พิมพ์คำว่า <b>ลบ</b> เพื่อยืนยัน</span><input name="confirm" autoComplete="off" className="field mt-1" /></label>
          {sp.confirm && <p className="text-sm font-semibold" role="alert">พิมพ์คำว่า ลบ ให้ตรงก่อน</p>}
          {sp.failed && <p className="text-sm font-semibold" role="alert">ลบไม่สำเร็จ ลองใหม่อีกครั้ง</p>}
          <SubmitButton className="btn w-full border-[1.5px] border-cocoa bg-cream text-cocoa" pendingText="กำลังลบ…">ลบข้อมูลทั้งหมด</SubmitButton>
        </form>
      </section>

      <form action={signOut}><SubmitButton className="btn btn-ghost w-full" pendingText="กำลังออก…">ออกจากระบบ</SubmitButton></form>
    </div>
  );
}
