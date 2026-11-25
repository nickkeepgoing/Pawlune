import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { dedupeCheckins, who5Score } from "./engine";

type DB = SupabaseClient<Database>;

/** Engine input. Never selects `note` (docs/DATABASE.md). */
export async function loadCheckins(supabase: DB, userId: string) {
  const { data, error } = await supabase.from("checkins")
    .select("checkin_date, mood, activities, created_at").eq("user_id", userId).order("checkin_date");
  if (error) throw error;
  return dedupeCheckins((data ?? []).map((r) => ({ date: r.checkin_date, mood: r.mood, activities: r.activities, created_at: r.created_at })));
}

export async function loadWho5(supabase: DB, userId: string) {
  const { data, error } = await supabase.from("who5_entries")
    .select("taken_on, items, raw, pct, created_at").eq("user_id", userId).order("taken_on").order("created_at");
  if (error) throw error;
  // Engine is the source of truth; DB generated columns must agree.
  return (data ?? []).map((r) => {
    const s = who5Score(r.items);
    if (s.raw !== r.raw || s.pct !== r.pct) throw new Error("WHO-5 DB score differs from engine");
    return { taken_on: r.taken_on, ...s };
  });
}

export async function petPhotoUrl(supabase: DB, path: string | null) {
  if (!path) return null;
  const { data } = await supabase.storage.from("pet-photos").createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}
