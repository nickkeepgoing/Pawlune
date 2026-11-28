import { PawPrint } from '@/components/Critters';

/** Paw prints walking across while something loads. */
export function PawLoader({ text = 'กำลังโหลด' }: { text?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-2 py-6">
      <div aria-hidden className="flex items-end gap-3 text-jade">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`paw-step ${i % 2 ? '-translate-y-2' : ''}`} style={{ animationDelay: `${i * 180}ms` }}>
            <PawPrint className="h-8 w-8" />
          </span>
        ))}
      </div>
      <p className="text-sm font-semibold text-bark">{text}…</p>
    </div>
  );
}
