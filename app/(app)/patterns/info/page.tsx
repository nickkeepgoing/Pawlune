import Link from 'next/link';
import { requireStage } from '@/lib/guard';

export default async function PatternsInfo() {
  await requireStage('ready');
  return (
    <article className="space-y-4 py-2">
      <Link href="/patterns" className="text-sm font-semibold text-jade underline underline-offset-4">กลับไปหน้ารูปแบบ</Link>
      <h1 className="text-2xl font-bold">รูปแบบคำนวณยังไง</h1>
      <section className="space-y-2">
        <h2 className="font-semibold">แบ่งวันเป็นสองกลุ่ม</h2>
        <p>สำหรับแต่ละกิจกรรม เราแบ่งวันที่คุณบันทึกเป็น วันที่มีกิจกรรมนั้น กับ วันที่ไม่มี แล้วหาค่าเฉลี่ยคะแนนอารมณ์ (1–5) ของแต่ละกลุ่ม การ์ดจะบอกจำนวนวันของทั้งสองกลุ่มเสมอ</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-semibold">ทำไมต้อง 7 และ 14 วัน</h2>
        <p>ถ้ากลุ่มใดมีน้อยกว่า 7 วัน การ์ดจะบอกว่าข้อมูลยังไม่พอ ถ้าทั้งสองกลุ่มมีอย่างน้อย 7 วัน จะเป็นแนวโน้มเบื้องต้น และถ้ามีอย่างน้อย 14 วัน จะเป็นแนวโน้มที่มีข้อมูลมากขึ้น</p>
        <p className="text-bark">ตัวเลข 7 และ 14 เป็นเกณฑ์ที่เราตั้งเพื่อไม่ให้การ์ดขึ้นจากข้อมูล 2–3 วัน ไม่ใช่การทดสอบทางสถิติ และไม่ได้พิสูจน์อะไร</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-semibold">ทำไมเราไม่บอกว่าอะไรเป็นสาเหตุ</h2>
        <p>วันที่พาน้องเดินอาจเป็นวันที่อากาศดี ว่าง หรือนอนหลับพอ สิ่งเหล่านี้อาจไปด้วยกันกับอารมณ์ทั้งหมด เราจึงพูดได้แค่ว่า "ไปด้วยกันกับ" ไม่ได้บอกว่ากิจกรรมหนึ่งส่งผลต่ออีกสิ่ง</p>
        <p>ถ้ากิจกรรมสองอย่างมักเกิดในวันเดียวกัน (ตั้งแต่ 70% ของวัน) การ์ดจะบอกว่าแยกผลสองอย่างนี้ออกจากกันไม่ได้</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-semibold">ความบังเอิญเกิดขึ้นได้</h2>
        <p>แม้ตัวเลขจะต่างกัน ความต่างเล็กๆ อาจเกิดจากความบังเอิญ ยิ่งบันทึกนาน ภาพจะยิ่งชัดขึ้น</p>
      </section>
    </article>
  );
}
