import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { DogTuaDaeng } from '@/components/Pets';
import { CatFace, PawPrint, PeekCat, coatFor } from '@/components/Critters';
import { PhotoSlot } from '@/components/PhotoSlot';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HeroTrial } from '@/components/hero/HeroTrial';
import { getState } from '@/lib/data';
import { matchAnimal, type AnimalLite, type Prefs } from '@/lib/engine';
import demoTrial from '@/fixtures/demo-trial.json';

// Figures: docs/EVIDENCE.md #19 (RSPCA Queensland, checked in the paper text). Never add a figure without a source.
const RSPCA = 'https://doi.org/10.3390/ani12192568';

/** One reading column, shared by every band so full-bleed backgrounds can alternate. */
const WRAP = 'mx-auto w-full max-w-md px-5 md:max-w-3xl md:px-8 lg:max-w-6xl';

const NAV = [
  ['/learn/cat', 'คู่มือแมว'],
  ['/learn/care', 'ค่าใช้จ่าย'],
  ['/learn', 'งานวิจัย'],
] as const;

/**
 * The story beats. Each is one of the four Adoption Compatibility Gaps told as a day in
 * someone's life instead of a definition — same four gaps as docs/PRD.md, no new claims.
 */
const STORY = [
  {
    day: 'วันที่ 0',
    title: 'คุณเจอน้องในประกาศ',
    body: 'รูปน่ารักมาก ใต้รูปเขียนแค่ชื่อกับอายุ ไม่มีใครบอกว่าน้องกลัวเสียงดังไหม เคยอยู่กับแมวตัวอื่นได้หรือเปล่า หรือเคยป่วยอะไรมาก่อน',
    gap: 'ช่องว่างด้านข้อมูล',
    src: '/photos/shelter.jpg',
    alt: 'ลูกแมวสีดำมองออกมาจากซี่กรงที่ศูนย์พักพิง',
  },
  {
    day: 'วันที่ 1',
    title: 'พากลับบ้านแล้ว น้องหายไปใต้โซฟา',
    body: 'ไม่ออกมากินข้าว ไม่เข้าหาใคร บ้านยังไม่ได้เตรียมอะไรเลย ทรายแมวซื้อผิดแบบ และแมวตัวเดิมในบ้านก็ขู่ใส่',
    gap: 'ช่องว่างด้านความพร้อม',
    src: '/photos/hiding.jpg',
    alt: 'แมวสีส้มขาวแอบมองออกมาจากใต้โต๊ะ',
  },
  {
    day: 'วันที่ 3',
    title: 'ปกติไหม หรือต้องพาไปหาหมอ',
    body: 'ข้าวยังเหลือเกือบเต็มชาม ขับถ่ายไม่เป็นที่ คุณเปิดหาในกลุ่มเฟซบุ๊กตอนตีสอง แล้วได้คำตอบคนละทาง ไม่มีใครรู้จักน้องตัวนี้จริงๆ',
    gap: 'ช่องว่างด้านการปรับตัว',
    src: '/photos/bowl.jpg',
    alt: 'แมวขาวดำนั่งอยู่ข้างชามอาหารที่ยังไม่ได้กิน',
  },
  {
    day: 'วันที่ 14',
    title: 'ถึงวันที่ต้องตัดสินใจ',
    body: 'บางบ้านผ่านไปได้สวย บางบ้านไม่ไหวจริงๆ แล้วพาน้องกลับศูนย์พร้อมความรู้สึกผิด ทั้งที่ไม่มีใครผิด เพราะไม่เคยมีใครบอกล่วงหน้าว่าต้องเจออะไร',
    gap: 'ช่องว่างด้านการติดตาม',
    src: '/photos/settled.jpg',
    alt: 'ลูกแมวนอนสบายบนโซฟาข้างโคมไฟในบ้านที่ปรับตัวได้แล้ว',
  },
] as const;

