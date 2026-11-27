'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconBars, IconHome, IconLeaf, IconPaw, IconPen } from './Icons';

const ITEMS = [
  { href: '/home', label: 'หน้าแรก', Icon: IconHome },
  { href: '/checkin', label: 'บันทึก', Icon: IconPen },
  { href: '/trial', label: 'ทดลองเลี้ยง', Icon: IconPaw },
  { href: '/patterns', label: 'รูปแบบ', Icon: IconBars },
  { href: '/wellbeing', label: 'สุขภาวะ', Icon: IconLeaf },
];

function isActive(path: string, href: string) { return path === href || path.startsWith(href + '/'); }

/** Desktop: the same five items in the header (bottom bar is hidden from lg). */
export function TopNav() {
  const path = usePathname();
  return (
    <nav className="no-print hidden flex-1 lg:block" aria-label="เมนูหลัก">
      <ul className="flex items-center justify-center gap-1">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(path, href);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? 'page' : undefined}
                className={`flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-sm ${active ? 'bg-sage/50 font-semibold text-jade' : 'text-bark hover:bg-paper'}`}>
                <Icon className="h-5 w-5" />{label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="no-print fixed inset-x-0 bottom-0 z-20 border-t lg:hidden border-bark/15 bg-paper/95 backdrop-blur" aria-label="เมนูหลัก">
      <ul className="mx-auto grid max-w-2xl grid-cols-5">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(path, href);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? 'page' : undefined}
                className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs ${active ? 'font-semibold text-jade' : 'text-bark'}`}>
                {active && <span className="absolute top-1 h-1 w-6 rounded-full bg-jade" aria-hidden />}
                <Icon className={`h-6 w-6 ${active ? 'nav-hop' : ''}`} />{label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
