'use client';
import { useActionState } from 'react';
import { SubmitButton } from '@/components/SubmitButton';
import { PasswordInput } from '@/components/PasswordInput';
import { setNewPassword } from './actions';

export function ResetForm() {
  const [s, action] = useActionState<{ error?: string }, FormData>(setNewPassword, {});
  return (
    <form action={action} className="mt-6 space-y-3">
      <label className="block"><span className="text-sm">รหัสผ่านใหม่</span><PasswordInput name="password" minLength={8} autoComplete="new-password" /></label>
      <label className="block"><span className="text-sm">ยืนยันรหัสผ่านใหม่</span><PasswordInput name="confirm" minLength={8} autoComplete="new-password" /></label>
      {s.error && <p className="text-sm font-semibold" role="alert">{s.error}</p>}
      <SubmitButton>ตั้งรหัสผ่านใหม่</SubmitButton>
    </form>
  );
}
