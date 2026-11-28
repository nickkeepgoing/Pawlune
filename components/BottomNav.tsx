'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconBars, IconHome, IconLeaf, IconPaw, IconPen } from './Icons';

/**
 * Five destinations in one floating bar, the same on phone and desktop.
 *
 * "บันทึก" is the one a person comes back to every day, so it is not another identical
 * tab: it sits raised in the middle of the bar. The others stay quiet around it.
 */
const ITEMS = [
  { href: '/home', label: 'หน้าแรก', Icon: IconHome },
  { href: '/patterns', label: 'รูปแบบ', Icon: IconBars },
  { href: '/checkin', label: 'บันทึก', Icon: IconPen, primary: true },
  { href: '/trial', label: 'ทดลองเลี้ยง', Icon: IconPaw },
  { href: '/wellbeing', label: 'สุขภาวะ', Icon: IconLeaf },
] as const;

function isActive(path: string, href: string) { return path === href || path.startsWith(href + '/'); }

export function BottomNav() {
  const path = usePathname();
  return (
    <nav
      className="no-print dock fixed inset-x-3 bottom-[max(.75rem,env(safe-area-inset-bottom))] z-20 mx-auto max-w-xl rounded-[2rem] md:bottom-5"
      aria-label="เมนูหลัก"
    >
      <ul className="grid grid-cols-5 items-end px-1">
        {ITEMS.map(({ href, label, Icon, ...rest }) => {
          const active = isActive(path, href);
          const primary = 'primary' in rest && rest.primary;

          return (
            <li key={href} className="flex justify-center">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`dock-link ${primary ? 'dock-primary' : ''} flex min-h-[4.25rem] w-full flex-col items-center justify-end gap-1 pb-2 text-xs md:text-sm ${
                  active ? 'font-bold text-jade' : primary ? 'font-semibold text-jade' : 'text-bark'
                }`}
              >
                <span className={primary ? 'dock-fab -mt-6 grid h-16 w-16 place-items-center rounded-full' : 'dock-icon grid h-9 w-14 place-items-center rounded-full'}>
                  <Icon className={primary ? 'h-7 w-7' : `h-6 w-6 ${active ? 'nav-hop' : ''}`} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
