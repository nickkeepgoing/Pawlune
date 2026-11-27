import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { redirect } from 'next/navigation';
import { BottomNav, TopNav } from '@/components/BottomNav';
import { HelpButton } from '@/components/HelpButton';
import { IconGear } from '@/components/Icons';
import { avatarFor, getState } from '@/lib/data';
import { Avatar } from '@/components/AnimalAvatar';
import { currentStage } from '@/lib/guard';

// Shell for every signed-in screen: help button always visible (CLAUDE.md rule 4), demo badge (rule 8).
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getState();
  if (!user) redirect('/');
  const ready = (await currentStage()) === 'ready';
  const av = await avatarFor(profile, user.id);
  return (
    <div className="min-h-dvh pb-24 lg:pb-12">
      {profile?.is_demo && (
        <div className="no-print sticky top-0 z-30 bg-honey px-4 py-1.5 text-center text-sm font-semibold text-cocoa" role="status">ข้อมูลจำลอง — บัญชีสำหรับสาธิต ไม่ใช่ข้อมูลผู้ใช้จริง</div>
      )}
      <header className="no-print sticky top-0 z-20 border-b border-bark/10 bg-cream/90 backdrop-blur">
        <div className="shell flex items-center justify-between gap-4 py-3">
          <Link href={ready ? '/home' : '/'} className="flex items-center" aria-label="Pawlune หน้าแรก"><Logo /></Link>
          {ready && <TopNav />}
          <div className="flex items-center gap-1">
            {ready && <Link href="/profile" className="no-print grid h-11 w-11 place-items-center" aria-label="โปรไฟล์ของฉัน"><Avatar url={av.url} animal={av.animal} className="h-9 w-9" alt="" /></Link>}
            {ready && <Link href="/settings" className="no-print grid h-11 w-11 place-items-center rounded-full text-bark" aria-label="ตั้งค่า"><IconGear /></Link>}
            <HelpButton />
          </div>
        </div>
      </header>
      <main className="app-main shell">{children}</main>
      {ready && <BottomNav />}
    </div>
  );
}
