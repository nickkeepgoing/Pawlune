import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { connection } from "next/server";
import { createClient } from "./supabase/server";
import { supabaseConfigured } from "./supabase/env";

/** Session + profile + current pet for this request (deduped per render). */
export const getSession = cache(async () => {
  await connection(); // always per-request: private data, never prerendered
  if (!supabaseConfigured) return { supabase: null, user: null, profile: null, pet: null } as const;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, profile: null, pet: null } as const;
  const [{ data: profile }, { data: pet }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("pets").select("*").eq("user_id", user.id).eq("is_current", true)
      .order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  return { supabase, user, profile, pet } as const;
});

export type Stage = "signedIn" | "consented" | "ageOk" | "ready";

type S = Awaited<ReturnType<typeof getSession>>;
type NN<T> = NonNullable<T>;
type Signed = { supabase: NN<S["supabase"]>; user: NN<S["user"]>; profile: S["profile"]; pet: S["pet"] };
type Consented = Signed & { profile: NN<S["profile"]> };
type Ready = Consented & { pet: NN<S["pet"]> };

/** Redirects to the first unfinished onboarding step (USER_FLOW Flow 0–1). */
export async function requireStage(stage: "signedIn"): Promise<Signed>;
export async function requireStage(stage: "consented" | "ageOk"): Promise<Consented>;
export async function requireStage(stage: "ready"): Promise<Ready>;
export async function requireStage(stage: "signedIn" | "consented" | "ageOk" | "ready") {
  const s = await getSession();
  if (!s.user || !s.supabase) redirect("/");
  if (stage === "signedIn") return s;
  if (!s.profile?.consented_at) redirect("/onboarding/consent");
  if (stage === "consented") return s;
  if (!s.profile.age_confirmed_20plus) redirect("/onboarding/age");
  if (stage === "ageOk") return s;
  if (!s.pet) redirect("/onboarding/pet");
  return s;
}

export async function nextStepPath() {
  const s = await getSession();
  if (!s.user) return "/";
  if (!s.profile?.consented_at) return "/onboarding/consent";
  if (!s.profile.age_confirmed_20plus) return "/onboarding/age";
  if (!s.pet) return "/onboarding/pet";
  return "/home";
}
