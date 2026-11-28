'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { SubmitButton } from '@/components/SubmitButton';
import { PasswordInput } from '@/components/PasswordInput';
import { setNewPassword, type ResetState } from './actions';

export function ResetForm({ tokenHash }: { tokenHash?: string }) {
  const [s, action] = useActionState<ResetState, FormData>(setNewPassword, {});
  return (
    <form action={action} className="mt-6 space-y-3">
      {tokenHash && !s.verified && <input type="hidden" name="token_hash" value={tokenHash} />}
      <label className="block"><span className="text-sm">รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)</span><PasswordInput name="password" minLength={8} autoComplete="new-password" /></label>
      <label className="block"><span className="text-sm">ยืนยันรหัสผ่านใหม่</span><PasswordInput name="confirm" minLength={8} autoComplete="new-password" /></label>
      {s.error && <p className="text-sm font-semibold" role="alert">{s.error}</p>}
      <SubmitButton>ตั้งรหัสผ่านใหม่</SubmitButton>
      <Link href="/login" className="btn w-full text-jade">กลับไปเข้าสู่ระบบ</Link>
    </form>
  );
}