const STEPS = [
  ['บอกว่าบ้านคุณเป็นยังไง', 'ตอบคำถามสั้นๆ เรื่องบ้าน เวลาว่าง ค่าใช้จ่ายที่ไหว อาการแพ้ และสัตว์เดิมในบ้าน'],
  ['ดูน้องที่เข้ากับบ้านคุณ', 'แต่ละตัวบอกเลยว่าเข้ากันตรงไหน ต้องระวังอะไร ถ้าคุณแพ้แมว ระบบจะไม่เสนอตัวนั้นให้เลย'],
  ['ทดลองเลี้ยง 14 วัน', 'ศูนย์อนุมัติก่อนเสมอ ระหว่างนั้นมีคำแนะนำรายวันว่าตอนนี้อะไรปกติ อะไรต้องรีบไปหาหมอ'],
  ['ตัดสินใจโดยมีข้อมูล', 'ดูบันทึก 14 วันของตัวเอง แล้วเลือกรับเป็นครอบครัว หรือคืนให้ศูนย์หาบ้านที่เหมาะกว่า'],
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
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-jade focus:px-4 focus:py-2 focus:text-cream">
        ข้ามไปเนื้อหาหลัก
      </a>

      <header className="sticky top-0 z-40 border-b border-bark/10 bg-cream/90 backdrop-blur">
        <div className={`${WRAP} flex items-center justify-between gap-6 py-3 md:py-4`}>
          <Logo className="text-lg" />
          <nav aria-label="ลิงก์หลัก" className="flex items-center gap-6 text-sm lg:gap-9">
            {NAV.map(([href, label]) => (
              <Link key={href} href={href} className="hidden min-h-11 items-center whitespace-nowrap text-bark hover:text-jade sm:flex">{label}</Link>
            ))}
            <ThemeToggle />
            <Link href={user ? '/home' : '/login'} className="btn btn-ghost whitespace-nowrap border-jade px-5 text-jade">{user ? 'เข้าแอป' : 'เข้าสู่ระบบ'}</Link>
          </nav>
        </div>
        <div className={`${WRAP} flex gap-2 overflow-x-auto pb-2 sm:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className="chip shrink-0 whitespace-nowrap px-4 py-1.5 text-sm">{label}</Link>
          ))}
        </div>
      </header>

      <div id="content">
        <HeroTrial ctaHref={cta.href} ctaText={cta.text} />
      </div>

      {/* ---- The story. Four days, four gaps, told instead of defined. ---- */}
      <div className="mt-16 bg-paper py-16 md:py-20">
        <div className={WRAP}>
          <h2 className="max-w-[20ch] text-2xl font-bold md:text-4xl">สองสัปดาห์แรก คือช่วงที่คนเลี้ยงถูกปล่อยให้เดาเอาเอง</h2>

          <div className="mt-12 space-y-16 md:space-y-24">
            {STORY.map((s, i) => (
              <article key={s.day} className="grid items-center gap-7 md:grid-cols-2 md:gap-12">
                <div className={`${i % 2 ? 'md:order-2' : ''}`}>
                  <PhotoSlot src={s.src} alt={s.alt} ratio="aspect-[4/3]" priority={i === 0} />
                </div>
                <div className={`${i % 2 ? 'md:order-1' : ''}`}>
                  <p className="num inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1 text-sm font-bold text-jade">{s.day}</p>
                  <h3 className="mt-3 text-xl font-bold md:text-2xl">{s.title}</h3>
                  <p className="mt-3 max-w-[48ch] text-bark">{s.body}</p>
                  <p className="mt-4 inline-block border-l-[3px] border-honey pl-3 text-sm font-semibold text-bark">{s.gap}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-[var(--radius-sheet)] bg-cream p-6 md:p-8">
            <h3 className="text-lg font-bold md:text-xl">สี่เรื่องนี้รวมกันเราเรียกว่า Adoption Compatibility Gap</h3>
            <p className="mt-2 max-w-[62ch] text-bark">ช่องว่างด้านข้อมูล ความพร้อม การปรับตัว และการติดตาม มักเกิดพร้อมกัน และเกิดในช่วงเวลาเดียวกันเสมอ</p>
          </div>
        </div>
      </div>

      <div className={WRAP}>
        {/* The number that explains why 14 days is the window we built around. */}
        <section className="peek-host relative mt-20">
          <PeekCat className="left-10" />
          <div className="relative grid gap-6 overflow-hidden rounded-[var(--radius-sheet)] bg-jade p-6 text-cream md:grid-cols-[auto_1fr] md:items-center md:p-9">
            <PawPrint className="absolute -right-6 -bottom-8 h-40 w-40 rotate-12 text-cream/10" />
            <p className="num text-6xl font-semibold leading-none md:text-8xl">64%</p>
            <div className="relative">
              <p className="text-lg font-semibold md:text-xl">ของการคืนสุนัขที่รับเลี้ยง เกิดใน 14 วันแรก</p>
              <p className="mt-2 text-sm opacity-95">552 จาก 865 ครั้งที่ถูกคืน จากการรับเลี้ยง 6,212 ครั้ง ของ RSPCA Queensland ปี 2019–2020 <a href={RSPCA} target="_blank" rel="noreferrer" className="underline">Thumpkin et al., 2022</a></p>
              <p className="mt-2 text-sm opacity-90">เป็นข้อมูลสุนัขในออสเตรเลีย ไม่ใช่ข้อมูลไทย และไม่ได้บอกผลของ Pawlune แต่ชี้ว่าช่วงแรกคือช่วงที่ต้องการความช่วยเหลือมากที่สุด ไทยยังไม่มีสถิติการคืนระดับประเทศ</p>
            </div>
          </div>
        </section>

        {/* ---- How it works: four steps, one line that fills as you read. ---- */}
        <section className="mt-24">
          <h2 className="text-2xl font-bold md:text-4xl">ใช้ยังไง · 4 ขั้น</h2>
          <p className="mt-2 max-w-[52ch] text-bark">ไม่มีอะไรให้ตั้งค่า ไม่มีปุ่มให้หา ทำตามลำดับนี้ทีละขั้น</p>

          <div className="relative mt-10">
            <span aria-hidden className="absolute left-[22px] top-2 hidden h-[calc(100%-1rem)] w-[3px] bg-bark/15 md:block" />
            <span aria-hidden className="track-fill-y absolute left-[22px] top-2 hidden h-[calc(100%-1rem)] w-[3px] bg-jade md:block" />
            <ol className="space-y-8">
              {STEPS.map(([t, d], i) => (
                <li key={t} className="flex gap-5">
                  <span className="relative grid h-12 w-12 shrink-0 place-items-center">
                    <PawPrint className="h-12 w-12 text-jade" />
                    <span className="num absolute top-[54%] text-base font-bold text-cream">{i + 1}</span>
                  </span>
                  <div className="pt-1">
                    <p className="text-lg font-bold">{t}</p>
                    <p className="mt-1 max-w-[52ch] text-bark">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Step 2, shown rather than described: the real rule engine on demo data. */}
          <figure className="peek-host relative mt-12">
            <PeekCat className="right-10" />
            <figcaption className="mb-3 text-sm font-semibold text-bark">ตัวอย่างที่คุณจะเห็นในขั้นที่ 2</figcaption>
            <div className="page relative rounded-[var(--radius-sheet)] border border-bark/20 p-5 shadow-[0_14px_30px_-18px_rgba(62,45,34,.5)] md:p-6">
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
              <p className="mt-4 border-t border-bark/15 pt-3 text-xs text-bark">เหตุผลพวกนี้มาจากกฎที่เปิดให้ดูทุกข้อ ไม่ใช่ AI · ข้อมูลน้องเป็นสิ่งที่ศูนย์รู้ ไม่ใช่การรับประกัน</p>
            </div>
          </figure>
        </section>
      </div>

      {/* ---- What AI does, and the much longer list of what it never touches. ---- */}
      <div className="mt-24 bg-paper py-16 md:py-20">
        <div className={WRAP}>
          <p className="inline-flex items-center gap-2 rounded-full bg-honey/25 px-3 py-1 text-sm font-semibold text-bark">กำลังพัฒนา · ยังไม่เปิดใช้</p>
          <h2 className="mt-3 max-w-[22ch] text-2xl font-bold md:text-4xl">AI ช่วยอ่านสรุป ไม่ได้ช่วยตัดสินใจแทนคุณ</h2>
          <p className="mt-3 max-w-[56ch] text-bark">สิ่งเดียวที่เราตั้งใจให้ AI ทำ คือเรียบเรียงตัวเลขที่แอปคำนวณไว้แล้วให้อ่านง่ายขึ้นสัปดาห์ละครั้ง</p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-[var(--radius-card)] bg-cream p-6">
              <h3 className="font-bold text-jade">สิ่งที่ AI ทำ</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex gap-2"><PawPrint className="mt-1 h-3.5 w-3.5 shrink-0 text-jade" />อ่านตัวเลขที่แอปคำนวณไว้แล้ว เช่น จำนวนวันที่บันทึก และคะแนนเฉลี่ย</li>
                <li className="flex gap-2"><PawPrint className="mt-1 h-3.5 w-3.5 shrink-0 text-jade" />เรียบเรียงเป็นภาษาไทยสั้นๆ ไม่เกิน 3 ประโยค</li>
                <li className="flex gap-2"><PawPrint className="mt-1 h-3.5 w-3.5 shrink-0 text-jade" />ถ้าเรียบเรียงออกมาแล้วมีตัวเลขที่ไม่ตรงกับของจริง ระบบจะทิ้งทั้งก้อนและไม่แสดงอะไรเลย</li>
              </ul>
            </div>
            <div className="rounded-[var(--radius-card)] border-[1.5px] border-dashed border-bark/30 p-6">
              <h3 className="font-bold">สิ่งที่ AI ไม่ได้แตะ</h3>
              <ul className="mt-3 space-y-2 text-sm text-bark">
                <li>การจับคู่น้องกับบ้านคุณ — ใช้กฎที่เปิดให้ดูทุกข้อ</li>
                <li>การคิดเลขทุกชนิด — ตัวเลขมาจากเครื่องคำนวณของแอปเท่านั้น</li>
                <li>บันทึกที่คุณพิมพ์ และข้อมูลเช็กอินรายวัน — ไม่เคยถูกส่งออกไป</li>
                <li>ปุ่มขอความช่วยเหลือ — ไม่มี AI อยู่ในนั้นเลย</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={WRAP}>
        <section className="mt-20 grid gap-8 md:grid-cols-2">
          <div >
            <h2 className="text-xl font-bold">สิ่งที่เราไม่สัญญา</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-bark">
              <li>14 วันไม่ได้รับประกันว่าจะเข้ากันได้</li>
              <li>สัตว์เลี้ยงไม่ใช่บริการด้านสุขภาพจิต งานวิจัยยังได้ผลหลายทาง</li>
              <li>เรายังไม่มีข้อมูลนำร่องว่าลดการคืนได้เท่าไร</li>
            </ul>
          </div>
          <div >
            <h2 className="text-xl font-bold">ข้อมูลของคุณเป็นของคุณ</h2>
            <p className="mt-3 text-bark">ศูนย์เห็นเฉพาะความพร้อม ข้อตกลง และสิ่งที่คุณแจ้งเรื่องน้อง ไม่เห็นบันทึกอารมณ์หรือคะแนนสุขภาวะทางใจ ลบข้อมูลทั้งหมดได้ในปุ่มเดียว</p>
          </div>
        </section>

        <section className="relative mt-20 overflow-hidden rounded-[var(--radius-sheet)] bg-sage/40 p-8 text-center md:p-12">
          <PawPrint className="absolute -left-8 -top-8 h-32 w-32 -rotate-12 text-jade/10" />
          <h2 className="relative text-2xl font-bold md:text-3xl">เริ่มจากเช็กความพร้อมก่อนก็ได้</h2>
          <p className="relative mx-auto mt-3 max-w-[44ch] text-bark">ไม่ต้องตัดสินใจรับเลี้ยงวันนี้ ใช้เวลาไม่กี่นาทีเพื่อดูว่าบ้านคุณพร้อมแค่ไหน และยังขาดอะไร</p>
          <div className="relative mt-7">
            <Link href={cta.href} className="btn btn-primary px-8 text-lg">{cta.text}</Link>
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
