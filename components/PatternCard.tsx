import { LIMITATION_LINE, cardSentence, daysNeeded, oftenTogetherLines, statusChip, MIN_DAYS_PER_GROUP, type Pattern } from '@/lib/engine';

// All text comes from lib/engine/copy.ts (CLAUDE.md rule 2). Bars always carry text + n (color-blind safe).
export function PatternCard({ p }: { p: Pattern }) {
  const sentence = cardSentence(p);
  const chip = statusChip(p);
  if (p.status === 'insufficient') {
    const done = Math.min(p.n_with, p.n_without);
    return (
      <article className="card card-quiet">
        <h3 className="font-semibold">{p.label_th}{p.kind === 'burden' && <span className="ml-2 text-sm font-normal text-bark">(ภาระ)</span>}</h3>
        <p className="mt-1 text-sm text-bark">{sentence}</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream" role="progressbar" aria-valuemin={0} aria-valuemax={MIN_DAYS_PER_GROUP} aria-valuenow={done} aria-label="ความคืบหน้าของข้อมูล">
          <div className="h-full rounded-full bg-jade" style={{ width: `${(done / MIN_DAYS_PER_GROUP) * 100}%` }} />
        </div>
        <p className="mt-1 text-xs text-bark">อีก <span className="num">{daysNeeded(p)}</span> วัน</p>
        {oftenTogetherLines(p).map((l) => (<p key={l} className="mt-2 text-sm text-bark">{l}</p>))}
      </article>
    );
  }
  const max = 5;
  return (
    <article className="card">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold">{p.label_th}</h3>
        {p.kind === 'burden' && <span className="text-sm text-bark">(ภาระ)</span>}
        {chip && <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs text-cocoa">{chip}</span>}
      </div>
      <p className="mt-2">{sentence}</p>
      <div className="mt-3 grid grid-cols-2 gap-3" aria-hidden>
        {[{ k: 'วันที่มี', v: p.mean_with!, n: p.n_with, c: 'bg-sage border-jade' }, { k: 'วันที่ไม่มี', v: p.mean_without!, n: p.n_without, c: 'bg-bark/25 border-bark' }].map((b) => (
          <div key={b.k}>
            <div className="flex h-24 items-end rounded-lg bg-cream/70 px-3">
              <div className={`w-full rounded-t-md border-t-2 ${b.c}`} style={{ height: `${(b.v / max) * 100}%` }} />
            </div>
            <p className="mt-1 text-sm"><span className="num font-semibold">{b.v.toFixed(2)}</span> · {b.k}</p>
            <p className="text-xs text-bark">n = <span className="num">{b.n}</span> วัน</p>
          </div>
        ))}
      </div>
      {oftenTogetherLines(p).map((l) => (<p key={l} className="mt-3 rounded-lg bg-cream px-3 py-2 text-sm">{l}</p>))}
      <p className="mt-3 text-sm text-bark">{LIMITATION_LINE}</p>
    </article>
  );
}
