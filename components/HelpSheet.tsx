"use client";
import { useEffect, useRef } from "react";

/** Global "ต้องการคนรับฟัง" button + help sheet. Exact copy from docs/SAFETY_PRIVACY.md. No AI, no logging. */
export function openHelp() {
  window.dispatchEvent(new Event("open-help"));
}

export default function HelpSheet() {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const open = () => ref.current?.showModal();
    window.addEventListener("open-help", open);
    return () => window.removeEventListener("open-help", open);
  }, []);

  return (
    <>
      <button type="button" onClick={openHelp}
        className="no-print inline-flex min-h-11 items-center gap-1.5 rounded-full border-[1.5px] border-jade bg-paper px-3.5 text-sm font-semibold text-jade-deep hover:bg-sage-soft">
        <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 14a8 8 0 1 1 3 6l-3 1 1-3.2A8 8 0 0 1 4 14Z" /><path d="M9 12h.01M12 12h.01M15 12h.01" />
        </svg>
        ต้องการคนรับฟัง
      </button>
      <dialog ref={ref} aria-labelledby="help-title"
        onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}
        className="m-0 mt-auto w-full max-w-none bg-transparent p-0 backdrop:bg-cocoa/40 sm:m-auto sm:max-w-md">
        <div className="paper rounded-b-none px-6 pb-8 pt-3 sm:rounded-b-[1.25rem]">
          <div aria-hidden className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-line" />
          <h2 id="help-title" className="text-xl font-semibold">อยากคุยกับใครสักคนไหม</h2>
          <p className="mt-1 text-bark">ถ้ารู้สึกหนักใจ คุณไม่ต้องรับมือคนเดียว</p>
          <a href="tel:1323" className="btn btn-primary mt-6 w-full text-lg">โทรสายด่วนสุขภาพจิต <span className="num">1323</span></a>
          <a href="tel:1669" className="btn btn-ghost mt-3 w-full">ถ้ามีอันตรายเร่งด่วน โทร <span className="num">1669</span></a>
          <p className="mt-5 text-sm text-bark">แอปนี้ไม่ใช่บริการทางการแพทย์ และไม่ได้ประเมินอาการ</p>
          <form method="dialog" className="mt-4 text-center">
            <button className="min-h-11 px-4 text-sm font-medium text-jade-deep underline underline-offset-4">ปิด</button>
          </form>
        </div>
      </dialog>
    </>
  );
}
