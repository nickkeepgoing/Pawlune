import Link from 'next/link';
import { requireStage } from '@/lib/guard';
import { LABEL, loadAnimals, loadPrefs, loadTrial } from '@/lib/trialData';
import { rankMatches } from '@/lib/engine';
import { PrefsForm } from './PrefsForm';
import { PawPrint } from '@/components/Critters';
import { AnimalPhoto } from '@/components/AnimalPhoto';

export default async function AdoptPage({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  await requireStage('ready');
  const sp = await searchParams;
  const [prefs, { animals, shelters }, { trial }] = await Promise.all([loadPrefs(), loadAnimals(), loadTrial()]);
  if (!prefs || sp.edit) return <PrefsForm prefs={prefs} />;
  const ranked = rankMatches(prefs, animals);
  const excluded = animals.length - ranked.length;
  const shelterName = (id: string) => shelters.find((s) => s.id === id)?.name ?? '';
  const anyDemo = animals.some((a) => a.is_demo);
  return (
    <div className="wide space-y-4 py-2">
      <div>
        <h1 className="text-2xl font-bold">ทดลองรับเลี้ยงเพื่อนจากศูนย์</h1>
        <p className="max-w-2xl text-bark">ศูนย์อนุมัติก่อนทุกครั้ง อยู่ด้วยกัน 14 วันพร้อมคำแนะนำ แล้วค่อยตัดสินใจ รายชื่อเรียงด้วยกฎที่เปิดเผย (ไม่ใช่ AI) ทุกตัวมีเหตุผลว่าเข้ากันตรงไหน และต้องระวังอะไร</p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold text-jade">
          <Link href="/adopt?edit=1" className="underline underline-offset-4">แก้สิ่งที่ฉันมองหา</Link>
          <Link href="/learn/cat" className="underline underline-offset-4">คู่มือแมว</Link>
          <Link href="/learn/dog" className="underline underline-offset-4">คู่มือหมา</Link>
          <Link href="/learn/care" className="underline underline-offset-4">ค่าใช้จ่าย</Link>
        </div>
      </div>
      {trial && trial.status !== 'adopted' && (
        <Link href="/trial" className="block rounded-[var(--radius-card)] bg-jade p-4 text-cream"><b>คุณมีคำขอ/การทดลองเลี้ยงอยู่แล้ว</b><span className="block text-sm">ดูสถานะ</span></Link>
      )}
      {sp.saved && <p role="status" className="card font-semibold">บันทึกความพร้อมแล้ว</p>}
      {anyDemo && <p className="rounded-lg bg-honey/30 px-3 py-2 text-sm">รายชื่อสัตว์ด้านล่างเป็นข้อมูลจำลองสำหรับสาธิต ระหว่างรอความร่วมมือกับศูนย์จริง</p>}
      {animals.length === 0 ? (
        // Say that the list itself is empty, rather than implying the person's answers ruled everyone out.
        <p className="card card-warn">ตอนนี้ยังไม่มีสัตว์จากศูนย์ในระบบ คำตอบของคุณบันทึกไว้แล้ว กลับมาดูได้เมื่อศูนย์ลงข้อมูล</p>
      ) : (
        <p className="text-sm text-bark">เจอ <span className="num font-semibold">{ranked.length}</span> ตัวที่เข้ากับคุณ{excluded > 0 && <> ซ่อน <span className="num">{excluded}</span> ตัวที่ไม่ปลอดภัยหรือไม่ตรงเงื่อนไข เช่น ชนิดที่คุณแพ้ หรือไม่เข้ากับสัตว์เดิมในบ้าน</>}</p>
      )}
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ranked.map((a, i) => (
          <li key={a.id} className="rise-in" style={{ animationDelay: `${Math.min(i, 6) * 90}ms` }}>
            <Link href={`/adopt/${a.id}`} className="zoom-photo group flex h-full flex-col overflow-hidden rounded-3xl bg-paper shadow-[0_22px_40px_-28px_var(--c-shadow)] ring-1 ring-bark/10 transition-transform hover:-translate-y-1">
              <AnimalPhoto animal={a} className="aspect-[4/3]" priority={i === 0} />
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xl font-bold">{a.name}</p>
                <p className="text-sm text-bark">{LABEL.species[a.species]}{a.sex && ` ${LABEL.sex[a.sex]}`} {a.age_group && LABEL.age_group[a.age_group]}</p>
                <p className="truncate text-xs text-bark">{shelterName(a.shelter_id)}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {a.match.fits.map((f) => <li key={f} className="flex items-start gap-1.5"><PawPrint className="mt-1 h-3.5 w-3.5 shrink-0 text-jade" /><span className="sr-only">เข้ากัน: </span>{f}</li>)}
                  {a.match.cautions.map((c) => <li key={c} className="flex items-start gap-1.5 text-bark"><span className="grid h-4 w-4 shrink-0 translate-y-1 place-items-center rounded-full bg-honey/40 text-[10px] font-bold" aria-hidden>!</span><span className="sr-only">ระวัง: </span>{c}</li>)}
                </ul>
                <span className="mt-auto pt-3 text-sm font-semibold text-jade">ดูประวัติของ{a.name}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {animals.length > 0 && ranked.length === 0 && <p className="card card-quiet">ยังไม่มีตัวที่ตรงเงื่อนไข ลองเปิดตัวเลือกให้กว้างขึ้น หรือรอศูนย์ลงข้อมูลเพิ่ม</p>}
      <section className="card card-quiet text-sm">
        <h2 className="font-semibold">อยากรับเลี้ยงจากศูนย์จริงตอนนี้</h2>
        <p className="mt-1">(สำหรับหมา) ศูนย์ควบคุมสุนัขกรุงเทพมหานคร (ประเวศ) ดูน้องที่รอบ้านได้ที่เพจ Facebook &quot;BKK Adopter&quot; โทร 0 2328 7460, 0 2245 3311 (จ.–ศ. 08.30–16.30 น.)</p>
        <p className="mt-1 text-bark">ทุกตัวผ่านการตรวจสุขภาพ ฉีดวัคซีน และทำหมันแล้ว ผู้รับต้องได้รับความเห็นชอบจากครอบครัว มีที่เลี้ยงมีรั้วรอบ และพร้อมดูแลค่าใช้จ่าย</p>
      </section>
    </div>
  );
}
