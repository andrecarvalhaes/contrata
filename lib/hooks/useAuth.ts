import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, signOut, getUserProfile } from '../firebase/auth';
import { UserProfile } from '../firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica autenticação fake primeiro (para testes)
    const checkFakeAuth = () => {
      if (typeof window === 'undefined') return false;

      try {
        const fakeAuth = localStorage.getItem('fakeAuth');
        console.log('🔍 Verificando fakeAuth:', fakeAuth);

        if (fakeAuth) {
          const authData = JSON.parse(fakeAuth);
          if (authData.loggedIn) {
            console.log('✅ Usuário autenticado (fake):', authData.email);

            // Cria um usuário fake
            const fakeUser = {
              uid: 'fake-user-id',
              email: authData.email,
              displayName: authData.name,
            } as User;

            setUser(fakeUser);
            setProfile({
              uid: 'fake-user-id',
              email: authData.email,
              name: authData.name,
              createdAt: new Date(),
            });
            setLoading(false);
            return true;
          }
        }
      } catch (error) {
        console.error('❌ Erro ao verificar autenticação fake:', error);
      }
      return false;
    };

    const initFirebaseAuth = () => {
      let authResolved = false;

      const unsubscribe = onAuthChange(async (firebaseUser) => {
        authResolved = true;
        setUser(firebaseUser);

        if (firebaseUser) {
          const userProfile = await getUserProfile(firebaseUser.uid);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }

        setLoading(false);
      });

      // Timeout de 10 segundos para prevenir loading infinito
      const timeout = setTimeout(() => {
        if (!authResolved) {
          console.warn('⏱️ Firebase auth timeout - assumindo usuário não autenticado');
          setLoading(false);
          setUser(null);
          setProfile(null);
        }
      }, 10000);

      return () => {
        unsubscribe();
        clearTimeout(timeout);
      };
    };

    // Pequeno delay para garantir que localStorage está disponível
    const timer = setTimeout(() => {
      // Se tem autenticação fake, usa ela
      if (checkFakeAuth()) {
        return;
      }

      // Senão, tenta Firebase
      const cleanup = initFirebaseAuth();
      return cleanup;
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const logout = async () => {
    try {
      // Remove autenticação fake
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fakeAuth');
      }

      await signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return {
    user,
    profile,
    loading,
    logout,
    isAuthenticated: !!user
  };
};
