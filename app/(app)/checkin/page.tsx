import { redirect } from 'next/navigation';
import { requireStage } from '@/lib/guard';
import { signedPhotoUrl } from '@/lib/data';
import { todayInBangkok } from '@/lib/time';
import { thaiDate } from '@/lib/format';
import { CheckinForm } from './CheckinForm';

export default async function CheckinPage() {
  const { supabase, user, pet } = await requireStage('ready');
  if (!pet) redirect('/adopt');
  const today = todayInBangkok();
  const [{ data: todayRow }, { data: lastRow }, photo] = await Promise.all([
    supabase.from('checkins').select('mood, activities, note').eq('user_id', user!.id).eq('checkin_date', today).maybeSingle(),
    supabase.from('checkins').select('activities').eq('user_id', user!.id).lt('checkin_date', today).order('checkin_date', { ascending: false }).limit(1).maybeSingle(),
    signedPhotoUrl(pet!.photo_path),
  ]);
  return (
    <CheckinForm
      petName={pet!.name} species={pet!.species} photoUrl={photo} dateLabel={thaiDate(today)}
      initial={todayRow ? { mood: todayRow.mood as number, activities: todayRow.activities as string[], note: (todayRow.note as string) ?? '' } : null}
      lastActivities={(lastRow?.activities as string[] | undefined) ?? null}
    />
  );
}
