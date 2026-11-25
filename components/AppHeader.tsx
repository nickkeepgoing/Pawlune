import Link from "next/link";
import HelpSheet from "./HelpSheet";

export function DemoBadge() {
  return (
    <div role="note" className="no-print sticky top-0 z-30 bg-honey py-1 text-center text-sm font-semibold text-cocoa">
      ข้อมูลจำลอง — บัญชีสาธิต ไม่ใช่ข้อมูลผู้ใช้จริง
    </div>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 font-semibold">
      <svg aria-hidden width="26" height="26" viewBox="0 0 32 32">
        <rect x="5" y="3" width="22" height="26" rx="4" fill="#4E6E58" />
        <rect x="8" y="3" width="2" height="26" fill="#3D5847" />
        <g fill="#F2EADB"><ellipse cx="18.5" cy="19" rx="4" ry="3.2" /><circle cx="14" cy="13.5" r="1.6" /><circle cx="17" cy="11" r="1.6" /><circle cx="20.6" cy="11" r="1.6" /><circle cx="23.4" cy="13.6" r="1.6" /></g>
      </svg>
      <span className="num text-lg tracking-tight">Paw Diary</span>
    </span>
  );
}

export default function AppHeader({ isDemo, settings = true }: { isDemo: boolean; settings?: boolean }) {
  return (
    <>
      {isDemo && <DemoBadge />}
      <header className="no-print mx-auto flex w-full max-w-xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/home" className="min-h-11 inline-flex items-center rounded-lg"><Logo /></Link>
        <div className="flex items-center gap-1">
          <HelpSheet />
          {settings && (
            <Link href="/settings" aria-label="ตั้งค่า" className="inline-flex size-11 items-center justify-center rounded-full text-bark hover:bg-paper">
              <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>
            </Link>
          )}
        </div>
      </header>
    </>
  );
}
