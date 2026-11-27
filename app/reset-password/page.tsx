import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { redirect } from 'next/navigation';
import { getState } from '@/lib/data';
import { ResetForm } from './ResetForm';

export default async function ResetPasswordPage() {
  const { user } = await getState();
  if (!user) redirect('/login?error=reset');
  return (
    <main className="mx-auto max-w-sm px-5 py-10">
      <Link href="/" className="flex items-center"><Logo className="text-lg" /></Link>
      <h1 className="mt-8 text-2xl font-bold">ตั้งรหัสผ่านใหม่</h1>
      <ResetForm />
    </main>
  );
}
