'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { signOut } from '@/app/login/actions';
import { SubmitButton } from '@/components/SubmitButton';

const LINKS = [
  ['/profile', 'โปรไฟล์ของฉัน'],
  ['/pets', 'น้องและความทรงจำ'],
  ['/report', 'รายงานของฉัน'],
  ['/settings', 'ตั้งค่าและโหมดสี'],
] as const;

/**
 * One account control in place of a picture plus a gear. The two small round icons sat
 * side by side and the gear was easy to mistake for a light/dark switch.
 */
export function AccountMenu({ avatar, shelterStaff = false }: { avatar: ReactNode; shelterStaff?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc); };
  }, [open]);

  const links = shelterStaff ? [['/shelter', 'จัดการศูนย์และเพิ่มสัตว์'] as const, ...LINKS] : LINKS;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="เมนูบัญชีของฉัน"
        className="flex min-h-11 items-center gap-1 rounded-full border border-bark/15 bg-paper py-1 pl-1 pr-2 hover:border-jade/50"
      >
        {avatar}
        <svg viewBox="0 0 24 24" className={`h-4 w-4 text-bark transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-60 overflow-hidden rounded-2xl border border-bark/15 bg-paper py-1 shadow-[0_22px_40px_-18px_var(--c-shadow)]">
          <ul>
            {links.map(([href, label]) => (
              <li key={href}>
                <Link href={href} onClick={() => setOpen(false)} className="flex min-h-11 items-center px-4 text-sm hover:bg-sage/30">{label}</Link>
              </li>
            ))}
          </ul>
          <form action={signOut} className="border-t border-bark/15 p-2">
            <SubmitButton className="btn btn-ghost w-full text-sm" pendingText="กำลังออก…">ออกจากระบบ</SubmitButton>
          </form>
        </div>
      )}
    </div>
  );
}
