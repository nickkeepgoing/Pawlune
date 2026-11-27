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
    <main className="mx-auto max-w-sm px-5 py-10">
      <Link href="/" className="flex items-center"><Logo className="text-lg" /></Link>
      <h1 className="mt-8 text-2xl font-bold">เข้าสู่ระบบ</h1>
      <p className="mt-1 text-bark">เริ่มสมุดบันทึกของคุณกับน้อง</p>
      {sp.error === 'reset' && <p className="mt-4 rounded-lg bg-paper px-3 py-2 text-sm" role="alert">ลิงก์ตั้งรหัสผ่านหมดอายุหรือใช้ไปแล้ว กดลืมรหัสผ่านเพื่อขอลิงก์ใหม่</p>}
      <LoginForm googleError={sp.error === 'google'} />
    </main>
  );
}
