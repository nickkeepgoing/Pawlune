import 'server-only';
import { redirect } from 'next/navigation';
import { getState } from '@/lib/data';

type Stage = 'consent' | 'age' | 'pet' | 'ready';

export async function currentStage(): Promise<Stage | 'signed_out'> {
  const { user, profile, pet } = await getState();
  if (!user) return 'signed_out';
  if (!profile?.consented_at) return 'consent';
  if (!profile.age_confirmed_20plus) return 'age';
  if (!pet && !profile.seeking_pet && !profile.is_shelter) return 'pet';
  return 'ready';
}

const PATH: Record<Stage, string> = { consent: '/onboarding/consent', age: '/onboarding/age', pet: '/onboarding/pet', ready: '/home' };

/** Use at the top of every app page. Redirects to where the user should be (USER_FLOW / Phase 2 rule 3). */
export async function requireStage(wanted: Stage) {
  const stage = await currentStage();
  if (stage === 'signed_out') redirect('/');
  if (stage !== wanted) redirect(PATH[stage]);
  return getState();
}

export async function pathForCurrentUser(): Promise<string> {
  const stage = await currentStage();
  return stage === 'signed_out' ? '/' : PATH[stage];
}
