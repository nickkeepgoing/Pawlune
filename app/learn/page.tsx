import Link from "next/link";
import { getSession } from "@/lib/guard";
import AppHeader, { Logo } from "@/components/AppHeader";
import LearnStory from "./LearnStory";
import "./learn.css";

export const metadata = { title: "สัตว์เลี้ยงกับใจ — Paw Diary" };

export default async function LearnPage() {
  const { user, profile } = await getSession();
  return (
    <>
      {user ? <AppHeader isDemo={!!profile?.is_demo} /> : (
        <header className="mx-auto flex w-full max-w-xl items-center justify-between px-4 py-3">
          <Link href="/" className="inline-flex min-h-11 items-center"><Logo /></Link>
        </header>
      )}
      <main className="learn mx-auto w-full max-w-xl flex-1 px-4 pb-16">
        <h1 className="pt-2 text-2xl font-semibold">สัตว์เลี้ยงกับใจ งานวิจัยว่ายังไง</h1>
        <p className="text-bark">ถั่วแดงกับมะขามจะพาไปดูทีละเรื่อง แตะที่น้องได้นะ</p>
        <LearnStory ctaHref={user ? "/checkin" : "/login"} />
      </main>
    </>
  );
}
