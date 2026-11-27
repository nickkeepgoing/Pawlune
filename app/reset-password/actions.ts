'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { pathForCurrentUser } from '@/lib/guard';

export async function setNewPassword(_: { error?: string }, form: FormData): Promise<{ error?: string }> {
  const password = String(form.get('password') ?? '');
  if (password.length < 8) return { error: 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร' };
  if (password !== String(form.get('confirm') ?? '')) return { error: 'รหัสผ่านสองช่องไม่ตรงกัน' };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: 'ตั้งรหัสผ่านไม่สำเร็จ ลิงก์อาจหมดอายุ ลองกดลืมรหัสผ่านอีกครั้ง' };
  redirect(await pathForCurrentUser());
}
