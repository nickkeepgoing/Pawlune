import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { IconPaw } from '@/components/Icons';
import { getState } from '@/lib/data';
import { TapPet } from './TapPet';

// Facts only from docs/EVIDENCE.md #1–3, each with its link.
function PawGroup({ n, label }: { n: number; label: string }) {
  return (
    <div className="text-center">
      <div className="flex flex-wrap justify-center gap-0.5 text-jade" aria-hidden>
        {Array.from({ length: n }).map((_, i) => <IconPaw key={i} className="h-3 w-3" />)}
      </div>
      <p className="num mt-1 text-xl font-semibold">{n}</p>
      <p className="text-xs text-bark">{label}</p>
    </div>
  );
}

export default async function LearnPage() {
  const { user } = await getState();
  return (
    <main className="mx-auto max-w-md px-5 pb-16 md:max-w-3xl md:px-8">
      <header className="flex items-center justify-between py-5">
        <Link href={user ? '/home' : '/'} className="flex items-center"><Logo /></Link>
        <a href="tel:1323" className="text-sm text-bark">สายด่วนสุขภาพจิต <span className="num font-semibold text-jade">1323</span></a>
      </header>
      <h1 className="text-2xl font-bold">สัตว์เลี้ยงกับใจ งานวิจัยว่าอย่างไร</h1>
      <p className="mt-1 text-bark">แตะน้องได้นะ</p>

      <div className="mt-8 space-y-8">
        <section className="page flex items-center gap-4 rounded-[var(--radius-card)] border border-bark/20 p-5">
          <TapPet kind="dog" />
          <div>
            <h2 className="font-semibold">เลี้ยงสัตว์ ไม่เท่ากับ สัตว์บำบัด</h2>
            <p className="mt-1 text-sm">การใช้สัตว์ในการดูแลสุขภาพจิตทางการแพทย์ ใช้สัตว์ที่ฝึกมาและทำร่วมกับผู้เชี่ยวชาญ ต่างจากการเลี้ยงสัตว์ที่บ้าน Pawlune เป็นสมุดบันทึกของเจ้าของสัตว์ ไม่ใช่บริการทางการแพทย์</p>
            <span className="mt-2 flex flex-wrap gap-3 text-sm font-semibold text-jade"><Link href="/learn/therapy" className="underline underline-offset-4">สัตว์บำบัดคืออะไร</Link><Link href="/learn/care" className="underline underline-offset-4">คู่มือเลี้ยงและค่าใช้จ่าย</Link></span>
          </div>
        </section>

        <section className="page rounded-[var(--radius-card)] border border-bark/20 p-5">
          <h2 className="font-semibold">งานวิจัยยังได้ผลหลายทาง</h2>
          <p className="mt-1 text-sm">การทบทวนงานวิจัย 54 ชิ้นเรื่องการเลี้ยงสัตว์กับสุขภาพจิตของเจ้าของ แบ่งผลได้ดังนี้</p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            <PawGroup n={17} label="ผลดี" /><PawGroup n={19} label="ผลผสม" /><PawGroup n={13} label="ไม่พบผล" /><PawGroup n={5} label="ผลลบ" />
          </div>
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8705563/" className="mt-3 inline-block text-xs text-jade underline" target="_blank" rel="noreferrer">Pet Ownership and Quality of Life: A Systematic Review (Vet Sci, 2021)</a>
        </section>

        <section className="page flex items-center gap-4 rounded-[var(--radius-card)] border border-bark/20 p-5">
          <div>
            <h2 className="font-semibold">การเลี้ยงสัตว์มีภาระด้วย</h2>
            <p className="mt-1 text-sm">การทบทวนงานวิจัย 17 ชิ้นพบทั้งประโยชน์ และภาระทั้งด้านการดูแลและด้านความรู้สึก รวมถึงผลของการสูญเสียสัตว์เลี้ยง Pawlune จึงให้บันทึกทั้งเรื่องดีและเรื่องที่เหนื่อย</p>
            <a href="https://pubmed.ncbi.nlm.nih.gov/29402247/" className="mt-2 inline-block text-xs text-jade underline" target="_blank" rel="noreferrer">BMC Psychiatry, 2018</a>
          </div>
          <TapPet kind="cat" tired />
        </section>

        <section className="rounded-[var(--radius-card)] bg-jade p-5 text-cream">
          <h2 className="font-semibold">แอปนี้ช่วยให้คุณสังเกตตัวเอง ไม่ได้ตัดสิน</h2>
          <p className="mt-1 text-sm opacity-95">บันทึกวันละ 10 วินาที แล้วดูรูปแบบในข้อมูลของคุณเอง พร้อมจำนวนวันทั้งสองฝั่ง</p>
          <Link href={user ? '/checkin' : '/login'} className="btn mt-4 bg-cream text-jade">เริ่มบันทึก</Link>
        </section>
      </div>
    </main>
  );
}
