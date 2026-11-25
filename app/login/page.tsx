import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession, nextStepPath } from "@/lib/guard";
import { Logo } from "@/components/AppHeader";
import LoginForm from "./LoginForm";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { user } = await getSession();
  if (user) redirect(await nextStepPath());
  const { error } = await searchParams;
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-8">
      <Link href="/" className="inline-flex min-h-11 items-center"><Logo /></Link>
      <h1 className="mt-6 text-2xl font-semibold">เข้าสู่ระบบ หรือ สมัครใช้งาน</h1>
      <p className="mt-1 text-bark">บันทึกของคุณเห็นได้เฉพาะคุณ</p>
      <LoginForm initialError={error === "callback" ? "เข้าสู่ระบบไม่สำเร็จ ลองอีกครั้งได้เลย" : null} />
    </main>
  );
}
