"use client";
import { useEffect, useRef, useState } from "react";
import { Cat, Dog } from "@/components/PetArt";

function Tappable({ children, label }: { children: React.ReactNode; label: string }) {
  const [n, setN] = useState(0);
  return (
    <button type="button" aria-label={label} onClick={() => setN((x) => x + 1)} onMouseEnter={() => setN((x) => x + 1)}
      className="relative inline-block rounded-3xl">
      <span key={n} className={n ? "hop inline-block" : "inline-block"}>{children}</span>
      {n > 0 && <span key={`h${n}`} aria-hidden className="heart text-2xl text-jade">♥</span>}
    </button>
  );
}

function Paws({ n, label }: { n: number; label: string }) {
  return (
    <div className="paper p-3 text-center">
      <div aria-hidden className="flex flex-wrap justify-center gap-0.5">
        {Array.from({ length: n }, (_, i) => (
          <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#6B4F3A"><ellipse cx="12" cy="16" rx="5" ry="4" /><circle cx="6" cy="10" r="2.2" /><circle cx="10" cy="6.5" r="2.2" /><circle cx="14" cy="6.5" r="2.2" /><circle cx="18" cy="10" r="2.2" /></svg>
        ))}
      </div>
      <p className="mt-1"><span className="num text-2xl font-semibold">{n}</span></p>
      <p className="text-xs text-bark">{label}</p>
    </div>
  );
}

const Src = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center text-sm text-jade-deep underline underline-offset-4">{children}</a>
);

export default function LearnStory({ ctaHref }: { ctaHref: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Pause animations on cards that are off-screen.
    const els = ref.current?.querySelectorAll("[data-card]") ?? [];
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("paused", !e.isIntersecting)));
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-6 space-y-6">
      <section data-card className="paper p-6">
        <div className="flex items-end justify-center gap-2"><Tappable label="แตะถั่วแดง"><Dog size={120} /></Tappable><Tappable label="แตะมะขาม"><Cat size={110} /></Tappable></div>
        <h2 className="mt-4 text-xl font-semibold">เลี้ยงสัตว์ ≠ สัตว์บำบัด</h2>
        <p className="mt-1 text-bark">กิจกรรมบำบัดโดยใช้สัตว์ ใช้สัตว์ที่ผ่านการฝึกและทำร่วมกับผู้เชี่ยวชาญ ซึ่งต่างจากการเลี้ยงน้องที่บ้าน Paw Diary เป็นสมุดบันทึกของคนเลี้ยงสัตว์ ไม่ใช่การบำบัด</p>
      </section>

      <section data-card className="paper p-6">
        <div className="flex justify-end"><Tappable label="แตะถั่วแดง"><Dog size={90} /></Tappable></div>
        <h2 className="text-xl font-semibold">งานวิจัยยังได้ผลหลายทาง</h2>
        <p className="mt-1 text-bark">การทบทวนบทความ 54 ชิ้นเรื่องการเลี้ยงสัตว์กับสุขภาพจิตของเจ้าของ พบผลแบบนี้</p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Paws n={17} label="ผลดี" /><Paws n={19} label="ผลผสม" /><Paws n={13} label="ไม่พบผล" /><Paws n={5} label="ผลไม่ดี" />
        </div>
        <Src href="https://pubmed.ncbi.nlm.nih.gov/34941859/">ที่มา: Vet Sci 2021 (systematic review)</Src>
        <p className="mt-3 text-bark">อีกงานทบทวน 116 การศึกษาเรื่องความผูกพันกับสัตว์เลี้ยงก็พบผลหลากหลายเช่นกัน (ดีขึ้น 15 · แย่ลง 22 · ผสม 36 · ไม่สัมพันธ์ 33)</p>
        <Src href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12023967/">ที่มา: systematic review (PMC12023967)</Src>
      </section>

      <section data-card className="paper p-6">
        <div className="flex items-end justify-center gap-1"><Cat size={110} mood="tired" /><Tappable label="แตะถั่วแดงเพื่อปลอบมะขาม"><Dog size={90} /></Tappable></div>
        <h2 className="mt-4 text-xl font-semibold">การเลี้ยงสัตว์มีภาระด้วย</h2>
        <p className="mt-1 text-bark">งานทบทวน 17 การศึกษาในผู้ที่มีปัญหาสุขภาพจิตพบทั้งการสนับสนุนจากสัตว์เลี้ยง และภาระทางปฏิบัติและทางใจของการเลี้ยง รวมถึงผลของการสูญเสียสัตว์เลี้ยง Paw Diary จึงให้บันทึกภาระด้วย ไม่ใช่แค่เรื่องดีๆ</p>
        <Src href="https://pubmed.ncbi.nlm.nih.gov/29402247/">ที่มา: BMC Psychiatry 2018</Src>
      </section>

      <section data-card className="paper p-6 text-center">
        <div className="flex items-end justify-center gap-2"><Tappable label="แตะถั่วแดง"><Dog size={100} /></Tappable><Tappable label="แตะมะขาม"><Cat size={96} /></Tappable></div>
        <h2 className="mt-4 text-xl font-semibold">แอปนี้ช่วยให้คุณสังเกตตัวเอง ไม่ได้ตัดสิน</h2>
        <p className="mt-1 text-bark">ภาพของแต่ละคนไม่เหมือนกัน ลองดูภาพของคุณเองกับน้อง</p>
        <a href={ctaHref} className="btn btn-primary mt-5">เริ่มบันทึก</a>
      </section>
    </div>
  );
}
