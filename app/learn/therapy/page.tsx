import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { getState } from '@/lib/data';
import { TapPet } from '../TapPet';
import { QuickCheck, TherapyTypes } from './TherapyTypes';

// Facts paraphrased from sources listed in docs/EVIDENCE.md #9–13. This page describes a professional service;
// it never says the app or the user's own pet provides therapy.
const SRC = {
  iahaio: 'https://habri.org/assets/uploads/AAI-Definitions-FINAL.pdf',
  avma: 'https://atwork.avma.org/resources-tools/avma-policies/animal-assisted-interventions-definitions',
  anxiety2026: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12840666',
  dogs: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7617605',
  inpatients: 'https://pmc.ncbi.nlm.nih.gov/articles/7185850',
  thaiTeams: 'https://mgronline.com/qol/detail/9690000054608',
  thaiHospital: 'https://www.pptvhd36.com/health/news/2761',
  course: 'https://www.khaosod.co.th/sentangsedtee/?p=212128',
  vths: 'https://www.thaipost.net/economy-news/1011186/',
  aspca: 'https://www.aspca.org/about-us/aspca-policy-and-position-statements/animal-assisted-interventions',
};
const Src = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="text-xs text-jade underline">{children}</a>
);

export default async function TherapyPage() {
  const { user } = await getState();
  return (
    <main className="mx-auto max-w-md px-5 pb-16 md:max-w-3xl md:px-8">
      <header className="flex items-center justify-between py-5">
        <Link href={user ? '/home' : '/'} className="flex items-center"><Logo /></Link>
        <a href="tel:1323" className="text-sm text-bark">สายด่วนสุขภาพจิต <span className="num font-semibold text-jade">1323</span></a>
      </header>
      <Link href="/learn" className="text-sm font-semibold text-jade underline underline-offset-4">สัตว์เลี้ยงกับใจ</Link>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">สัตว์บำบัดคืออะไร</h1>
          <p className="mt-1 text-bark">งานที่มีเป้าหมาย มีแผน และมีคนที่รู้จริงดูแลทั้งคนและสัตว์</p>
        </div>
        <TapPet kind="cat" className="h-24 w-24" />
      </div>

      <p className="mt-4 rounded-[var(--radius-card)] border-[1.5px] border-bark bg-paper p-4 text-sm"><b>Pawlune ไม่ใช่บริการบำบัด</b> และไม่ได้จัดหาสัตว์บำบัด หน้านี้อธิบายว่างานนี้คืออะไร เพื่อไม่ให้สับสนกับการรับเลี้ยงสัตว์ ถ้ารู้สึกหนักใจ ควรคุยกับผู้เชี่ยวชาญ หรือโทร 1323</p>
      <div className="mt-6 space-y-6">
        <section className="rounded-[var(--radius-card)] bg-paper p-5">
          <h2 className="text-lg font-bold">สรุปใน 3 บรรทัด</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>คือการใช้สัตว์อย่างมีเป้าหมายและมีแผน ในงานสุขภาพ การศึกษา หรือบริการสังคม โดยมีคนที่รู้จักทั้งผู้รับบริการและตัวสัตว์ดูแล <Src href={SRC.iahaio}>IAHAIO</Src></li>
            <li>แบบเต็มรูปแบบต้องมีนักวิชาชีพวางแผนและดูแล ในขอบเขตวิชาชีพของตัวเอง <Src href={SRC.avma}>AVMA</Src></li>
            <li>ใช้เสริมการรักษาหลัก ไม่ได้ใช้แทน</li>
          </ul>
        </section>

        <TherapyTypes />

        <section className="rounded-[var(--radius-card)] bg-paper p-5">
          <h2 className="text-lg font-bold">ในไทยใช้กับใคร</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>ทีมสุนัขนักบำบัดไทยทำงานกับสถานพยาบาลและโรงเรียน เช่น ผู้สูงวัยที่มีภาวะสมองเสื่อม ผู้ป่วยจิตเวช เด็กที่มีความต้องการพิเศษ เด็กตาบอดและหูหนวก <Src href={SRC.thaiTeams}>MGR Online</Src></li>
            <li>โรงพยาบาลมหาวชิราลงกรณธัญบุรี ใช้สุนัขช่วยดูแลจิตใจผู้ป่วยมะเร็งระยะท้ายและญาติ <Src href={SRC.thaiHospital}>PPTV</Src></li>
          </ul>
        </section>

        <section className="rounded-[var(--radius-card)] bg-paper p-5">
          <h2 className="text-lg font-bold">งานวิจัยว่าอย่างไร</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>ในผู้ป่วยในโรงพยาบาล รายงานความเครียด ความเจ็บปวด และความกังวลลดลง ความเสี่ยงคือภูมิแพ้ การติดเชื้อ และอุบัติเหตุ ซึ่งลดได้ด้วยมาตรการสุขอนามัย <Src href={SRC.inpatients}>ทบทวนงานวิจัย</Src></li>
            <li>หลักฐานเรื่องความกังวลยังกระจัดกระจายตามกลุ่มผู้ป่วยและวิธีวิจัย <Src href={SRC.anxiety2026}>Healthcare, 2026</Src> · คุณภาพการรายงานผลยังต้องปรับปรุง <Src href={SRC.dogs}>ทบทวนงานวิจัย</Src></li>
          </ul>
        </section>

        <section className="flex items-center gap-4 rounded-[var(--radius-card)] bg-paper p-5">
          <div>
            <h2 className="text-lg font-bold">อยากให้หมาของคุณเป็นสุนัขนักบำบัด</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              <li>หลักสูตรสุนัขนักบำบัดไทยฝึกเจ้าของกับสุนัขเป็นทีม ภาคทฤษฎีและปฏิบัติ ประมาณ 30 ชั่วโมง และเจ้าของกับสุนัขต้องผูกพันกันอย่างน้อย 1 ปี <Src href={SRC.course}>ข่าวสด</Src></li>
              <li>แนวหลักสูตรมาจาก Therapy Dog Association Switzerland (VTHS) <Src href={SRC.vths}>ไทยโพสต์</Src></li>
              <li>สัตว์ต้องแข็งแรงทั้งกายและใจ <Src href={SRC.aspca}>ASPCA</Src></li>
              <li><b>ค่าใช้จ่าย:</b> ค่าอบรมไม่ได้เปิดเผยในแหล่งที่เราพบ สอบถามโครงการโดยตรง และเตรียมค่าเลี้ยงดูปกติตาม <Link href="/learn/care" className="font-semibold text-jade underline">คู่มือค่าใช้จ่าย</Link></li>
            </ul>
          </div>
          <TapPet kind="dog" className="h-20 w-20" />
        </section>

        <QuickCheck />

        <section className="rounded-[var(--radius-card)] bg-jade p-5 text-cream">
          <h2 className="font-semibold">Pawlune ไม่ใช่สัตว์บำบัด</h2>
          <p className="mt-1 text-sm opacity-95">เราช่วยให้คุณทดลองรับเลี้ยงเพื่อนจากศูนย์อย่างมีข้อมูล และสังเกตใจตัวเองระหว่างทาง ถ้าสนใจสัตว์บำบัด ปรึกษาโรงพยาบาลหรือผู้เชี่ยวชาญ</p>
          <Link href={user ? '/adopt' : '/login'} className="btn mt-4 bg-cream text-jade">ทดลองรับเลี้ยงเพื่อนจากศูนย์</Link>
        </section>
      </div>
    </main>
  );
}
