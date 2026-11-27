import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Mascot } from '@/components/Mascot';
import { getState } from '@/lib/data';

// Every tip maps to docs/EVIDENCE.md #20–24. Paraphrased; the shelter and a vet have the final say.
const S = {
  vca: 'https://vcahospitals.com/know-your-pet/recognizing-signs-of-illness-in-cats',
  maddie: 'https://maddiesfund.org/kb-bringing-your-new-cat-home.htm',
  bf: 'https://bestfriends.org/node/546835',
  battersea: 'https://www.battersea.org.uk/pet-advice/cat-advice/settling-your-cat-new-home',
  sfspca: 'https://www.sfspca.org/resource/moving-with-your-cat/',
  petfinder: 'https://www.petfinder.com/cats-and-kittens/adoption/new-cat/first-30-days',
};
const Src = ({ href, children }: { href: string; children: React.ReactNode }) => (<a href={href} target="_blank" rel="noreferrer" className="text-xs text-jade underline">{children}</a>);

const STAGES = [
  { when: 'ก่อนรับ', items: [
    <>ติดมุ้งลวดหรือตาข่ายที่หน้าต่างและระเบียง เก็บสายไฟ ยา และต้นไม้ที่เป็นพิษให้พ้นมือ</>,
    <>เตรียมห้องเงียบหนึ่งห้องที่ปิดประตูได้ มีที่ซ่อน ที่นอน น้ำ อาหาร และกระบะทรายวางห่างจากอาหาร <Src href={S.battersea}>Battersea</Src></>,
    <>ขอชื่ออาหารที่ศูนย์ให้ และสมุดวัคซีน</>,
  ] },
  { when: 'วันรับ', items: [
    <>ใส่กล่องใส่สัตว์แบบแข็งที่ปิดล็อกได้ ไม่อุ้มขึ้นรถ คลุมผ้าบางๆ ให้น้องสงบ</>,
    <>ถึงบ้านแล้ว พาเข้าห้องที่เตรียมไว้ ปิดประตู เปิดกล่องแล้วให้น้องออกมาเอง <Src href={S.battersea}>Battersea</Src></>,
    <>ถ้ามีสัตว์อื่นในบ้าน แยกไว้คนละห้องตั้งแต่วันแรก</>,
  ] },
  { when: 'วันที่ 1–3', items: [
    <>ซ่อนตัว นอนเยอะ หรือกินและใช้กระบะน้อยลงในวันแรกๆ อาจเป็นเรื่องปกติ <Src href={S.bf}>Best Friends</Src></>,
    <>ใช้อาหารเดิมของศูนย์ก่อน แล้วค่อยๆ ผสมอาหารใหม่ภายในราว 6 วัน <Src href={S.bf}>Best Friends</Src></>,
    <>นั่งเงียบๆ ในห้อง ให้น้องเข้าหาเอง ไม่ดึงออกจากที่ซ่อน</>,
  ] },
  { when: 'วันที่ 4–7', items: [
    <>ถ้าน้องกิน ใช้กระบะ และออกมาหาคนแล้ว ค่อยเปิดให้เข้าอีกห้องทีละห้อง</>,
    <>แนะนำสัตว์เดิมผ่านกลิ่นก่อน (สลับผ้า ให้ดมใต้ประตู) บางบ้านต้องแยกห้องนานเป็นสัปดาห์ <Src href={S.sfspca}>SF SPCA</Src></>,
    <>นัดสัตวแพทย์ตรวจสุขภาพภายในสัปดาห์แรก พร้อมสมุดวัคซีนจากศูนย์ <Src href={S.petfinder}>Petfinder</Src></>,
  ] },
  { when: 'วันที่ 8–14', items: [
    <>แมวส่วนใหญ่ใช้เวลาปรับตัวราว 1–2 สัปดาห์ ขึ้นกับนิสัย ประสบการณ์ และสัตว์อื่นในบ้าน <Src href={S.maddie}>Maddie&apos;s Fund</Src></>,
    <>ดูชีวิตจริง: เวลาที่คุณอยู่บ้าน เสียงรบกวน ค่าใช้จ่าย และความสบายใจของทุกคนในบ้าน</>,
    <>จดเรื่องที่กังวล แล้วคุยกับศูนย์ก่อนวันตัดสินใจ</>,
  ] },
];

