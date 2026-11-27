import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { redirect } from 'next/navigation';
import { getState } from '@/lib/data';
import { pathForCurrentUser } from '@/lib/guard';
import { LoginForm } from './LoginForm';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { user } = await getState();
  if (user) redirect(await pathForCurrentUser());
  const sp = await searchParams;
  return (
    <main className="mx-auto grid min-h-dvh max-w-5xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_26rem] lg:gap-16">
      {/* Someone arriving from the landing page should not lose the thread at the door. */}
      <div className="hidden lg:block">
        <Link href="/" className="flex items-center"><Logo className="text-lg" /></Link>
        <p className="mt-10 max-w-[22ch] text-[2.4rem] font-bold leading-[1.1]">บันทึกวันละสิบวินาที ตลอดสิบสี่วัน</p>
        <p className="mt-5 max-w-[46ch] text-bark">
          ช่วงแรกของการรับเลี้ยงคือช่วงที่คนเลี้ยงต้องเดาเอาเองมากที่สุด สมุดเล่มนี้เก็บไว้ให้คุณดูย้อนหลังตอนต้องตัดสินใจ
        </p>
        <p className="mt-8 text-sm text-bark">ศูนย์เห็นเฉพาะความเป็นอยู่ของน้อง ไม่เห็นบันทึกอารมณ์ของคุณ</p>
      </div>

      <div className="w-full">
        <Link href="/" className="flex items-center lg:hidden"><Logo className="text-lg" /></Link>
        <h1 className="mt-8 text-2xl font-bold lg:mt-0">เข้าสู่ระบบ</h1>
        <p className="mt-1 text-bark">เริ่มสมุดบันทึกของคุณกับน้อง</p>
        {sp.error === 'reset' && <p className="mt-4 rounded-lg bg-paper px-3 py-2 text-sm" role="alert">ลิงก์ตั้งรหัสผ่านหมดอายุหรือใช้ไปแล้ว กดลืมรหัสผ่านเพื่อขอลิงก์ใหม่</p>}
        <LoginForm googleError={sp.error === 'google'} />
      </div>
    </main>
  );
}
