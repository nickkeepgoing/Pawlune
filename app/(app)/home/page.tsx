import Link from "next/link";
import { requireStage } from "@/lib/guard";
import { loadCheckins, loadWho5, petPhotoUrl } from "@/lib/data";
import { todayInBangkok } from "@/lib/time";
import { daysBetween, last7, lowMoodStreak, summary, who5Due } from "@/lib/engine";
import { MoodSparkline } from "@/components/Charts";
import GentleCard from "@/components/GentleCard";
import MoodFace, { MOOD_LABELS } from "@/components/MoodFace";
import { Cat, Dog } from "@/components/PetArt";

export default async function HomePage({ searchParams }: PageProps<"/home">) {
  const { supabase, user, profile, pet } = await requireStage("ready");
  const today = todayInBangkok();
  const [checkins, who5, photo] = await Promise.all([loadCheckins(supabase, user.id), loadWho5(supabase, user.id), petPhotoUrl(supabase, pet.photo_path)]);
  const s = summary(checkins, today);
  const todayRow = checkins.find((c) => c.date === today);
  const due = who5Due(who5.at(-1)?.taken_on ?? null, today);
  const low = lowMoodStreak(checkins, today);
  const sinceAdopt = pet.adopted_on ? daysBetween(pet.adopted_on, today) : null;
  const { saved } = await searchParams;

  return (
    <div className="space-y-5">
      <section className="rise flex items-center gap-4 pt-2">
        <div className="size-20 shrink-0 overflow-hidden rounded-[1.6rem] bg-paper shadow-[var(--shadow-paper)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {photo ? <img src={photo} alt={`รูปของ${pet.name}`} className="size-full object-cover" /> : pet.species === "cat" ? <Cat size={80} /> : <Dog size={80} />}
        </div>
        <div>
          <p className="text-bark">สวัสดี{profile.display_name ? ` ${profile.display_name}` : ""}</p>
          <h1 className="text-2xl font-semibold">วันนี้กับ{pet.name}เป็นยังไงบ้าง</h1>
          {sinceAdopt !== null && sinceAdopt >= 0 && <p className="text-sm text-bark">อยู่ด้วยกันมา <span className="num font-semibold text-cocoa">{sinceAdopt}</span> วัน</p>}
        </div>
      </section>

      {saved && (
        <p role="status" className="paper rise flex items-center gap-3 p-4">
          <Dog size={52} /><span>บันทึกแล้ว ขอบคุณที่ดูแลใจตัวเองวันนี้</span>
        </p>
      )}

      {low.gentle_card && <GentleCard day={today} />}

      {due && (
        <Link href="/wellbeing/take" className="paper rise rise-2 flex items-center justify-between gap-3 border-l-4 border-honey p-4 hover:bg-cream">
          <span><span className="block font-semibold">WHO-5 ถึงเวลาแล้ว</span>
            <span className="text-sm text-bark">5 คำถามเกี่ยวกับ 2 สัปดาห์ที่ผ่านมา ใช้เวลาไม่ถึงนาที</span></span>
          <span aria-hidden className="text-xl text-jade">→</span>
        </Link>
      )}

      <section className="paper rise rise-2 p-5">
        {todayRow ? (
          <div className="flex items-center gap-4">
            <MoodFace mood={todayRow.mood} size={52} />
            <div className="flex-1"><p className="text-sm text-bark">บันทึกวันนี้แล้ว</p><p className="text-lg font-semibold">อารมณ์วันนี้: {MOOD_LABELS[todayRow.mood - 1]}</p></div>
            <Link href="/checkin" className="btn btn-ghost min-h-11 px-4 text-sm">แก้ไข</Link>
          </div>
        ) : (
          <div><p className="text-lg font-semibold">ยังไม่ได้บันทึกวันนี้</p>
            <p className="text-sm text-bark">ใช้เวลาไม่ถึง 10 วินาที</p>
            <Link href="/checkin" className="btn btn-primary mt-4 w-full">บันทึกวันนี้</Link></div>
        )}
      </section>

      <section className="rise rise-3 grid grid-cols-2 gap-3">
        <div className="paper p-4">
          <p className="text-sm text-bark">บันทึกต่อเนื่อง</p>
          <p><span className="num text-3xl font-semibold">{s.streak}</span> <span className="text-bark">วัน</span></p>
          {s.streak > 0 && <span aria-hidden className="mt-1 block h-1.5 w-10 rounded-full bg-honey" />}
        </div>
        <div className="paper p-4">
          <p className="text-sm text-bark">บันทึกทั้งหมด</p>
          <p><span className="num text-3xl font-semibold">{s.days_logged}</span> <span className="text-bark">วัน</span></p>
          {s.mean_mood !== null && <p className="text-sm text-bark">อารมณ์เฉลี่ย <span className="num font-semibold text-cocoa">{s.mean_mood.toFixed(2)}</span></p>}
        </div>
      </section>

      <section className="paper rise rise-4 p-5">
        <h2 className="font-semibold">อารมณ์ 7 วันล่าสุด</h2>
        <MoodSparkline days={last7(checkins, today)} />
        <p className="text-xs text-bark">จุดเล็กด้านล่าง = วันที่ไม่ได้บันทึก</p>
      </section>
    </div>
  );
}
