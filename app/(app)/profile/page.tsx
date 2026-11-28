import { requireStage } from '@/lib/guard';
import { avatarFor } from '@/lib/data';
import { ProfileForm } from './ProfileForm';

export default async function ProfilePage() {
  const { user, profile } = await requireStage('ready');
  const av = await avatarFor(profile, user!.id);
  const google = user!.app_metadata?.provider === 'google';
  return (
    <ProfileForm uid={user!.id} avatarUrl={av.url} animal={av.animal} hasPhoto={Boolean(profile?.avatar_path)} fromProvider={av.fromProvider}
      displayName={profile?.display_name ?? ''} username={profile?.username ?? ''} email={user!.email ?? ''} google={google} />
  );
}
