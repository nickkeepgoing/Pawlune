/**
 * Create/refresh the labelled demo account from fixtures/demo-seed.json.
 * Run: npm run seed:demo   (needs NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEMO_EMAIL, DEMO_PASSWORD in .env.local)
 * Server-only: uses the service role key. The account gets profiles.is_demo = true → "ข้อมูลจำลอง" badge.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/database.types";

const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key, DEMO_EMAIL: email, DEMO_PASSWORD: password } = process.env;
if (!url || !key || !email || !password) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEMO_EMAIL, DEMO_PASSWORD");

const seed = JSON.parse(readFileSync(new URL("../fixtures/demo-seed.json", import.meta.url), "utf-8"));
const db = createClient<Database>(url, key, { auth: { persistSession: false } });
const must = <R extends { data: unknown; error: unknown }>(r: R): NonNullable<R["data"]> => { if (r.error) throw r.error; return r.data as NonNullable<R["data"]>; };

async function findUser(): Promise<string | null> {
  for (let page = 1; ; page++) {
    const { users } = must(await db.auth.admin.listUsers({ page, perPage: 200 }));
    const u = users.find((x) => x.email === email);
    if (u) return u.id;
    if (users.length < 200) return null;
  }
}

async function main() {
  let uid = await findUser();
  if (!uid) uid = must(await db.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: "ผู้ใช้สาธิต" } })).user!.id;

  // Refresh: wipe this user's rows, keep the auth user.
  for (const t of ["checkins", "who5_entries", "pets"] as const) must(await db.from(t).delete().eq("user_id", uid));
  must(await db.from("profiles").upsert({ id: uid, display_name: "ผู้ใช้สาธิต", consent_version: "v1", consented_at: new Date().toISOString(), age_confirmed_20plus: true, is_demo: true }));

  const pet = must(await db.from("pets").insert({ user_id: uid, name: seed.pet.name, species: seed.pet.species, adopted_on: seed.pet.adopted_on, is_current: true }).select("id").single());
  for (const p of seed.past_pets) must(await db.from("pets").insert({
    user_id: uid, is_current: false, name: p.name, species: p.species, past_period: p.period, past_feeling: p.feeling, past_tags: p.tags, memory_note: p.memory_note || null,
  }));
  must(await db.from("checkins").insert(seed.checkins.map((c: { date: string; mood: number; activities: string[]; created_at: string }) => ({
    user_id: uid, pet_id: pet.id, checkin_date: c.date, mood: c.mood, activities: c.activities, created_at: c.created_at, updated_at: c.created_at,
  }))));
  must(await db.from("who5_entries").insert(seed.who5.map((w: { taken_on: string; items: number[] }) => ({ user_id: uid, taken_on: w.taken_on, items: w.items }))));
  console.log(`Demo account ready: ${seed.checkins.length} check-ins, ${seed.who5.length} WHO-5 entries (is_demo = true).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
