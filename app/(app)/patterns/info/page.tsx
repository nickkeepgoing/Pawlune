import Link from "next/link";
import { LIMITATION_LINE, MIN_DAYS_PER_GROUP, STRONG_DAYS_PER_GROUP } from "@/lib/engine";

export default function PatternsInfo() {
  return (
    <article className="space-y-4 pt-2">
      <Link href="/patterns" className="inline-flex min-h-11 items-center text-jade-deep">← กลับไปที่รูปแบบ</Link>
      <h1 className="text-2xl font-semibold">รูปแบบคำนวณยังไง</h1>
      <section className="paper p-5">
        <h2 className="font-semibold">วิธีคิด</h2>
        <p className="mt-1 text-bark">สำหรับแต่ละกิจกรรม เราแบ่งวันที่คุณบันทึกเป็นสองกลุ่ม คือ วันที่มีกิจกรรมนั้น กับวันที่ไม่มี แล้วหาค่าเฉลี่ยคะแนนอารมณ์ของแต่ละกลุ่ม (1–5) และบอกว่าต่างกันเท่าไร พร้อมจำนวนวันของทั้งสองกลุ่มเสมอ</p>
      </section>
      <section className="paper p-5">
        <h2 className="font-semibold">ทำไมต้อง <span className="num">{MIN_DAYS_PER_GROUP}</span> และ <span className="num">{STRONG_DAYS_PER_GROUP}</span> วัน</h2>
        <p className="mt-1 text-bark">ถ้ากลุ่มใดมีน้อยกว่า {MIN_DAYS_PER_GROUP} วัน เราจะบอกว่า &quot;ข้อมูลยังไม่พอ&quot; เพื่อไม่ให้การ์ดเกิดจากข้อมูลแค่ 2–3 วัน ถ้าทั้งสองกลุ่มมีอย่างน้อย {STRONG_DAYS_PER_GROUP} วัน การ์ดจะบอกว่าเป็นแนวโน้มจากข้อมูลที่มากขึ้น</p>
        <p className="mt-2 text-bark">ตัวเลข {MIN_DAYS_PER_GROUP} และ {STRONG_DAYS_PER_GROUP} เป็นเกณฑ์ของแอปที่เราตั้งเอง ไม่ใช่การทดสอบนัยสำคัญทางสถิติ</p>
      </section>
      <section className="paper p-5">
        <h2 className="font-semibold">ทำไมเราไม่บอกว่ากิจกรรมไหน &quot;เป็นสาเหตุ&quot;</h2>
        <p className="mt-1 text-bark">สองอย่างที่ไปด้วยกันในข้อมูล ไม่ได้แปลว่าอย่างหนึ่งเป็นต้นเหตุของอีกอย่าง เช่น วันที่อากาศดีคุณอาจทั้งพาน้องเดินและอารมณ์ดีไปพร้อมกัน เราจึงใช้คำว่า &quot;ไปด้วยกันกับ&quot; และเขียนไว้ทุกการ์ดว่า</p>
        <p className="mt-2 rounded-xl bg-cream px-3 py-2">{LIMITATION_LINE}</p>
        <p className="mt-2 text-bark">ถ้ากิจกรรมหนึ่งมักเกิดพร้อมอีกกิจกรรมเกือบทุกครั้ง (ตั้งแต่ <span className="num">70%</span> ของวัน) การ์ดจะบอกว่าแยกผลสองอย่างนี้ออกจากกันไม่ได้</p>
      </section>
      <section className="paper p-5">
        <h2 className="font-semibold">ความบังเอิญเกิดได้เสมอ</h2>
        <p className="mt-1 text-bark">ความต่างเล็กๆ อาจเกิดขึ้นเองโดยบังเอิญ ใช้การ์ดเป็นจุดเริ่มสังเกตตัวเอง ไม่ใช่ข้อสรุป</p>
      </section>
    </article>
  );
}
