import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { isSupabaseConfigured, supabase } from '../services/supabase';
import {
  getLocalUsers,
  getStoredSession,
  saveLocalUser,
  setStoredSession,
} from '../services/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSupabase: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  continueAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            const mappedUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            };
            setUser(mappedUser);
            await setStoredSession(mappedUser);
          } else {
            const localSession = await getStoredSession();
            if (isMounted) setUser(localSession);
          }

          const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!isMounted) return;
            if (session?.user) {
              const mappedUser: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              };
              setUser(mappedUser);
              await setStoredSession(mappedUser);
            } else {
              setUser(null);
              await setStoredSession(null);
            }
          });

          return () => {
            authListener?.subscription?.unsubscribe();
          };
        } else {
          const localSession = await getStoredSession();
          if (isMounted) {
            setUser(localSession);
          }
        }
      } catch (err) {
        console.error('Error during auth init:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      return { error: 'Please enter both email and password.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (error) return { error: error.message };
        if (data.user) {
          const mappedUser: User = {
            id: data.user.id,
            email: data.user.email || trimmedEmail,
            name: data.user.user_metadata?.name || trimmedEmail.split('@')[0],
          };
          setUser(mappedUser);
          await setStoredSession(mappedUser);
          return {};
        }
      } catch (err: any) {
        return { error: err.message || 'Supabase authentication failed.' };
      }
    }

    // Local / Offline Auth Fallback
    try {
      const localUsers = await getLocalUsers();
      const existing = localUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

      if (!existing) {
        return { error: 'Account not found. Please sign up first.' };
      }

      if (existing.password !== password) {
        return { error: 'Invalid password. Please try again.' };
      }

      const activeUser: User = {
        id: existing.id,
        email: existing.email,
        name: existing.name,
      };

      setUser(activeUser);
      await setStoredSession(activeUser);
      return {};
    } catch {
      return { error: 'Failed to sign in. Please try again.' };
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail || !password) {
      return { error: 'Email and password are required.' };
    }
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters long.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: { name: trimmedName || trimmedEmail.split('@')[0] },
          },
        });
        if (error) return { error: error.message };
        if (data.user) {
          const mappedUser: User = {
            id: data.user.id,
            email: data.user.email || trimmedEmail,
            name: trimmedName || trimmedEmail.split('@')[0],
          };
          setUser(mappedUser);
          await setStoredSession(mappedUser);
          return {};
        }
      } catch (err: any) {
        return { error: err.message || 'Supabase sign up failed.' };
      }
    }

    // Local / Offline Auth Fallback
    try {
      const localUsers = await getLocalUsers();
      const existing = localUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

      if (existing) {
        return { error: 'An account with this email already exists. Please sign in.' };
      }

      const newUser: User = {
        id: `local-user-${Date.now()}`,
        email: trimmedEmail,
        name: trimmedName || trimmedEmail.split('@')[0],
      };

      await saveLocalUser({ ...newUser, password });
      setUser(newUser);
      await setStoredSession(newUser);
      return {};
    } catch {
      return { error: 'Failed to create account.' };
    }
  };

  const continueAsGuest = async () => {
    const guestUser: User = {
      id: 'guest-account',
      email: 'guest@todoapp.local',
      name: 'Guest User',
      isGuest: true,
    };
    setUser(guestUser);
    await setStoredSession(guestUser);
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error signing out from Supabase:', err);
      }
    }
    setUser(null);
    await setStoredSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSupabase: isSupabaseConfigured,
        signIn,
        signUp,
        continueAsGuest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

