'use server';
import { revalidatePath } from 'next/cache';
import { getState } from '@/lib/data';
import { USERNAME_HINT, USERNAME_RE, normUsername } from '@/lib/username';

const ANIMALS = ['dog', 'cat', 'rabbit', 'hamster', 'bird', 'turtle'];
export type ProfileState = { error?: string; info?: string };

export async function saveProfile(_: ProfileState, form: FormData): Promise<ProfileState> {
  const { supabase, user, profile } = await getState();
  if (!user) return { error: 'กรุณาเข้าสู่ระบบใหม่' };
  const display_name = String(form.get('display_name') ?? '').trim().slice(0, 40) || null;
  const raw = String(form.get('username') ?? '');
  const username = raw.trim() ? normUsername(raw) : null;
  if (username && !USERNAME_RE.test(username)) return { error: `ชื่อผู้ใช้ต้องเป็น${USERNAME_HINT}` };
  if (username && username !== profile?.username) {
    const { data: taken } = await supabase.rpc('username_available', { u: username });
    if (taken === false) return { error: 'ชื่อผู้ใช้นี้มีคนใช้แล้ว' };
  }
  const { error } = await supabase.from('profiles').update({ display_name, username }).eq('id', user.id);
  if (error) return { error: error.code === '23505' ? 'ชื่อผู้ใช้นี้มีคนใช้แล้ว' : 'บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง' };
  revalidatePath('/', 'layout');
  return { info: 'บันทึกแล้ว' };
}

export async function setAvatarPhoto(path: string) {
  const { supabase, user, profile } = await getState();
  if (!user || !path.startsWith(`${user.id}/avatar-`)) return { error: 'รูปไม่ถูกต้อง' };
  const { error } = await supabase.from('profiles').update({ avatar_path: path }).eq('id', user.id);
  if (error) return { error: 'บันทึกรูปไม่สำเร็จ' };
  if (profile?.avatar_path && profile.avatar_path !== path) await supabase.storage.from('pet-photos').remove([profile.avatar_path]);
  revalidatePath('/', 'layout');
  return { ok: true };
}

/** Pick an animal; also removes the uploaded photo so the animal shows. */
export async function setAvatarAnimal(form: FormData) {
  const { supabase, user, profile } = await getState();
  if (!user) return;
  const animal = String(form.get('animal'));
  if (!ANIMALS.includes(animal)) return;
  if (profile?.avatar_path) await supabase.storage.from('pet-photos').remove([profile.avatar_path]);
  await supabase.from('profiles').update({ avatar_animal: animal, avatar_path: null }).eq('id', user.id);
  revalidatePath('/', 'layout');
}
