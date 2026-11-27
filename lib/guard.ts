import 'server-only';
import { redirect } from 'next/navigation';
import { freshOnboardingFlags, getState } from '@/lib/data';

type Stage = 'consent' | 'age' | 'pet' | 'ready';

export async function currentStage(): Promise<Stage | 'signed_out'> {
  const { user, pet } = await getState();
  if (!user) return 'signed_out';
  // Read the flags fresh: a stale memo here bounces the user back to the step they just finished.
  const flags = await freshOnboardingFlags(user.id);
  if (!flags?.consented_at) return 'consent';
  if (!flags.age_confirmed_20plus) return 'age';
  if (!pet && !flags.seeking_pet && !flags.is_shelter) return 'pet';
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
