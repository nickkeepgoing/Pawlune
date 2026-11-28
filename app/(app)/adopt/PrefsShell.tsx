'use client';
import { useRef, useState, useTransition, type FormEvent, type ReactNode } from 'react';

/**
 * Wrapper for the one-page readiness form: a guide beside the questions on desktop and a
 * single send button.
 *
 * Submits through a transition instead of `<form action>` so a failed save keeps every
 * answer on screen and can say what went wrong. A "none" box and the other boxes in its
 * group cancel each other.
 */
export function PrefsShell({ action, aside, children }: {
  action: (data: FormData) => Promise<{ error: string } | void>;
  aside: ReactNode;
  children: ReactNode;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const form = useRef<HTMLFormElement>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.current?.querySelector('input[name="species"]:checked')) {
      setError('ยังไม่ได้เลือกว่าอยากได้แมว หมา หรือทั้งสองอย่าง (ข้อแรกของส่วนที่ 1)');
      form.current?.querySelector('#part-1')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      return;
    }
    const data = new FormData(e.currentTarget);
    setError(null);
    start(async () => {
      const res = await action(data);
      if (res?.error) setError(res.error);
    });
  }

  function exclusive(e: FormEvent<HTMLFormElement>) {
    const box = e.target as HTMLInputElement;
    if (box.type !== 'checkbox' || !box.checked) return;
    e.currentTarget.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="${box.name}"]`).forEach((other) => {
      if (other !== box && (box.value === 'none' || other.value === 'none')) other.checked = false;
    });
  }

  const send = (
    <>
      {error && <p role="alert" className="card card-warn mb-3 text-base font-semibold text-cocoa">{error}</p>}
      <button type="submit" className="btn btn-primary min-h-16 w-full text-xl" disabled={pending} aria-busy={pending}>
        {pending ? 'กำลังจับคู่ให้คุณ…' : 'ดูเพื่อนที่เข้ากับฉัน'}
      </button>
    </>
  );

  // method="post" so that a click before the page is ready never puts answers in the address bar.
  return (
    <form ref={form} method="post" onSubmit={submit} onChange={exclusive} className="grid gap-6 lg:grid-cols-[19rem_1fr] lg:items-start">
      <aside className="lg:sticky lg:top-24">
        {aside}
        <div className="mt-4 hidden lg:block">{send}</div>
      </aside>
      <div className="min-w-0 space-y-6">
        {children}
        <div className="lg:hidden">{send}</div>
      </div>
    </form>
  );
}
