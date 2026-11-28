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

/** Desktop: the same five in the header. The daily action keeps its weight here too. */
export function TopNav() {
  const path = usePathname();
  return (
    /* Takes over from the bottom bar at 768px: a bar pinned to the bottom of a
       desktop window reads as a phone app stuck in a browser. Labels appear once
       there is room for them. */
    <nav className="no-print hidden flex-1 md:block" aria-label="เมนูหลัก">
      <ul className="flex items-center justify-center gap-1">
        {ITEMS.map(({ href, label, Icon, ...rest }) => {
          const active = isActive(path, href);
          const primary = 'primary' in rest && rest.primary;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={
                  primary
                    ? 'mx-2 flex min-h-11 items-center gap-1.5 rounded-full bg-jade px-4 text-sm font-semibold text-cream lg:px-5'
                    : `flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-sm ${active ? 'font-semibold text-jade' : 'text-bark hover:text-cocoa'}`
                }
              >
                <Icon className="h-5 w-5" />
                {/* Tablet widths have room for the icons but not five Thai labels. */}
                <span className={primary ? undefined : 'hidden lg:inline'}>{label}</span>
                <span className="sr-only lg:hidden">{label}</span>
                {active && !primary && <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-honey" aria-hidden />}
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
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-jade text-cream shadow-[0_6px_0_color-mix(in_srgb,var(--color-jade)_72%,#000)]">
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
                className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs ${active ? 'font-semibold text-jade' : 'text-bark'}`}
              >
                {active && <span className="absolute top-1 h-1 w-6 rounded-full bg-honey" aria-hidden />}
                <Icon className="h-6 w-6" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
