'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ACTIVITIES, ACTIVITY_IDS, type ActivityId } from '@/lib/engine';
import { MOOD_LABELS } from '@/lib/format';
import { MoodFace } from '@/components/MoodFace';
import { IconCheck } from '@/components/Icons';
import { CatMakham, DogTuaDaeng } from '@/components/Pets';
import { saveCheckin } from './actions';

const JOY = ACTIVITY_IDS.filter((a) => ACTIVITIES[a].kind === 'joy');
const BURDEN = ACTIVITY_IDS.filter((a) => ACTIVITIES[a].kind === 'burden');

type Props = {
  petName: string; species: 'dog' | 'cat' | 'other'; photoUrl: string | null; dateLabel: string;
  initial: { mood: number; activities: string[]; note: string } | null; lastActivities: string[] | null;
};

export function CheckinForm({ petName, species, photoUrl, dateLabel, initial, lastActivities }: Props) {
  const router = useRouter();
  const [mood, setMood] = useState<number | null>(initial?.mood ?? null);
  const [acts, setActs] = useState<Set<string>>(new Set(initial?.activities ?? []));
  const [note, setNote] = useState(initial?.note ?? '');
  const [showNote, setShowNote] = useState(Boolean(initial?.note));
  const [state, setState] = useState<'idle' | 'saving' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  const toggle = (a: ActivityId) => setActs((s) => { const n = new Set(s); if (n.has(a)) n.delete(a); else n.add(a); return n; });

  async function save() {
    if (!mood) { setError('เลือกอารมณ์วันนี้ก่อน'); return; }
    setState('saving'); setError(null);
    const res = await saveCheckin({ mood, activities: [...acts], note });
    if (res.error) { setState('idle'); setError(res.error); return; }
    setState('done');
    setTimeout(() => { router.push('/home'); router.refresh(); }, 1400);
  }

  if (state === 'done') {
    return (
      <section className="flex flex-col items-center py-12 text-center" role="status">
        <div className="relative">
          {species === 'cat' ? <CatMakham className="h-36 w-36" /> : <DogTuaDaeng className="h-36 w-36" />}
          <svg viewBox="0 0 24 24" className="absolute left-1/2 top-0 h-7 w-7 -translate-x-1/2 text-honey" style={{ animation: 'floatUp 1.2s ease-out forwards' }} aria-hidden fill="currentColor"><path d="M12 21s-7.5-4.6-9.5-9.2C1 8.4 3.2 5 6.6 5c2 0 3.5 1.1 5.4 3 1.9-1.9 3.4-3 5.4-3 3.4 0 5.6 3.4 4.1 6.8C19.5 16.4 12 21 12 21Z" /></svg>
        </div>
        <p className="mt-4 text-xl font-bold">บันทึกแล้ว ขอบคุณที่ดูแลใจตัวเองวันนี้</p>
      </section>
    );
  }

  return (
    <section className="space-y-6 pb-4">
      {/* Signature element: the user's own pet photo is the hero of the check-in card */}
      <div className="page flex items-center gap-4 rounded-[var(--radius-sheet)] border border-bark/20 p-4">
        {photoUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={photoUrl} alt={`รูป${petName}`} className="h-24 w-24 shrink-0 rounded-[var(--radius-card)] object-cover" />
          : <div className="grid h-24 w-24 shrink-0 place-items-center rounded-[var(--radius-card)] bg-cream">{species === 'cat' ? <CatMakham className="h-20 w-20" still /> : <DogTuaDaeng className="h-20 w-20" still />}</div>}
        <div>
          <p className="text-sm text-bark">{dateLabel}</p>
          <h1 className="text-xl font-bold">วันนี้กับ{petName} เป็นยังไงบ้าง</h1>
          {initial && <p className="mt-1 text-sm text-bark">บันทึกวันนี้แล้ว แก้ไขได้</p>}
        </div>
      </div>

      {/* The one required answer, so it gets the weight on the screen rather than
          sitting smaller than the optional chips below it. */}
      <fieldset>
        <legend className="font-semibold">อารมณ์วันนี้</legend>
        <div className="mt-2 grid grid-cols-5 gap-1.5 sm:gap-2" role="radiogroup" aria-label="อารมณ์วันนี้">
          {[1, 2, 3, 4, 5].map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mood === m}
              onClick={() => setMood(m)}
              className={`flex min-h-[6.5rem] flex-col items-center justify-center gap-1.5 rounded-[var(--radius-card)] border-2 px-1 text-xs transition-colors ${
                mood === m
                  ? 'border-jade bg-sage font-semibold text-cocoa'
                  : 'border-bark/15 bg-paper text-bark hover:border-bark/35'
              }`}
            >
              <MoodFace mood={m} className="h-12 w-12 sm:h-14 sm:w-14" />
              {MOOD_LABELS[m - 1]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <div className="flex items-end justify-between gap-2">
          <legend className="font-semibold">วันนี้กับน้อง <span className="text-sm font-normal text-bark">เลือกได้หลายข้อ</span></legend>
          {lastActivities && lastActivities.length > 0 && (
            <button type="button" className="text-sm font-semibold text-jade underline underline-offset-4" onClick={() => setActs(new Set(lastActivities))}>เหมือนครั้งก่อน</button>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {JOY.map((a) => (<button key={a} type="button" className="chip" aria-pressed={acts.has(a)} onClick={() => toggle(a)}>{acts.has(a) && <IconCheck />}{ACTIVITIES[a].th}</button>))}
        </div>
      </fieldset>

      {/* Recording the cost of pet care, not only the good parts, is the thing this app
          does that a generic mood tracker does not — so it gets its own surface instead of
          looking like a second row of the same chips. */}
      <fieldset className="card card-warn">
        <legend className="font-semibold">ภาระวันนี้ <span className="text-sm font-normal text-bark">เลือกได้หลายข้อ</span></legend>
        <p className="mt-0.5 text-sm text-bark">วันที่เหนื่อยก็บันทึกได้ ไม่ได้แปลว่าคุณเลี้ยงไม่ดี</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {BURDEN.map((a) => (<button key={a} type="button" className="chip chip-burden" aria-pressed={acts.has(a)} onClick={() => toggle(a)}>{acts.has(a) && <IconCheck />}{ACTIVITIES[a].th}</button>))}
        </div>
      </fieldset>

      <div>
        {showNote ? (
          <label className="block"><span className="font-semibold">โน้ต</span> <span className="text-sm text-bark">(เห็นได้คนเดียว ไม่ถูกส่งให้ AI)</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={3} className="field mt-1" />
            <span className="text-xs text-bark"><span className="num">{note.length}</span>/500</span>
          </label>
        ) : (
          <button type="button" className="text-sm font-semibold text-jade underline underline-offset-4" onClick={() => setShowNote(true)}>เพิ่มโน้ต</button>
        )}
      </div>

      {error && <p className="font-semibold" role="alert">{error}</p>}

      {/* Stays within thumb reach on a phone however long the chip list runs. */}
      <div className="sticky bottom-20 z-10 -mx-5 bg-gradient-to-t from-cream via-cream to-transparent px-5 pb-1 pt-4 md:static md:mx-0 md:bg-none md:p-0">
        <button type="button" onClick={save} disabled={state === 'saving'} className="btn btn-primary w-full text-lg">{state === 'saving' ? 'กำลังบันทึก…' : 'บันทึก'}</button>
      </div>
    </section>
  );
}
