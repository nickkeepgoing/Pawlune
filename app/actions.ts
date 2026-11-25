"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireStage } from "@/lib/guard";
import { todayInBangkok } from "@/lib/time";
import { isActivityId, who5Score } from "@/lib/engine";
import { createAdminClient } from "@/lib/supabase/admin";

// Every action re-reads the session itself; RLS is the second wall.

export async function signOut() {
  const { supabase } = await requireStage("signedIn");
  await supabase.auth.signOut();
  redirect("/");
}

export async function acceptConsent(formData: FormData) {
  const { supabase, user } = await requireStage("signedIn");
  if (formData.get("agree") !== "on") redirect("/onboarding/consent?error=1");
  const { error } = await supabase.from("profiles")
    .update({ consent_version: "v1", consented_at: new Date().toISOString() }).eq("id", user.id);
  if (error) throw error;
  redirect("/onboarding/age");
}

export async function confirmAge(formData: FormData) {
  const { supabase, user } = await requireStage("consented");
  if (formData.get("answer") !== "yes") redirect("/onboarding/age?stop=1"); // nothing stored
  const { error } = await supabase.from("profiles").update({ age_confirmed_20plus: true }).eq("id", user.id);
  if (error) throw error;
  redirect("/onboarding/pet");
}

const str = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);
const isoDate = (v: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);
const species = (v: string) => (["dog", "cat", "other"].includes(v) ? (v as "dog" | "cat" | "other") : "other");

export async function savePet(formData: FormData) {
  const { supabase, user } = await requireStage("ageOk");
  const name = str(formData.get("name"), 40);
  if (!name) redirect("/onboarding/pet?error=name");
  const photo = str(formData.get("photo_path"), 200);
  const { error } = await supabase.from("pets").insert({
    user_id: user.id, name, species: species(str(formData.get("species"), 10)),
    adopted_on: isoDate(str(formData.get("adopted_on"), 10)),
    photo_path: photo.startsWith(`${user.id}/`) ? photo : null, is_current: true,
  });
  if (error) throw error;
  redirect("/checkin");
}

export async function saveCheckin(formData: FormData) {
  const { supabase, user, pet } = await requireStage("ready");
  const mood = Number(formData.get("mood"));
  if (!Number.isInteger(mood) || mood < 1 || mood > 5) redirect("/checkin?error=mood");
  const activities = [...new Set(formData.getAll("activities").map(String))].filter(isActivityId);
  const note = str(formData.get("note"), 500) || null;
  const { error } = await supabase.from("checkins").upsert({
    user_id: user.id, pet_id: pet.id, checkin_date: todayInBangkok(), mood, activities, note,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,checkin_date" });
  if (error) throw error;
  revalidatePath("/", "layout");
  redirect("/home?saved=1");
}

export async function saveWho5(formData: FormData) {
  const { supabase, user } = await requireStage("ready");
  const items = [0, 1, 2, 3, 4].map((i) => Number(formData.get(`q${i}`)));
  let score;
  try { score = who5Score(items); } catch { redirect("/wellbeing/take?error=1"); }
  const { data, error } = await supabase.from("who5_entries")
    .insert({ user_id: user.id, taken_on: todayInBangkok(), items }).select("raw, pct").single();
  if (error) throw error;
  if (data.raw !== score.raw || data.pct !== score.pct) throw new Error("WHO-5 DB score differs from engine");
  revalidatePath("/", "layout");
  redirect("/wellbeing?result=1");
}

export async function updateDisplayName(formData: FormData) {
  const { supabase, user } = await requireStage("ready");
  const { error } = await supabase.from("profiles").update({ display_name: str(formData.get("display_name"), 40) || null }).eq("id", user.id);
  if (error) throw error;
  revalidatePath("/", "layout");
  redirect("/settings?saved=1");
}

export async function savePastPet(formData: FormData) {
  const { supabase, user } = await requireStage("ready");
  const id = str(formData.get("id"), 40);
  const feeling = Number(formData.get("past_feeling"));
  const row = {
    user_id: user.id, is_current: false,
    name: str(formData.get("name"), 40) || "ไม่มีชื่อ",
    species: species(str(formData.get("species"), 10)),
    past_period: str(formData.get("past_period"), 40) || null,
    past_feeling: Number.isInteger(feeling) && feeling >= 1 && feeling <= 5 ? feeling : null,
    past_tags: str(formData.get("past_tags"), 200).split(/[,،]/).map((t) => t.trim()).filter(Boolean).slice(0, 8),
    memory_note: str(formData.get("memory_note"), 500) || null,
  };
  const { error } = id
    ? await supabase.from("pets").update(row).eq("id", id).eq("user_id", user.id).eq("is_current", false)
    : await supabase.from("pets").insert(row);
  if (error) throw error;
  revalidatePath("/pets");
  redirect("/pets");
}

export async function deletePastPet(formData: FormData) {
  const { supabase, user } = await requireStage("ready");
  const { error } = await supabase.from("pets").delete()
    .eq("id", str(formData.get("id"), 40)).eq("user_id", user.id).eq("is_current", false);
  if (error) throw error;
  revalidatePath("/pets");
  redirect("/pets");
}

/** ลบข้อมูลทั้งหมด: photos under {uid}/, then the auth user (cascades every table). */
export async function deleteAllData(formData: FormData) {
  const { supabase, user } = await requireStage("signedIn");
  if (str(formData.get("confirm"), 10) !== "ลบ") redirect("/settings?error=confirm");
  const admin = createAdminClient();
  for (;;) {
    const { data: files, error } = await admin.storage.from("pet-photos").list(user.id, { limit: 100 });
    if (error) throw error;
    if (!files?.length) break;
    const { error: rmErr } = await admin.storage.from("pet-photos").remove(files.map((f) => `${user.id}/${f.name}`));
    if (rmErr) throw rmErr;
  }
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw error;
  await supabase.auth.signOut();
  redirect("/?deleted=1");
}
