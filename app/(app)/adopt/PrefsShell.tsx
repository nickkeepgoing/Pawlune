'use client';
import { useEffect, useRef, useState, useTransition, type FormEvent, type ReactNode } from 'react';

const STEPS = ['ชนิดและอาการแพ้', 'บ้านของคุณ', 'น้องที่มองหา', 'ครอบครัวและงบ'];

/**
 * The readiness questions, one part at a time.
 *
 * Children mark their parts with `data-step`; the others are hidden, not removed, so every
 * answer is still submitted. Submits through a transition instead of `<form action>` so a
 * failed save keeps the answers and can say what went wrong. A "none" box and the other
 * boxes in its group cancel each other.
 */
export function PrefsShell({ action, children, className }: {
  action: (data: FormData) => Promise<{ error: string } | void>;
  children: ReactNode;
  className?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [step, setStep] = useState(0); // 0 until mounted: without script every part stays visible
  const [total, setTotal] = useState(0);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const n = form.current?.querySelectorAll('[data-step]').length ?? 0;
    if (n > 1) { setTotal(n); setStep(1); }
  }, []);

  useEffect(() => {
    if (!step) return;
    form.current?.querySelectorAll<HTMLElement>('[data-step]').forEach((el) => {
      const on = Number(el.dataset.step) === step;
      el.hidden = !on;
      el.classList.toggle('rise-in', on);
    });
  }, [step]);

  const go = (n: number) => {
    setError(null);
    setStep(n);
    form.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  function next() {
    if (step === 1 && !form.current?.querySelector('input[name="species"]:checked')) {
      setError('เลือกก่อนว่าอยากได้แมว หมา หรือทั้งสองอย่าง');
      return;
    }
    go(step + 1);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step && step < total) return next(); // Enter in a number box moves on instead of sending early
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

  const last = !step || step === total;

  // method="post" so that a click before the page is ready never puts answers in the address bar.
  return (
    <form ref={form} method="post" onSubmit={submit} onChange={exclusive} className={`scroll-mt-24 ${className ?? ''}`}>
      {step > 0 && (
        <ol className="grid grid-cols-4 gap-2" aria-label={`ขั้นที่ ${step} จาก ${total}`}>
          {STEPS.slice(0, total).map((label, i) => (
            <li key={label}>
              <button type="button" onClick={() => go(i + 1)} aria-current={step === i + 1 ? 'step' : undefined} className="w-full text-left">
                <span className="block h-2 overflow-hidden rounded-full bg-bark/15">
                  <span className={`block h-full rounded-full bg-jade transition-all duration-300 ${i < step ? 'w-full' : 'w-0'}`} />
                </span>
                <span className={`mt-1 block text-xs ${step === i + 1 ? 'font-bold text-cocoa' : 'text-bark'}`}>{label}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
      {children}
      {error && <p role="alert" className="card card-warn font-semibold">{error}</p>}
      <div className="flex gap-3 pb-4">
        {step > 1 && <button key="back" type="button" className="btn btn-ghost px-6" onClick={() => go(step - 1)}>ย้อนกลับ</button>}
        {last ? (
          <button key="send" type="submit" className="btn btn-primary flex-1" disabled={pending} aria-busy={pending}>
            {pending ? 'กำลังบันทึก…' : 'ดูเพื่อนที่เข้ากับฉัน'}
          </button>
        ) : (
          <button key="next" type="button" className="btn btn-primary flex-1" onClick={next}>ถัดไป</button>
        )}
      </div>
      {pending && <p role="status" className="text-center text-sm text-bark">กำลังจับคู่ให้คุณ…</p>}
    </form>
  );
}
