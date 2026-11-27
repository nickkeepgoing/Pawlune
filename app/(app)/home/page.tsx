import Link from 'next/link';
import { Mascot } from '@/components/Mascot';
import { requireStage } from '@/lib/guard';
import { loadCheckins, loadWho5 } from '@/lib/data';
import { todayInBangkok } from '@/lib/time';
import { daysBetween, lowMoodStreak, recentMoods, summary, who5Due, ACTIVITIES, MIN_DAYS_PER_GROUP } from '@/lib/engine';
import { MOOD_LABELS } from '@/lib/format';
import { MoodLine } from '@/components/Charts';
import { MoodFace } from '@/components/MoodFace';
import { GentleCard } from '@/components/GentleCard';
import { IconFlame } from '@/components/Icons';
import { loadTrial } from '@/lib/trialData';
import { TRIAL_DAYS, trialDay } from '@/lib/engine';

export default async function HomePage() {
  const { pet, profile } = await requireStage('ready');
  const today = todayInBangkok();
  const [checkins, who5, { trial, animal }] = await Promise.all([loadCheckins(), loadWho5(), loadTrial()]);
  if (!pet) {
    return (
      <div className="space-y-5 py-2">
        <h1 className="text-2xl font-bold">สวัสดี{profile?.display_name ? ` ${profile.display_name}` : ''}</h1>
        {trial?.status === 'applied' ? (
          <Link href="/trial" className="block rounded-[var(--radius-card)] bg-jade p-5 text-cream"><b className="block text-lg">ส่งคำขอทดลองเลี้ยง{animal?.name}แล้ว</b><span className="text-sm">รอศูนย์ติดต่อกลับ</span></Link>
        ) : (
          <Link href="/adopt" className="block rounded-[var(--radius-card)] bg-jade p-5 text-cream"><b className="block text-lg">หาเพื่อนจากศูนย์</b><span className="text-sm">ทดลองเลี้ยง 14 วัน แล้วตัดสินใจจากข้อมูลใจของคุณเอง</span></Link>
        )}
        <Link href="/learn/care" className="card card-quiet lift block"><b>คู่มือเลี้ยงและค่าใช้จ่าย</b><span className="block text-sm text-bark">อ่านก่อนรับน้อง ราคาจากแหล่งข้อมูลจริง</span></Link>
        <Link href="/wellbeing/st5" className="card card-quiet lift block"><b>แบบประเมินความเครียด ST-5</b><span className="block text-sm text-bark">5 ข้อ ของกรมสุขภาพจิต</span></Link>
      </div>
    );
  }
  const s = summary(checkins, today);
  const todayRow = checkins.find((c) => c.date === today);
  const lastWho5 = who5.at(-1) ?? null;
  const due = who5Due(lastWho5?.taken_on ?? null, today);
  const gentle = lowMoodStreak(checkins, today).gentle_card || (lastWho5 ? lastWho5.raw < 12 : false);
  const sinceAdoption = pet.adopted_on ? daysBetween(pet.adopted_on, today) : null;

  // Early value while Patterns need 7 days: plain counts for this week, no comparison.
  const week = checkins.filter((c) => daysBetween(c.date, today) < 7);
  const counts = new Map<string, number>();
  week.forEach((c) => c.activities.forEach((a) => counts.set(a, (counts.get(a) ?? 0) + 1)));
  const topThisWeek = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const daysToFirstPattern = Math.max(0, MIN_DAYS_PER_GROUP - s.days_logged);

  return (
    /* One column, read top to bottom: the thing to do today sits at the top and the
       record of what has happened follows under it. Two columns made people choose
       where to look first on a screen that has one job. */
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">สวัสดี{profile?.display_name ? ` ${profile.display_name}` : ''}</h1>
          <p className="text-bark">
            วันนี้กับ{pet!.name}
            {sinceAdoption !== null && sinceAdoption >= 0 && <> อยู่ด้วยกันมา <span className="num">{sinceAdoption.toLocaleString('th-TH')}</span> วัน</>}
          </p>
        </div>
        <Mascot className="h-20 w-20 shrink-0 md:h-24 md:w-24" />
      </div>

      {gentle && <GentleCard today={today} />}

      {todayRow ? (
        <Link href="/checkin" className="card lift flex items-center gap-4">
          <MoodFace mood={todayRow.mood} className="h-12 w-12 text-jade" />
          <div><p className="font-semibold">บันทึกวันนี้แล้ว {MOOD_LABELS[todayRow.mood - 1]}</p><p className="text-sm text-bark">แตะเพื่อแก้ไข</p></div>
        </Link>
      ) : (
        <Link href="/checkin" className="flex items-center justify-between rounded-[var(--radius-card)] bg-jade p-5 text-cream">
          <span><span className="block text-lg font-bold">บันทึกวันนี้</span><span className="text-sm opacity-90">ใช้เวลาประมาณ 10 วินาที</span></span>
          <span className="btn bg-cream text-jade">เริ่ม</span>
        </Link>
      )}

      {trial?.status === 'active' && trial.start_date && (
        <Link href="/trial" className="card lift block">
          <p className="font-semibold">ทดลองเลี้ยง{animal?.name} วันที่ <span className="num">{Math.min(trialDay(trial.start_date, today), TRIAL_DAYS)}</span>/{TRIAL_DAYS}</p>
          <p className="text-sm text-bark">{trialDay(trial.start_date, today) >= TRIAL_DAYS ? 'ครบแล้ว ดูผลและตัดสินใจ' : 'บันทึกทุกวัน เพื่อใช้ตัดสินใจวันที่ 14'}</p>
        </Link>
      )}

      {due && (
        <Link href="/wellbeing/take" className="card card-warn lift block">
          <p className="font-semibold">WHO-5 ถึงเวลาแล้ว</p>
          <p className="text-sm text-bark">5 คำถามเกี่ยวกับ 2 สัปดาห์ที่ผ่านมา ใช้เวลาไม่ถึงนาที</p>
        </Link>
      )}

      <section className="grid grid-cols-2 gap-3">
        <div className="card card-quiet">
          <p className="flex items-center gap-1 text-sm text-bark"><IconFlame className="h-4 w-4" /> บันทึกต่อเนื่อง</p>
          <p className="stat mt-1"><span className="stat-value">{s.streak}</span><span className="stat-label">วัน</span></p>
        </div>
        <div className="card card-quiet">
          <p className="text-sm text-bark">บันทึกทั้งหมด</p>
          <p className="stat mt-1"><span className="stat-value">{s.days_logged}</span><span className="stat-label">วัน</span></p>
        </div>
      </section>

      <section className="card card-quiet">
        <h2 className="font-semibold">อารมณ์ 7 วันล่าสุด</h2>
        <MoodLine points={recentMoods(checkins, today, 7)} />
      </section>

      <section className="card card-quiet">
        <h2 className="font-semibold">สัปดาห์นี้กับ{pet!.name}</h2>
        {topThisWeek.length ? (
          <ul className="mt-2 space-y-1">
            {topThisWeek.map(([a, n]) => (<li key={a}>{ACTIVITIES[a as keyof typeof ACTIVITIES].th} <span className="num font-semibold">{n}</span> วัน</li>))}
          </ul>
        ) : <p className="mt-1 text-bark">ยังไม่มีกิจกรรมในสัปดาห์นี้</p>}
        {daysToFirstPattern > 0
          ? <p className="mt-3 text-sm text-bark">บันทึกต่ออีกไม่กี่วัน แล้วเราจะเริ่มเห็นรูปแบบของคุณกับน้อง (อย่างน้อยอีก <span className="num">{daysToFirstPattern}</span> วัน)</p>
          : <Link href="/patterns" className="mt-3 inline-block font-semibold text-jade underline underline-offset-4">ดูรูปแบบของคุณ</Link>}
      </section>
    </div>
  );
}
