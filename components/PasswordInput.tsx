'use client';
import { useState } from 'react';

/** Password field with an eye button to show/hide the password. */
export function PasswordInput({ name, autoComplete, minLength, className = 'field' }: { name: string; autoComplete?: string; minLength?: number; className?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative mt-1">
      <input name={name} type={show ? 'text' : 'password'} autoComplete={autoComplete} minLength={minLength} required
        autoCapitalize="none" spellCheck={false} className={`${className} pr-12`} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'} aria-pressed={show}
        className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-bark">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {!show && <path d="M4 20 20 4" />}
        </svg>
      </button>
    </div>
  );
}
