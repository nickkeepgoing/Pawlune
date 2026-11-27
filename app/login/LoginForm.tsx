'use client';
import { useActionState, useState } from 'react';
import { forgotPassword, googleAuth, register, signIn, type AuthState } from './actions';
import { SubmitButton } from '@/components/SubmitButton';
import { PasswordInput } from '@/components/PasswordInput';
import { USERNAME_HINT } from '@/lib/username';

type Mode = 'login' | 'register' | 'forgot';

function Msg({ s }: { s: AuthState }) {
  if (s.error) return <p className="text-sm font-semibold text-cocoa" role="alert">{s.error}</p>;
  if (s.info) return <p className="rounded-lg bg-sage/40 px-3 py-2 text-sm" role="status">{s.info}</p>;
  return null;
}

function Field(p: { label: string; name: string; type?: string; auto?: string; hint?: string; min?: number }) {
  return (
    <label className="block">
      <span className="text-sm">{p.label}</span>
      {p.type === 'password'
        ? <PasswordInput name={p.name} autoComplete={p.auto} minLength={p.min} />
        : <input name={p.name} type={p.type ?? 'text'} autoComplete={p.auto} required minLength={p.min} className="field mt-1" autoCapitalize="none" spellCheck={false} />}
      {p.hint && <span className="mt-1 block text-xs text-bark">{p.hint}</span>}
    </label>
  );
}

export function LoginForm({ googleError }: { googleError: boolean }) {
  const [mode, setMode] = useState<Mode>('login');
  const [ls, loginAction] = useActionState<AuthState, FormData>(signIn, {});
  const [rs, registerAction] = useActionState<AuthState, FormData>(register, {});
  const [fs, forgotAction] = useActionState<AuthState, FormData>(forgotPassword, {});

  return (
    <div className="mt-6 space-y-6">
      {mode !== 'forgot' && (
        <div className="grid grid-cols-2 rounded-full bg-paper p-1" role="tablist" aria-label="เข้าสู่ระบบหรือสมัคร">
          {(['login', 'register'] as const).map((m) => (
            <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
              className={`min-h-11 rounded-full font-semibold ${mode === m ? 'bg-jade text-cream' : 'text-bark'}`}>{m === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</button>
          ))}
        </div>
      )}

      {mode === 'login' && (
        <form action={loginAction} className="space-y-3">
          <Field label="ชื่อผู้ใช้ (หรืออีเมล)" name="identifier" auto="username" />
          <Field label="รหัสผ่าน" name="password" type="password" auto="current-password" />
          <Msg s={ls} />
          <SubmitButton pendingText="กำลังเข้าสู่ระบบ…">เข้าสู่ระบบ</SubmitButton>
          <button type="button" onClick={() => setMode('forgot')} className="btn w-full text-jade">ลืมรหัสผ่าน</button>
        </form>
      )}

      {mode === 'register' && (
        <form action={registerAction} className="space-y-3">
          <Field label="อีเมล" name="email" type="email" auto="email" hint="ใช้สำหรับยืนยันบัญชีและกรณีลืมรหัสผ่าน ไม่แสดงให้ใครเห็น" />
          <Field label="ชื่อผู้ใช้" name="username" auto="username" hint={USERNAME_HINT} />
          <Field label="รหัสผ่าน" name="password" type="password" auto="new-password" min={8} hint="อย่างน้อย 8 ตัวอักษร" />
          <Field label="ยืนยันรหัสผ่าน" name="confirm" type="password" auto="new-password" min={8} />
          <Msg s={rs} />
          <SubmitButton pendingText="กำลังสมัคร…">สมัครสมาชิก</SubmitButton>
        </form>
      )}

      {mode === 'forgot' && (
        <form action={forgotAction} className="space-y-3">
          <h2 className="text-lg font-bold">ลืมรหัสผ่าน</h2>
          <p className="text-sm text-bark">กรอกอีเมลหรือชื่อผู้ใช้ เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมลที่ใช้สมัคร</p>
          <Field label="อีเมลหรือชื่อผู้ใช้" name="identifier" auto="username" />
          <Msg s={fs} />
          <SubmitButton pendingText="กำลังส่ง…">ส่งลิงก์ตั้งรหัสผ่านใหม่</SubmitButton>
          <button type="button" onClick={() => setMode('login')} className="btn w-full text-jade">กลับไปเข้าสู่ระบบ</button>
        </form>
      )}

      {mode !== 'forgot' && (
        <>
          <div className="flex items-center gap-3 text-sm text-bark"><span className="h-px flex-1 bg-bark/25" />หรือ<span className="h-px flex-1 bg-bark/25" /></div>
          <form action={googleAuth}>
            <SubmitButton className="btn btn-ghost w-full bg-paper" pendingText="กำลังไปที่ Google…">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden><path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.5Z"/><path fill="#34A853" d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A11.5 11.5 0 0 0 12 23.5Z"/><path fill="#FBBC05" d="M5.6 14.2a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4l3.8-3Z"/><path fill="#EA4335" d="M12 5c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 0 0 1.8 6.8l3.8 3C6.5 7 9 5 12 5Z"/></svg>
              เข้าสู่ระบบด้วย Google
            </SubmitButton>
            {googleError && <p className="mt-2 text-sm text-cocoa" role="alert">เข้าสู่ระบบด้วย Google ไม่สำเร็จ ลองใช้ชื่อผู้ใช้แทน</p>}
          </form>
        </>
      )}
    </div>
  );
}
