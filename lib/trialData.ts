import 'server-only';
import { getState } from '@/lib/data';
import type { Prefs } from '@/lib/engine';

export interface Animal {
  id: string; shelter_id: string; name: string; species: 'dog' | 'cat'; sex: 'm' | 'f' | null;
  age_group: string | null; size: string | null; energy: string | null; personality: string | null;
  needs_fence: boolean; max_hours_alone: number | null; good_with: string[]; story: string | null; status: string; is_demo: boolean;
  // Known history disclosed by the shelter (0005)
  indoor_ok: boolean; ok_with_cats: 'yes' | 'no' | 'unknown'; ok_with_dogs: 'yes' | 'no' | 'unknown';
  vaccinated: boolean | null; neutered: boolean | null; health_notes: string | null; behavior_notes: string | null;
}
export interface Shelter { id: string; name: string; area: string | null; phone: string | null; url: string | null; is_demo: boolean }
export interface Trial {
  id: string; animal_id: string; status: 'applied' | 'active' | 'adopted' | 'return_requested' | 'returned' | 'declined';
  applied_at: string; start_date: string | null; decided_at: string | null; pet_id: string | null;
  agreed_at: string | null; return_plan: string | null; emergency_contact: string | null; approved_at: string | null;
}
export interface Feedback { id: string; kind: 'day14' | 'monthly' | 'concern'; feeling: number | null; decision: string | null; problems: string[]; note: string | null; created_at: string }
export interface St5Row { id: string; taken_on: string; items: number[]; raw: number; created_at: string }
export type PrefsRow = Prefs & { budget_month: number | null; family_agrees: boolean; experience: string | null; allergy_checked?: boolean; has_carrier?: boolean };

export async function loadPrefs(): Promise<PrefsRow | null> {
  const { supabase, user } = await getState();
  if (!user) return null;
  const { data } = await supabase.from('adopt_preferences').select('*').eq('user_id', user.id).maybeSingle();
  return (data as PrefsRow) ?? null;
}

export async function loadAnimals(): Promise<{ animals: Animal[]; shelters: Shelter[] }> {
  const { supabase } = await getState();
  const [{ data: a }, { data: s }] = await Promise.all([
    supabase.from('shelter_animals').select('*').eq('status', 'available'),
    supabase.from('shelters').select('*'),
  ]);
  return { animals: (a ?? []) as Animal[], shelters: (s ?? []) as Shelter[] };
}

/** The user's current trial (anything not closed), else the latest one. */
export async function loadTrial(): Promise<{ trial: Trial | null; animal: Animal | null; shelter: Shelter | null; feedback: Feedback[] }> {
  const { supabase, user } = await getState();
  if (!user) return { trial: null, animal: null, shelter: null, feedback: [] };
  const { data: trials } = await supabase.from('trials').select('*').eq('user_id', user.id).order('applied_at', { ascending: false }).limit(5);
  const list = (trials ?? []) as Trial[];
  const trial = list.find((t) => ['applied', 'active', 'return_requested', 'adopted'].includes(t.status)) ?? null;
  if (!trial) return { trial: null, animal: null, shelter: null, feedback: [] };
  const [{ data: animal }, { data: fb }] = await Promise.all([
    supabase.from('shelter_animals').select('*').eq('id', trial.animal_id).maybeSingle(),
    supabase.from('trial_feedback').select('*').eq('trial_id', trial.id).order('created_at'),
  ]);
  const { data: shelter } = animal ? await supabase.from('shelters').select('*').eq('id', (animal as Animal).shelter_id).maybeSingle() : { data: null };
  return { trial, animal: (animal as Animal) ?? null, shelter: (shelter as Shelter) ?? null, feedback: (fb ?? []) as Feedback[] };
}

export async function loadSt5(): Promise<St5Row[]> {
  const { supabase, user } = await getState();
  if (!user) return [];
  const { data } = await supabase.from('st5_entries').select('id, taken_on, items, raw, created_at').eq('user_id', user.id).order('taken_on').order('created_at');
  return (data ?? []) as St5Row[];
}

export const LABEL = {
  species: { dog: 'หมา', cat: 'แมว' } as Record<string, string>,
  sex: { m: 'ตัวผู้', f: 'ตัวเมีย' } as Record<string, string>,
  age_group: { young: 'อายุน้อย', adult: 'โตเต็มวัย', senior: 'สูงวัย', any: 'ไม่จำกัด' } as Record<string, string>,
  size: { small: 'เล็ก', medium: 'กลาง', large: 'ใหญ่', any: 'ไม่จำกัด' } as Record<string, string>,
  energy: { calm: 'นิ่ง ชอบพัก', medium: 'ปานกลาง', active: 'พลังเยอะ', any: 'ไม่จำกัด' } as Record<string, string>,
  personality: { cuddly: 'ขี้อ้อน', independent: 'ชอบอยู่เงียบๆ', any: 'ไม่จำกัด' } as Record<string, string>,
  okWith: { yes: 'เคยอยู่ด้วยกันได้', no: 'ไม่เข้ากัน', unknown: 'ศูนย์ยังไม่ทราบ' } as Record<string, string>,
  pets: { cat: 'แมว', dog: 'หมา', other: 'สัตว์อื่น' } as Record<string, string>,
};

export const PROBLEMS = [
  ['cost', 'ค่าใช้จ่ายมากกว่าที่คิด'], ['time', 'ไม่มีเวลาดูแลพอ'], ['behavior', 'พฤติกรรมน้องปรับยาก'],
  ['health', 'น้องมีปัญหาสุขภาพ'], ['home', 'ที่อยู่ไม่เหมาะ / มีปัญหากับเพื่อนบ้าน'], ['allergy', 'มีอาการแพ้'], ['family', 'คนในบ้านไม่สะดวก'],
  ['pets', 'น้องกับสัตว์เดิมในบ้านเข้ากันไม่ได้'], ['safety', 'กังวลเรื่องความปลอดภัยของคนหรือน้อง'],
] as const;
