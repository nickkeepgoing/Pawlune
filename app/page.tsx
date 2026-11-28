import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Logo } from '@/components/Logo';
import { DogTuaDaeng } from '@/components/Pets';
import { CatFace, PawPrint, PeekCat, coatFor } from '@/components/Critters';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HeroTrial } from '@/components/hero/HeroTrial';
import { PhoneCheckin } from '@/components/landing/PhoneFrame';
import { MatchSceneMount } from '@/components/landing/MatchSceneMount';
import { getState } from '@/lib/data';
import { matchAnimal, type AnimalLite, type Prefs } from '@/lib/engine';
import demoTrial from '@/fixtures/demo-trial.json';

// Figures: docs/EVIDENCE.md #19 (RSPCA Queensland, checked in the paper text). Never add a figure without a source.
const RSPCA = 'https://doi.org/10.3390/ani12192568';

export const metadata: Metadata = {
  title: 'Pawlune — ทดลองรับเลี้ยง 14 วัน ก่อนตัดสินใจรับเป็นครอบครัว',
  description:
    'Pawlune ช่วยให้คนที่อยากรับเลี้ยงสัตว์เช็กความพร้อมของตัวเอง เจอน้องที่เข้ากับชีวิตจริง และทดลองเลี้ยง 14 วันภายใต้การดูแลของศูนย์ ก่อนตัดสินใจอย่างมีข้อมูล',
  openGraph: {
    title: 'Pawlune — More Than Adoption. A Better Bond.',
    description: 'เช็กความพร้อม เจอน้องที่เข้ากัน ทดลองเลี้ยง 14 วัน แล้วค่อยตัดสินใจ',
    type: 'website',
  },
};

/** One reading column, shared by every band so full-bleed backgrounds can alternate. */
const WRAP = 'mx-auto w-full max-w-md px-5 md:max-w-3xl md:px-8 lg:max-w-6xl';

const NAV = [
  ['#problem', 'ปัญหา'],
  ['#how', 'วิธีใช้'],
  ['#matching', 'การจับคู่'],
  ['#shelters', 'สำหรับศูนย์'],
] as const;

/** The adoption compatibility gap, told as three things that actually happen. */
const PROBLEMS = [
  {
    n: '01',
    title: 'สิ่งที่คิดไว้ กับสิ่งที่เจอจริง',
    body: 'ค่าใช้จ่าย เวลา และการเปลี่ยนวิถีชีวิต มักมากกว่าที่คิดไว้ตอนเห็นรูปน่ารักในประกาศ',
    photo: '/photos/shelter.jpg',
    alt: 'ลูกแมวมองออกมาจากกรงที่ศูนย์พักพิง',
  },
  {
    n: '02',
    title: 'หาน้องที่เข้ากับชีวิตเราจริงๆ',
    body: 'แต่ละตัวมีนิสัย พลังงาน และความต้องการต่างกัน ประกาศหาบ้านส่วนใหญ่บอกแค่ชื่อกับอายุ',
    photo: '/photos/bowl.jpg',
    alt: 'แมวนั่งอยู่ข้างชามอาหารที่ยังไม่ได้กิน',
  },
  {
    n: '03',
    title: 'ช่วงปรับตัวที่ไม่มีใครเตือน',
    body: 'ทั้งคนและน้องต้องใช้เวลา ช่วงแรกน้องอาจซ่อนตัวหรือไม่กินข้าว โดยไม่มีใครบอกว่าอะไรปกติ',
    photo: '/photos/hiding.jpg',
    alt: 'แมวแอบอยู่ใต้โต๊ะในบ้านใหม่',
  },
] as const;

