import { requireStage } from '@/lib/guard';
import { loadCheckins, loadWho5 } from '@/lib/data';
import { todayInBangkok } from '@/lib/time';
import { allPatterns, cardSentence, oftenTogetherLines, sortPatterns, statusChip, summary, weeklyTimeline, LIMITATION_LINE } from '@/lib/engine';
import { SPECIES_TH, thaiDate } from '@/lib/format';
import { ReportBuilder, type ReportData } from './ReportBuilder';
import { loadSt5, loadTrial } from '@/lib/trialData';
import { st5Score, trialEnd, trialMood } from '@/lib/engine';

export default async function ReportPage() {
  const { supabase, user, pet, profile } = await requireStage('ready');
  const today = todayInBangkok();
  const [checkins, who5, { data: notes }, { data: past }] = await Promise.all([
    loadCheckins(), loadWho5(),
    supabase.from('checkins').select('checkin_date, note').eq('user_id', user!.id).not('note', 'is', null).order('checkin_date'),
    supabase.from('pets').select('name, species, past_period, past_feeling, past_tags, memory_note').eq('user_id', user!.id).eq('is_current', false).order('created_at'),
  ]);
  const s = summary(checkins, today);
  const [st5, { trial, animal }] = await Promise.all([loadSt5(), loadTrial()]);
  const trialLines: string[] = [];
  if (trial?.start_date && animal) {
    const m = trialMood(checkins, trial.start_date);
    const st = { active: 'กำลังทดลองเลี้ยง', adopted: 'รับเลี้ยงแล้ว', return_requested: 'แจ้งคืนแล้ว' }[trial.status as string] ?? trial.status;
    trialLines.push(`${animal.name} · ${st} · ช่วงทดลอง ${thaiDate(trial.start_date)} – ${thaiDate(trialEnd(trial.start_date))}`);
    if (m.during.mean !== null) trialLines.push(`อารมณ์เฉลี่ยช่วงทดลอง ${m.during.mean.toFixed(2)} (${m.during.n} วัน)${m.before.mean !== null ? ` · 14 วันก่อนหน้า ${m.before.mean.toFixed(2)} (${m.before.n} วัน)` : ''}`);
  }
  const data: ReportData = {
    name: profile?.display_name ?? '',
    created: thaiDate(today),
    pet: pet ? `${pet.name} (${SPECIES_TH[pet.species]})${pet.adopted_on ? ` รับมาเมื่อ ${thaiDate(pet.adopted_on)}` : ''}` : 'ยังไม่มีสัตว์เลี้ยง',
    range: checkins.length ? `${thaiDate(checkins[0].date)} – ${thaiDate(checkins.at(-1)!.date)}` : '-',
    daysLogged: s.days_logged,
    meanMood: s.mean_mood,
    weeks: weeklyTimeline(checkins),
    who5: who5.map((w) => ({ date: thaiDate(w.taken_on), pct: w.pct })),
    st5: st5.map((x) => ({ date: thaiDate(x.taken_on), raw: x.raw, level: st5Score(x.items).level })),
    trial: trialLines,
    patterns: sortPatterns(Object.values(allPatterns(checkins))).filter((p) => p.status !== 'insufficient')
      .map((p) => ({ label: p.label_th, sentence: cardSentence(p), chip: statusChip(p) ?? '', extra: oftenTogetherLines(p) })),
    limitation: LIMITATION_LINE,
    memories: (past ?? []).map((m) => ({
      name: m.name as string, species: SPECIES_TH[m.species as keyof typeof SPECIES_TH], period: (m.past_period as string) ?? '',
      feeling: (m.past_feeling as number | null) ?? null, tags: (m.past_tags as string[]) ?? [], note: (m.memory_note as string) ?? '',
    })),
    notes: (notes ?? []).map((n) => ({ date: thaiDate(n.checkin_date as string), note: n.note as string })),
  };
  return <ReportBuilder data={data} />;
}
