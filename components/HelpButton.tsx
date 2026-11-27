'use client';
import { useEffect, useRef, useState } from 'react';
import { IconChat, IconClose, IconPhone } from './Icons';

// docs/SAFETY_PRIVACY.md — exact copy. No AI, no logging of who opened it.
export function HelpSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="help-title"
      className="m-0 mt-auto w-full max-w-none bg-transparent p-0 backdrop:bg-cocoa/40 sm:m-auto sm:max-w-md">
      <div className="rounded-t-[var(--radius-sheet)] bg-paper p-6 pb-8 text-cocoa sm:rounded-[var(--radius-sheet)]" style={{ animation: 'pop .25s ease-out' }}>
        <div className="flex items-start justify-between gap-4">
          <h2 id="help-title" className="text-xl font-bold">อยากคุยกับใครสักคนไหม</h2>
          <button onClick={onClose} className="-m-2 grid h-11 w-11 place-items-center rounded-full text-bark" aria-label="ปิด"><IconClose /></button>
        </div>
        <p className="mt-2 text-bark">ถ้ารู้สึกหนักใจ คุณไม่ต้องรับมือคนเดียว</p>
        <a href="tel:1323" className="btn btn-primary mt-5 w-full text-lg"><IconPhone /> โทรสายด่วนสุขภาพจิต 1323</a>
        <a href="tel:1669" className="btn btn-ghost mt-3 w-full">ถ้ามีอันตรายเร่งด่วน โทร 1669</a>
        <p className="mt-5 text-sm text-bark">แอปนี้ไม่ใช่บริการทางการแพทย์ และไม่ได้ประเมินอาการ</p>
      </div>
    </dialog>
  );
}

export function HelpButton() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener('paw:help', h);
    return () => window.removeEventListener('paw:help', h);
  }, []);
  return (
    <>
      <button onClick={() => setOpen(true)} className="no-print inline-flex min-h-11 items-center gap-1.5 rounded-full border-[1.5px] border-jade bg-paper px-3 text-sm font-semibold text-jade">
        <IconChat className="h-4 w-4" /> ต้องการคนรับฟัง
      </button>
      <HelpSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** Any component can open the help sheet: openHelp() */
export function openHelp() { window.dispatchEvent(new Event('paw:help')); }