/** The four stages, named the way the app actually works. */
const STAGES = [
  ['01', 'เช็กความพร้อมและจับคู่', 'ตอบคำถามเรื่องบ้าน เวลา ค่าใช้จ่าย และอาการแพ้ แล้วดูน้องที่เข้ากับคุณพร้อมเหตุผลทุกข้อ'],
  ['02', 'ทดลองเลี้ยง 14 วัน', 'ศูนย์อนุมัติก่อนเสมอ ระหว่างนั้นมีคำแนะนำรายวันและช่องทางแจ้งศูนย์เมื่อมีปัญหา'],
  ['03', 'ทบทวนแล้วตัดสินใจ', 'ดูบันทึกของตัวเองตลอด 14 วัน แล้วเลือกรับเป็นครอบครัว คืนให้ศูนย์ หรือขอคุยกับศูนย์ก่อน'],
  ['04', 'ติดตามต่อ', 'ถ้ารับเป็นครอบครัว ส่งความเป็นอยู่ของน้องให้ศูนย์เป็นระยะ และขอความช่วยเหลือได้เสมอ'],
] as const;

/** Each screen below exists in the app today; nothing here is a mock-up of a plan. */
const SCREENS = [
  ['ค้นหาและดูรายละเอียดน้อง', 'รายชื่อน้องจากศูนย์ พร้อมชนิด เพศ ช่วงวัย ศูนย์ที่ดูแล และเหตุผลว่าเข้ากับบ้านคุณตรงไหน'],
  ['ผลการจับคู่ที่อ่านได้', 'ทุกข้อบอกที่มา ถ้ามีเรื่องความปลอดภัย เช่น คุณแพ้แมว ระบบจะไม่เสนอตัวนั้นเลย'],
  ['บันทึกรายวันสิบวินาที', 'เลือกอารมณ์ กิจกรรมที่ทำกับน้อง และภาระที่เจอ จดโน้ตเพิ่มได้ถ้าอยากจด'],
  ['สรุปก่อนตัดสินใจวันที่ 14', 'เทียบแบบวัดก่อนและหลัง ดูบันทึกทั้งช่วง แล้วเลือกสิ่งที่จะทำต่อ'],
] as const;

/** What the rule engine actually looks at. Mirrors lib/engine/match.ts. */
const RULES = [
  'ชนิดสัตว์และอาการแพ้ของคนในบ้าน',
  'สัตว์เดิมที่อยู่ในบ้านแล้ว',
  'ที่อยู่อาศัย และการเลี้ยงในบ้าน',
  'เวลาที่น้องต้องอยู่ลำพังต่อวัน',
  'ขนาด ช่วงวัย พลังงาน และนิสัยที่คุณมองหา',
  'ความพร้อมเรื่องค่าใช้จ่ายและความเห็นของคนในบ้าน',
] as const;

