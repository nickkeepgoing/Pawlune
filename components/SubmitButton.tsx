'use client';
import { useFormStatus } from 'react-dom';

export function SubmitButton({ children, pendingText = 'กำลังบันทึก…', className = 'btn btn-primary w-full', disabled }: { children: React.ReactNode; pendingText?: string; className?: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" className={className} disabled={pending || disabled} aria-busy={pending}>{pending ? pendingText : children}</button>;
}
