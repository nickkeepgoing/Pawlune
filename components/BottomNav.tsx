'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconBars, IconHome, IconLeaf, IconPaw, IconPen } from './Icons';

/**
 * Five destinations, phone and desktop.
 *
 * "บันทึก" is the one a person comes back to every day, so on the phone it is not
 * another identical tab: it sits raised in the middle of the bar, the way the app's
 * one daily action should. The others stay quiet around it.
 */
const ITEMS = [
  { href: '/home', label: 'หน้าแรก', Icon: IconHome },
  { href: '/patterns', label: 'รูปแบบ', Icon: IconBars },
  { href: '/checkin', label: 'บันทึก', Icon: IconPen, primary: true },
  { href: '/trial', label: 'ทดลองเลี้ยง', Icon: IconPaw },
  { href: '/wellbeing', label: 'สุขภาวะ', Icon: IconLeaf },
] as const;

function isActive(path: string, href: string) { return path === href || path.startsWith(href + '/'); }

/**
 * Desktop: the four places sit together in one tray, with the current one raised.
 * The daily action is not a place, so it lives apart as a button (RecordButton).
 */
export function TopNav() {
  const path = usePathname();
  return (
    <nav className="no-print hidden flex-1 justify-center md:flex" aria-label="เมนูหลัก">
      <ul className="flex items-center gap-1 rounded-full border border-bark/10 bg-paper p-1 shadow-[0_8px_20px_-16px_var(--c-shadow)]">
        {ITEMS.filter((i) => !('primary' in i)).map(({ href, label, Icon }) => {
          const active = isActive(path, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                title={label}
                className={`flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm transition-colors lg:px-4 ${
                  active ? 'bg-sage/60 font-semibold text-cocoa' : 'text-bark hover:bg-cream hover:text-cocoa'
                }`}
              >
                <Icon className="h-5 w-5" />
                {/* Narrow desktop windows name only the current place; the rest keep their icon. */}
                <span className={active ? undefined : 'sr-only lg:not-sr-only'}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function RecordButton() {
  const here = usePathname() === '/checkin';
  return (
    /* The wrapper does the hiding: .btn sets its own display, which would beat "hidden". */
    <span className="hidden md:block">
      <Link href="/checkin" aria-current={here ? 'page' : undefined} className="btn btn-primary whitespace-nowrap px-4 text-sm">
        <IconPen className="h-5 w-5" />
        <span>บันทึก<span className="hidden xl:inline">วันนี้</span></span>
      </Link>
    </span>
  );
}

export function BottomNav() {
  const path = usePathname();
  return (
    <nav
      className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-bark/15 bg-paper/95 backdrop-blur md:hidden"
      aria-label="เมนูหลัก"
    >
      <ul className="mx-auto grid max-w-2xl grid-cols-5 items-end">
        {ITEMS.map(({ href, label, Icon, ...rest }) => {
          const active = isActive(path, href);
          const primary = 'primary' in rest && rest.primary;

          if (primary) {
            return (
              <li key={href} className="flex justify-center">
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className="-mt-5 flex min-h-14 w-full flex-col items-center justify-end gap-1 pb-1.5 text-xs font-semibold text-jade"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-jade text-cream ring-4 ring-paper">
                    <Icon className="h-6 w-6" />
                  </span>
                  {label}
                </Link>
              </li>
            );
          }

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs ${active ? 'font-semibold text-jade' : 'text-bark'}`}
              >
                <span className={`grid h-8 w-14 place-items-center rounded-full transition-colors ${active ? 'bg-sage/55' : ''}`}>
                  <Icon className="h-6 w-6" />
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
