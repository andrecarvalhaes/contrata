import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './client';
import type { Database, Tables } from './types';

export type UserProfile = Tables<'users'>;
export type AuthRole = Database['public']['Enums']['user_role'];
export type { User, Session };

function siteUrl() {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export async function signUp(
  email: string,
  password: string,
  displayName: string,
  role: AuthRole = 'posto'
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, role },
      emailRedirectTo: `${siteUrl()}/auth/callback`,
    },
  });
  if (error) throw new Error(error.message);

  // O perfil em public.users é criado pelo trigger handle_new_auth_user.
  // Buscamos para devolver junto (pode ser null se confirmação por email estiver ativa).
  let profile: UserProfile | null = null;
  if (data.user) {
    profile = await getUserProfile(data.user.id);
  }
  return { user: data.user, session: data.session, profile };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  const profile = data.user ? await getUserProfile(data.user.id) : null;
  return { user: data.user, session: data.session, profile };
}

export async function signInWithGoogle(_role: AuthRole = 'posto') {
  // O role default vem do trigger handle_new_auth_user (posto).
  // Para forçar fornecedor via Google, o usuário escolhe depois no perfil.
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl()}/auth/callback`,
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/recuperar-senha`,
  });
  if (error) throw new Error(error.message);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', uid)
    .maybeSingle();
  if (error) {
    console.error('Erro ao buscar perfil do usuário:', error.message);
    return null;
  }
  return data;
}

/** Subscribe a mudanças de autenticação. Retorna função de unsubscribe. */
export function onAuthChange(callback: (user: User | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => data.subscription.unsubscribe();
}
