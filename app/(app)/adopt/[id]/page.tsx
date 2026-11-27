import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireStage } from '@/lib/guard';
import { LABEL, loadPrefs, type Animal, type Shelter } from '@/lib/trialData';
import { matchAnimal } from '@/lib/engine';
import { SubmitButton } from '@/components/SubmitButton';
import { AnimalFace, PawPrint, PeekCat } from '@/components/Critters';
import { applyForTrial } from '../actions';

export default async function AnimalPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ need?: string }> }) {
  const { supabase } = await requireStage('ready');
  const { id } = await params; const sp = await searchParams;
  const { data } = await supabase.from('shelter_animals').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const a = data as Animal;
  const [{ data: s }, prefs] = await Promise.all([supabase.from('shelters').select('*').eq('id', a.shelter_id).maybeSingle(), loadPrefs()]);
  const shelter = s as Shelter | null;
  const m = prefs ? matchAnimal(prefs, a) : null;
  const yesNo = (v: boolean | null) => (v === null ? 'ศูนย์ยังไม่ระบุ' : v ? 'แล้ว' : 'ยัง');
  const tick = 'mt-0.5 h-5 w-5 shrink-0 accent-[#4E6E58]';
  return (
    <div className="wide space-y-4 py-2">
      <Link href="/adopt" className="text-sm font-semibold text-jade underline underline-offset-4">กลับไปรายชื่อ</Link>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-4">
          <section className="page flex items-center gap-4 rounded-[var(--radius-sheet)] border border-bark/20 p-5">
            <div className="blob grid h-28 w-28 shrink-0 place-items-center bg-sage/45"><AnimalFace id={a.name} species={a.species} className="h-24 w-24" label={`${a.name} ${LABEL.species[a.species]}`} /></div>
            <div>
              <h1 className="text-2xl font-bold">{a.name}</h1>
              <p className="text-bark">{LABEL.species[a.species]}{a.sex && ` ${LABEL.sex[a.sex]}`} · {a.age_group && LABEL.age_group[a.age_group]} · ตัว{a.size && LABEL.size[a.size]}</p>
              <p className="text-xs text-bark">{shelter?.name}{a.is_demo && ' · ข้อมูลจำลอง'}</p>
            </div>
          </section>
          {a.story && <p className="rounded-[var(--radius-card)] bg-paper p-4">{a.story}</p>}

          <section className="rounded-[var(--radius-card)] bg-paper p-4 text-sm">
            <h2 className="font-semibold">ประวัติที่ศูนย์เปิดเผย</h2>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              <dt className="text-bark">วัคซีน</dt><dd>{yesNo(a.vaccinated)}</dd>
              <dt className="text-bark">ทำหมัน</dt><dd>{yesNo(a.neutered)}</dd>
              {a.species === 'cat' && <><dt className="text-bark">อยู่ในบ้าน</dt><dd>{a.indoor_ok ? 'เคยชินกับการอยู่ในบ้าน' : 'เคยชินกับการออกนอกบ้าน'}</dd></>}
              <dt className="text-bark">กับแมวตัวอื่น</dt><dd>{LABEL.okWith[a.ok_with_cats]}</dd>
              <dt className="text-bark">กับหมา</dt><dd>{LABEL.okWith[a.ok_with_dogs]}</dd>
              {a.health_notes && <><dt className="text-bark">สุขภาพ</dt><dd>{a.health_notes}</dd></>}
              {a.behavior_notes && <><dt className="text-bark">พฤติกรรม</dt><dd>{a.behavior_notes}</dd></>}
            </dl>
            <p className="mt-2 text-xs text-bark">เป็นสิ่งที่ศูนย์รู้ ณ วันนี้ ไม่ใช่การรับประกัน น้องอาจทำตัวต่างไปในบ้านใหม่ ถามศูนย์เพิ่มได้ก่อนตัดสินใจ</p>
          </section>

          <section className="rounded-[var(--radius-card)] bg-paper p-4 text-sm">
            <h2 className="font-semibold">นิสัยและสิ่งที่น้องต้องการ</h2>
            <ul className="mt-1 space-y-0.5">
              {a.energy && <li>พลังงาน: {LABEL.energy[a.energy]}</li>}
              {a.personality && <li>นิสัย: {LABEL.personality[a.personality]}</li>}
              {a.max_hours_alone !== null && <li>อยู่ลำพังได้ไม่เกิน {a.max_hours_alone} ชม. ต่อวัน</li>}
              {a.needs_fence && <li>ต้องการพื้นที่มีรั้วรอบ</li>}
              {a.good_with.length > 0 && <li>เข้ากับ: {a.good_with.join(', ')}</li>}
            </ul>
            {m && (m.fits.length > 0 || m.cautions.length > 0) && (
              <>
                <h3 className="mt-3 border-t border-bark/15 pt-3 font-semibold">เทียบกับความพร้อมของคุณ <span className="font-normal text-bark">(กฎที่เปิดเผย ไม่ใช่ AI)</span></h3>
                <ul className="mt-1 space-y-0.5">
                  {m.fits.map((f) => <li key={f} className="flex items-start gap-1.5"><PawPrint className="mt-1 h-3.5 w-3.5 shrink-0 text-jade" />{f}</li>)}
                  {m.cautions.map((c) => <li key={c} className="flex items-start gap-1.5 text-bark"><span className="grid h-4 w-4 shrink-0 translate-y-1 place-items-center rounded-full bg-honey/40 text-[10px] font-bold" aria-hidden>!</span>{c}</li>)}
                </ul>
              </>
            )}
            {m?.excluded && <p className="mt-3 font-semibold">ไม่แนะนำ: {m.exclude_reason}</p>}
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-[var(--radius-card)] border-[1.5px] border-jade bg-paper p-4 text-sm">
            <h2 className="font-semibold">ทดลองเลี้ยง 14 วัน ทำงานยังไง</h2>
            <ol className="mt-1 list-decimal space-y-0.5 pl-5">
              <li>ศูนย์ตรวจคำขอ คุยกับคุณ และอนุมัติก่อนทุกครั้ง</li>
              <li>รับน้องในกล่องใส่สัตว์ เริ่มจากห้องเงียบหนึ่งห้อง</li>
              <li>บันทึกวันละ 10 วินาที แจ้งปัญหาหรือขอคืนได้ทุกวัน</li>
              <li>วันที่ 14 ทบทวนแล้วเลือก รับเป็นครอบครัว หรือคืนให้ศูนย์</li>
              <li>ถ้ารับต่อ ส่งความเป็นอยู่ของน้องให้ศูนย์ทุก 30 วัน</li>
            </ol>
            <p className="mt-2 text-bark">14 วันช่วยให้เห็นชีวิตจริงก่อนตัดสินใจ แต่ไม่ได้รับประกันว่าจะเข้ากันได้ การคืนเมื่อไปต่อไม่ไหวไม่ใช่ความผิด และช่วยให้ศูนย์หาบ้านที่เหมาะกว่าให้น้อง</p>
            <span className="mt-2 flex flex-wrap gap-3 font-semibold text-jade">
              <Link href={`/learn/${a.species}`} className="underline underline-offset-4">คู่มือ 14 วันแรกกับ{a.species === 'cat' ? 'แมว' : 'หมา'}</Link>
              <Link href="/learn/care" className="underline underline-offset-4">ค่าใช้จ่าย</Link>
            </span>
          </section>

          {a.status === 'available' && !m?.excluded && (
            <form id="apply" action={applyForTrial} className="peek-host relative mt-10 space-y-3 rounded-[var(--radius-card)] bg-paper p-4 text-sm">
              <PeekCat className="right-8" />
              <input type="hidden" name="animal_id" value={a.id} />
              <h2 className="text-base font-bold">ข้อตกลงก่อนขอทดลองเลี้ยง</h2>
              <p className="text-bark">ศูนย์จะยืนยันรายละเอียดกับคุณอีกครั้งก่อนส่งมอบ</p>
              <label className="flex items-start gap-3"><input type="checkbox" name="ready" className={tick} /><span>ฉันอ่านคู่มือแล้ว และพร้อมดูแลน้องตลอดช่วงทดลอง</span></label>
              <label className="flex items-start gap-3"><input type="checkbox" name="costs" className={tick} /><span>ฉันรับผิดชอบค่าอาหาร ทราย และของใช้ระหว่างทดลอง ส่วนค่าสัตวแพทย์จะทำตามที่ตกลงกับศูนย์</span></label>
              <label className="flex items-start gap-3"><input type="checkbox" name="emergency" className={tick} /><span>ถ้าน้องมีอาการฉุกเฉิน ฉันจะโทรหาศูนย์ทันทีและพาไปคลินิกตามที่ตกลงไว้</span></label>
              <label className="flex items-start gap-3"><input type="checkbox" name="transport" className={tick} /><span>ฉันจะรับและส่งน้องในกล่องใส่สัตว์ที่ปิดล็อกได้เท่านั้น</span></label>
              <label className="flex items-start gap-3"><input type="checkbox" name="return_ok" className={tick} /><span>ถ้าไปต่อไม่ได้ ฉันจะคืนน้องให้ศูนย์โดยตรง ไม่ส่งต่อให้คนอื่นและไม่ปล่อย</span></label>
              <label className="block"><span className="font-semibold">แผนคืนน้องอย่างปลอดภัย</span>
                <textarea name="return_plan" required maxLength={300} rows={2} className="field mt-1" placeholder="เช่น ขับรถพาไปส่งที่ศูนย์เองภายใน 1 วัน ใช้กล่องใส่สัตว์ใบเดิม" /></label>
              <label className="block"><span className="font-semibold">ผู้ติดต่อฉุกเฉินถ้าติดต่อคุณไม่ได้</span>
                <input name="emergency_contact" required maxLength={100} className="field mt-1" placeholder="ชื่อ และเบอร์โทร" /></label>
              <label className="flex items-start gap-3"><input type="checkbox" name="share" className={tick} /><span>ยินยอมให้ศูนย์เห็นชื่อ ความพร้อม ข้อตกลงนี้ และสิ่งที่ฉันแจ้งเรื่องน้อง <b>ศูนย์ไม่เห็นบันทึกอารมณ์ คะแนน WHO-5 หรือ ST-5 ของฉัน</b></span></label>
              {sp.need === 'home' && <p className="font-semibold" role="alert">กลับไปติ๊ก &quot;ทุกคนในบ้านเห็นด้วย&quot; และ &quot;ถามเรื่องอาการแพ้แล้ว&quot; ในหน้าความพร้อมก่อน <Link href="/adopt?edit=1" className="text-jade underline">แก้ความพร้อม</Link></p>}
              {sp.need === '1' && <p className="font-semibold" role="alert">ติ๊กให้ครบทุกข้อ และกรอกแผนคืนกับผู้ติดต่อฉุกเฉินก่อนส่ง</p>}
              <SubmitButton>ขอทดลองเลี้ยง{a.name}</SubmitButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
