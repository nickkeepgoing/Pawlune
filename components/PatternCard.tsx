import { cardSentence, daysNeeded, LIMITATION_LINE, MIN_DAYS_PER_GROUP, oftenTogetherLines, statusChip, type Pattern } from "@/lib/engine";
import { TwoBar } from "./Charts";

export default function PatternCard({ p }: { p: Pattern }) {
  const chip = statusChip(p);
  const burden = p.kind === "burden";
  if (p.status === "insufficient") {
    const need = daysNeeded(p);
    const progress = Math.min(p.n_with, p.n_without) / MIN_DAYS_PER_GROUP;
    return (
      <article className="paper p-5 opacity-95">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs ${burden ? "border border-dashed border-bark" : "bg-sage-soft"}`}>{burden ? "ภาระ" : "กับน้อง"}</span>
          <span className="text-sm font-semibold text-bark">อีก <span className="num">{need}</span> วัน</span>
        </div>
        <p>{cardSentence(p)}</p>
        <div role="meter" aria-valuemin={0} aria-valuemax={MIN_DAYS_PER_GROUP} aria-valuenow={Math.min(p.n_with, p.n_without)}
          aria-label={`ความคืบหน้า อีก ${need} วัน`} className="mt-3 h-2 rounded-full bg-cream">
          <div className="h-2 rounded-full bg-bark/60" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="mt-1 text-xs text-bark">มี <span className="num">{p.n_with}</span> วันที่ทำ · <span className="num">{p.n_without}</span> วันที่ไม่ได้ทำ</p>
        {oftenTogetherLines(p).map((l) => <p key={l} className="mt-2 text-sm text-bark">{l}</p>)}
      </article>
    );
  }
  return (
    <article className="paper p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs ${burden ? "border border-dashed border-bark" : "bg-sage-soft"}`}>{burden ? "ภาระ" : "กับน้อง"}</span>
        {chip && <span className="rounded-full bg-sage px-2.5 py-0.5 text-xs font-semibold">{chip}</span>}
      </div>
      <p className="text-lg font-medium leading-relaxed">{cardSentence(p)}</p>
      <div className="mt-4"><TwoBar meanWith={p.mean_with!} meanWithout={p.mean_without!} nWith={p.n_with} nWithout={p.n_without} /></div>
      {oftenTogetherLines(p).map((l) => <p key={l} className="mt-3 rounded-xl bg-cream px-3 py-2 text-sm">{l}</p>)}
      <p className="mt-3 text-sm text-bark">{LIMITATION_LINE}</p>
    </article>
  );
}
