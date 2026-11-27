'use client';
import { useState } from 'react';
import { DogTuaDaeng } from '@/components/Pets';

// Interactive: pick a type → ถั่วแดง hops and changes its prop (vest / book / ball).
const TYPES = [
  {
    id: 'aat', name: 'สัตว์บำบัด (AAT)', who: 'นักวิชาชีพด้านสุขภาพหรือบริการสังคม เช่น นักกิจกรรมบำบัด นักจิตวิทยา',
    what: 'มีเป้าหมายรายคน มีแผน ติดตามความคืบหน้า และจดบันทึกเหมือนการดูแลแบบอื่น เพื่อช่วยด้านร่างกาย สังคม อารมณ์ หรือความคิด',
    prop: 'vest',
  },
  {
    id: 'aae', name: 'สัตว์ช่วยการเรียนรู้ (AAE)', who: 'ครูที่มีคุณวุฒิ ในสถานศึกษา',
    what: 'มีเป้าหมายด้านการเรียน เช่น โครงการให้เด็กอ่านหนังสือให้สุนัขฟัง',
    prop: 'book',
  },
  {
    id: 'aaa', name: 'กิจกรรมกับสัตว์ (AAA)', who: 'อาสาสมัครหรือผู้เชี่ยวชาญ พาสัตว์ที่ผ่านการฝึกหรือการประเมินมาเยี่ยม',
    what: 'เพื่อสร้างแรงจูงใจ ความรู้ หรือความผ่อนคลาย เช่น พาสุนัขไปเยี่ยมโรงพยาบาลหรือโรงเรียน',
    prop: 'ball',
  },
] as const;

function Prop({ kind }: { kind: (typeof TYPES)[number]['prop'] }) {
  if (kind === 'vest') return (<svg viewBox="0 0 40 40" className="h-12 w-12" aria-hidden><path d="M8 10h24l-3 24H11Z" fill="#4E6E58" /><path d="M17 18h6M20 15v6" stroke="#F2EADB" strokeWidth="3" strokeLinecap="round" /></svg>);
  if (kind === 'book') return (<svg viewBox="0 0 40 40" className="h-12 w-12" aria-hidden><path d="M6 10c5-2 10-2 14 1 4-3 9-3 14-1v20c-5-2-10-2-14 1-4-3-9-3-14-1Z" fill="#C99A5B" /><path d="M20 11v20" stroke="#3E2D22" strokeWidth="1.5" /></svg>);
  return (<svg viewBox="0 0 40 40" className="h-12 w-12" aria-hidden><circle cx="20" cy="20" r="12" fill="#C99A5B" /><path d="M9 16c7 3 15 3 22 0M9 24c7-3 15-3 22 0" stroke="#FBF7EF" strokeWidth="2" fill="none" /></svg>);
}

export function TherapyTypes() {
  const [sel, setSel] = useState(0);
  const [hop, setHop] = useState(0);
  const t = TYPES[sel];
  return (
    <section className="card">
      <h2 className="text-lg font-bold">สัตว์ช่วยงานคนได้ 3 แบบ</h2>
      <p className="mt-1 text-sm text-bark">แตะแต่ละแบบ แล้วดูว่าถั่วแดงทำหน้าที่อะไร</p>
      <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="ประเภท">
        {TYPES.map((x, i) => (
          <button key={x.id} role="tab" aria-selected={sel === i} className="chip" aria-pressed={sel === i} onClick={() => { setSel(i); setHop((h) => h + 1); }}>{x.name}</button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3" role="tabpanel" aria-live="polite">
        <div className="relative shrink-0">
          <span key={hop} className="block" style={{ animation: hop ? 'hop .5s ease-out' : undefined }}><DogTuaDaeng className="h-28 w-28" /></span>
          <span key={`p${hop}`} className="absolute -bottom-1 -right-3" style={{ animation: 'pop .35s ease-out' }}><Prop kind={t.prop} /></span>
        </div>
        <div>
          <p className="font-semibold">{t.name}</p>
          <p className="mt-1 text-sm"><b>ใครเป็นคนดูแล:</b> {t.who}</p>
          <p className="mt-1 text-sm"><b>ทำอะไร:</b> {t.what}</p>
        </div>
      </div>
    </section>
  );
}

// Mini quiz: which one is a therapy animal?
export function QuickCheck() {
  const [ans, setAns] = useState<null | 'home' | 'team'>(null);
  return (
    <section className="card card-quiet">
      <h2 className="text-lg font-bold">ลองทายดู</h2>
      <p className="mt-1">แบบไหนเรียกว่าสัตว์บำบัด</p>
      <div className="mt-3 grid gap-2">
        <button className="chip justify-start text-left" aria-pressed={ans === 'home'} onClick={() => setAns('home')}>หมาที่บ้านที่ชอบนอนข้างเราตอนเหนื่อย</button>
        <button className="chip justify-start text-left" aria-pressed={ans === 'team'} onClick={() => setAns('team')}>หมาที่ผ่านการฝึก ทำงานเป็นทีมกับนักวิชาชีพ ตามแผนของผู้ป่วยแต่ละคน</button>
      </div>
      {ans && (
        <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-sm" role="status">
          {ans === 'team' ? 'ใช่เลย ' : 'ยังไม่ใช่ '}สัตว์บำบัดต้องมีเป้าหมาย มีแผน และมีนักวิชาชีพดูแล ส่วนน้องที่บ้านเป็นเพื่อนในชีวิตประจำวัน ซึ่งก็มีความหมายในแบบของมัน แต่ไม่ใช่การบำบัด
        </p>
      )}
    </section>
  );
}
