"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const TH_ERRORS: Record<string, string> = {
  invalid_credentials: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  email_not_confirmed: "ยังไม่ได้ยืนยันอีเมล กรุณาเปิดลิงก์ในอีเมลก่อน",
  user_already_exists: "อีเมลนี้มีบัญชีอยู่แล้ว ลองเข้าสู่ระบบแทน",
  weak_password: "รหัสผ่านสั้นเกินไป ใช้อย่างน้อย 8 ตัวอักษร",
  over_email_send_rate_limit: "ส่งอีเมลบ่อยเกินไป รอสักครู่แล้วลองใหม่",
  validation_failed: "กรอกอีเมลให้ถูกรูปแบบ",
};
const thai = (e: { code?: string } | null) => (e ? TH_ERRORS[e.code ?? ""] ?? "เกิดข้อผิดพลาด ลองอีกครั้งได้เลย" : null);

export default function LoginForm({ initialError }: { initialError: string | null }) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(initialError);
  const [busy, setBusy] = useState(false);
  const callback = () => `${window.location.origin}/auth/callback`;

  async function google() {
    setBusy(true);
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback() } });
    if (error) { setErr(thai(error)); setBusy(false); }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")), password = String(f.get("password"));
    setBusy(true); setErr(null); setMsg(null);
    const sb = createClient();
    if (mode === "signin") {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) { setErr(thai(error)); setBusy(false); return; }
      router.replace("/home"); router.refresh();
    } else {
      if (password.length < 8) { setErr(TH_ERRORS.weak_password); setBusy(false); return; }
      const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: callback() } });
      if (error) { setErr(thai(error)); setBusy(false); return; }
      if (data.session) { router.replace("/home"); router.refresh(); return; }
      setMsg("ส่งลิงก์ยืนยันไปที่อีเมลแล้ว เปิดลิงก์เพื่อเริ่มใช้งาน"); setBusy(false);
    }
  }

  return (
    <div className="paper mt-6 p-6">
      <button type="button" onClick={google} disabled={busy} className="btn btn-ghost w-full bg-paper">
        <svg aria-hidden width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
        เข้าสู่ระบบด้วย Google
      </button>
      <div className="my-5 flex items-center gap-3 text-sm text-bark"><span className="h-px flex-1 bg-line" />หรือใช้อีเมล<span className="h-px flex-1 bg-line" /></div>
      <form onSubmit={submit} className="space-y-4">
        <label className="block"><span className="mb-1 block text-sm font-medium">อีเมล</span>
          <input name="email" type="email" required autoComplete="email" className="field" /></label>
        <label className="block"><span className="mb-1 block text-sm font-medium">รหัสผ่าน</span>
          <input name="password" type="password" required minLength={mode === "signup" ? 8 : undefined}
            autoComplete={mode === "signup" ? "new-password" : "current-password"} className="field" /></label>
        {err && <p role="alert" className="rounded-lg bg-cream px-3 py-2 text-sm">{err}</p>}
        {msg && <p role="status" className="rounded-lg bg-sage-soft px-3 py-2 text-sm">{msg}</p>}
        <button disabled={busy} className="btn btn-primary w-full">{busy ? "กำลังดำเนินการ…" : mode === "signin" ? "เข้าสู่ระบบ" : "สมัครใช้งาน"}</button>
      </form>
      <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(null); setMsg(null); }}
        className="mt-4 min-h-11 w-full text-sm text-jade-deep underline underline-offset-4">
        {mode === "signin" ? "ยังไม่มีบัญชี? สมัครด้วยอีเมล" : "มีบัญชีแล้ว? เข้าสู่ระบบ"}
      </button>
    </div>
  );
}
