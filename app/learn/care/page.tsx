import Link from 'next/link';
import { LearnNav } from '@/components/LearnNav';
import { getState } from '@/lib/data';
import { Budget } from './Budget';

// Every figure has a source link. Clinic prices are one private clinic's list, shown as an example only.
const S = {
  thairath: 'https://www.thairath.co.th/money/personal_finance/finance_banking/2902292',
  clinic: 'https://page.line.me/483uinhb/showcase/2080695408240861',
  bmaFree: 'https://www.thansettakij.com/health-wellness/662052',
  bkkAdopt: 'https://www.dailynews.co.th/news/5422583/',
  bkkRules: 'https://www.dailynews.co.th/articles/3614740/',
  bkkContact: 'https://thestandard.co/?p=1085104',
};
const Src = ({ href, children }: { href: string; children: React.ReactNode }) => (<a href={href} target="_blank" rel="noreferrer" className="text-xs text-jade underline">{children}</a>);
const Row = ({ item, cost, src }: { item: string; cost: string; src: React.ReactNode }) => (
  <tr className="border-t border-bark/10 align-top"><td className="py-1.5 pr-2">{item}</td><td className="num py-1.5 pr-2 whitespace-nowrap">{cost}</td><td className="py-1.5">{src}</td></tr>
);

