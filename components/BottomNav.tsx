"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/home", label: "หน้าหลัก", d: "M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" },
  { href: "/checkin", label: "บันทึก", d: "M12 5v14M5 12h14" },
  { href: "/patterns", label: "รูปแบบ", d: "M5 19V9M12 19V5M19 19v-7" },
  { href: "/wellbeing", label: "สุขภาวะ", d: "M4 16l5-5 4 3 7-7" },
  { href: "/pets", label: "น้อง", d: "M8 9a2 2 0 1 0 0-.1M16 9a2 2 0 1 0 0-.1M5 13a2 2 0 1 0 0-.1M19 13a2 2 0 1 0 0-.1M8 18c0-2.5 1.8-4 4-4s4 1.5 4 4c0 1.5-1.5 2-4 2s-4-.5-4-2z" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav aria-label="เมนูหลัก" className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur">
      <ul className="mx-auto flex max-w-xl justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {items.map((it) => {
          const active = path === it.href || path.startsWith(it.href + "/");
          return (
            <li key={it.href}>
              <Link href={it.href} aria-current={active ? "page" : undefined}
                className={`flex min-h-14 min-w-14 flex-col items-center justify-center gap-0.5 px-2 text-xs ${active ? "font-semibold text-jade-deep" : "text-bark"}`}>
                <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round"><path d={it.d} /></svg>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
