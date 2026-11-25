import { requireStage } from "@/lib/guard";
import { loadCheckins, loadWho5 } from "@/lib/data";
import { todayInBangkok } from "@/lib/time";
import { allPatterns, cardSentence, LIMITATION_LINE, oftenTogetherLines, sortPatterns, statusChip, summary, weeklyTimeline } from "@/lib/engine";
import ReportBuilder from "./ReportBuilder";

export default async function ReportPage() {
  const { supabase, user, pet } = await requireStage("ready");
  const today = todayInBangkok();
  const [checkins, who5, { data: notes }] = await Promise.all([
    loadCheckins(supabase, user.id), loadWho5(supabase, user.id),
    // Notes only ever go to the user's own report, never to the engine or AI.
    supabase.from("checkins").select("checkin_date, note").eq("user_id", user.id).not("note", "is", null).order("checkin_date"),
  ]);
  const patterns = sortPatterns(Object.values(allPatterns(checkins))).filter((p) => p.status !== "insufficient")
    .map((p) => ({ sentence: cardSentence(p), chip: statusChip(p), together: oftenTogetherLines(p) }));
  return (
    <ReportBuilder
      today={today}
      pet={{ name: pet.name, species: pet.species, adopted_on: pet.adopted_on }}
      summary={summary(checkins, today)} weekly={weeklyTimeline(checkins)} who5={who5}
      patterns={patterns} limitation={LIMITATION_LINE}
      notes={(notes ?? []).map((n) => ({ date: n.checkin_date, note: n.note! }))}
    />
  );
}
