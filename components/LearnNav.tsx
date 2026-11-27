import Link from 'next/link';
import { Logo } from '@/components/Logo';

/**
 * Shared header for the five guide pages.
 *
 * Each page used to carry its own hand-made header linking to a different pair of
 * siblings — two of them linked to none at all — so the guides read as loose pages
 * rather than one set. Showing the whole set, with the current one marked, is the
 * navigation and the "here is what else there is" in the same device.
 */
const GUIDES = [
  { href: '/learn', label: 'งานวิจัย' },
  { href: '/learn/cat', label: 'คู่มือแมว' },
  { href: '/learn/dog', label: 'คู่มือหมา' },
  { href: '/learn/care', label: 'ค่าใช้จ่าย' },
  { href: '/learn/therapy', label: 'สัตว์บำบัด' },
] as const;

export type GuideHref = (typeof GUIDES)[number]['href'];

export function LearnNav({ current, homeHref }: { current: GuideHref; homeHref: string }) {
  return (
    <header className="-mx-5 mb-2 border-b border-bark/10 px-5 md:-mx-8 md:px-8">
      <div className="flex items-center justify-between gap-4 py-4">
        <Link href={homeHref} className="flex items-center" aria-label="Pawlune หน้าแรก"><Logo /></Link>
        {/* These pages are reachable while signed out, so the helpline stays on them. */}
        <a href="tel:1323" className="text-sm text-bark">สายด่วนสุขภาพจิต <span className="num font-semibold text-jade">1323</span></a>
      </div>

      <nav aria-label="คู่มือทั้งหมด">
        <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-3 md:mx-0 md:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {GUIDES.map(({ href, label }) => {
            const here = href === current;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={here ? 'page' : undefined}
                  className={`flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-sm ${
                    here ? 'bg-jade font-semibold text-cream' : 'bg-paper text-bark hover:text-cocoa'
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
