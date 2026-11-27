'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getState } from '@/lib/data';
import { decide } from '@/lib/trialAdmin';
import { PROBLEMS } from '@/lib/trialData';
import { decisionOpen } from '@/lib/engine';
import { todayInBangkok } from '@/lib/time';

const OK_PROBLEMS: string[] = PROBLEMS.map(([k]) => k);

async function ownTrial(id: string) {
  const { supabase, user } = await getState();
  if (!user) redirect('/');
  const { data } = await supabase.from('trials').select('id, status, start_date').eq('id', id).eq('user_id', user.id).maybeSingle();
  return { supabase, user, trial: data as { id: string; status: string; start_date: string | null } | null };
}

function readFeedback(form: FormData) {
  const feeling = Number(form.get('feeling'));
  return {
    feeling: Number.isInteger(feeling) && feeling >= 1 && feeling <= 5 ? feeling : null,
    problems: form.getAll('problems').map(String).filter((p) => OK_PROBLEMS.includes(p)),
    note: String(form.get('note') ?? '').trim().slice(0, 500) || null,
  };
}

export async function submitDay14(form: FormData) {
  const { supabase, user, trial } = await ownTrial(String(form.get('trial_id')));
  if (!trial || trial.status !== 'active' || !trial.start_date || !decisionOpen(trial.start_date, todayInBangkok())) redirect('/trial');
  const f = readFeedback(form);
  const decision = ['adopt', 'return', 'unsure'].includes(String(form.get('decision'))) ? String(form.get('decision')) : null;
  if (!f.feeling || !decision) redirect('/trial?missing=1');
  await supabase.from('trial_feedback').insert({ trial_id: trial.id, user_id: user!.id, kind: 'day14', feeling: f.feeling, decision, problems: f.problems, note: f.note });
  if (decision === 'adopt' || decision === 'return') await decide(trial.id, decision);
  revalidatePath('/', 'layout');
  redirect('/trial');
}

export async function submitMonthly(form: FormData) {
  const { supabase, user, trial } = await ownTrial(String(form.get('trial_id')));
  if (!trial || trial.status !== 'adopted') redirect('/trial');
  const f = readFeedback(form);
  if (!f.feeling) redirect('/trial?missing=1');
  await supabase.from('trial_feedback').insert({ trial_id: trial.id, user_id: user!.id, kind: 'monthly', feeling: f.feeling, problems: f.problems, note: f.note });
  if (form.get('want_return') === 'on') await decide(trial.id, 'return');
  revalidatePath('/', 'layout');
  redirect('/trial');
}

/** Report a problem or ask to return at ANY time during the trial or after adoption. Never blocked by the 14-day timer. */
export async function submitConcern(form: FormData) {
  const { supabase, user, trial } = await ownTrial(String(form.get('trial_id')));
  if (!trial || !['active', 'adopted'].includes(trial.status)) redirect('/trial');
  const f = readFeedback(form);
  const wantReturn = form.get('want_return') === 'on';
  if (!f.problems.length && !f.note && !wantReturn) redirect('/trial?concern=empty#concern');
  await supabase.from('trial_feedback').insert({
    trial_id: trial.id, user_id: user!.id, kind: 'concern', feeling: f.feeling,
    decision: wantReturn ? 'return' : null, problems: f.problems, note: f.note,
  });
  if (wantReturn) await decide(trial.id, 'return');
  revalidatePath('/', 'layout');
  redirect('/trial?concern=sent');
}
