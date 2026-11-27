'use client';
import { useEffect, useState } from 'react';

type Choice = 'light' | 'dark';

/** Runs before paint in app/layout.tsx so the page never flashes the wrong theme. */
export const THEME_INIT = `(function(){try{var t=localStorage.getItem('pawlune-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t}}catch(e){}})()`;

function current(): Choice {
  if (typeof document === 'undefined') return 'light';
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Choice>('light');
  const [ready, setReady] = useState(false);

  // The server cannot know the visitor's choice, so settle it after mount.
  useEffect(() => { setTheme(current()); setReady(true); }, []);

  function flip() {
    const next: Choice = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('pawlune-theme', next); } catch { /* private mode: this visit only */ }
    setTheme(next);
  }

  const dark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={flip}
      aria-pressed={dark}
      aria-label={dark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
      title={dark ? 'โหมดสว่าง' : 'โหมดมืด'}
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border-[1.5px] border-bark/30 text-cocoa transition-colors hover:bg-paper ${className}`}
    >
      {/* Sun and moon share the frame; only the visible one is rendered. */}
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        {ready && dark
          ? <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z" fill="currentColor" stroke="none" />
          : <>
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
            </>}
      </svg>
    </button>
  );
}