export default async function CarePage() {
  const { user } = await getState();
  return (
    <main className="mx-auto max-w-md px-5 pb-16 md:max-w-3xl md:px-8">
      <LearnNav current="/learn/care" homeHref={user ? '/home' : '/'} />
      <h1 className="text-2xl font-bold">ก่อนรับน้อง: คู่มือและค่าใช้จ่าย</h1>
      <p className="mt-1 text-bark">หมาและแมวอยู่กับเรา 10–15 ปี เตรียมเงินและเวลาให้พร้อมก่อน <Src href={S.thairath}>ไทยรัฐ</Src></p>

      <div className="mt-6 space-y-6">
        <section className="card card-quiet">
          <h2 className="text-lg font-bold">ค่าใช้จ่ายที่ต้องเตรียม (บาท)</h2>
          <table className="mt-2 w-full text-left text-sm">
            <tbody>
              <tr><td colSpan={3} className="pt-1 font-semibold text-jade">ประจำเดือน</td></tr>
              <Row item="อาหารและขนม" cost="1,000–3,000" src={<Src href={S.thairath}>ไทยรัฐ</Src>} />
              <Row item="ยาป้องกันเห็บหมัด" cost="เริ่ม 320" src={<Src href={S.clinic}>คลินิกตัวอย่าง</Src>} />
              <tr><td colSpan={3} className="pt-3 font-semibold text-jade">ประจำปี</td></tr>
              <Row item="วัคซีนรวม" cost="420" src={<Src href={S.clinic}>คลินิกตัวอย่าง</Src>} />
              <Row item="วัคซีนพิษสุนัขบ้า" cost="240 (ฟรีที่หน่วย กทม.)" src={<><Src href={S.clinic}>คลินิก</Src> · <Src href={S.bmaFree}>กทม.</Src></>} />
              <Row item="ถ่ายพยาธิ" cost="เริ่ม 170/ครั้ง" src={<Src href={S.clinic}>คลินิกตัวอย่าง</Src>} />
              <Row item="ค่าตรวจ" cost="150/ครั้ง" src={<Src href={S.clinic}>คลินิกตัวอย่าง</Src>} />
              <Row item="รวมทั้งปี (สุนัข)" cost="~24,000–28,000" src={<Src href={S.thairath}>ศูนย์วิจัยกสิกรไทย ผ่านไทยรัฐ</Src>} />
              <tr><td colSpan={3} className="pt-3 font-semibold text-jade">เมื่อป่วยหรือเกิดอุบัติเหตุ (ต่อครั้ง)</td></tr>
              <Row item="แมวติดเชื้อทั่วไป" cost="500–1,500" src={<Src href={S.thairath}>ttb ผ่านไทยรัฐ</Src>} />
              <Row item="สุนัขท้องเสียรุนแรง" cost="1,000–3,000" src={<Src href={S.thairath}>ttb ผ่านไทยรัฐ</Src>} />
              <Row item="สุนัขขาหัก" cost="20,000–50,000" src={<Src href={S.thairath}>ttb ผ่านไทยรัฐ</Src>} />
              <tr><td colSpan={3} className="pt-3 font-semibold text-jade">ครั้งเดียว</td></tr>
              <Row item="อุปกรณ์ ที่นอน ปลอกคอ สายจูง" cost="20–2,000/ชิ้น" src={<Src href={S.thairath}>ไทยรัฐ</Src>} />
              <Row item="ทำหมันที่คลินิกเอกชน (แมว)" cost="ตัวผู้ 4,000+ ตัวเมีย 5,000+" src={<Src href={S.clinic}>คลินิกตัวอย่าง</Src>} />
            </tbody>
          </table>
          <ul className="mt-3 space-y-1 text-sm">
            <li><b>ประหยัดได้:</b> หน่วยสัตวแพทย์เคลื่อนที่ของ กทม. ฉีดวัคซีนพิษสุนัขบ้า ฝังไมโครชิป และทำหมันฟรี ตามตารางของสำนักอนามัย <Src href={S.bmaFree}>ฐานเศรษฐกิจ</Src></li>
            <li><b>เงินสำรอง:</b> เก็บไว้ 3–6 เดือนของค่าใช้จ่าย เช่น ใช้เดือนละ 3,000 ควรมี 9,000–18,000 <Src href={S.thairath}>ไทยรัฐ</Src></li>
            <li className="text-bark">ราคาคลินิกเป็นของคลินิกเอกชนแห่งหนึ่ง แต่ละที่ต่างกัน ใช้เป็นตัวอย่างเท่านั้น</li>
          </ul>
        </section>

        <Budget />

        <section className="card card-quiet">
          <h2 className="text-lg font-bold">รับจากศูนย์ กทม. ต้องพร้อมอะไร</h2>
          <p className="mt-1 text-sm">ศูนย์ควบคุมสุนัขกรุงเทพมหานคร (ประเวศ) ตรวจสุขภาพ คัดกรองโรค ฉีดวัคซีน และทำหมันน้องทุกตัวก่อนให้รับ <Src href={S.bkkAdopt}>เดลินิวส์</Src></p>
          <ol className="mt-2 list-decimal space-y-0.5 pl-5 text-sm">
            <li>คนในครอบครัวเห็นด้วย</li><li>มีความรู้เบื้องต้นในการเลี้ยงสัตว์</li><li>มีที่เลี้ยงรั้วรอบขอบชิด</li><li>พร้อมดูแลค่าใช้จ่าย</li><li>มีจิตใจเมตตาและรักสัตว์</li>
          </ol>
          <p className="mt-1"><Src href={S.bkkRules}>เงื่อนไขจากศูนย์ฯ ผ่านเดลินิวส์</Src></p>
          <p className="mt-2 text-sm">ติดต่อ: Facebook &quot;BKK Adopter&quot; · โทร 0 2328 7460, 0 2245 3311 (จ.–ศ. 08.30–16.30 น.) <Src href={S.bkkContact}>THE STANDARD</Src></p>
        </section>

        <section className="card card-quiet">
          <h2 className="text-lg font-bold">14 วันแรกที่บ้าน</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li><b>มุมสงบของน้อง:</b> ที่นอน น้ำสะอาด และจุดขับถ่ายที่เดิมทุกวัน (แมวใช้กระบะทราย)</li>
            <li><b>เวลาเดิมทุกวัน:</b> ให้อาหาร พาเดิน และเล่นเวลาเดิม ช่วยให้น้องปรับตัวเร็วขึ้น</li>
            <li><b>อาหารสำหรับสัตว์:</b> อาหารคนไม่เหมาะกับระบบย่อยของสุนัข เปลี่ยนอาหารทีละน้อย <Src href="https://www.ofm.co.th/blog/expenses-for-a-new-dog/">OfficeMate</Src></li>
            <li><b>สมุดวัคซีน:</b> ขอประวัติจากศูนย์ แล้วนัดสัตวแพทย์ตามกำหนดฉีดกระตุ้น</li>
            <li><b>ให้น้องเข้าหาเอง:</b> ไม่บังคับอุ้มหรือกอด สังเกตว่าน้องชอบอะไร กลัวอะไร แล้วจดไว้ส่งศูนย์</li>
            <li><b>คู่มือละเอียดแยกตามชนิด:</b> <Link href="/learn/cat" className="text-jade underline">14 วันแรกกับแมว</Link> · <Link href="/learn/dog" className="text-jade underline">14 วันแรกกับหมา</Link> เรื่องการขนส่ง การปรับตัว การแนะนำสัตว์เดิม และอาการที่ต้องรีบไปหาหมอ</li>
            <li><b>พาไปหาสัตวแพทย์ทันที</b> ถ้าน้องไม่กินอาหาร ซึมผิดปกติ อาเจียนหรือท้องเสียซ้ำ หรือหายใจลำบาก</li>
          </ul>
        </section>

        <section className="rounded-[var(--radius-card)] bg-jade p-5 text-cream">
          <h2 className="font-semibold">พร้อมแล้ว ลองทดลองเลี้ยง 14 วัน</h2>
          <p className="mt-1 text-sm opacity-95">ศูนย์อนุมัติก่อน มีคำแนะนำรายวันและแจ้งปัญหาได้ทุกเมื่อ ถ้าไม่เข้ากัน ศูนย์จะช่วยหาบ้านที่เหมาะกว่าให้น้อง</p>
          <Link href={user ? '/adopt' : '/login'} className="btn mt-4 bg-cream text-jade">หาเพื่อนที่เข้ากับฉัน</Link>
        </section>
      </div>
    </main>
  );
}
