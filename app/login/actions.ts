'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { pathForCurrentUser } from '@/lib/guard';
import { emailFor, usernameTaken } from '@/lib/authLookup';
import { USERNAME_HINT, USERNAME_RE, normUsername } from '@/lib/username';

export type AuthState = { error?: string; info?: string };

function thaiError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login')) return 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
  if (m.includes('already registered') || m.includes('already been registered')) return 'อีเมลนี้สมัครแล้ว ลองเข้าสู่ระบบ หรือกดลืมรหัสผ่าน';
  if (m.includes('password') && (m.includes('6') || m.includes('weak'))) return 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร';
  if (m.includes('email not confirmed')) return 'ยังไม่ได้ยืนยันอีเมล เปิดลิงก์ในอีเมลก่อน';
  if (m.includes('rate limit') || m.includes('security purposes')) return 'ลองบ่อยเกินไป รอสักครู่แล้วลองใหม่';
  return 'ทำรายการไม่สำเร็จ ลองใหม่อีกครั้ง';
}

async function origin() {
  const h = await headers();
  return process.env.NEXT_PUBLIC_SITE_URL || `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('host')}`;
}

export async function signIn(_: AuthState, form: FormData): Promise<AuthState> {
  const identifier = String(form.get('identifier') ?? '');
  const password = String(form.get('password') ?? '');
  if (!identifier.trim() || !password) return { error: 'กรอกชื่อผู้ใช้และรหัสผ่าน' };
  const email = await emailFor(identifier);
  // Same message whether the username exists or not (no account enumeration).
  if (!email) return { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: thaiError(error.message) };
  redirect(await pathForCurrentUser());
}

export async function register(_: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get('email') ?? '').trim();
  const username = normUsername(String(form.get('username') ?? ''));
  const password = String(form.get('password') ?? '');
  const confirm = String(form.get('confirm') ?? '');
  if (!email || !username || !password) return { error: 'กรอกให้ครบทุกช่อง' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'รูปแบบอีเมลไม่ถูกต้อง' };
  if (!USERNAME_RE.test(username)) return { error: `ชื่อผู้ใช้ต้องเป็น${USERNAME_HINT}` };
  if (password.length < 8) return { error: 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร' };
  if (password !== confirm) return { error: 'รหัสผ่านสองช่องไม่ตรงกัน' };
  if (await usernameTaken(username)) return { error: 'ชื่อผู้ใช้นี้มีคนใช้แล้ว ลองชื่ออื่น' };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email, password, options: { emailRedirectTo: `${await origin()}/auth/callback`, data: { username } },
  });
  if (error) return { error: thaiError(error.message) };
  if (!data.session) return { info: 'สมัครแล้ว ส่งลิงก์ยืนยันไปที่อีเมลแล้ว เปิดลิงก์เพื่อเริ่มใช้งาน' };
  redirect(await pathForCurrentUser());
}

export async function forgotPassword(_: AuthState, form: FormData): Promise<AuthState> {
  const identifier = String(form.get('identifier') ?? '');
  if (!identifier.trim()) return { error: 'กรอกอีเมลหรือชื่อผู้ใช้' };
  const email = await emailFor(identifier);
  if (email) {
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${await origin()}/auth/callback?next=/reset-password` });
  }
  // Same answer either way.
  return { info: 'ถ้ามีบัญชีนี้อยู่ เราส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมลที่ใช้สมัครแล้ว' };
}

export async function googleAuth() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${await origin()}/auth/callback` } });
  if (error || !data.url) redirect('/login?error=google');
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
