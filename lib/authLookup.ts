import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { normUsername } from '@/lib/username';

/** username or email → email (server only, service role). Returns null if not found. Never sent to the browser. */
export async function emailFor(identifier: string): Promise<string | null> {
  const id = identifier.trim();
  if (id.includes('@')) return id;
  const admin = createAdminClient();
  const { data } = await admin.from('profiles').select('id').eq('username', normUsername(id)).maybeSingle();
  if (!data) return null;
  const { data: u } = await admin.auth.admin.getUserById(data.id as string);
  return u?.user?.email ?? null;
}

export async function usernameTaken(username: string): Promise<boolean> {
  const { data } = await createAdminClient().from('profiles').select('id').eq('username', normUsername(username)).maybeSingle();
  return Boolean(data);
}
