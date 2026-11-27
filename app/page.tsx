import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { DogTuaDaeng } from '@/components/Pets';
import { Mascot } from '@/components/Mascot';
import { CatFace, PawPrint, PeekCat, coatFor } from '@/components/Critters';
import { PawPath } from '@/components/PawPath';
import { getState } from '@/lib/data';
import { matchAnimal, type AnimalLite, type Prefs } from '@/lib/engine';
import demoTrial from '@/fixtures/demo-trial.json';

// Figures: docs/EVIDENCE.md #19 (RSPCA Queensland, checked in the paper text). Never add a figure without a source.
const RSPCA = 'https://doi.org/10.3390/ani12192568';

const GapIcon = ({ k }: { k: number }) => (
  <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden fill="none" stroke="#4E6E58" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {k === 0 && <><circle cx="21" cy="21" r="11" fill="#E4EEDF" /><path d="m30 30 9 9" /><path d="M17 23c1-3 7-3 8 0M18 18h.1M24 18h.1" /></>}
    {k === 1 && <><path d="M8 24 24 10l16 14" /><path d="M13 21v17h22V21" fill="#E4EEDF" /><path d="M21 38v-8h6v8" /></>}
    {k === 2 && <><path d="M8 22h32v16H8Z" fill="#F3E3C7" /><path d="M8 22l5-7h22l5 7" /><path d="M18 22l-2-6 5 3M30 22l2-6-5 3" /><path d="M20 27h.1M28 27h.1" /></>}
    {k === 3 && <><rect x="9" y="12" width="30" height="27" rx="4" fill="#E4EEDF" /><path d="M9 20h30M17 8v7M31 8v7" /><path d="M24 34s-6-3.6-6-7.2c0-2 1.5-3.3 3.1-3.3 1.2 0 2.1.7 2.9 1.8.8-1.1 1.7-1.8 2.9-1.8 1.6 0 3.1 1.3 3.1 3.3 0 3.6-6 7.2-6 7.2Z" fill="#E39B8A" stroke="none" /></>}
  </svg>
);

const GAPS = [
  ['ข้อมูล', 'คนรับเลี้ยงรู้นิสัยและประวัติสุขภาพของน้องไม่พอ ก่อนพาน้องกลับบ้าน'],
  ['ความพร้อม', 'บ้าน เวลา ค่าใช้จ่าย อาการแพ้ และสัตว์เดิมในบ้าน ไม่ได้ถูกเช็กก่อน'],
  ['การปรับตัว', 'ช่วงแรกน้องซ่อนตัว ไม่กิน หรือไม่เข้ากับสัตว์เดิม คนเลี้ยงไม่รู้ว่าอะไรปกติ อะไรต้องรีบไปหาหมอ'],
  ['การติดตาม', 'หลังรับไปแล้ว ศูนย์แทบไม่รู้ว่าน้องเป็นยังไง จนวันที่น้องถูกพากลับมา'],
] as const;

const STEPS = [
  ['ค้นหาและจับคู่', 'เช็กความพร้อมของบ้าน แล้วจับคู่กับแมวจากศูนย์ด้วยกฎที่เปิดให้ดูทุกข้อ ไม่ใช่ AI'],
  ['ทดลองเลี้ยง 14 วัน', 'ศูนย์อนุมัติก่อน มีข้อตกลงเรื่องค่าใช้จ่าย เหตุฉุกเฉิน และการคืน พร้อมคำแนะนำรายวัน'],
  ['ทบทวนและตัดสินใจ', 'ดูบันทึกของตัวเอง แล้วเลือกรับเป็นครอบครัว หรือคืนให้ศูนย์หาบ้านที่เหมาะกว่า'],
  ['ติดตามต่อ', 'ส่งความเป็นอยู่ของน้องให้ศูนย์ทุก 30 วัน และขอความช่วยเหลือได้ทุกเมื่อ'],
] as const;

