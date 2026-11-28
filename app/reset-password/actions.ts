'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { pathForCurrentUser } from '@/lib/guard';

/** `verified` tells the form that the email link has been used and the session now carries the reset. */
export type ResetState = { error?: string; verified?: boolean };

const EXPIRED = 'ลิงก์หมดอายุหรือใช้ไปแล้ว กลับไปหน้าเข้าสู่ระบบแล้วกดลืมรหัสผ่านเพื่อขอลิงก์ใหม่';

export async function setNewPassword(prev: ResetState, form: FormData): Promise<ResetState> {
  const password = String(form.get('password') ?? '');
  const tokenHash = String(form.get('token_hash') ?? '');
  // Check the typing first: a link works once, so a typo must not use it up.
  if (password.length < 8) return { ...prev, error: 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร' };
  if (password !== String(form.get('confirm') ?? '')) return { ...prev, error: 'รหัสผ่านสองช่องไม่ตรงกัน' };
  const supabase = await createClient();
  // The link is verified here, on submit, and not when the page opens, so mail scanners
  // that open links cannot spend it. This also works on a different device or browser.
  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({ type: 'recovery', token_hash: tokenHash });
    if (error) return { error: EXPIRED };
  }
  const verified = prev.verified || Boolean(tokenHash);
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error('[setNewPassword]', error.code, error.message);
    if (error.code === 'same_password') return { verified, error: 'รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสเดิม' };
    if (error.code === 'weak_password') return { verified, error: 'รหัสผ่านเดาง่ายเกินไป ลองใช้ให้ยาวขึ้น' };
    return { verified, error: 'ตั้งรหัสผ่านไม่สำเร็จ ลองกดลืมรหัสผ่านเพื่อขอลิงก์ใหม่' };
  }
  redirect(await pathForCurrentUser());
}
