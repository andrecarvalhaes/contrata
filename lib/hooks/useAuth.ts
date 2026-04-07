import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import { getUserProfile, signOut, type UserProfile } from '../supabase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile(currentUser: User | null) {
      if (!currentUser) {
        if (active) setProfile(null);
        return;
      }
      const p = await getUserProfile(currentUser.id);
      if (active) setProfile(p);
    }

    // Sessão atual ao montar
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      loadProfile(currentUser).finally(() => {
        if (active) setLoading(false);
      });
    });

    // Subscribe a mudanças
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      loadProfile(currentUser);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    user,
    profile,
    loading,
    logout,
    isAuthenticated: !!user,
  };
};
