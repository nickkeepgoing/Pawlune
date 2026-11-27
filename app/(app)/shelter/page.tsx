import { redirect } from 'next/navigation';
import { getState } from '@/lib/data';
import { createAdminClient } from '@/lib/supabase/admin';
import { thaiDate } from '@/lib/format';
import { LABEL, PROBLEMS } from '@/lib/trialData';
import { SubmitButton } from '@/components/SubmitButton';
import { approve, decline, received } from './actions';

const STATUS: Record<string, string> = { applied: 'รอตรวจคำขอ', active: 'กำลังทดลองเลี้ยง', adopted: 'รับเลี้ยงแล้ว', return_requested: 'รอรับน้องคืน', returned: 'รับคืนแล้ว', declined: 'ไม่อนุมัติ' };
const PROB_TH = Object.fromEntries(PROBLEMS) as Record<string, string>;
const KIND: Record<string, string> = { day14: 'วันที่ 14', monthly: 'รายเดือน', concern: 'แจ้งปัญหา' };
const NONE = ['00000000-0000-0000-0000-000000000000'];

type Prefs = { housing?: string; has_fence?: boolean; hours_alone?: number; budget_month?: number; family_agrees?: boolean; experience?: string;
  indoor_only?: boolean; window_screens?: boolean; existing_pets?: string[]; allergy_checked?: boolean; has_carrier?: boolean };

