import Link from 'next/link';

// Guidance during a trial. Sources in docs/EVIDENCE.md #20–30 (VCA, Maddie's Fund, Best Friends, Battersea, SF SPCA).
// Advice only: the shelter and a vet decide on care.

const CAT_STAGES: { from: number; to: number; title: string; tips: string[] }[] = [
  { from: 1, to: 3, title: 'วันที่ 1–3: ให้น้องอยู่ห้องเดียวก่อน', tips: [
    'ห้องเงียบหนึ่งห้อง มีที่ซ่อน น้ำ อาหาร และกระบะทรายวางห่างจากอาหาร',
    'ซ่อนตัว นอนเยอะ หรือกินน้อยในวันแรกๆ เป็นเรื่องปกติของแมวที่ย้ายบ้าน',
    'ใช้อาหารแบบเดียวกับที่ศูนย์ให้ อย่าเพิ่งเปลี่ยนสูตร',
    'ถ้ามีสัตว์อื่นในบ้าน แยกไว้คนละห้องก่อน',
  ] },
  { from: 4, to: 7, title: 'วันที่ 4–7: ค่อยๆ เปิดพื้นที่', tips: [
    'ถ้าน้องกิน ใช้กระบะ และออกมาหาคนเองแล้ว เปิดให้เข้าอีกห้องทีละห้อง',
    'ให้น้องดมกลิ่นสัตว์เดิมผ่านผ้าหรือใต้ประตูก่อนเจอกันจริง',
    'เล่นด้วยของเล่นไม้ตกแมว ไม่ใช้มือเล่น',
  ] },
  { from: 8, to: 14, title: 'วันที่ 8–14: ดูชีวิตจริงด้วยกัน', tips: [
    'แมวส่วนใหญ่ใช้เวลาปรับตัวราว 1–2 สัปดาห์ บางตัวนานกว่านั้น',
    'สังเกตว่าตารางชีวิตของคุณกับน้องไปด้วยกันได้ไหม เช่น เวลาอยู่บ้าน เสียง ค่าใช้จ่าย',
    'จดเรื่องที่ยังกังวลไว้ คุยกับศูนย์ก่อนวันตัดสินใจ',
  ] },
];

const DOG_STAGES: typeof CAT_STAGES = [
  { from: 1, to: 3, title: 'วันที่ 1–3: ให้น้องได้พัก', tips: [
    'มีมุมสงบของตัวเอง ยังไม่พาไปที่คนเยอะหรือชวนแขกมาบ้าน',
    'กลัว ซ่อน ไม่กิน หรือยังไม่แสดงนิสัยจริงในวันแรกๆ เกิดขึ้นได้',
    'ใช้อาหารเดิมของศูนย์ไปก่อน พาไปจุดขับถ่ายเวลาเดิม',
    'ถ้ามีหมาเดิม ให้เจอกันนอกบ้านก่อน และแยกกันระหว่างกินอาหาร',
  ] },
  { from: 4, to: 7, title: 'วันที่ 4–7: สร้างกิจวัตร', tips: [
    'กิน เดินเล่น ขับถ่าย และนอนเวลาเดิมทุกวัน',
    'เดินคู่ขนานกับหมาเดิม ห่างกันพอไม่ต้องเผชิญหน้า',
    'นัดสัตวแพทย์ตรวจสุขภาพพร้อมสมุดวัคซีนจากศูนย์',
  ] },
  { from: 8, to: 14, title: 'วันที่ 8–14: ดูชีวิตจริงด้วยกัน', tips: [
    'สองสัปดาห์แรก น้องอาจยังคลายเครียดจากศูนย์ไม่หมด',
    'เดินเล่นช่วงเช้าหรือเย็น เลี่ยงแดดจัด มีน้ำให้เสมอ',
    'จดเรื่องที่ยังกังวล เช่น เสียงเห่า การอยู่ลำพัง แล้วคุยกับศูนย์ก่อนวันตัดสินใจ',
  ] },
];

export function StageTip({ species, day }: { species: 'dog' | 'cat'; day: number }) {
  const list = species === 'cat' ? CAT_STAGES : DOG_STAGES;
  const s = list.find((x) => day >= x.from && day <= x.to) ?? list[2];
  return (
    <section className="rounded-[var(--radius-card)] bg-paper p-4 text-sm">
      <h2 className="font-semibold">{s.title}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5">{s.tips.map((t) => <li key={t}>{t}</li>)}</ul>
      <Link href={`/learn/${species}`} className="mt-2 inline-block font-semibold text-jade underline underline-offset-4">อ่านคู่มือ 14 วันแรกกับ{species === 'cat' ? 'แมว' : 'หมา'}ทั้งหมด</Link>
    </section>
  );
}

export function RedFlags({ species, phone }: { species: 'dog' | 'cat'; phone: string | null }) {
  const flags = species === 'cat'
    ? ['ไม่กินอาหารเกิน 24 ชั่วโมง', 'เบ่งในกระบะทรายแต่ไม่มีปัสสาวะ หรือไม่ปัสสาวะเลย', 'หายใจลำบาก หอบ หรืออ้าปากหายใจ', 'อาเจียนหรือท้องเสียซ้ำๆ ซึมมาก', 'ขาหลังอ่อนแรงทันที หรือบาดเจ็บ']
    : ['พยายามอาเจียนแต่ไม่มีอะไรออก ท้องป่อง น้ำลายไหล กระสับกระส่าย', 'หอบหนัก อ่อนแรง หรือล้ม หลังอยู่ที่ร้อน', 'ไม่กินอาหารเกิน 24 ชั่วโมง ซึมมาก', 'อาเจียนหรือท้องเสียซ้ำๆ หรือมีเลือดปน', 'หายใจลำบาก บาดเจ็บ หรือกัดคน'];
  return (
    <section className="rounded-[var(--radius-card)] border-[1.5px] border-bark bg-paper p-4 text-sm" aria-labelledby="rf-title">
      <h2 id="rf-title" className="font-semibold">พาไปหาหมอทันที ถ้าเห็นอาการเหล่านี้</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5">{flags.map((f) => <li key={f}>{f}</li>)}</ul>
      <p className="mt-2">โทรหาศูนย์{phone && phone !== '-' ? <> <a href={`tel:${phone.replace(/\s/g, '')}`} className="num font-semibold text-jade underline">{phone}</a></> : ''} แล้วไปคลินิกตามที่ตกลงไว้ ไม่ต้องรอแจ้งในแอป</p>
      <p className="mt-1 text-xs text-bark">แอปนี้ไม่ใช่สัตวแพทย์ ถ้าไม่แน่ใจ ให้ถือว่าเป็นเรื่องด่วนไว้ก่อน</p>
    </section>
  );
}