export default async function CatGuidePage() {
  const { user } = await getState();
  return (
    <main className="mx-auto max-w-md px-5 pb-16 md:max-w-3xl md:px-8">
      <header className="flex items-center justify-between py-5">
        <Link href={user ? '/home' : '/'} className="flex items-center"><Logo /></Link>
        <span className="flex gap-3 text-sm font-semibold text-jade"><Link href="/learn/dog" className="underline underline-offset-4">คู่มือหมา</Link><Link href="/learn/care" className="underline underline-offset-4">ค่าใช้จ่าย</Link></span>
      </header>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">14 วันแรกกับแมวจากศูนย์</h1>
          <p className="mt-1 max-w-[60ch] text-bark">ทำทีละขั้นตามจังหวะของน้อง คำแนะนำนี้รวบรวมจากองค์กรดูแลสัตว์และโรงพยาบาลสัตว์ ศูนย์และสัตวแพทย์ของคุณตัดสินได้ดีที่สุดเสมอ</p>
        </div>
        <div className="hidden shrink-0 sm:block"><Mascot className="h-32 w-32" /></div>
      </div>

      <section className="mt-6 rounded-[var(--radius-card)] border-[1.5px] border-bark bg-paper p-5" aria-labelledby="urgent">
        <h2 id="urgent" className="text-lg font-bold">พาไปหาสัตวแพทย์ทันที แล้วโทรบอกศูนย์</h2>
        <ul className="mt-2 grid gap-x-6 gap-y-1 text-sm md:grid-cols-2">
          <li>ไม่กินอาหารเกิน 24 ชั่วโมง</li>
          <li>เบ่งในกระบะแต่ไม่มีปัสสาวะ หรือไม่ปัสสาวะเลย (อันตรายถึงชีวิต)</li>
          <li>หายใจลำบาก หอบ อ้าปากหายใจ</li>
          <li>ขาหลังอ่อนแรงทันที บาดเจ็บ หรือตาดูแปลกไป</li>
        </ul>
        <p className="mt-2 text-sm">แมวมักซ่อนอาการป่วย ถ้าไม่แน่ใจให้ถือว่าด่วนไว้ก่อน <Src href={S.vca}>VCA Animal Hospitals</Src></p>
      </section>

      <ol className="mt-6 space-y-4">
        {STAGES.map((s) => (
          <li key={s.when} className="grid gap-2 rounded-[var(--radius-card)] bg-paper p-5 md:grid-cols-[8rem_1fr]">
            <h2 className="font-bold text-jade">{s.when}</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">{s.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
          </li>
        ))}
      </ol>

      <section className="mt-6 rounded-[var(--radius-card)] bg-paper p-5 text-sm">
        <h2 className="text-lg font-bold">ถ้าไปต่อไม่ไหว</h2>
        <p className="mt-1">แจ้งศูนย์ในแอปหรือโทรได้ทุกวัน ไม่ต้องรอครบ 14 วัน คืนน้องที่ศูนย์โดยตรงในกล่องใส่สัตว์ ไม่ส่งต่อให้คนอื่นและไม่ปล่อยนอกบ้าน ข้อมูลที่คุณบอกช่วยให้ศูนย์หาบ้านที่เหมาะกว่าให้น้อง</p>
      </section>

      <section className="mt-6 rounded-[var(--radius-card)] bg-jade p-5 text-cream">
        <h2 className="font-semibold">พร้อมแล้ว เริ่มเช็กความพร้อม</h2>
        <p className="mt-1 text-sm opacity-95">ระบบจะจับคู่ตามความพร้อมของบ้านคุณ แล้วส่งคำขอให้ศูนย์ตรวจก่อน</p>
        <Link href={user ? '/adopt' : '/login'} className="btn mt-4 bg-cream text-jade">เช็กความพร้อม</Link>
      </section>
    </main>
  );
}
