import Link from 'next/link';
import { requireStage } from '@/lib/guard';
import { loadCheckins, loadWho5 } from '@/lib/data';
import { LABEL, PROBLEMS, loadSt5, loadTrial } from '@/lib/trialData';
import { todayInBangkok } from '@/lib/time';
import { thaiDate } from '@/lib/format';
import { BASELINE_GRACE_DAYS, TRIAL_DAYS, beforeAfter, decisionOpen, monthlyDue, st5Score, trialDay, trialEnd, trialMood } from '@/lib/engine';
import { SubmitButton } from '@/components/SubmitButton';
import { FeedbackFields } from './FeedbackFields';
import { submitConcern, submitDay14, submitMonthly } from './actions';
import { RedFlags, StageTip } from './CatCare';
import { PawPath } from '@/components/PawPath';
import { AnimalFace } from '@/components/Critters';

const word = (after: number, before: number) => (after > before ? 'สูงขึ้น' : after < before ? 'ต่ำลง' : 'เท่าเดิม');
const PROB_TH = Object.fromEntries(PROBLEMS) as Record<string, string>;

export default async function TrialPage({ searchParams }: { searchParams: Promise<{ missing?: string; concern?: string }> }) {
  await requireStage('ready');
  const sp = await searchParams;
  const today = todayInBangkok();
  const { trial, animal, shelter, feedback } = await loadTrial();

  if (!trial || !animal) {
    return (
      <div className="wide mx-auto max-w-4xl space-y-4 py-2">
        <h1 className="text-2xl font-bold">ทดลองเลี้ยง 14 วัน</h1>
        <p className="max-w-2xl">ศูนย์อนุมัติก่อน แล้วอยู่กับน้อง 14 วันพร้อมคำแนะนำรายวัน แจ้งปัญหาได้ทุกเมื่อ ครบแล้วค่อยตัดสินใจว่าจะรับเป็นครอบครัวหรือคืนให้ศูนย์หาบ้านที่เหมาะกว่า</p>
        <Link href="/adopt" className="btn btn-primary w-full sm:w-auto">หาเพื่อนที่เข้ากับฉัน</Link>
      </div>
    );
  }

  const head = (
    <section className="page flex items-center gap-4 rounded-[var(--radius-sheet)] border border-bark/20 p-5">
      <div className="blob grid h-20 w-20 shrink-0 place-items-center bg-sage/45"><AnimalFace id={animal.name} species={animal.species} className="h-16 w-16" /></div>
      <div>
        <p className="text-sm text-bark">{shelter?.name}{animal.is_demo && ' · ข้อมูลจำลอง'}</p>
        <h1 className="text-2xl font-bold">{animal.name}</h1>
        <p className="text-bark">{LABEL.species[animal.species]} · {animal.age_group && LABEL.age_group[animal.age_group]}</p>
      </div>
    </section>
  );

  if (trial.status === 'applied') {
    return (
      <div className="wide mx-auto max-w-4xl space-y-4 py-2">{head}
        <div className="rounded-[var(--radius-card)] bg-paper p-4">
          <p className="font-semibold">ส่งคำขอแล้ว รอศูนย์ติดต่อกลับ</p>
          <p className="mt-1 text-sm">ศูนย์จะตรวจคำขอและนัดวันรับน้อง{shelter?.phone && <> สอบถามได้ที่ <span className="num">{shelter.phone}</span></>}</p>
          <p className="mt-2 text-sm text-bark">ระหว่างรอ อ่านคู่มือเลี้ยงและเตรียมของได้เลย</p>
          <Link href="/learn/care" className="mt-2 inline-block font-semibold text-jade underline underline-offset-4">คู่มือเลี้ยงและค่าใช้จ่าย</Link>
        </div>
      </div>
    );
  }

  if (trial.status === 'return_requested') {
    return (
      <div className="wide mx-auto max-w-4xl space-y-4 py-2">{head}
        <div className="rounded-[var(--radius-card)] bg-paper p-4">
          <p className="font-semibold">แจ้งคืนน้องแล้ว รอศูนย์นัดรับ</p>
          <p className="mt-1 text-sm">ขอบคุณที่ดูแล{animal.name} ข้อมูลที่คุณส่งจะช่วยให้ศูนย์หาบ้านที่เหมาะกว่าให้น้อง เมื่อศูนย์รับคืนแล้ว คุณหาเพื่อนใหม่ได้ทันที และบันทึกของ{animal.name}จะอยู่ในความทรงจำ</p>
        </div>
      </div>
    );
  }

  const start = trial.start_date!;
  const [checkins, who5, st5] = await Promise.all([loadCheckins(), loadWho5(), loadSt5()]);
  const w = beforeAfter(who5, start);
  const s = beforeAfter(st5, start);
  const mood = trialMood(checkins, start);
  const day = Math.min(trialDay(start, today), TRIAL_DAYS);

  if (trial.status === 'adopted') {
    const lastOn = (feedback.at(-1)?.created_at ?? trial.decided_at ?? start).slice(0, 10);
    const due = monthlyDue(lastOn, today);
    return (
      <div className="wide mx-auto max-w-4xl space-y-4 py-2">{head}
        <p className="rounded-[var(--radius-card)] bg-sage/40 p-4 font-semibold">{animal.name}เป็นครอบครัวของคุณแล้ว ตั้งแต่ {trial.decided_at ? thaiDate(trial.decided_at.slice(0, 10)) : ''}</p>
        {due ? (
          <form action={submitMonthly} className="space-y-4 rounded-[var(--radius-card)] bg-paper p-4">
            <input type="hidden" name="trial_id" value={trial.id} />
            <h2 className="text-lg font-bold">ครบเดือนแล้ว เป็นยังไงบ้าง</h2>
            <FeedbackFields />
            <label className="flex items-start gap-3"><input type="checkbox" name="want_return" className="mt-1 h-5 w-5 accent-[#4E6E58]" /><span className="text-sm">ฉันดูแลต่อไม่ไหว อยากให้ศูนย์ช่วยหาบ้านใหม่ให้น้อง</span></label>
            {sp.missing && <p className="text-sm font-semibold" role="alert">เลือกความรู้สึกก่อนส่ง</p>}
            <SubmitButton>ส่งให้ศูนย์</SubmitButton>
          </form>
        ) : <p className="rounded-[var(--radius-card)] bg-paper p-4 text-sm">ครั้งต่อไปที่จะถามความรู้สึก: อีกไม่เกิน 30 วันหลังครั้งล่าสุด ({thaiDate(lastOn)})</p>}
        <RedFlags species={animal.species} phone={shelter?.phone ?? null} />
        <Concern trialId={trial.id} name={animal.name} state={sp.concern} adopted />
        <History feedback={feedback} />
      </div>
    );
  }

  // active
  const open = decisionOpen(start, today);
  const needBaseline = !w.before || !s.before;
  return (
    <div className="wide mx-auto max-w-4xl space-y-4 py-2">{head}
      <section className="rounded-[var(--radius-card)] bg-paper p-4">
        <div className="flex items-baseline justify-between"><h2 className="font-semibold">ทดลองเลี้ยง</h2><p className="text-sm text-bark">{thaiDate(start)} – {thaiDate(trialEnd(start))}</p></div>
        <p className="num mt-1 text-3xl font-semibold">วันที่ {day}<span className="text-base font-normal text-bark"> / {TRIAL_DAYS}</span></p>
        <div className="mt-1"><PawPath day={day} label={`${animal.name} อยู่กับคุณมา ${day} วัน จาก ${TRIAL_DAYS} วัน`} /></div>
        <Link href="/checkin" className="btn btn-primary mt-4 w-full">บันทึกวันนี้กับ{animal.name}</Link>
      </section>

      {needBaseline && !open && day <= BASELINE_GRACE_DAYS + 1 && (
        <section className="rounded-[var(--radius-card)] border-[1.5px] border-honey bg-paper p-4">
          <p className="font-semibold">ตอบแบบวัดวันแรก ก่อนวันที่ 3</p>
          <p className="text-sm text-bark">ใช้เทียบกับวันที่ 14 ว่าช่วงทดลองใจคุณเป็นยังไง</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href="/wellbeing/take?next=/trial" className={`btn ${w.before ? 'text-bark' : 'btn-primary'}`}>{w.before ? 'WHO-5 เสร็จแล้ว' : 'WHO-5 (5 ข้อ)'}</Link>
            <Link href="/wellbeing/st5?next=/trial" className={`btn ${s.before ? 'text-bark' : 'btn-primary'}`}>{s.before ? 'ST-5 เสร็จแล้ว' : 'ST-5 (5 ข้อ)'}</Link>
          </div>
        </section>
      )}

      {open && (
        <>
          <section className="space-y-3 rounded-[var(--radius-card)] bg-paper p-4">
            <h2 className="text-lg font-bold">ครบ 14 วันแล้ว ดูผลก่อนตัดสินใจ</h2>
            {(!w.after || !s.after) && (
              <div className="grid grid-cols-2 gap-2">
                {!w.after && <Link href="/wellbeing/take?next=/trial" className="btn btn-primary">ตอบ WHO-5 วันนี้</Link>}
                {!s.after && <Link href="/wellbeing/st5?next=/trial" className="btn btn-primary">ตอบ ST-5 วันนี้</Link>}
              </div>
            )}
            <table className="w-full text-left text-sm">
              <thead><tr className="text-bark"><th className="font-normal" /><th className="font-normal">ก่อนเริ่ม</th><th className="font-normal">วันที่ 14</th></tr></thead>
              <tbody>
                <tr><td>สุขภาวะทางใจ WHO-5 (0–100, สูง = ดี)</td><td className="num">{w.before?.pct ?? '–'}</td><td className="num">{w.after?.pct ?? 'ยังไม่ตอบ'}</td></tr>
                <tr><td>ความเครียด ST-5 (0–15, สูง = เครียด)</td><td className="num">{s.before ? `${s.before.raw} ${st5Score(s.before.items).level}` : '–'}</td><td className="num">{s.after ? `${s.after.raw} ${st5Score(s.after.items).level}` : 'ยังไม่ตอบ'}</td></tr>
                <tr><td>อารมณ์เฉลี่ยรายวัน (1–5)</td><td className="num">{mood.before.mean ?? '–'}<span className="text-xs text-bark"> ({mood.before.n} วัน)</span></td><td className="num">{mood.during.mean ?? '–'}<span className="text-xs text-bark"> ({mood.during.n} วัน ช่วงทดลอง)</span></td></tr>
              </tbody>
            </table>
            {w.before && w.after && <p className="text-sm">WHO-5 {word(w.after.pct, w.before.pct)} {s.before && s.after && <>· ความเครียด {word(s.after.raw, s.before.raw)}</>}</p>}
            <p className="text-sm text-bark">ช่วง 14 วันมีหลายอย่างเปลี่ยนไปพร้อมกัน ตัวเลขนี้ช่วยให้คุณสังเกตตัวเอง แต่บอกไม่ได้ว่าน้องเป็นสาเหตุ ใช้ประกอบกับความรู้สึกของคุณ</p>
          </section>
          <form action={submitDay14} className="space-y-4 rounded-[var(--radius-card)] bg-paper p-4">
            <input type="hidden" name="trial_id" value={trial.id} />
            <FeedbackFields />
            <fieldset>
              <legend className="font-semibold">ตัดสินใจยังไง</legend>
              <div className="mt-2 grid gap-2">
                {[['adopt', `รับ${animal.name}เป็นครอบครัว`], ['return', 'คืนให้ศูนย์หาบ้านที่เหมาะกว่า'], ['unsure', 'ยังไม่แน่ใจ ขอคิดต่ออีกหน่อย']].map(([v, l]) => (
                  <label key={v} className="chip cursor-pointer justify-start has-[:checked]:border-2 has-[:checked]:border-jade has-[:checked]:bg-sage"><input type="radio" name="decision" value={v} required className="sr-only" />{l}</label>
                ))}
              </div>
            </fieldset>
            {sp.missing && <p className="text-sm font-semibold" role="alert">เลือกความรู้สึกและการตัดสินใจก่อนส่ง</p>}
            <SubmitButton>ส่งให้ศูนย์</SubmitButton>
          </form>
        </>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <StageTip species={animal.species} day={day} />
        <RedFlags species={animal.species} phone={shelter?.phone ?? null} />
      </div>
      <Concern trialId={trial.id} name={animal.name} state={sp.concern} />
      <History feedback={feedback} />
    </div>
  );
}

function Concern({ trialId, name, state, adopted }: { trialId: string; name: string; state?: string; adopted?: boolean }) {
  if (state === 'sent') return <p id="concern" className="rounded-[var(--radius-card)] bg-sage/40 p-4 text-sm font-semibold" role="status">ส่งให้ศูนย์แล้ว ศูนย์จะติดต่อกลับ ถ้าเร่งด่วนโทรหาศูนย์ได้เลย</p>;
  return (
    <details id="concern" className="rounded-[var(--radius-card)] bg-paper p-4" open={state === 'empty'}>
      <summary className="cursor-pointer font-semibold">มีปัญหา หรืออยากคืน{name}ก่อนกำหนด</summary>
      <form action={submitConcern} className="mt-3 space-y-4">
        <input type="hidden" name="trial_id" value={trialId} />
        <p className="text-sm text-bark">แจ้งได้ทุกวัน ไม่ต้องรอครบ 14 วัน ถ้าคนหรือน้องไม่ปลอดภัย ไม่ต้องฝืนทดลองต่อ</p>
        <FeedbackFields optionalFeeling />
        <label className="flex items-start gap-3"><input type="checkbox" name="want_return" className="mt-1 h-5 w-5 accent-[#4E6E58]" /><span className="text-sm">{adopted ? 'ฉันดูแลต่อไม่ไหว อยากให้ศูนย์ช่วยหาบ้านใหม่ให้น้อง' : `ขอคืน${name}ให้ศูนย์`}</span></label>
        {state === 'empty' && <p className="text-sm font-semibold" role="alert">เลือกเรื่องที่ยาก เขียนบอกศูนย์ หรือติ๊กขอคืนอย่างน้อยหนึ่งอย่าง</p>}
        <SubmitButton className="btn btn-ghost w-full">ส่งให้ศูนย์</SubmitButton>
      </form>
    </details>
  );
}

function History({ feedback }: { feedback: { id: string; kind: string; feeling: number | null; decision: string | null; problems: string[]; note: string | null; created_at: string }[] }) {
  if (!feedback.length) return null;
  return (
    <section className="rounded-[var(--radius-card)] bg-paper p-4">
      <h2 className="font-semibold">สิ่งที่ส่งให้ศูนย์แล้ว</h2>
      <ul className="mt-2 space-y-2 text-sm">
        {feedback.map((f) => (
          <li key={f.id} className="border-t border-bark/10 pt-2 first:border-0 first:pt-0">
            <span className="text-bark">{thaiDate(f.created_at.slice(0, 10))} · {f.kind === 'day14' ? 'วันที่ 14' : f.kind === 'concern' ? 'แจ้งปัญหา' : 'รายเดือน'}</span>{f.feeling !== null && <> · ความรู้สึก <span className="num">{f.feeling}</span>/5</>}
            {f.decision && <> · {f.decision === 'adopt' ? 'รับเลี้ยงต่อ' : f.decision === 'return' ? 'คืนน้อง' : 'ยังไม่แน่ใจ'}</>}
            {f.problems.length > 0 && <div className="text-bark">{f.problems.map((p) => PROB_TH[p] ?? p).join(', ')}</div>}
            {f.note && <div>{f.note}</div>}
          </li>
        ))}
      </ul>
    </section>
  );
}
