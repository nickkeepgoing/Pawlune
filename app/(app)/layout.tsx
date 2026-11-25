import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { requireStage } from "@/lib/guard";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireStage("ready");
  return (
    <>
      <AppHeader isDemo={profile.is_demo} />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-28">{children}</main>
      <BottomNav />
    </>
  );
}
