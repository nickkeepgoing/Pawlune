import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { redirect } from 'next/navigation';
import { BottomNav } from '@/components/BottomNav';
import { AccountMenu } from '@/components/AccountMenu';
import { HelpButton } from '@/components/HelpButton';
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
    <div className="min-h-dvh pb-48 lg:pb-36">
      {profile?.is_demo && (
        <div className="no-print sticky top-0 z-30 bg-honey px-4 py-1.5 text-center text-sm font-semibold text-cocoa" role="status">ข้อมูลจำลอง — บัญชีสำหรับสาธิต ไม่ใช่ข้อมูลผู้ใช้จริง</div>
      )}
      <header className="no-print app-header sticky top-0 z-20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4 lg:gap-4 lg:px-8">
          <Link href={ready ? '/home' : '/'} className="flex shrink-0 items-center" aria-label="Pawlune หน้าแรก"><Logo /></Link>
          <div className="flex shrink-0 items-center gap-2">
            {ready && <AccountMenu shelterStaff={Boolean(profile?.is_shelter)} avatar={<Avatar url={av.url} animal={av.animal} className="h-9 w-9" alt="" />} />}
          </div>
        </div>
      </header>
      <main className="app-main shell">{children}</main>
      <HelpButton />
      {ready && <BottomNav />}
    </div>
  );
}
