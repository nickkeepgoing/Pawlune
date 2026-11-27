import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { TapPet } from '../TapPet';
import { getState } from '@/lib/data';

// Every tip maps to docs/EVIDENCE.md #25–30. Paraphrased; the shelter and a vet have the final say.
const S = {
  sfspca: 'https://www.sfspca.org/blog/3-3-3-guideline/',
  sdh: 'https://sdhumane.org/resources/adopting-helping-a-dog-adjust-to-a-new-home/',
  aspca: 'https://www.aspca.org/pet-care/general-pet-care/introducing-dogs-each-other',
  spca: 'https://spca.org/wp-content/uploads/2023/07/Dog-to-Dog-Introductions.pdf',
  gdv: 'https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-topics/gastric-dilatation-volvulus-gdv-or-bloat',
  heat: 'https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-information/heatstroke-medical-emergency',
  food: 'https://www.campbowwow.com/blogs/2024/march/the-3-3-3-rule-for-dog-adoption/',
};
const Src = ({ href, children }: { href: string; children: React.ReactNode }) => (<a href={href} target="_blank" rel="noreferrer" className="text-xs text-jade underline">{children}</a>);

const STAGES = [
  { when: 'ก่อนรับ', items: [
    <>เตรียมมุมสงบของน้อง มีที่นอน น้ำ และของเล่น เก็บสายไฟ รองเท้า ยา และขยะให้พ้นปาก</>,
    <>ปลอกคอหรือสายรัดอกที่พอดี สายจูงแบบสั้น (ไม่ใช้สายยืดหด) และป้ายชื่อพร้อมเบอร์โทร</>,
    <>ถามศูนย์ว่าน้องกินอาหารอะไร ขับถ่ายเวลาไหน และกลัวอะไรบ้าง</>,
  ] },
  { when: 'วันรับ', items: [
    <>ขึ้นรถในกรงเดินทางหรือคาดสายนิรภัยสำหรับสุนัข ไม่ให้นั่งตักคนขับหรือยื่นหัวออกหน้าต่าง</>,
    <>ถึงบ้านแล้ว พาไปจุดขับถ่ายก่อน แล้วค่อยพาเดินดูบ้านโดยยังจูงอยู่</>,
    <>ถ้ามีหมาอยู่แล้ว ให้เจอกันครั้งแรกนอกบ้าน ในที่ที่ไม่ใช่อาณาเขตของตัวไหน <Src href={S.aspca}>ASPCA</Src></>,
  ] },
  { when: 'วันที่ 1–3', items: [
    <>ช่วงแรกน้องกำลังปรับตัวกับที่ใหม่ อาจกลัว ซ่อนตัว ไม่กิน หรือยังไม่แสดงนิสัยจริง <Src href={S.sfspca}>SF SPCA</Src></>,
    <>ใช้อาหารเดิมของศูนย์ไปก่อนหลายวัน แล้วค่อยๆ เปลี่ยน <Src href={S.food}>Camp Bow Wow</Src></>,
    <>เงียบๆ ไว้ก่อน ยังไม่พาไปที่คนเยอะหรือชวนแขกมาเจอ</>,
  ] },
  { when: 'วันที่ 4–7', items: [
    <>ทำตารางเดิมทุกวัน: เวลากิน เดินเล่น ขับถ่าย และนอน</>,
    <>แนะนำหมาเดิมด้วยการเดินคู่ขนาน ห่างกันพอให้เห็นและได้กลิ่นโดยไม่ต้องเผชิญหน้า <Src href={S.spca}>SPCA</Src></>,
    <>แยกชามอาหารและของเล่นที่หวง ดูแลใกล้ชิดทุกครั้งที่อยู่ด้วยกัน <Src href={S.aspca}>ASPCA</Src></>,
    <>นัดสัตวแพทย์ตรวจสุขภาพ พร้อมสมุดวัคซีนจากศูนย์</>,
  ] },
  { when: 'วันที่ 8–14', items: [
    <>ช่วงสองสัปดาห์แรก น้องอาจยังคลายความเครียดจากศูนย์ไม่หมด <Src href={S.sdh}>San Diego Humane Society</Src></>,
    <>หลายศูนย์ใช้แนวทาง &quot;3-3-3&quot; คือ 3 วัน 3 สัปดาห์ 3 เดือน เป็นแค่แนวทางคร่าวๆ แต่ละตัวช้าเร็วต่างกัน <Src href={S.sfspca}>SF SPCA</Src></>,
    <>ดูชีวิตจริง: เวลาเดินเล่นที่ทำได้ทุกวัน เสียงเห่ากับเพื่อนบ้าน ค่าใช้จ่าย และความสบายใจของทุกคนในบ้าน</>,
  ] },
];

