'use server';
import { revalidatePath } from 'next/cache';
import { isActivityId } from '@/lib/engine';
import { getState } from '@/lib/data';
import { todayInBangkok } from '@/lib/time';

export async function saveCheckin(input: { mood: number; activities: string[]; note: string }) {
  const { supabase, user, pet } = await getState();
  if (!user) return { error: 'กรุณาเข้าสู่ระบบใหม่' };
  if (!Number.isInteger(input.mood) || input.mood < 1 || input.mood > 5) return { error: 'เลือกอารมณ์วันนี้ก่อน' };
  const activities = [...new Set(input.activities)].filter(isActivityId);
  const note = input.note.trim().slice(0, 500) || null;
  const now = new Date().toISOString();
  // Date comes from the server only. Upsert = one row per user per day.
  const { error } = await supabase.from('checkins').upsert(
    { user_id: user.id, pet_id: pet?.id ?? null, checkin_date: todayInBangkok(), mood: input.mood, activities, note, created_at: now, updated_at: now },
    { onConflict: 'user_id,checkin_date' },
  );
  if (error) return { error: 'บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง' };
  revalidatePath('/', 'layout');
  return { ok: true };
}