export default async function Landing() {
  const { user } = await getState();
  // Hero sample: the real rule engine run on the labelled demo fixture (never hand-typed reasons).
  const cat = demoTrial.animals.find((a) => a.name === 'มะตูม')!;
  const prefs = { ...demoTrial.prefs, species: ['cat'], existing_pets: ['cat'] } as Prefs;
  const m = matchAnimal(prefs, cat as AnimalLite);
  const cta = user ? { href: '/home', text: 'ไปที่สมุดของฉัน' } : { href: '/login', text: 'หาเพื่อนที่ใช่' };

  const matchCard = (
    <div className="card relative bg-paper p-5 text-cocoa shadow-[0_18px_40px_-24px_var(--c-shadow)] md:p-6">
      <div className="flex items-center gap-4">
        <CatFace coat={coatFor(cat.name, 'cat')} className="h-16 w-16 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-2">
            <p className="text-xl font-bold">{cat.name}</p>
            <p className="text-xs text-bark">ตัวอย่างจากข้อมูลจำลอง</p>
          </div>
          <p className="text-sm text-bark">แมวโต ตรวจ FIV/FeLV แล้ว ขี้อ้อน</p>
        </div>
      </div>
      <ul className="mt-4 space-y-1.5 text-sm">
        {m.fits.map((f) => (
          <li key={f} className="flex items-start gap-2"><PawPrint className="mt-1 h-3.5 w-3.5 shrink-0 text-jade" />{f}</li>
        ))}
        {m.cautions.map((c) => (
          <li key={c} className="flex items-start gap-2 text-bark">
            <span className="grid h-4 w-4 shrink-0 translate-y-1 place-items-center rounded-full bg-honey/40 text-[10px] font-bold" aria-hidden>!</span>{c}
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-bark/15 pt-3 text-xs text-bark">
        เหตุผลทั้งหมดมาจากกฎที่เปิดให้ดู ไม่ใช่ AI และข้อมูลน้องเป็นสิ่งที่ศูนย์รู้ ไม่ใช่การรับประกัน
      </p>
    </div>
  );

  return (
    <main className="overflow-x-clip">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-jade focus:px-4 focus:py-2 focus:text-cream">
        ข้ามไปเนื้อหาหลัก
      </a>

      <header className="sticky top-0 z-40 border-b border-bark/10 bg-cream/90 backdrop-blur">
        <div className={`${WRAP} flex items-center justify-between gap-6 py-3 md:py-4`}>
          <Logo className="text-lg" />
          <nav aria-label="ลิงก์หลัก" className="flex items-center gap-6 text-sm lg:gap-8">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="hidden min-h-11 items-center whitespace-nowrap text-bark hover:text-jade lg:flex">{label}</a>
            ))}
            <ThemeToggle />
            <Link href={user ? '/home' : '/login'} className="btn btn-ghost whitespace-nowrap border-jade px-5 text-jade">{user ? 'เข้าแอป' : 'เข้าสู่ระบบ'}</Link>
          </nav>
        </div>
      </header>

      {/* ---- 1. Hero ----
          One deep panel holding everything, with the product pieces layered over the
          photograph at different depths. A flat row of blocks on the page background
          read as a document; the product should look like something you can pick up. */}
      <section id="content" className={`${WRAP} pb-8 pt-4 md:pt-6`}>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sage/50 via-paper to-honey/25 px-6 py-12 text-cocoa ring-1 ring-inset ring-bark/10 md:px-10 md:py-16 lg:px-14">
          {/* Warm light from the top right, the same light the 3D scene uses. */}
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-honey/35 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 h-[22rem] w-[22rem] rounded-full bg-jade/15 blur-3xl" />
          <PawPrint aria-hidden className="pointer-events-none absolute -bottom-10 -left-8 h-48 w-48 rotate-12 text-jade/10" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.12fr_1fr]">
            <div>
              <p className="font-[family-name:var(--font-num)] text-sm font-semibold text-jade">More Than Adoption. A Better Bond.</p>
              <h1 className="mt-4 text-[2.2rem] font-bold leading-[1.14] md:text-[2.7rem] lg:text-[2.9rem]">
                หาน้องไม่ยาก<br />หาคู่ที่ใช่ยากกว่า
              </h1>
              <p className="mt-6 max-w-[50ch] text-bark md:text-lg">
                Pawlune ช่วยให้คุณเจอน้องที่เข้ากับชีวิตจริงของคุณ ทดลองเลี้ยง 14 วันภายใต้การดูแลของศูนย์
                แล้วค่อยตัดสินใจรับเป็นครอบครัวโดยมีข้อมูลของตัวเองอยู่ในมือ
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link
                  href={cta.href}
                  className="btn btn-primary px-8 text-lg"
                >
                  {cta.text}
                </Link>
                <a href="#how" className="font-semibold text-jade underline decoration-2 underline-offset-4">ดูว่าทำงานยังไง</a>
              </div>

              {/* Three promises as pills inside the panel, so the panel carries proof too. */}
              <ul className="mt-9 flex flex-wrap gap-2 text-sm">
                {['ศูนย์อนุมัติก่อนเสมอ', 'จับคู่ด้วยกฎที่เปิดให้ดู', 'บันทึกใจเป็นของคุณคนเดียว'].map((t) => (
                  <li key={t} className="rounded-full border border-jade/25 bg-paper/70 px-3.5 py-1.5 text-bark shadow-[0_2px_8px_-4px_var(--c-shadow)]">{t}</li>
                ))}
              </ul>
            </div>

            {/* Photograph, match result and phone, stacked at three depths. */}
            <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] shadow-[0_26px_50px_-22px_var(--c-shadow)] ring-1 ring-bark/10">
                <Image src="/photos/settled.jpg" alt="ลูกแมวนอนสบายบนโซฟาในบ้านที่ปรับตัวได้แล้ว" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              </div>

              <div className="relative z-10 mx-auto -mt-20 w-[94%] lg:-ml-10 lg:w-[88%]">{matchCard}</div>

              <div className="pointer-events-none absolute right-0 top-2 z-20 hidden origin-top-right scale-[.58] xl:block">
                <PhoneCheckin />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 2. The problem ---- */}
      <div id="problem" className="scroll-mt-20 bg-paper py-16 md:py-20">
        <div className={WRAP}>
          <h2 className="max-w-[22ch] text-2xl font-bold md:text-4xl">รักคือจุดเริ่มต้น ความพร้อมคือสิ่งที่ทำให้อยู่ด้วยกันได้</h2>
          <p className="mt-3 max-w-[60ch] text-bark">
            คนจำนวนมากอยากรับเลี้ยงสัตว์ แต่ &quot;อยากเลี้ยง&quot; กับ &quot;พร้อมเลี้ยง&quot; เป็นคนละเรื่องกัน
            ช่องว่างนี้มักเกิดขึ้นพร้อมกันสามทาง
          </p>

          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {PROBLEMS.map((p) => (
              <li key={p.n} className="flex flex-col">
                <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-card)]">
                  <Image src={p.photo} alt={p.alt} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
                </div>
                <p className="num mt-4 text-sm font-semibold text-honey">{p.n}</p>
                <h3 className="mt-1 text-lg font-bold">{p.title}</h3>
                <p className="mt-1 text-sm text-bark">{p.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-6 overflow-hidden rounded-[var(--radius-sheet)] bg-jade p-6 text-cream md:grid-cols-[auto_1fr] md:items-center md:p-9">
            <p className="num text-6xl font-semibold leading-none md:text-8xl">64%</p>
            <div>
              <p className="text-lg font-semibold md:text-xl">ของการคืนสุนัขที่รับเลี้ยง เกิดใน 14 วันแรก</p>
              <p className="mt-2 text-sm opacity-95">
                552 จาก 865 ครั้งที่ถูกคืน จากการรับเลี้ยง 6,212 ครั้ง ของ RSPCA Queensland ปี 2019–2020{' '}
                <a href={RSPCA} target="_blank" rel="noreferrer" className="underline">Thumpkin et al., 2022</a>
              </p>
              <p className="mt-2 text-sm opacity-90">
                เป็นข้อมูลสุนัขในออสเตรเลีย ไม่ใช่สถิติของไทย และไม่ได้บอกผลของ Pawlune
                แต่ชี้ว่าช่วงแรกคือช่วงที่ต้องการความช่วยเหลือมากที่สุด ไทยยังไม่มีสถิติการคืนระดับประเทศ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- 3. The solution: four stages ---- */}
      <section id="how" className={`${WRAP} scroll-mt-20 py-16 md:py-20`}>
        <h2 className="text-2xl font-bold md:text-4xl">วิธีรับเลี้ยงที่คิดมาแล้ว</h2>
        <p className="mt-3 max-w-[56ch] text-bark">สี่ขั้น ไล่จากการรู้จักตัวเองก่อน ไปจนถึงหลังรับน้องกลับบ้าน</p>

        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STAGES.map(([n, title, body], i) => (
            <li key={n} className="relative">
              {/* The connector only means something where the stages sit in a row. */}
              {i < STAGES.length - 1 && <span aria-hidden className="absolute left-12 right-0 top-5 hidden h-[2px] bg-bark/15 lg:block" />}
              <span className="num relative grid h-10 w-10 place-items-center rounded-full bg-jade text-sm font-bold text-cream">{n}</span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-bark">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---- 4. Experience the product ---- */}
      <div className="bg-paper py-16 md:py-20">
        <div className={WRAP}>
          <h2 className="text-2xl font-bold md:text-4xl">ลองเล่นดูว่า 14 วันเป็นยังไง</h2>
          <p className="mt-3 max-w-[58ch] text-bark">
            ลากดูได้เลย รูป ข้อความ และแสงจะเปลี่ยนตามวันที่คุณเลือก ทั้งหมดนี้คือหน้าจอที่มีอยู่จริงในแอป ไม่ใช่ภาพจำลองของสิ่งที่ยังไม่ได้ทำ
          </p>
        </div>

        <div className="mt-10">
          <HeroTrial ctaHref={cta.href} ctaText={cta.text} />
        </div>

        <div className={`${WRAP} mt-10`}>
          <ul className="grid gap-4 md:grid-cols-2">
            {SCREENS.map(([title, body]) => (
              <li key={title} className="card card-quiet">
                <h3 className="font-bold">{title}</h3>
                <p className="mt-1 text-sm text-bark">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---- 5. How matching works ----
          Two rings of shapes turning around one centre, behind the explanation of
          what the rules weigh: the household and the animals, drifting until a pair
          lines up. */}
      <section id="matching" className="relative scroll-mt-20 overflow-hidden py-16 md:py-20">
        <MatchSceneMount className="absolute inset-x-0 top-0 -z-10 h-full opacity-70" />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-cream via-cream/60 to-cream" />

        <div className={`${WRAP} grid gap-10 lg:grid-cols-2 lg:items-start`}>
          <div>
            <h2 className="text-2xl font-bold md:text-4xl">ความเข้ากันไม่ใช่แค่ตัวเลข</h2>
            <p className="mt-3 max-w-[52ch] text-bark">
              Pawlune ใช้กฎที่เขียนไว้ชัดเจนและเปิดให้ดูได้ ไม่ใช่ AI และไม่ใช่การเดา
              เราไม่ให้คะแนนความเข้ากันเป็นเปอร์เซ็นต์ เพราะตัวเลขเดียวบอกไม่ได้ว่าทำไม
            </p>
            <ul className="mt-6 space-y-2">
              {RULES.map((r) => (
                <li key={r} className="flex items-start gap-2.5"><PawPrint className="mt-1 h-4 w-4 shrink-0 text-jade" />{r}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-bark">
              การจับคู่ช่วยให้ตัดสินใจได้ง่ายขึ้น แต่ไม่ได้รับประกันว่าจะอยู่ด้วยกันได้
              และ 14 วันก็ไม่ได้รับประกันเช่นกัน
            </p>
          </div>

          <figure className="peek-host relative">
            <PeekCat className="right-10" />
            <figcaption className="mb-3 text-sm font-semibold text-bark">ตัวอย่างผลการจับคู่จริงจากเครื่องคำนวณของแอป</figcaption>
            {matchCard}
          </figure>
        </div>
      </section>

      {/* ---- Mid-page band: the daily screen, at the size you would actually hold it. ---- */}
      <div className={`${WRAP} pb-16 md:pb-20`}>
        <div className="relative overflow-hidden rounded-[2rem] bg-jade px-6 py-12 text-cream md:px-12 md:py-14">
          <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-cream/10 blur-3xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">สิบวินาทีต่อวัน คือทั้งหมดที่ขอ</h2>
              <p className="mt-3 max-w-[46ch] opacity-95">
                เลือกอารมณ์ แตะกิจกรรมที่ทำกับน้อง แล้วกดบันทึก ภาระที่เจอก็บันทึกได้
                เพราะวันที่เหนื่อยเป็นส่วนหนึ่งของการเลี้ยงเหมือนกัน
              </p>
              <ul className="mt-6 space-y-2 text-sm opacity-95">
                <li className="flex items-start gap-2.5"><PawPrint className="mt-1 h-4 w-4 shrink-0" />บันทึกย้อนหลังได้ ไม่ต้องกลัวลืมวันเดียวแล้วเสียสถิติ</li>
                <li className="flex items-start gap-2.5"><PawPrint className="mt-1 h-4 w-4 shrink-0" />โน้ตที่พิมพ์ไม่เคยถูกส่งออกไปไหน และไม่ถูกส่งให้ AI</li>
                <li className="flex items-start gap-2.5"><PawPrint className="mt-1 h-4 w-4 shrink-0" />ครบเจ็ดวันถึงจะเริ่มเห็นรูปแบบ เราไม่เดาจากสองสามวัน</li>
              </ul>
              <Link href={cta.href} className="btn mt-8 bg-cream px-7 text-jade">{cta.text}</Link>
            </div>

            <div className="mx-auto md:mx-0">
              <PhoneCheckin className="rotate-[-3deg]" />
            </div>
          </div>
        </div>
      </div>

      {/* ---- The AI card, drawn as the card it will be, and labelled as not built yet. ---- */}
      <section className={`${WRAP} pb-16 md:pb-20`}>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-paper via-sage/30 to-honey/20 p-6 ring-1 ring-inset ring-bark/10 md:p-10">
          <div aria-hidden className="pointer-events-none absolute -right-28 -bottom-28 h-80 w-80 rounded-full bg-jade/15 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-honey/30 px-3 py-1 text-sm font-semibold text-bark">กำลังพัฒนา ยังไม่เปิดใช้</p>
              <h2 className="mt-3 max-w-[20ch] text-2xl font-bold md:text-4xl">AI ช่วยอ่านสรุป ไม่ได้ช่วยตัดสินใจแทนคุณ</h2>
              <p className="mt-3 max-w-[52ch] text-bark">
                สิ่งเดียวที่เราตั้งใจให้ AI ทำ คือเรียบเรียงตัวเลขที่แอปคำนวณไว้แล้วให้อ่านง่ายขึ้นสัปดาห์ละครั้ง
                ถ้าเรียบเรียงออกมาแล้วมีตัวเลขไม่ตรงกับของจริง ระบบจะทิ้งทั้งก้อนและไม่แสดงอะไรเลย
              </p>
              <ul className="mt-5 space-y-2 text-sm text-bark">
                {[
                  'การจับคู่น้องกับบ้านคุณ ใช้กฎที่เปิดให้ดู ไม่ใช่ AI',
                  'การคิดเลขทุกชนิด มาจากเครื่องคำนวณของแอปเท่านั้น',
                  'บันทึกที่คุณพิมพ์ ไม่เคยถูกส่งออกไปไหน',
                  'ปุ่มขอความช่วยเหลือ ไม่มี AI อยู่ในนั้นเลย',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5"><PawPrint className="mt-1 h-4 w-4 shrink-0 text-jade" />{t}</li>
                ))}
              </ul>
            </div>

            {/* A picture of the card as it would appear, stacked over a quiet second card. */}
            <div className="relative mx-auto w-full max-w-[26rem]">
              <div aria-hidden className="absolute inset-x-6 -bottom-4 h-24 rounded-[var(--radius-card)] bg-paper/70 ring-1 ring-bark/10" />
              <div className="card relative bg-paper shadow-[0_22px_45px_-26px_var(--c-shadow)]">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold">สรุปสัปดาห์ของคุณ</h3>
                  <span className="rounded-full bg-honey/30 px-2 py-0.5 text-[11px] font-semibold text-bark">ตัวอย่าง</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed">
                  สัปดาห์นี้คุณบันทึก <span className="num font-semibold">6</span> วัน คะแนนอารมณ์เฉลี่ย{' '}
                  <span className="num font-semibold">3.50</span> ในวันที่มี &quot;พาน้องเดิน&quot;{' '}
                  <span className="num font-semibold">4</span> วัน คะแนนเฉลี่ยสูงกว่าวันที่ไม่มี
                </p>
                <p className="mt-3 border-t border-bark/15 pt-3 text-xs text-bark">
                  ข้อความตัวอย่าง ตัวเลขทุกตัวมาจากเครื่องคำนวณของแอป AI เป็นคนเรียบเรียงเท่านั้น
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 6. For shelters ---- */}
      <div id="shelters" className="scroll-mt-20 bg-paper py-16 md:py-20">
        <div className={WRAP}>
          <h2 className="text-2xl font-bold md:text-4xl">ข้อมูลที่ดีขึ้น การรับเลี้ยงที่รับผิดชอบขึ้น</h2>
          <p className="mt-3 max-w-[58ch] text-bark">สำหรับศูนย์พักพิงและเครือข่ายบ้านพักชั่วคราว</p>

          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ['เห็นความพร้อมก่อนอนุมัติ', 'ผู้ขอทดลองเลี้ยงตอบเรื่องบ้าน เวลา ค่าใช้จ่าย และอาการแพ้ไว้แล้ว ศูนย์เห็นก่อนตัดสินใจ'],
              ['ติดต่อกันได้ระหว่าง 14 วัน', 'ศูนย์เห็นความเป็นอยู่ของน้องที่ผู้เลี้ยงแจ้ง และเข้าไปช่วยได้ตั้งแต่ปัญหายังเล็ก'],
              ['ผลลัพธ์ที่บันทึกไว้', 'ทุกการทดลองจบด้วยการตัดสินใจที่ชัดเจน รับเป็นครอบครัว คืน หรือขอคุยต่อ'],
              ['ความยินยอมมาก่อนเสมอ', 'ศูนย์เห็นเฉพาะสิ่งที่ผู้ใช้ยินยอมให้เห็น ไม่เห็นบันทึกอารมณ์หรือคะแนนสุขภาวะทางใจ'],
            ].map(([t, b]) => (
              <li key={t} className="card">
                <h3 className="font-bold">{t}</h3>
                <p className="mt-1 text-sm text-bark">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---- 7. Impact ---- */}
      <section className={`${WRAP} py-16 md:py-20`}>
        <h2 className="text-2xl font-bold md:text-4xl">ทุกการรับเลี้ยงควรได้เริ่มต้นที่ดีกว่านี้</h2>
        <p className="mt-3 max-w-[58ch] text-bark">
          นี่คือผลที่เราตั้งใจให้เกิด ยังไม่ใช่ผลที่วัดได้ เพราะ Pawlune ยังอยู่ในช่วงนำร่องและยังไม่มีข้อมูลจากการใช้งานจริง
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['ตัดสินใจโดยมีข้อมูล', 'คนรับเลี้ยงรู้ว่าตัวเองพร้อมแค่ไหนก่อนพาน้องกลับบ้าน'],
            ['ช่วงปรับตัวที่มีคนช่วย', 'สองสัปดาห์แรกไม่ต้องเดาเอาเองอีกต่อไป'],
            ['การเลี้ยงระยะยาวที่รับผิดชอบ', 'รู้ค่าใช้จ่ายจริงและรู้ว่าเมื่อไรต้องขอความช่วยเหลือ'],
          ].map(([t, b]) => (
            <div key={t} className="rounded-[var(--radius-card)] border-[1.5px] border-dashed border-bark/30 p-5">
              <h3 className="font-bold">{t}</h3>
              <p className="mt-1 text-sm text-bark">{b}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold">สิ่งที่เราไม่สัญญา</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-bark">
              <li>14 วันไม่ได้รับประกันว่าจะเข้ากันได้</li>
              <li>สัตว์เลี้ยงไม่ใช่บริการด้านสุขภาพจิต งานวิจัยยังได้ผลหลายทาง</li>
              <li>เรายังไม่มีข้อมูลนำร่องว่าลดการคืนได้เท่าไร</li>
            </ul>
            <Link href="/learn" className="mt-3 inline-block font-semibold text-jade underline underline-offset-4">งานวิจัยพูดว่าอะไร</Link>
          </div>
          <div>
            <h3 className="text-xl font-bold">ข้อมูลของคุณเป็นของคุณ</h3>
            <p className="mt-3 text-bark">
              ศูนย์เห็นเฉพาะความพร้อม ข้อตกลง และสิ่งที่คุณแจ้งเรื่องน้อง ไม่เห็นบันทึกอารมณ์หรือคะแนนสุขภาวะทางใจ
              ลบข้อมูลทั้งหมดได้ในปุ่มเดียว
            </p>
          </div>
        </div>
      </section>

      {/* ---- 8. Final call ---- */}
      <div className={`${WRAP} pb-20`}>
        <section className="relative overflow-hidden rounded-[var(--radius-sheet)] bg-sage/40 p-8 text-center md:p-12">
          <PawPrint className="absolute -left-8 -top-8 h-32 w-32 -rotate-12 text-jade/10" aria-hidden />
          <h2 className="relative text-2xl font-bold md:text-3xl">เพื่อนที่ใช่ อาจกำลังรออยู่</h2>
          <p className="relative mx-auto mt-3 max-w-[46ch] text-bark">
            เริ่มจากทำความเข้าใจตัวเองก่อน ไม่ต้องตัดสินใจรับเลี้ยงวันนี้ ใช้เวลาไม่กี่นาทีเพื่อดูว่าบ้านคุณพร้อมแค่ไหน
          </p>
          <div className="relative mt-7 flex flex-wrap items-center justify-center gap-5">
            <Link href={cta.href} className="btn btn-primary px-8 text-lg">{cta.text}</Link>
            <Link href="/learn/care" className="font-semibold text-jade underline decoration-2 underline-offset-4">ดูค่าใช้จ่ายจริงก่อน</Link>
          </div>
        </section>
      </div>

      {/* ---- 9. Footer ---- */}
      <footer className="relative bg-paper pt-16">
        <div className="pointer-events-none absolute -top-[70px] left-1/2 flex -translate-x-1/2 items-end gap-2" aria-hidden>
          <DogTuaDaeng className="h-20 w-20" />
          <CatFace coat={coatFor('มะขาม', 'cat')} className="h-16 w-16" />
        </div>

        <div className={`${WRAP} grid gap-8 pb-10 md:grid-cols-[1.4fr_1fr_1fr]`}>
          <div>
            <Logo className="text-lg" />
            <p className="mt-3 max-w-[40ch] text-sm text-bark">
              ทดลองรับเลี้ยง 14 วันภายใต้การดูแลของศูนย์ เพื่อให้ทั้งคนและน้องได้เริ่มต้นอย่างมีข้อมูล
            </p>
          </div>

          <nav aria-label="คู่มือ">
            <h2 className="font-semibold">คู่มือ</h2>
            <ul className="mt-2 space-y-1 text-sm text-bark">
              <li><Link href="/learn/cat" className="hover:text-jade">คู่มือแมว</Link></li>
              <li><Link href="/learn/dog" className="hover:text-jade">คู่มือหมา</Link></li>
              <li><Link href="/learn/care" className="hover:text-jade">ค่าใช้จ่าย</Link></li>
              <li><Link href="/learn/therapy" className="hover:text-jade">สัตว์บำบัดคืออะไร</Link></li>
            </ul>
          </nav>

          <nav aria-label="เกี่ยวกับ Pawlune">
            <h2 className="font-semibold">เกี่ยวกับ</h2>
            <ul className="mt-2 space-y-1 text-sm text-bark">
              <li><Link href="/learn" className="hover:text-jade">งานวิจัยที่เราอ้างอิง</Link></li>
              <li><a href="#matching" className="hover:text-jade">การจับคู่ทำงานยังไง</a></li>
              <li><a href="#shelters" className="hover:text-jade">สำหรับศูนย์พักพิง</a></li>
              <li><Link href={user ? '/settings' : '/login'} className="hover:text-jade">ข้อมูลและความเป็นส่วนตัว</Link></li>
            </ul>
          </nav>
        </div>

        <div className={`${WRAP} border-t border-bark/10 py-6 text-center text-sm text-bark`}>
          <p>ถ้ารู้สึกหนักใจ โทรสายด่วนสุขภาพจิต <a href="tel:1323" className="num font-semibold text-jade underline">1323</a></p>
          <p className="mt-1">Pawlune ไม่ใช่บริการทางการแพทย์หรือสัตวแพทย์ สำหรับผู้ที่อายุ 20 ปีขึ้นไป</p>
        </div>
      </footer>
    </main>
  );
}
