import Link from "next/link";
import { requireStage } from "@/lib/guard";
import { loadCheckins } from "@/lib/data";
import { allPatterns, sortPatterns } from "@/lib/engine";
import PatternCard from "@/components/PatternCard";
import { Dog } from "@/components/PetArt";

export default async function PatternsPage() {
  const { supabase, user } = await requireStage("ready");
  const checkins = await loadCheckins(supabase, user.id);
  const cards = sortPatterns(Object.values(allPatterns(checkins)));
  const anyReady = cards.some((c) => c.status !== "insufficient");
  return (
    <div className="space-y-4">
      <header className="pt-2">
        <h1 className="text-2xl font-semibold">รูปแบบของคุณกับน้อง</h1>
        <p className="text-bark">จาก <span className="num font-semibold text-cocoa">{checkins.length}</span> วันที่บันทึก · <Link href="/patterns/info" className="text-jade-deep underline underline-offset-4">คำนวณยังไง</Link></p>
      </header>
      {!anyReady && (
        <div className="paper flex items-center gap-3 p-4">
          <Dog size={64} /><p>บันทึกต่ออีกไม่กี่วัน แล้วเราจะเริ่มเห็นรูปแบบของคุณกับน้อง</p>
        </div>
      )}
      {cards.map((p) => <PatternCard key={p.activity} p={p} />)}
    </div>
  );
}