export default async function DogGuidePage() {
  const { user } = await getState();
  return (
    <main className="mx-auto max-w-md px-5 pb-16 md:max-w-3xl md:px-8">
      <header className="flex items-center justify-between py-5">
        <Link href={user ? '/home' : '/'} className="flex items-center"><Logo /></Link>
        <span className="flex gap-3 text-sm font-semibold text-jade"><Link href="/learn/cat" className="underline underline-offset-4">คู่มือแมว</Link><Link href="/learn/care" className="underline underline-offset-4">ค่าใช้จ่าย</Link></span>
      </header>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">14 วันแรกกับหมาจากศูนย์</h1>
          <p className="mt-1 max-w-[60ch] text-bark">ทำทีละขั้นตามจังหวะของน้อง คำแนะนำนี้รวบรวมจากองค์กรดูแลสัตว์และโรงพยาบาลสัตว์ ศูนย์และสัตวแพทย์ของคุณตัดสินได้ดีที่สุดเสมอ</p>
        </div>
        <div className="hidden shrink-0 sm:block"><TapPet kind="dog" className="h-32 w-32" /></div>
      </div>

      <section className="mt-6 rounded-[var(--radius-card)] border-[1.5px] border-bark bg-paper p-5" aria-labelledby="urgent">
        <h2 id="urgent" className="text-lg font-bold">พาไปหาสัตวแพทย์ทันที แล้วโทรบอกศูนย์</h2>
        <ul className="mt-2 grid gap-x-6 gap-y-1 text-sm md:grid-cols-2">
          <li>พยายามอาเจียนแต่ไม่มีอะไรออก ท้องป่องหรือท้องแข็ง น้ำลายไหลมาก กระสับกระส่าย (อาจเป็นกระเพาะบิด อันตรายถึงชีวิต) <Src href={S.gdv}>Cornell</Src></li>
          <li>หอบหนัก น้ำลายไหล อาเจียน ท้องเสียมีเลือด อ่อนแรง สับสน ชัก หรือล้ม หลังอยู่ที่ร้อน (อาจเป็นฮีตสโตรก) <Src href={S.heat}>Cornell</Src></li>
          <li>ไม่กินอาหารเกิน 24 ชั่วโมง หรือซึมมาก</li>
          <li>หายใจลำบาก บาดเจ็บ หรือกัดคน</li>
        </ul>
        <p className="mt-2 text-sm">อากาศไทยร้อนและชื้น พาเดินช่วงเช้าหรือเย็น มีน้ำและที่ร่มให้เสมอ ถ้าไม่แน่ใจให้ถือว่าด่วนไว้ก่อน</p>
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
        <p className="mt-1">แจ้งศูนย์ในแอปหรือโทรได้ทุกวัน ไม่ต้องรอครบ 14 วัน คืนน้องที่ศูนย์โดยตรง จูงหรือใส่กรงเดินทาง ไม่ส่งต่อให้คนอื่นและไม่ปล่อยนอกบ้าน ข้อมูลที่คุณบอกช่วยให้ศูนย์หาบ้านที่เหมาะกว่าให้น้อง</p>
      </section>

      <section className="mt-6 rounded-[var(--radius-card)] bg-jade p-5 text-cream">
        <h2 className="font-semibold">พร้อมแล้ว เริ่มเช็กความพร้อม</h2>
        <p className="mt-1 text-sm opacity-95">ระบบจะจับคู่ตามความพร้อมของบ้านคุณ เช่น เวลาที่อยู่บ้าน รั้ว และหมาเดิม แล้วส่งคำขอให้ศูนย์ตรวจก่อน</p>
        <Link href={user ? '/adopt' : '/login'} className="btn mt-4 bg-cream text-jade">เช็กความพร้อม</Link>
      </section>
    </main>
  );
}
