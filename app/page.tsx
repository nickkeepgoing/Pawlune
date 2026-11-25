import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, nextStepPath } from "@/lib/guard";
import { Logo } from "@/components/AppHeader";
import { TwoBar } from "@/components/Charts";
import { Cat, Dog } from "@/components/PetArt";
import { LIMITATION_LINE } from "@/lib/engine";

export default async function Landing({ searchParams }: PageProps<"/">) {
  const { user } = await getSession();
  if (user) redirect(await nextStepPath());
  const { deleted } = await searchParams;
  return (
    <div className="flex-1">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Logo />
        <Link href="/login" className="btn btn-ghost min-h-11 px-4 text-sm">เข้าสู่ระบบ</Link>
      </header>
      {deleted && <p role="status" className="mx-auto max-w-5xl px-4"><span className="block rounded-xl bg-sage-soft px-4 py-3">ลบข้อมูลทั้งหมดของคุณเรียบร้อยแล้ว</span></p>}

      <main>
        <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 pb-16 pt-8 md:grid-cols-[1.1fr_1fr]">
          <div className="rise">
            <p className="text-sm font-semibold tracking-wide text-jade-deep">สมุดบันทึกใจ ของคนมีน้อง</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-[2.9rem]">
              เวลาแบบไหนกับน้อง<br />ที่ไปด้วยกันกับ<span className="underline decoration-sage decoration-[6px] underline-offset-[6px]">วันดี</span>ของคุณ?
            </h1>
            <p className="mt-4 max-w-md text-lg text-bark">บันทึกวันละไม่ถึง 10 วินาที ทั้งช่วงเวลาดีๆ และภาระของการดูแลน้อง แล้วค่อยๆ เห็นรูปแบบในข้อมูลของคุณเอง</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/login" className="btn btn-primary text-lg">เริ่มบันทึก</Link>
              <Link href="/learn" className="btn min-h-12 text-jade-deep underline underline-offset-4">สัตว์เลี้ยงกับใจ งานวิจัยว่ายังไง</Link>
            </div>
          </div>
          {/* Illustrative card: example numbers, labelled as such */}
          <figure className="rise rise-3 relative">
            <div className="absolute -right-2 -top-10 hidden md:block"><Cat size={110} /></div>
            <div className="paper relative rotate-[-1.2deg] p-5">
              <figcaption className="mb-3 inline-block rounded-full bg-cream px-3 py-0.5 text-xs text-bark">ตัวอย่างการ์ดรูปแบบ (ข้อมูลตัวอย่าง)</figcaption>
              <p className="font-medium">ใน <span className="num">8</span> วันที่มี &quot;พาน้องเดิน&quot; คะแนนอารมณ์เฉลี่ย <span className="num">4.38</span> สูงกว่า <span className="num">8</span> วันที่ไม่มี (<span className="num">2.63</span>) อยู่ <span className="num">1.8</span> คะแนน</p>
              <div className="mt-4"><TwoBar meanWith={4.38} meanWithout={2.63} nWith={8} nWithout={8} /></div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sage px-3 py-0.5 text-xs font-semibold">แนวโน้มเบื้องต้น</span>
              </div>
              <p className="mt-2 text-sm text-bark">{LIMITATION_LINE}</p>
            </div>
          </figure>
        </section>

        <section className="border-y border-line bg-paper/70 py-14">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-semibold">ใช้งานยังไง</h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                ["บันทึกวันละครั้ง", "เลือกหน้าอารมณ์วันนี้ และสิ่งที่ทำกับน้อง ทั้งเรื่องสนุกและเรื่องที่เป็นภาระ"],
                ["ตอบ 5 คำถามทุก 14 วัน", "แบบสอบถามคะแนนสุขภาวะทางใจ WHO-5 เกี่ยวกับ 2 สัปดาห์ที่ผ่านมา"],
                ["ดูรูปแบบของคุณ", "กิจกรรมไหนไปด้วยกันกับวันที่คะแนนอารมณ์สูงหรือต่ำ พร้อมบอกจำนวนวันทุกครั้ง"],
              ].map(([t, d], i) => (
                <li key={t} className="paper p-5">
                  <span className="num text-3xl text-jade">{i + 1}</span>
                  <h3 className="mt-1 text-lg font-semibold">{t}</h3>
                  <p className="mt-1 text-bark">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-6 px-4 py-14 md:grid-cols-2">
          <div className="paper ruled p-6">
            <h2 className="text-xl font-semibold">สัญญาเรื่องความจริง</h2>
            <p className="mt-2 text-lg">เราไม่บอกว่าสัตว์รักษาใจ เราช่วยให้คุณสังเกต</p>
            <p className="mt-2 text-bark">ทุกการ์ดบอกจำนวนวันทั้งสองฝั่ง บอกเมื่อข้อมูลยังไม่พอ และบอกเมื่อสองกิจกรรมมักเกิดพร้อมกันจนแยกกันไม่ได้</p>
          </div>
          <div className="paper p-6">
            <h2 className="text-xl font-semibold">สัญญาเรื่องความเป็นส่วนตัว</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-bark">
              <li>ขอความยินยอมก่อนเก็บข้อมูลทุกครั้ง</li>
              <li>ข้อมูลของคุณเห็นได้เฉพาะคุณ รูปน้องเก็บแบบส่วนตัว</li>
              <li>ไม่มีสคริปต์ติดตามหรือโฆษณา</li>
              <li>ลบข้อมูลทั้งหมดได้เองทุกเมื่อ</li>
            </ul>
          </div>
        </section>

        <div className="flex justify-center pb-6"><Dog size={120} /></div>
      </main>

      <footer className="border-t border-line bg-paper py-8 text-center text-sm text-bark">
        <p>ถ้ารู้สึกหนักใจ โทรสายด่วนสุขภาพจิต <a href="tel:1323" className="num font-semibold text-jade-deep underline">1323</a></p>
        <p className="mt-1">Paw Diary ไม่ใช่บริการทางการแพทย์ และไม่ได้ประเมินอาการ</p>
      </footer>
    </div>
  );
}