// Shelter staff view, scoped to the staff member's own shelter.
// Shows ONLY what the adopter agreed to share: name, readiness, agreement, trial feedback. Never check-ins, notes, WHO-5 or ST-5.
export default async function ShelterPage({ searchParams }: { searchParams: Promise<{ check?: string }> }) {
  const { profile } = await getState();
  if (!profile?.is_shelter) redirect('/home');
  const sp = await searchParams;
  if (!profile.shelter_id) {
    return <p className="rounded-[var(--radius-card)] bg-paper p-4">บัญชีนี้ยังไม่ได้ผูกกับศูนย์ ให้ผู้ดูแลระบบตั้งค่า shelter_id ก่อน</p>;
  }
  const admin = createAdminClient();
  const [{ data: shelter }, { data: own }] = await Promise.all([
    admin.from('shelters').select('name').eq('id', profile.shelter_id).maybeSingle(),
    admin.from('shelter_animals').select('id, name, species').eq('shelter_id', profile.shelter_id),
  ]);
  const aids = (own ?? []).map((a) => a.id);
  const { data: trials } = await admin.from('trials').select('id, user_id, animal_id, status, applied_at, start_date, return_plan, emergency_contact, agreed_at, approved_at')
    .in('animal_id', aids.length ? aids : NONE).order('applied_at', { ascending: false }).limit(50);
  const rows = trials ?? [];
  const uids = [...new Set(rows.map((t) => t.user_id))], tids = rows.map((t) => t.id);
  const [{ data: people }, { data: prefs }, { data: fb }] = await Promise.all([
    admin.from('profiles').select('id, display_name, username').in('id', uids.length ? uids : NONE),
    admin.from('adopt_preferences').select('user_id, housing, has_fence, hours_alone, budget_month, family_agrees, experience, indoor_only, window_screens, existing_pets, allergy_checked, has_carrier').in('user_id', uids.length ? uids : NONE),
    admin.from('trial_feedback').select('trial_id, kind, feeling, decision, problems, note, created_at').in('trial_id', tids.length ? tids : NONE).order('created_at'),
  ]);
  const by = <T extends Record<string, unknown>>(xs: T[] | null, k: keyof T) => new Map((xs ?? []).map((x) => [x[k] as string, x]));
  const P = by(people, 'id'), R = by(prefs, 'user_id'), A = by(own, 'id');
  const yes = (v: boolean | undefined, y: string, n: string) => (v ? y : n);
  return (
    <div className="wide space-y-4 py-2">
      <div>
        <h1 className="text-2xl font-bold">คำขอทดลองเลี้ยง: {shelter?.name}</h1>
        <p className="text-sm text-bark">เห็นเฉพาะข้อมูลที่ผู้ขอยินยอมให้ศูนย์ ไม่รวมบันทึกอารมณ์และคะแนนสุขภาพใจ</p>
      </div>
      {rows.length === 0 && <p className="rounded-[var(--radius-card)] bg-paper p-4">ยังไม่มีคำขอ</p>}
      <div className="grid gap-4 xl:grid-cols-2">
      {rows.map((t) => {
        const who = P.get(t.user_id) as { display_name?: string; username?: string } | undefined;
        const pr = R.get(t.user_id) as Prefs | undefined;
        const an = A.get(t.animal_id) as { name?: string; species?: string } | undefined;
        const fbs = (fb ?? []).filter((f) => f.trial_id === t.id);
        const concern = fbs.some((f) => f.kind === 'concern');
        return (
          <article key={t.id} id={`t-${t.id}`} className={`rounded-[var(--radius-card)] bg-paper p-4 text-sm ${concern && t.status === 'active' ? 'border-[1.5px] border-bark' : ''}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-base font-bold">{an?.name} <span className="font-normal text-bark">({an?.species && LABEL.species[an.species]})</span></p>
              <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs">{STATUS[t.status]}{concern && t.status === 'active' ? ' · มีเรื่องแจ้ง' : ''}</span>
            </div>
            <p>ผู้ขอ: {who?.display_name ?? '-'}{who?.username && ` (@${who.username})`} · ส่งเมื่อ {thaiDate(String(t.applied_at).slice(0, 10))}{t.start_date && ` · เริ่ม ${thaiDate(t.start_date)}`}</p>
            {pr && (
              <ul className="mt-1 grid gap-x-4 text-bark sm:grid-cols-2">
                <li>{pr.housing === 'house' ? 'บ้าน' : 'คอนโด/หอ'}{pr.has_fence ? ' มีรั้ว' : ''} · ไม่อยู่บ้าน {pr.hours_alone ?? '-'} ชม./วัน</li>
                <li>งบ {pr.budget_month?.toLocaleString('th-TH') ?? '-'} บาท/เดือน</li>
                <li>{yes(pr.family_agrees, 'ทุกคนในบ้านเห็นด้วย', 'ยังไม่ยืนยันว่าทุกคนเห็นด้วย')} · {yes(pr.allergy_checked, 'เช็กอาการแพ้แล้ว', 'ยังไม่เช็กอาการแพ้')}</li>
                <li>{yes(pr.indoor_only, 'เลี้ยงในบ้าน', 'อาจปล่อยออกนอกบ้าน')} · {yes(pr.window_screens, 'มีมุ้งลวด/ตาข่าย', 'ยังไม่มีมุ้งลวด')} · {yes(pr.has_carrier, 'มีกล่องใส่สัตว์', 'ยังไม่มีกล่อง')}</li>
                <li>สัตว์เดิมในบ้าน: {pr.existing_pets?.length ? pr.existing_pets.map((x) => LABEL.pets[x] ?? x).join(', ') : 'ไม่มี'}</li>
                {pr.experience && <li>ประสบการณ์: {pr.experience}</li>}
              </ul>
            )}
            {t.agreed_at && (
              <div className="mt-2 rounded-lg bg-cream/60 p-2">
                <p><b>ข้อตกลง</b> ยอมรับเมื่อ {thaiDate(String(t.agreed_at).slice(0, 10))}{t.approved_at && ` · ศูนย์อนุมัติ ${thaiDate(String(t.approved_at).slice(0, 10))}`}</p>
                <p>แผนคืน: {t.return_plan}</p>
                <p>ผู้ติดต่อฉุกเฉิน: {t.emergency_contact}</p>
              </div>
            )}
            {fbs.map((f, i) => (
              <p key={i} className="mt-1 border-t border-bark/10 pt-1">{thaiDate(String(f.created_at).slice(0, 10))} · {KIND[f.kind] ?? f.kind}{f.feeling !== null && ` · ความรู้สึก ${f.feeling}/5`}{f.decision && ` · ${f.decision === 'adopt' ? 'รับเลี้ยง' : f.decision === 'return' ? 'ขอคืน' : 'ยังไม่แน่ใจ'}`}{f.problems?.length ? ` · ${f.problems.map((p: string) => PROB_TH[p] ?? p).join(', ')}` : ''}{f.note && ` · "${f.note}"`}</p>
            ))}
            {t.status === 'applied' && (
              <form action={approve} className="mt-3 space-y-1.5 border-t border-bark/15 pt-3">
                <input type="hidden" name="id" value={t.id} />
                <p className="font-semibold">ตรวจก่อนอนุมัติ</p>
                {[['c_identity', 'ยืนยันตัวตนและช่องทางติดต่อของผู้ขอแล้ว'], ['c_home', 'คุยเรื่องบ้าน คนในบ้าน อาการแพ้ และสัตว์เดิมแล้ว'], ['c_history', 'แจ้งประวัติสุขภาพและพฤติกรรมของน้องที่ศูนย์รู้แล้ว'], ['c_agreement', 'ตกลงเรื่องค่าสัตวแพทย์ คลินิกฉุกเฉิน และการคืนแล้ว']].map(([n, l]) => (
                  <label key={n} className="flex items-start gap-2"><input type="checkbox" name={n} className="mt-0.5 h-5 w-5 shrink-0 accent-[#4E6E58]" />{l}</label>
                ))}
                {sp.check === t.id && <p className="font-semibold" role="alert">ติ๊กให้ครบทุกข้อก่อนอนุมัติ</p>}
                <SubmitButton className="btn btn-primary mt-1">อนุมัติและส่งมอบน้อง (เริ่มวันนี้)</SubmitButton>
              </form>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {t.status === 'applied' && <form action={decline}><input type="hidden" name="id" value={t.id} /><SubmitButton className="btn btn-ghost">ไม่อนุมัติ</SubmitButton></form>}
              {t.status === 'return_requested' && <form action={received}><input type="hidden" name="id" value={t.id} /><SubmitButton className="btn btn-primary">รับน้องคืนแล้ว</SubmitButton></form>}
            </div>
          </article>
        );
      })}
      </div>
    </div>
  );
}
