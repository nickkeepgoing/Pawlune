import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireStage } from '@/lib/guard';
import { signedPhotoUrl, type Pet } from '@/lib/data';
import { todayInBangkok } from '@/lib/time';
import { daysBetween } from '@/lib/engine';
import { SPECIES_TH, thaiDate } from '@/lib/format';
import { SubmitButton } from '@/components/SubmitButton';
import { addMemory, deleteMemory } from './actions';

export default async function PetsPage({ searchParams }: { searchParams: Promise<{ confirm?: string }> }) {
  const { supabase, user, pet } = await requireStage('ready');
  const sp = await searchParams;
  if (!pet) redirect('/adopt');
  const [{ data: past }, photo] = await Promise.all([
    supabase.from('pets').select('*').eq('user_id', user!.id).eq('is_current', false).order('created_at'),
    signedPhotoUrl(pet!.photo_path),
  ]);
  const since = pet!.adopted_on ? daysBetween(pet!.adopted_on, todayInBangkok()) : null;
  return (
    <div className="space-y-6 py-2">
      <section className="card flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {photo && <img src={photo} alt={`รูป${pet!.name}`} className="h-20 w-20 rounded-[var(--radius-card)] object-cover" />}
        <div>
          <h1 className="text-xl font-bold">{pet!.name}</h1>
          <p className="text-bark">{SPECIES_TH[pet!.species]}{pet!.adopted_on && <> รับมาเมื่อ {thaiDate(pet!.adopted_on)}</>}</p>
          {since !== null && since >= 0 && <p>อยู่ด้วยกันมา <span className="num font-semibold">{since.toLocaleString('th-TH')}</span> วัน</p>}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">ความทรงจำ</h2>
        <p className="text-sm text-bark">ข้อมูลส่วนนี้เป็นความทรงจำ ไม่นำไปคำนวณรูปแบบ</p>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {((past ?? []) as Pet[]).map((p) => (
            <li key={p.id} className="card card-quiet">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{p.name} <span className="font-normal text-bark">{SPECIES_TH[p.species]}{p.past_period && ` ${p.past_period}`}</span></p>
                  {p.past_feeling && <p className="text-sm">ความรู้สึกเมื่อนึกถึง <span className="num">{p.past_feeling}</span>/5</p>}
                  {p.past_tags.length > 0 && <p className="mt-1 flex flex-wrap gap-1">{p.past_tags.map((t) => <span key={t} className="rounded-full bg-cream px-2 py-0.5 text-xs">{t}</span>)}</p>}
                  {p.memory_note && <p className="mt-2 text-bark">{p.memory_note}</p>}
                </div>
                {sp.confirm === p.id ? (
                  <form action={deleteMemory} className="shrink-0 text-right">
                    <input type="hidden" name="id" value={p.id} />
                    <p className="text-sm font-semibold">ลบแล้วกู้คืนไม่ได้</p>
                    <div className="mt-1 flex gap-2">
                      <button className="btn btn-ghost min-h-11 px-3 text-sm">ลบเลย</button>
                      <Link href="/pets" className="btn btn-quiet min-h-11 px-3 text-sm">เก็บไว้</Link>
                    </div>
                  </form>
                ) : (
                  <Link href={`/pets?confirm=${p.id}`} className="btn btn-quiet min-h-11 shrink-0 px-3 text-sm" aria-label={`ลบความทรงจำของ${p.name}`}>ลบ</Link>
                )}
              </div>
            </li>
          ))}
        </ul>
        <details className="card card-quiet mt-4">
          <summary className="cursor-pointer font-semibold text-jade">เพิ่มความทรงจำ</summary>
          <form action={addMemory} className="mt-3 space-y-3">
            <label className="block"><span className="text-sm">ชื่อ</span><input name="name" required maxLength={40} className="field mt-1" /></label>
            <label className="block"><span className="text-sm">ชนิด</span>
              <select name="species" className="field mt-1"><option value="dog">หมา</option><option value="cat">แมว</option><option value="other">อื่นๆ</option></select></label>
            <label className="block"><span className="text-sm">ช่วงเวลา เช่น 2018–2023</span><input name="period" maxLength={40} className="field mt-1" /></label>
            <label className="block"><span className="text-sm">ความรู้สึกเมื่อนึกถึง (1–5)</span><input name="feeling" type="number" min={1} max={5} className="field mt-1" /></label>
            <label className="block"><span className="text-sm">คำที่นึกถึง คั่นด้วยจุลภาค</span><input name="tags" className="field mt-1" placeholder="อุ่นใจ, ผูกพัน" /></label>
            <label className="block"><span className="text-sm">เรื่องที่อยากจดไว้</span><textarea name="note" maxLength={500} rows={3} className="field mt-1" /></label>
            <SubmitButton>บันทึกความทรงจำ</SubmitButton>
          </form>
        </details>
      </section>
    </div>
  );
}