export default async function Landing() {
  const { user } = await getState();
  // Hero sample: the real rule engine run on the labelled demo fixture (never hand-typed reasons).
  const cat = demoTrial.animals.find((a) => a.name === 'มะตูม')!;
  const prefs = { ...demoTrial.prefs, species: ['cat'], existing_pets: ['cat'] } as Prefs;
  const m = matchAnimal(prefs, cat as AnimalLite);
  const cta = user ? { href: '/home', text: 'ไปที่สมุดของฉัน' } : { href: '/login', text: 'เริ่มเช็กความพร้อม' };

  return (
    <main className="overflow-x-clip">
      <div className="mx-auto max-w-md px-5 md:max-w-3xl md:px-8 lg:max-w-6xl">
      <header className="flex items-center justify-between py-5">
        <Logo className="text-lg" />
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/learn/cat" className="hidden min-h-11 items-center px-3 text-bark hover:text-jade sm:flex">คู่มือแมว</Link>
          <Link href="/learn/dog" className="hidden min-h-11 items-center px-3 text-bark hover:text-jade md:flex">คู่มือหมา</Link>
          <Link href="/learn/care" className="hidden min-h-11 items-center px-3 text-bark hover:text-jade sm:flex">ค่าใช้จ่าย</Link>
          <Link href={user ? '/home' : '/login'} className="btn btn-ghost border-jade text-jade">{user ? 'เข้าแอป' : 'เข้าสู่ระบบ'}</Link>
        </nav>
      </header>

      <section className="grid items-center gap-6 pt-2 lg:grid-cols-[1.05fr_1fr] lg:pt-8">
        <div className="order-2 lg:order-1">
          <p className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1 font-[family-name:var(--font-num)] text-sm font-semibold text-jade"><PawPrint className="h-4 w-4" />More Than Adoption. A Better Bond.</p>
          <h1 className="mt-4 text-[2.2rem] font-bold leading-[1.15] md:text-[3.2rem]">ไม่ใช่แค่รับเลี้ยง<br />แต่<span className="relative whitespace-nowrap">อยู่ด้วยกันได้จริง<svg viewBox="0 0 300 16" className="absolute -bottom-2 left-0 h-3 w-full" preserveAspectRatio="none" aria-hidden><path d="M3 10c50-8 100-8 150-3s100 4 144-4" stroke="#C99A5B" strokeWidth="5" fill="none" strokeLinecap="round" /></svg></span></h1>
          <p className="mt-5 max-w-[46ch] text-bark md:text-lg">เช็กความพร้อมก่อนรับ ทดลองเลี้ยง 14 วันภายใต้การดูแลของศูนย์ แล้วตัดสินใจอย่างมีข้อมูล เพื่อทั้งคนและน้อง</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link href={cta.href} className="btn btn-primary px-7 text-lg">{cta.text}</Link>
            <Link href="/learn/cat" className="font-semibold text-jade underline decoration-2 underline-offset-4">14 วันแรกกับแมว</Link>
          </div>
          <p className="mt-5 text-sm text-bark">ช่วงนำร่อง: แมว ในกรุงเทพฯ และปริมณฑล ร่วมกับศูนย์หรือเครือข่ายบ้านพักชั่วคราว</p>
        </div>

        {/* Hero scene: มะขาม by the window. Tap her. */}
        <div className="relative order-1 mx-auto aspect-square w-full max-w-[400px] lg:order-2 lg:max-w-[460px]">
          <div className="blob absolute inset-[4%] bg-sage/45" />
          <div className="absolute left-[12%] top-[6%] h-[46%] w-[40%] overflow-hidden rounded-t-full border-[7px] border-paper bg-[#DCE8EE]">
            <div className="absolute right-[18%] top-[22%] h-[26%] w-[34%] rounded-full bg-honey/80" />
            <div className="absolute inset-x-0 top-1/2 h-[6px] bg-paper" /><div className="absolute inset-y-0 left-1/2 w-[6px] -translate-x-1/2 bg-paper" />
          </div>
          <div className="absolute bottom-[7%] left-1/2 h-[14%] w-[64%] -translate-x-1/2 rounded-[50%] bg-honey/55" />
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2"><Mascot className="h-[min(62vw,280px)] w-[min(62vw,280px)]" /></div>
          <svg viewBox="0 0 40 40" className="absolute bottom-[9%] left-[6%] h-12 w-12" style={{ animation: 'roll 6s ease-in-out infinite' }} aria-hidden>
            <circle cx="20" cy="20" r="16" fill="#E39B8A" /><path d="M8 12c10 4 18 14 22 24M6 22c10 0 18 6 20 14M14 6c4 10 14 16 24 16" stroke="#C97A6A" strokeWidth="2" fill="none" />
          </svg>
          <PawPrint className="absolute right-[8%] top-[14%] h-7 w-7 text-jade/40" />
          <PawPrint className="absolute right-[18%] top-[30%] h-5 w-5 rotate-12 text-jade/30" />
          <span className="absolute right-[4%] top-[44%] rounded-full bg-paper px-3 py-1 text-xs text-bark shadow-sm" style={{ animation: 'drift 5s ease-in-out infinite' }}>แตะมะขามดูสิ</span>
        </div>
      </section>

      <section className="mt-16 grid items-center gap-8 lg:mt-20 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="text-xl font-bold md:text-2xl">จับคู่ด้วยเหตุผลที่อ่านได้</h2>
          <p className="mt-2 max-w-[48ch] text-bark">ทุกตัวมีเหตุผลว่าเข้ากับบ้านคุณตรงไหน และต้องระวังอะไร ใช้กฎที่เปิดให้ดูทุกข้อ ไม่ใช่ AI ถ้ามีเรื่องที่ไม่ปลอดภัย เช่น คุณแพ้แมว ระบบจะซ่อนตัวนั้นให้เลย</p>
        </div>
        <figure className="peek-host relative mt-8 lg:mt-0">
          <PeekCat className="right-10" />
          <div className="page relative rounded-[var(--radius-sheet)] border border-bark/20 p-5 shadow-[0_14px_30px_-18px_rgba(62,45,34,.5)]">
            <div className="flex items-center gap-4">
              <CatFace coat={coatFor(cat.name, 'cat')} className="h-16 w-16 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2"><p className="text-xl font-bold">{cat.name}</p><p className="text-xs text-bark">ตัวอย่างจากข้อมูลจำลอง</p></div>
                <p className="text-sm text-bark">แมวโต · ตรวจ FIV/FeLV แล้ว · ขี้อ้อน</p>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5 text-sm">
              {m.fits.map((f) => <li key={f} className="flex items-start gap-2"><PawPrint className="mt-1 h-3.5 w-3.5 shrink-0 text-jade" />{f}</li>)}
              {m.cautions.map((c) => <li key={c} className="flex items-start gap-2 text-bark"><span className="grid h-4 w-4 shrink-0 translate-y-1 place-items-center rounded-full bg-honey/40 text-[10px] font-bold" aria-hidden>!</span>{c}</li>)}
            </ul>
            <p className="mt-4 border-t border-bark/15 pt-3 text-xs text-bark">ข้อมูลน้องเป็นสิ่งที่ศูนย์รู้ ไม่ใช่การรับประกัน</p>
          </div>
        </figure>
      </section>

      <section className="mt-20">
        <h2 className="text-xl font-bold md:text-2xl">ช่องว่างระหว่าง &quot;อยากรับ&quot; กับ &quot;อยู่ด้วยกันได้&quot;</h2>
        <p className="mt-2 max-w-[60ch] text-bark">เราเรียกปัญหานี้ว่า Adoption Compatibility Gap เกิดจาก 4 ช่องว่างที่มักเกิดพร้อมกัน</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GAPS.map(([t, d], i) => (
            <div key={t} className="lift rounded-[var(--radius-card)] bg-paper p-5">
              <GapIcon k={i} />
              <dt className="mt-2 font-bold text-jade">ช่องว่างด้าน{t}</dt>
              <dd className="mt-1 text-sm">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="peek-host relative mt-20">
        <PeekCat className="left-10" />
        <div className="relative grid gap-6 overflow-hidden rounded-[var(--radius-sheet)] bg-jade p-6 text-cream md:grid-cols-[auto_1fr] md:items-center md:p-8">
          <PawPrint className="absolute -right-6 -bottom-8 h-40 w-40 rotate-12 text-cream/10" />
          <p className="num text-6xl font-semibold leading-none md:text-7xl">64%</p>
          <div className="relative">
            <p className="text-lg font-semibold">ของการคืนสุนัขที่รับเลี้ยง เกิดใน 14 วันแรก</p>
            <p className="mt-1 text-sm opacity-95">552 จาก 865 ครั้งที่ถูกคืน จากการรับเลี้ยง 6,212 ครั้ง ของ RSPCA Queensland ปี 2019–2020 <a href={RSPCA} target="_blank" rel="noreferrer" className="underline">Thumpkin et al., 2022</a></p>
            <p className="mt-2 text-sm opacity-90">เป็นข้อมูลสุนัขในออสเตรเลีย ไม่ใช่ข้อมูลไทย และไม่ได้บอกผลของ Pawlune แต่ชี้ว่าช่วงแรกคือช่วงที่ต้องการความช่วยเหลือมากที่สุด ไทยยังไม่มีสถิติการคืนระดับประเทศ</p>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-xl font-bold md:text-2xl">14 วัน เดินไปด้วยกันทีละก้าว</h2>
        <p className="mt-2 max-w-[60ch] text-bark">ทุกวันมีคำแนะนำว่าตอนนี้อะไรปกติ อะไรต้องระวัง และแจ้งศูนย์ได้ทุกเมื่อ</p>
        <div className="mt-4 rounded-[var(--radius-sheet)] bg-paper p-4 md:p-6"><PawPath day={9} label="ตัวอย่างทางเดิน 14 วัน" /></div>
        <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="flex gap-4 lg:flex-col lg:gap-3">
              <span className="relative grid h-11 w-11 shrink-0 place-items-center text-jade"><PawPrint className="h-11 w-11" /><span className="num absolute top-[52%] text-sm font-bold text-cream">{i + 1}</span></span>
              <div><p className="font-semibold">{t}</p><p className="text-sm text-bark">{d}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20 grid gap-4 md:grid-cols-3">
        {[
          ['สุขภาวะของคน', 'บันทึกวันละ 10 วินาทีและแบบวัด WHO-5 กับ ST-5 ไว้สังเกตตัวเอง ไม่ใช่เครื่องมือวินิจฉัย'],
          ['สวัสดิภาพของสัตว์', 'ศูนย์อนุมัติก่อน เปิดเผยประวัติที่รู้ มีแผนคืนที่ปลอดภัย และไม่บังคับให้ทดลองต่อเมื่อคนหรือน้องไม่ปลอดภัย'],
          ['การเลี้ยงอย่างรับผิดชอบ', 'รู้ค่าใช้จ่ายจริง เตรียมบ้านให้แมวในบ้าน และรู้ว่าอาการไหนต้องพาไปหาหมอทันที'],
        ].map(([t, d]) => (
          <div key={t} className="rounded-[var(--radius-card)] border-[1.5px] border-dashed border-bark/30 p-5">
            <h3 className="font-bold">{t}</h3>
            <p className="mt-1 text-sm text-bark">{d}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">สิ่งที่เราไม่สัญญา</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-bark">
            <li>14 วันไม่ได้รับประกันว่าจะเข้ากันได้</li>
            <li>สัตว์เลี้ยงไม่ใช่บริการด้านสุขภาพจิต งานวิจัยยังได้ผลหลายทาง</li>
            <li>เรายังไม่มีข้อมูลนำร่องว่าลดการคืนได้เท่าไร</li>
          </ul>
          <Link href="/learn" className="mt-2 inline-block font-semibold text-jade underline underline-offset-4">งานวิจัยพูดว่าอะไร</Link>
        </div>
        <div>
          <h2 className="text-xl font-bold">ข้อมูลของคุณเป็นของคุณ</h2>
          <p className="mt-2 text-bark">ศูนย์เห็นเฉพาะความพร้อม ข้อตกลง และสิ่งที่คุณแจ้งเรื่องน้อง ไม่เห็นบันทึกอารมณ์หรือคะแนนสุขภาพใจ ลบข้อมูลทั้งหมดได้ในปุ่มเดียว</p>
        </div>
      </section>
      </div>

      {/* Footer: the two friends sit on the edge */}
      <footer className="relative mt-24 bg-paper">
        <div className="pointer-events-none absolute -top-[70px] left-1/2 flex -translate-x-1/2 items-end gap-2" aria-hidden>
          <DogTuaDaeng className="h-20 w-20" />
          <CatFace coat={coatFor('มะขาม', 'cat')} className="h-16 w-16" />
        </div>
        <div className="mx-auto max-w-md px-5 py-10 text-center text-sm text-bark md:max-w-3xl">
          <p>ถ้ารู้สึกหนักใจ โทรสายด่วนสุขภาพจิต <a href="tel:1323" className="num font-semibold text-jade underline">1323</a></p>
          <p className="mt-1">Pawlune ไม่ใช่บริการทางการแพทย์หรือสัตวแพทย์ · สำหรับผู้ที่อายุ 20 ปีขึ้นไป</p>
        </div>
      </footer>
    </main>
  );
}
